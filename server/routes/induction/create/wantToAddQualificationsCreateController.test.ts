import { Request, Response } from 'express'
import { v4 as uuidV4 } from 'uuid'
import type { WantToAddQualificationsForm } from 'inductionForms'
import type { AchievedQualificationDto } from 'dto'
import type { PreviousQualificationsDto } from 'inductionDto'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import validFunctionalSkills from '../../../testsupport/functionalSkillsTestDataBuilder'
import WantToAddQualificationsCreateController from './wantToAddQualificationsCreateController'
import YesNoValue from '../../../enums/yesNoValue'
import { aValidInductionDto } from '../../../testsupport/inductionDtoTestDataBuilder'
import EducationLevelValue from '../../../enums/educationLevelValue'
import QualificationLevelValue from '../../../enums/qualificationLevelValue'
import validInPrisonCourseRecords from '../../../testsupport/inPrisonCourseRecordsTestDataBuilder'
import { verifiedQualifications as aVerifiedQualifications } from '../../../testsupport/verifiedQualificationsTestDataBuilder'
import { Result } from '../../../utils/result/result'

describe('wantToAddQualificationsCreateController', () => {
  const controller = new WantToAddQualificationsCreateController()

  const journeyId = uuidV4()
  const prisonNumber = 'A1234BC'
  const prisonerSummary = aValidPrisonerSummary()
  const prisonerFunctionalSkills = Result.fulfilled(validFunctionalSkills())
  const inPrisonCourses = Result.fulfilled(validInPrisonCourseRecords())
  const verifiedQualifications = Result.fulfilled(aVerifiedQualifications())
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
      verifiedQualifications,
      prisonNamesById,
    },
  } as unknown as Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
    req.body = {}
    req.journeyData = {}
    req.query = {}
    res.locals.invalidForm = undefined
  })

  describe('getWantToAddQualificationsView', () => {
    it('should get the Want To Add Qualifications view given there is no WantToAddQualificationsForm on res.locals.invalidForm', async () => {
      // Given
      req.journeyData.inductionDto = partialInductionDto()
      res.locals.invalidForm = undefined

      const expectedWantToAddQualificationsForm: WantToAddQualificationsForm = {
        wantToAddQualifications: undefined,
      }

      const expectedView = {
        prisonerSummary,
        form: expectedWantToAddQualificationsForm,
        prisonerFunctionalSkills,
        inPrisonCourses,
        verifiedQualifications,
        prisonNamesById,
      }

      // When
      await controller.getWantToAddQualificationsView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/prePrisonEducation/wantToAddQualifications', expectedView)
    })

    it('should get the Want To Add Qualifications view given there is already a WantToAddQualificationsForm on res.locals.invalidForm', async () => {
      // Given
      req.journeyData.inductionDto = partialInductionDto()

      const expectedWantToAddQualificationsForm: WantToAddQualificationsForm = {
        wantToAddQualifications: YesNoValue.NO,
      }
      res.locals.invalidForm = expectedWantToAddQualificationsForm

      const expectedView = {
        prisonerSummary,
        form: expectedWantToAddQualificationsForm,
        prisonerFunctionalSkills,
        inPrisonCourses,
        verifiedQualifications,
        prisonNamesById,
      }

      // When
      await controller.getWantToAddQualificationsView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/prePrisonEducation/wantToAddQualifications', expectedView)
    })
  })

  describe('submitWantToAddQualificationsForm', () => {
    it(`should proceed to qualification level page given user wants to add qualifications and previous page was not Check Your Answers`, async () => {
      // Given
      req.query = {}

      req.journeyData.inductionDto = partialInductionDto()

      req.body = { wantToAddQualifications: YesNoValue.YES }

      // When
      await controller.submitWantToAddQualificationsForm(req, res, next)

      // Then
      expect(res.redirect).toHaveBeenCalledWith('qualification-level')
      expect(req.journeyData.inductionDto.previousQualifications.qualifications).toEqual([])
      expect(req.journeyData.inductionDto.previousQualifications.educationLevel).toEqual(EducationLevelValue.NOT_SURE)
      expect(req.journeyData.inductionDto.previousQualifications.needToCompleteJourneyFromCheckYourAnswers).toEqual(
        false,
      )
    })

    it(`should proceed to additional training page given user does not want to add qualifications and previous page was not Check Your Answers`, async () => {
      // Given
      req.query = {}

      req.journeyData.inductionDto = partialInductionDto()

      req.body = { wantToAddQualifications: YesNoValue.NO }

      // When
      await controller.submitWantToAddQualificationsForm(req, res, next)

      // Then
      expect(res.redirect).toHaveBeenCalledWith('additional-training')
      expect(req.journeyData.inductionDto.previousQualifications.qualifications).toEqual([])
      expect(req.journeyData.inductionDto.previousQualifications.educationLevel).toEqual(EducationLevelValue.NOT_SURE)
      expect(req.journeyData.inductionDto.previousQualifications.needToCompleteJourneyFromCheckYourAnswers).toEqual(
        false,
      )
    })

    it('should redirect to check your answers given previous page was check your answers and induction form with no qualifications was submitted with no change', async () => {
      // Given
      req.query = { submitToCheckAnswers: 'true' }

      const inductionDto = partialInductionDto()
      const existingQualifications: Array<AchievedQualificationDto> = [] // Empty array of qualifications meaning the user has previously said No to Do The Want To Record Qualifications
      inductionDto.previousQualifications = { qualifications: existingQualifications } as PreviousQualificationsDto
      req.journeyData.inductionDto = inductionDto

      req.body = { wantToAddQualifications: YesNoValue.NO }

      // When
      await controller.submitWantToAddQualificationsForm(req, res, next)

      // Then
      expect(res.redirect).toHaveBeenCalledWith('check-your-answers')
      expect(req.journeyData.inductionDto.previousQualifications.qualifications).toEqual(existingQualifications)
      expect(req.journeyData.inductionDto.previousQualifications.needToCompleteJourneyFromCheckYourAnswers).toEqual(
        false,
      )
    })

    it('should redirect to check your answers given previous page was check your answers and induction form with some qualifications was submitted with no change', async () => {
      // Given
      req.query = { submitToCheckAnswers: 'true' }

      const inductionDto = partialInductionDto()
      const existingQualifications: Array<AchievedQualificationDto> = [
        { subject: 'Maths', grade: 'C', level: QualificationLevelValue.LEVEL_1 },
      ] // Array of qualifications meaning the user has previously said Yes to Do The Want To Record Qualifications
      inductionDto.previousQualifications = { qualifications: existingQualifications } as PreviousQualificationsDto
      req.journeyData.inductionDto = inductionDto

      req.body = { wantToAddQualifications: YesNoValue.YES }

      // When
      await controller.submitWantToAddQualificationsForm(req, res, next)

      // Then
      expect(res.redirect).toHaveBeenCalledWith('check-your-answers')
      expect(req.journeyData.inductionDto.previousQualifications.qualifications).toEqual(existingQualifications)
      expect(req.journeyData.inductionDto.previousQualifications.needToCompleteJourneyFromCheckYourAnswers).toEqual(
        false,
      )
    })

    it('should redirect to check your answers given previous page was check your answers and induction form with some qualifications was submitted changing the answer to No', async () => {
      // Given
      req.query = { submitToCheckAnswers: 'true' }

      const inductionDto = partialInductionDto()
      const existingQualifications: Array<AchievedQualificationDto> = [
        { subject: 'Maths', grade: 'C', level: QualificationLevelValue.LEVEL_1 },
      ] // Array of qualifications meaning the user has previously said Yes to Do The Want To Record Qualifications
      inductionDto.previousQualifications = { qualifications: existingQualifications } as PreviousQualificationsDto
      req.journeyData.inductionDto = inductionDto

      req.body = { wantToAddQualifications: YesNoValue.NO }

      // When
      await controller.submitWantToAddQualificationsForm(req, res, next)

      // Then
      expect(res.redirect).toHaveBeenCalledWith('check-your-answers')
      expect(req.journeyData.inductionDto.previousQualifications.qualifications).toEqual([]) // expect qualifications to have been removed from the Induction
      expect(req.journeyData.inductionDto.previousQualifications.educationLevel).toEqual(EducationLevelValue.NOT_SURE)
      expect(req.journeyData.inductionDto.previousQualifications.needToCompleteJourneyFromCheckYourAnswers).toEqual(
        false,
      )
    })

    it('should redirect to qualification level given previous page was check your answers and induction form with no qualifications was submitted changing the answer to Yes', async () => {
      // Given
      req.query = { submitToCheckAnswers: 'true' }

      const inductionDto = partialInductionDto()
      const existingQualifications: Array<AchievedQualificationDto> = [] // Empty array of qualifications meaning the user has previously said No to Do The Want To Record Qualifications
      inductionDto.previousQualifications = { qualifications: existingQualifications } as PreviousQualificationsDto
      req.journeyData.inductionDto = inductionDto

      req.body = { wantToAddQualifications: YesNoValue.YES }

      // When
      await controller.submitWantToAddQualificationsForm(req, res, next)

      // Then
      expect(res.redirect).toHaveBeenCalledWith('qualification-level')
      expect(req.journeyData.inductionDto.previousQualifications.qualifications).toEqual(existingQualifications) // expect qualifications to still be empty
      expect(req.journeyData.inductionDto.previousQualifications.educationLevel).toEqual(EducationLevelValue.NOT_SURE)
      expect(req.journeyData.inductionDto.previousQualifications.needToCompleteJourneyFromCheckYourAnswers).toEqual(
        true,
      )
    })
  })
})
