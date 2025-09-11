import { Request, Response } from 'express'
import { v4 as uuidV4 } from 'uuid'
import type { WantToAddQualificationsForm } from 'inductionForms'
import type { AchievedQualificationDto } from 'dto'
import type { PreviousQualificationsDto } from 'inductionDto'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import { validFunctionalSkills } from '../../../testsupport/functionalSkillsTestDataBuilder'
import WantToAddQualificationsCreateController from './wantToAddQualificationsCreateController'
import YesNoValue from '../../../enums/yesNoValue'
import { aValidInductionDto } from '../../../testsupport/inductionDtoTestDataBuilder'
import EducationLevelValue from '../../../enums/educationLevelValue'
import QualificationLevelValue from '../../../enums/qualificationLevelValue'
import validInPrisonCourseRecords from '../../../testsupport/inPrisonCourseRecordsTestDataBuilder'
import { Result } from '../../../utils/result/result'

describe('wantToAddQualificationsCreateController', () => {
  const controller = new WantToAddQualificationsCreateController()

  const journeyId = uuidV4()
  const prisonNumber = 'A1234BC'
  const prisonerSummary = aValidPrisonerSummary()
  const prisonerFunctionalSkills = validFunctionalSkills()
  const inPrisonCourses = validInPrisonCourseRecords()
  const prisonNamesById = Result.fulfilled({ MDI: 'Moorland (HMP & YOI)', WDI: 'Wakefield (HMP)' })

  // Returns a DTO for this step of the create journey
  const partialInductionDto = () => {
    const inductionDto = aValidInductionDto({ hasQualifications: false })
    inductionDto.previousQualifications = undefined
    return inductionDto
  }

  const req = {
    session: {},
    journeyData: {},
    body: {},
    params: { prisonNumber, journeyId },
    originalUrl: `/prisoners/${prisonNumber}/create-induction/${journeyId}/want-to-add-qualifications`,
  } as unknown as Request
  const res = {
    redirect: jest.fn(),
    redirectWithErrors: jest.fn(),
    render: jest.fn(),
    locals: {
      prisonerSummary,
      prisonerFunctionalSkills,
      curiousInPrisonCourses: inPrisonCourses,
      prisonNamesById,
    },
  } as unknown as Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
    req.session.pageFlowHistory = undefined
    req.body = {}
    req.journeyData = {}
  })

  describe('getWantToAddQualificationsView', () => {
    it('should get the Want To Add Qualifications view', async () => {
      // Given
      req.journeyData.inductionDto = partialInductionDto()
      req.session.wantToAddQualificationsForm = undefined

      const expectedWantToAddQualificationsForm: WantToAddQualificationsForm = {
        wantToAddQualifications: undefined,
      }

      const expectedView = {
        prisonerSummary,
        form: expectedWantToAddQualificationsForm,
        prisonerFunctionalSkills,
        inPrisonCourses,
        prisonNamesById,
      }

      // When
      await controller.getWantToAddQualificationsView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/prePrisonEducation/wantToAddQualifications', expectedView)
      expect(req.session.wantToAddQualificationsForm).toBeUndefined()
    })
  })

  describe('submitWantToAddQualificationsForm', () => {
    it('should not proceed to next page given form is submitted with validation errors', async () => {
      // Given
      req.journeyData.inductionDto = partialInductionDto()

      const invalidWantToAddQualificationsForm = {
        wantToAddQualifications: '',
      }
      req.body = invalidWantToAddQualificationsForm
      req.session.wantToAddQualificationsForm = undefined

      const expectedErrors = [
        {
          href: '#wantToAddQualifications',
          text: `Select whether Ifereeca Peigh wants to record any other educational qualifications`,
        },
      ]

      // When
      await controller.submitWantToAddQualificationsForm(req, res, next)

      // Then
      expect(res.redirectWithErrors).toHaveBeenCalledWith(
        `/prisoners/A1234BC/create-induction/${journeyId}/want-to-add-qualifications`,
        expectedErrors,
      )
      expect(req.session.wantToAddQualificationsForm).toEqual(invalidWantToAddQualificationsForm)
      expect(req.journeyData.inductionDto.previousQualifications).toBeUndefined()
    })

    it(`should proceed to qualification level page given user wants to add qualifications`, async () => {
      // Given
      req.journeyData.inductionDto = partialInductionDto()

      req.body = { wantToAddQualifications: YesNoValue.YES }
      req.session.wantToAddQualificationsForm = undefined

      // When
      await controller.submitWantToAddQualificationsForm(req, res, next)

      // Then
      expect(res.redirect).toHaveBeenCalledWith(
        `/prisoners/${prisonNumber}/create-induction/${journeyId}/qualification-level`,
      )
      expect(req.session.wantToAddQualificationsForm).toBeUndefined()
      expect(req.journeyData.inductionDto.previousQualifications.qualifications).toEqual([])
      expect(req.journeyData.inductionDto.previousQualifications.educationLevel).toEqual(EducationLevelValue.NOT_SURE)
    })

    it(`should proceed to additional training page given user does not want to add qualifications`, async () => {
      // Given
      req.journeyData.inductionDto = partialInductionDto()

      req.body = { wantToAddQualifications: YesNoValue.NO }
      req.session.wantToAddQualificationsForm = undefined

      // When
      await controller.submitWantToAddQualificationsForm(req, res, next)

      // Then
      expect(res.redirect).toHaveBeenCalledWith(
        `/prisoners/${prisonNumber}/create-induction/${journeyId}/additional-training`,
      )
      expect(req.session.wantToAddQualificationsForm).toBeUndefined()
      expect(req.journeyData.inductionDto.previousQualifications.qualifications).toEqual([])
      expect(req.journeyData.inductionDto.previousQualifications.educationLevel).toEqual(EducationLevelValue.NOT_SURE)
    })

    it('should redirect to check your answers given previous page was check your answers and induction form with no qualifications was submitted with no change', async () => {
      // Given
      const inductionDto = partialInductionDto()
      const existingQualifications: Array<AchievedQualificationDto> = [] // Empty array of qualifications meaning the user has previously said No to Do The Want To Record Qualifications
      inductionDto.previousQualifications = { qualifications: existingQualifications } as PreviousQualificationsDto
      req.journeyData.inductionDto = inductionDto

      req.session.pageFlowHistory = {
        pageUrls: [
          `/prisoners/A1234BC/create-induction/${journeyId}/check-your-answers`,
          `/prisoners/A1234BC/create-induction/${journeyId}/want-to-add-qualifications`,
        ],
        currentPageIndex: 1,
      }

      req.body = { wantToAddQualifications: YesNoValue.NO }
      req.session.wantToAddQualificationsForm = undefined

      // When
      await controller.submitWantToAddQualificationsForm(req, res, next)

      // Then
      expect(res.redirect).toHaveBeenCalledWith(
        `/prisoners/${prisonNumber}/create-induction/${journeyId}/check-your-answers`,
      )
      expect(req.session.wantToAddQualificationsForm).toBeUndefined()
      expect(req.journeyData.inductionDto.previousQualifications.qualifications).toEqual(existingQualifications)
    })

    it('should redirect to check your answers given previous page was check your answers and induction form with some qualifications was submitted with no change', async () => {
      // Given
      const inductionDto = partialInductionDto()
      const existingQualifications: Array<AchievedQualificationDto> = [
        { subject: 'Maths', grade: 'C', level: QualificationLevelValue.LEVEL_1 },
      ] // Array of qualifications meaning the user has previously said Yes to Do The Want To Record Qualifications
      inductionDto.previousQualifications = { qualifications: existingQualifications } as PreviousQualificationsDto
      req.journeyData.inductionDto = inductionDto

      req.session.pageFlowHistory = {
        pageUrls: [
          `/prisoners/A1234BC/create-induction/${journeyId}/check-your-answers`,
          `/prisoners/A1234BC/create-induction/${journeyId}/want-to-add-qualifications`,
        ],
        currentPageIndex: 1,
      }

      req.body = { wantToAddQualifications: YesNoValue.YES }
      req.session.wantToAddQualificationsForm = undefined

      // When
      await controller.submitWantToAddQualificationsForm(req, res, next)

      // Then
      expect(res.redirect).toHaveBeenCalledWith(
        `/prisoners/${prisonNumber}/create-induction/${journeyId}/check-your-answers`,
      )
      expect(req.session.wantToAddQualificationsForm).toBeUndefined()
      expect(req.journeyData.inductionDto.previousQualifications.qualifications).toEqual(existingQualifications)
    })

    it('should redirect to check your answers given previous page was check your answers and induction form with some qualifications was submitted changing the answer to No', async () => {
      // Given
      const inductionDto = partialInductionDto()
      const existingQualifications: Array<AchievedQualificationDto> = [
        { subject: 'Maths', grade: 'C', level: QualificationLevelValue.LEVEL_1 },
      ] // Array of qualifications meaning the user has previously said Yes to Do The Want To Record Qualifications
      inductionDto.previousQualifications = { qualifications: existingQualifications } as PreviousQualificationsDto
      req.journeyData.inductionDto = inductionDto

      req.session.pageFlowHistory = {
        pageUrls: [
          `/prisoners/A1234BC/create-induction/${journeyId}/check-your-answers`,
          `/prisoners/A1234BC/create-induction/${journeyId}/want-to-add-qualifications`,
        ],
        currentPageIndex: 1,
      }

      req.body = { wantToAddQualifications: YesNoValue.NO }
      req.session.wantToAddQualificationsForm = undefined

      // When
      await controller.submitWantToAddQualificationsForm(req, res, next)

      // Then
      expect(res.redirect).toHaveBeenCalledWith(
        `/prisoners/${prisonNumber}/create-induction/${journeyId}/check-your-answers`,
      )
      expect(req.session.wantToAddQualificationsForm).toBeUndefined()
      expect(req.journeyData.inductionDto.previousQualifications.qualifications).toEqual([]) // expect qualifications to have been removed from the Induction
      expect(req.journeyData.inductionDto.previousQualifications.educationLevel).toEqual(EducationLevelValue.NOT_SURE)
    })

    it('should redirect to qualification level given previous page was check your answers and induction form with no qualifications was submitted changing the answer to Yes', async () => {
      // Given
      const inductionDto = partialInductionDto()
      const existingQualifications: Array<AchievedQualificationDto> = [] // Empty array of qualifications meaning the user has previously said No to Do The Want To Record Qualifications
      inductionDto.previousQualifications = { qualifications: existingQualifications } as PreviousQualificationsDto
      req.journeyData.inductionDto = inductionDto

      req.session.pageFlowHistory = {
        pageUrls: [
          `/prisoners/A1234BC/create-induction/${journeyId}/check-your-answers`,
          `/prisoners/A1234BC/create-induction/${journeyId}/want-to-add-qualifications`,
        ],
        currentPageIndex: 1,
      }

      req.body = { wantToAddQualifications: YesNoValue.YES }
      req.session.wantToAddQualificationsForm = undefined

      // When
      await controller.submitWantToAddQualificationsForm(req, res, next)

      // Then
      expect(res.redirect).toHaveBeenCalledWith(
        `/prisoners/${prisonNumber}/create-induction/${journeyId}/qualification-level`,
      )
      expect(req.session.wantToAddQualificationsForm).toBeUndefined()
      expect(req.journeyData.inductionDto.previousQualifications.qualifications).toEqual(existingQualifications) // expect qualifications to still be empty
      expect(req.journeyData.inductionDto.previousQualifications.educationLevel).toEqual(EducationLevelValue.NOT_SURE)
    })
  })
})
