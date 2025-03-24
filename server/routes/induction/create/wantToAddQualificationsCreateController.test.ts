import { Request, Response } from 'express'
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
import { getPrisonerContext } from '../../../data/session/prisonerContexts'

describe('wantToAddQualificationsCreateController', () => {
  const controller = new WantToAddQualificationsCreateController()

  const prisonNumber = 'A1234BC'
  const prisonerSummary = aValidPrisonerSummary()
  const functionalSkills = validFunctionalSkills()
  const inPrisonCourses = validInPrisonCourseRecords()

  // Returns a DTO for this step of the create journey
  const partialInductionDto = () => {
    const inductionDto = aValidInductionDto({ hasQualifications: false })
    inductionDto.previousQualifications = undefined
    return inductionDto
  }

  const req = {
    session: {},
    body: {},
    params: { prisonNumber },
    path: `/prisoners/${prisonNumber}/create-induction/want-to-add-qualifications`,
  } as unknown as Request
  const res = {
    redirect: jest.fn(),
    redirectWithErrors: jest.fn(),
    render: jest.fn(),
    locals: {
      prisonerSummary,
      prisonerFunctionalSkills: functionalSkills,
      curiousInPrisonCourses: inPrisonCourses,
    },
  } as unknown as Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
    req.session.pageFlowHistory = undefined
    req.body = {}
  })

  describe('getWantToAddQualificationsView', () => {
    it('should get the Want To Add Qualifications view', async () => {
      // Given
      getPrisonerContext(req.session, prisonNumber).inductionDto = partialInductionDto()
      getPrisonerContext(req.session, prisonNumber).wantToAddQualificationsForm = undefined

      const expectedWantToAddQualificationsForm: WantToAddQualificationsForm = {
        wantToAddQualifications: undefined,
      }

      const expectedView = {
        prisonerSummary,
        form: expectedWantToAddQualificationsForm,
        functionalSkills,
        inPrisonCourses,
      }

      // When
      await controller.getWantToAddQualificationsView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/prePrisonEducation/wantToAddQualifications', expectedView)
      expect(getPrisonerContext(req.session, prisonNumber).wantToAddQualificationsForm).toBeUndefined()
    })
  })

  describe('submitWantToAddQualificationsForm', () => {
    it('should not proceed to next page given form is submitted with validation errors', async () => {
      // Given
      getPrisonerContext(req.session, prisonNumber).inductionDto = partialInductionDto()

      const invalidWantToAddQualificationsForm = {
        wantToAddQualifications: '',
      }
      req.body = invalidWantToAddQualificationsForm
      getPrisonerContext(req.session, prisonNumber).wantToAddQualificationsForm = undefined

      const expectedErrors = [
        {
          href: '#wantToAddQualifications',
          text: `Select whether Jimmy Lightfingers wants to record any other educational qualifications`,
        },
      ]

      // When
      await controller.submitWantToAddQualificationsForm(req, res, next)

      // Then
      expect(res.redirectWithErrors).toHaveBeenCalledWith(
        '/prisoners/A1234BC/create-induction/want-to-add-qualifications',
        expectedErrors,
      )
      expect(getPrisonerContext(req.session, prisonNumber).wantToAddQualificationsForm).toEqual(
        invalidWantToAddQualificationsForm,
      )
      expect(getPrisonerContext(req.session, prisonNumber).inductionDto.previousQualifications).toBeUndefined()
    })

    it(`should proceed to qualification level page given user wants to add qualifications`, async () => {
      // Given
      getPrisonerContext(req.session, prisonNumber).inductionDto = partialInductionDto()

      req.body = { wantToAddQualifications: YesNoValue.YES }
      getPrisonerContext(req.session, prisonNumber).wantToAddQualificationsForm = undefined

      // When
      await controller.submitWantToAddQualificationsForm(req, res, next)

      // Then
      expect(res.redirect).toHaveBeenCalledWith(`/prisoners/${prisonNumber}/create-induction/qualification-level`)
      expect(getPrisonerContext(req.session, prisonNumber).wantToAddQualificationsForm).toBeUndefined()
      expect(getPrisonerContext(req.session, prisonNumber).inductionDto.previousQualifications.qualifications).toEqual(
        [],
      )
      expect(getPrisonerContext(req.session, prisonNumber).inductionDto.previousQualifications.educationLevel).toEqual(
        EducationLevelValue.NOT_SURE,
      )
    })

    it(`should proceed to additional training page given user does not want to add qualifications`, async () => {
      // Given
      getPrisonerContext(req.session, prisonNumber).inductionDto = partialInductionDto()

      req.body = { wantToAddQualifications: YesNoValue.NO }
      getPrisonerContext(req.session, prisonNumber).wantToAddQualificationsForm = undefined

      // When
      await controller.submitWantToAddQualificationsForm(req, res, next)

      // Then
      expect(res.redirect).toHaveBeenCalledWith(`/prisoners/${prisonNumber}/create-induction/additional-training`)
      expect(getPrisonerContext(req.session, prisonNumber).wantToAddQualificationsForm).toBeUndefined()
      expect(getPrisonerContext(req.session, prisonNumber).inductionDto.previousQualifications.qualifications).toEqual(
        [],
      )
      expect(getPrisonerContext(req.session, prisonNumber).inductionDto.previousQualifications.educationLevel).toEqual(
        EducationLevelValue.NOT_SURE,
      )
    })

    it('should redirect to check your answers given previous page was check your answers and induction form with no qualifications was submitted with no change', async () => {
      // Given
      const inductionDto = partialInductionDto()
      const existingQualifications: Array<AchievedQualificationDto> = [] // Empty array of qualifications meaning the user has previously said No to Do The Want To Record Qualifications
      inductionDto.previousQualifications = { qualifications: existingQualifications } as PreviousQualificationsDto
      getPrisonerContext(req.session, prisonNumber).inductionDto = inductionDto

      req.session.pageFlowHistory = {
        pageUrls: [
          '/prisoners/A1234BC/create-induction/check-your-answers',
          '/prisoners/A1234BC/create-induction/want-to-add-qualifications',
        ],
        currentPageIndex: 1,
      }

      req.body = { wantToAddQualifications: YesNoValue.NO }
      getPrisonerContext(req.session, prisonNumber).wantToAddQualificationsForm = undefined

      // When
      await controller.submitWantToAddQualificationsForm(req, res, next)

      // Then
      expect(res.redirect).toHaveBeenCalledWith(`/prisoners/${prisonNumber}/create-induction/check-your-answers`)
      expect(getPrisonerContext(req.session, prisonNumber).wantToAddQualificationsForm).toBeUndefined()
      expect(getPrisonerContext(req.session, prisonNumber).inductionDto.previousQualifications.qualifications).toEqual(
        existingQualifications,
      )
    })

    it('should redirect to check your answers given previous page was check your answers and induction form with some qualifications was submitted with no change', async () => {
      // Given
      const inductionDto = partialInductionDto()
      const existingQualifications: Array<AchievedQualificationDto> = [
        { subject: 'Maths', grade: 'C', level: QualificationLevelValue.LEVEL_1 },
      ] // Array of qualifications meaning the user has previously said Yes to Do The Want To Record Qualifications
      inductionDto.previousQualifications = { qualifications: existingQualifications } as PreviousQualificationsDto
      getPrisonerContext(req.session, prisonNumber).inductionDto = inductionDto

      req.session.pageFlowHistory = {
        pageUrls: [
          '/prisoners/A1234BC/create-induction/check-your-answers',
          '/prisoners/A1234BC/create-induction/want-to-add-qualifications',
        ],
        currentPageIndex: 1,
      }

      req.body = { wantToAddQualifications: YesNoValue.YES }
      getPrisonerContext(req.session, prisonNumber).wantToAddQualificationsForm = undefined

      // When
      await controller.submitWantToAddQualificationsForm(req, res, next)

      // Then
      expect(res.redirect).toHaveBeenCalledWith(`/prisoners/${prisonNumber}/create-induction/check-your-answers`)
      expect(getPrisonerContext(req.session, prisonNumber).wantToAddQualificationsForm).toBeUndefined()
      expect(getPrisonerContext(req.session, prisonNumber).inductionDto.previousQualifications.qualifications).toEqual(
        existingQualifications,
      )
    })

    it('should redirect to check your answers given previous page was check your answers and induction form with some qualifications was submitted changing the answer to No', async () => {
      // Given
      const inductionDto = partialInductionDto()
      const existingQualifications: Array<AchievedQualificationDto> = [
        { subject: 'Maths', grade: 'C', level: QualificationLevelValue.LEVEL_1 },
      ] // Array of qualifications meaning the user has previously said Yes to Do The Want To Record Qualifications
      inductionDto.previousQualifications = { qualifications: existingQualifications } as PreviousQualificationsDto
      getPrisonerContext(req.session, prisonNumber).inductionDto = inductionDto

      req.session.pageFlowHistory = {
        pageUrls: [
          '/prisoners/A1234BC/create-induction/check-your-answers',
          '/prisoners/A1234BC/create-induction/want-to-add-qualifications',
        ],
        currentPageIndex: 1,
      }

      req.body = { wantToAddQualifications: YesNoValue.NO }
      getPrisonerContext(req.session, prisonNumber).wantToAddQualificationsForm = undefined

      // When
      await controller.submitWantToAddQualificationsForm(req, res, next)

      // Then
      expect(res.redirect).toHaveBeenCalledWith(`/prisoners/${prisonNumber}/create-induction/check-your-answers`)
      expect(getPrisonerContext(req.session, prisonNumber).wantToAddQualificationsForm).toBeUndefined()
      expect(getPrisonerContext(req.session, prisonNumber).inductionDto.previousQualifications.qualifications).toEqual(
        [],
      ) // expect qualifications to have been removed from the Induction
      expect(getPrisonerContext(req.session, prisonNumber).inductionDto.previousQualifications.educationLevel).toEqual(
        EducationLevelValue.NOT_SURE,
      )
    })

    it('should redirect to qualification level given previous page was check your answers and induction form with no qualifications was submitted changing the answer to Yes', async () => {
      // Given
      const inductionDto = partialInductionDto()
      const existingQualifications: Array<AchievedQualificationDto> = [] // Empty array of qualifications meaning the user has previously said No to Do The Want To Record Qualifications
      inductionDto.previousQualifications = { qualifications: existingQualifications } as PreviousQualificationsDto
      getPrisonerContext(req.session, prisonNumber).inductionDto = inductionDto

      req.session.pageFlowHistory = {
        pageUrls: [
          '/prisoners/A1234BC/create-induction/check-your-answers',
          '/prisoners/A1234BC/create-induction/want-to-add-qualifications',
        ],
        currentPageIndex: 1,
      }

      req.body = { wantToAddQualifications: YesNoValue.YES }
      getPrisonerContext(req.session, prisonNumber).wantToAddQualificationsForm = undefined

      // When
      await controller.submitWantToAddQualificationsForm(req, res, next)

      // Then
      expect(res.redirect).toHaveBeenCalledWith(`/prisoners/${prisonNumber}/create-induction/qualification-level`)
      expect(getPrisonerContext(req.session, prisonNumber).wantToAddQualificationsForm).toBeUndefined()
      expect(getPrisonerContext(req.session, prisonNumber).inductionDto.previousQualifications.qualifications).toEqual(
        existingQualifications,
      ) // expect qualifications to still be empty
      expect(getPrisonerContext(req.session, prisonNumber).inductionDto.previousQualifications.educationLevel).toEqual(
        EducationLevelValue.NOT_SURE,
      )
    })
  })
})
