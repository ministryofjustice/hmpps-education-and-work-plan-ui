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

  let req: Request
  const res = {
    redirect: jest.fn(),
    redirectWithErrors: jest.fn(),
    render: jest.fn(),
    locals: {
      prisonerFunctionalSkills: functionalSkills,
      curiousInPrisonCourses: inPrisonCourses,
    },
  } as unknown as Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
    req = {
      session: { prisonerSummary },
      body: {},
      user: { token: 'some-token' },
      params: { prisonNumber },
      path: `/prisoners/${prisonNumber}/create-induction/want-to-add-qualifications`,
    } as unknown as Request
  })

  describe('getWantToAddQualificationsView', () => {
    it('should get the Want To Add Qualifications view', async () => {
      // Given
      req.session.inductionDto = partialInductionDto()
      req.session.wantToAddQualificationsForm = undefined

      const expectedWantToAddQualificationsForm: WantToAddQualificationsForm = {
        wantToAddQualifications: undefined,
      }

      const expectedView = {
        prisonerSummary,
        backLinkUrl: '/prisoners/A1234BC/create-induction/highest-level-of-education',
        backLinkAriaText: `Back to What's the highest level of education Jimmy Lightfingers completed before entering prison?`,
        form: expectedWantToAddQualificationsForm,
        functionalSkills,
        inPrisonCourses,
      }

      // When
      await controller.getWantToAddQualificationsView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/prePrisonEducation/wantToAddQualifications', expectedView)
      expect(req.session.wantToAddQualificationsForm).toBeUndefined()
    })

    it('should get the Want To Add Qualifications view given previous page was Check Your Answers', async () => {
      // Given
      req.session.inductionDto = partialInductionDto()

      req.session.pageFlowHistory = {
        pageUrls: ['/prisoners/A1234BC/create-induction/check-your-answers'],
        currentPageIndex: 0,
      }

      req.session.wantToAddQualificationsForm = undefined

      const expectedWantToAddQualificationsForm: WantToAddQualificationsForm = {
        wantToAddQualifications: undefined,
      }

      const expectedView = {
        prisonerSummary,
        backLinkUrl: '/prisoners/A1234BC/create-induction/check-your-answers',
        backLinkAriaText: `Back to Check and save your answers before adding Jimmy Lightfingers's goals`,
        form: expectedWantToAddQualificationsForm,
        functionalSkills,
        inPrisonCourses,
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
      req.session.inductionDto = partialInductionDto()

      const invalidWantToAddQualificationsForm = {
        wantToAddQualifications: '',
      }
      req.body = invalidWantToAddQualificationsForm
      req.session.wantToAddQualificationsForm = undefined

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
      expect(req.session.wantToAddQualificationsForm).toEqual(invalidWantToAddQualificationsForm)
      expect(req.session.inductionDto.previousQualifications).toBeUndefined()
    })

    it(`should proceed to qualification level page given user wants to add qualifications`, async () => {
      // Given
      req.user.token = 'some-token'
      req.session.inductionDto = partialInductionDto()

      req.body = { wantToAddQualifications: YesNoValue.YES }
      req.session.wantToAddQualificationsForm = undefined

      // When
      await controller.submitWantToAddQualificationsForm(req, res, next)

      // Then
      expect(res.redirect).toHaveBeenCalledWith(`/prisoners/${prisonNumber}/create-induction/qualification-level`)
      expect(req.session.wantToAddQualificationsForm).toBeUndefined()
      expect(req.session.inductionDto.previousQualifications.qualifications).toEqual([])
      expect(req.session.inductionDto.previousQualifications.educationLevel).toEqual(EducationLevelValue.NOT_SURE)
    })

    it(`should proceed to additional training page given user does not want to add qualifications`, async () => {
      // Given
      req.user.token = 'some-token'
      req.session.inductionDto = partialInductionDto()

      req.body = { wantToAddQualifications: YesNoValue.NO }
      req.session.wantToAddQualificationsForm = undefined

      // When
      await controller.submitWantToAddQualificationsForm(req, res, next)

      // Then
      expect(res.redirect).toHaveBeenCalledWith(`/prisoners/${prisonNumber}/create-induction/additional-training`)
      expect(req.session.wantToAddQualificationsForm).toBeUndefined()
      expect(req.session.inductionDto.previousQualifications.qualifications).toEqual([])
      expect(req.session.inductionDto.previousQualifications.educationLevel).toEqual(EducationLevelValue.NOT_SURE)
    })

    it('should redirect to check your answers given previous page was check your answers and induction form with no qualifications was submitted with no change', async () => {
      // Given
      req.user.token = 'some-token'
      const inductionDto = partialInductionDto()
      const existingQualifications: Array<AchievedQualificationDto> = [] // Empty array of qualifications meaning the user has previously said No to Do The Want To Record Qualifications
      inductionDto.previousQualifications = { qualifications: existingQualifications } as PreviousQualificationsDto
      req.session.inductionDto = inductionDto

      req.session.pageFlowHistory = {
        pageUrls: [
          '/prisoners/A1234BC/create-induction/check-your-answers',
          '/prisoners/A1234BC/create-induction/want-to-add-qualifications',
        ],
        currentPageIndex: 1,
      }

      req.body = { wantToAddQualifications: YesNoValue.NO }
      req.session.wantToAddQualificationsForm = undefined

      // When
      await controller.submitWantToAddQualificationsForm(req, res, next)

      // Then
      expect(res.redirect).toHaveBeenCalledWith(`/prisoners/${prisonNumber}/create-induction/check-your-answers`)
      expect(req.session.wantToAddQualificationsForm).toBeUndefined()
      expect(req.session.inductionDto.previousQualifications.qualifications).toEqual(existingQualifications)
    })

    it('should redirect to check your answers given previous page was check your answers and induction form with some qualifications was submitted with no change', async () => {
      // Given
      req.user.token = 'some-token'
      const inductionDto = partialInductionDto()
      const existingQualifications: Array<AchievedQualificationDto> = [
        { subject: 'Maths', grade: 'C', level: QualificationLevelValue.LEVEL_1 },
      ] // Array of qualifications meaning the user has previously said Yes to Do The Want To Record Qualifications
      inductionDto.previousQualifications = { qualifications: existingQualifications } as PreviousQualificationsDto
      req.session.inductionDto = inductionDto

      req.session.pageFlowHistory = {
        pageUrls: [
          '/prisoners/A1234BC/create-induction/check-your-answers',
          '/prisoners/A1234BC/create-induction/want-to-add-qualifications',
        ],
        currentPageIndex: 1,
      }

      req.body = { wantToAddQualifications: YesNoValue.YES }
      req.session.wantToAddQualificationsForm = undefined

      // When
      await controller.submitWantToAddQualificationsForm(req, res, next)

      // Then
      expect(res.redirect).toHaveBeenCalledWith(`/prisoners/${prisonNumber}/create-induction/check-your-answers`)
      expect(req.session.wantToAddQualificationsForm).toBeUndefined()
      expect(req.session.inductionDto.previousQualifications.qualifications).toEqual(existingQualifications)
    })

    it('should redirect to check your answers given previous page was check your answers and induction form with some qualifications was submitted changing the answer to No', async () => {
      // Given
      req.user.token = 'some-token'
      const inductionDto = partialInductionDto()
      const existingQualifications: Array<AchievedQualificationDto> = [
        { subject: 'Maths', grade: 'C', level: QualificationLevelValue.LEVEL_1 },
      ] // Array of qualifications meaning the user has previously said Yes to Do The Want To Record Qualifications
      inductionDto.previousQualifications = { qualifications: existingQualifications } as PreviousQualificationsDto
      req.session.inductionDto = inductionDto

      req.session.pageFlowHistory = {
        pageUrls: [
          '/prisoners/A1234BC/create-induction/check-your-answers',
          '/prisoners/A1234BC/create-induction/want-to-add-qualifications',
        ],
        currentPageIndex: 1,
      }

      req.body = { wantToAddQualifications: YesNoValue.NO }
      req.session.wantToAddQualificationsForm = undefined

      // When
      await controller.submitWantToAddQualificationsForm(req, res, next)

      // Then
      expect(res.redirect).toHaveBeenCalledWith(`/prisoners/${prisonNumber}/create-induction/check-your-answers`)
      expect(req.session.wantToAddQualificationsForm).toBeUndefined()
      expect(req.session.inductionDto.previousQualifications.qualifications).toEqual([]) // expect qualifications to have been removed from the Induction
      expect(req.session.inductionDto.previousQualifications.educationLevel).toEqual(EducationLevelValue.NOT_SURE)
    })

    it('should redirect to qualification level given previous page was check your answers and induction form with no qualifications was submitted changing the answer to Yes', async () => {
      // Given
      req.user.token = 'some-token'
      const inductionDto = partialInductionDto()
      const existingQualifications: Array<AchievedQualificationDto> = [] // Empty array of qualifications meaning the user has previously said No to Do The Want To Record Qualifications
      inductionDto.previousQualifications = { qualifications: existingQualifications } as PreviousQualificationsDto
      req.session.inductionDto = inductionDto

      req.session.pageFlowHistory = {
        pageUrls: [
          '/prisoners/A1234BC/create-induction/check-your-answers',
          '/prisoners/A1234BC/create-induction/want-to-add-qualifications',
        ],
        currentPageIndex: 1,
      }

      req.body = { wantToAddQualifications: YesNoValue.YES }
      req.session.wantToAddQualificationsForm = undefined

      // When
      await controller.submitWantToAddQualificationsForm(req, res, next)

      // Then
      expect(res.redirect).toHaveBeenCalledWith(`/prisoners/${prisonNumber}/create-induction/qualification-level`)
      expect(req.session.wantToAddQualificationsForm).toBeUndefined()
      expect(req.session.inductionDto.previousQualifications.qualifications).toEqual(existingQualifications) // expect qualifications to still be empty
      expect(req.session.inductionDto.previousQualifications.educationLevel).toEqual(EducationLevelValue.NOT_SURE)
    })
  })
})
