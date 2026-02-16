import { Request, Response } from 'express'
import { v4 as uuidV4 } from 'uuid'
import type { AchievedQualificationDto } from 'dto'
import type { InductionDto } from 'inductionDto'
import QualificationsListCreateController from './qualificationsListCreateController'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import { aValidInductionDto } from '../../../testsupport/inductionDtoTestDataBuilder'
import validFunctionalSkills from '../../../testsupport/functionalSkillsTestDataBuilder'
import EducationLevelValue from '../../../enums/educationLevelValue'
import validInPrisonCourseRecords from '../../../testsupport/inPrisonCourseRecordsTestDataBuilder'
import HopingToGetWorkValue from '../../../enums/hopingToGetWorkValue'
import { verifiedQualifications as aVerifiedQualifications } from '../../../testsupport/verifiedQualificationsTestDataBuilder'
import { Result } from '../../../utils/result/result'

describe('qualificationsListCreateController', () => {
  const controller = new QualificationsListCreateController()

  const journeyId = uuidV4()
  const prisonNumber = 'A1234BC'
  const prisonerSummary = aValidPrisonerSummary()
  const prisonerFunctionalSkills = Result.fulfilled(validFunctionalSkills())
  const inPrisonCourses = validInPrisonCourseRecords()
  const verifiedQualifications = Result.fulfilled(aVerifiedQualifications())
  const prisonNamesById = Result.fulfilled({ MDI: 'Moorland (HMP & YOI)', WDI: 'Wakefield (HMP)' })

  const req = {
    session: {},
    journeyData: {},
    body: {},
    params: { prisonNumber, journeyId },
    originalUrl: `/prisoners/${prisonNumber}/create-induction/${journeyId}/qualifications`,
  } as unknown as Request
  const res = {
    redirect: jest.fn(),
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
    req.query = {}
    req.journeyData = {}
  })

  describe('getQualificationsListView', () => {
    it('should get the Qualifications List view given the Induction has Hoping To Get Work as Yes', async () => {
      // Given
      const inductionDto = aValidInductionDto({ hopingToGetWork: HopingToGetWorkValue.YES })
      inductionDto.previousQualifications.qualifications = []
      req.journeyData.inductionDto = inductionDto

      const expectedQualifications: Array<AchievedQualificationDto> = []

      const expectedView = {
        prisonerSummary,
        qualifications: expectedQualifications,
        prisonerFunctionalSkills,
        inPrisonCourses,
        verifiedQualifications,
        prisonNamesById,
      }

      // When
      await controller.getQualificationsListView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/prePrisonEducation/qualificationsList', expectedView)
      expect(req.journeyData.inductionDto).toEqual(inductionDto)
    })

    it('should get the Qualifications List view given the Induction has Hoping To Get Work as No', async () => {
      // Given
      const inductionDto = aValidInductionDto({ hopingToGetWork: HopingToGetWorkValue.NO })
      inductionDto.previousQualifications.qualifications = []
      req.journeyData.inductionDto = inductionDto

      const expectedQualifications: Array<AchievedQualificationDto> = []

      const expectedView = {
        prisonerSummary,
        qualifications: expectedQualifications,
        prisonerFunctionalSkills,
        inPrisonCourses,
        verifiedQualifications,
        prisonNamesById,
      }

      // When
      await controller.getQualificationsListView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/prePrisonEducation/qualificationsList', expectedView)
      expect(req.journeyData.inductionDto).toEqual(inductionDto)
    })
  })

  describe('submitQualificationsListView', () => {
    it('should update Induction and redisplay Qualification List Page given page submitted with removeQualification and previous page was not Check Your Answers', async () => {
      // Given
      req.query = {}

      const inductionDto = aValidInductionDto()
      req.journeyData.inductionDto = inductionDto
      /* The Induction has Secondary School with Exams as the highest level of education, and the following qualification:
           - Level 4 Pottery, Grade C
       */

      req.body = { removeQualification: '0' } // We expect to delete Pottery, as it is the first qualification (zero indexed)

      const expectedHighestLevelOfEducation: EducationLevelValue = EducationLevelValue.SECONDARY_SCHOOL_TOOK_EXAMS
      const expectedQualifications: Array<AchievedQualificationDto> = []

      // When
      await controller.submitQualificationsListView(req, res, next)

      // Then
      const updatedInduction: InductionDto = req.journeyData.inductionDto
      expect(updatedInduction.previousQualifications.educationLevel).toEqual(expectedHighestLevelOfEducation)
      expect(updatedInduction.previousQualifications.qualifications).toEqual(expectedQualifications)
      expect(updatedInduction.previousQualifications.needToCompleteJourneyFromCheckYourAnswers).toEqual(false)
      expect(res.redirect).toHaveBeenCalledWith('qualifications')
    })

    it('should redirect to Qualification Level Page given page submitted with addQualification and previous page was not Check Your Answers', async () => {
      // Given
      req.query = {}

      const inductionDto = aValidInductionDto()
      req.journeyData.inductionDto = inductionDto

      req.body = { addQualification: '' }

      // When
      await controller.submitQualificationsListView(req, res, next)

      // Then
      expect(res.redirect).toHaveBeenCalledWith('qualification-level')
      expect(req.journeyData.inductionDto.previousQualifications.needToCompleteJourneyFromCheckYourAnswers).toEqual(
        false,
      )
    })

    it('should update Induction and redisplay Qualification List Page given page submitted with removeQualification and previous page not Check Your Answers', async () => {
      // Given
      req.query = { submitToCheckAnswers: 'true' }

      const inductionDto = aValidInductionDto()
      req.journeyData.inductionDto = inductionDto
      /* The Induction has Secondary School with Exams as the highest level of education, and the following qualification:
           - Level 4 Pottery, Grade C
       */

      req.body = { removeQualification: '0' } // We expect to delete Pottery, as it is the first qualification (zero indexed)

      const expectedHighestLevelOfEducation: EducationLevelValue = EducationLevelValue.SECONDARY_SCHOOL_TOOK_EXAMS
      const expectedQualifications: Array<AchievedQualificationDto> = []

      // When
      await controller.submitQualificationsListView(req, res, next)

      // Then
      const updatedInduction: InductionDto = req.journeyData.inductionDto
      expect(updatedInduction.previousQualifications.educationLevel).toEqual(expectedHighestLevelOfEducation)
      expect(updatedInduction.previousQualifications.qualifications).toEqual(expectedQualifications)
      expect(updatedInduction.previousQualifications.needToCompleteJourneyFromCheckYourAnswers).toEqual(true)
      expect(res.redirect).toHaveBeenCalledWith('qualifications')
    })

    it('should redirect to Qualification Level Page given page submitted with addQualification and previous page was Check Your Answers', async () => {
      // Given
      req.query = { submitToCheckAnswers: 'true' }

      const inductionDto = aValidInductionDto()
      req.journeyData.inductionDto = inductionDto

      req.body = { addQualification: '' }

      // When
      await controller.submitQualificationsListView(req, res, next)

      // Then
      expect(res.redirect).toHaveBeenCalledWith('qualification-level')
      expect(req.journeyData.inductionDto.previousQualifications.needToCompleteJourneyFromCheckYourAnswers).toEqual(
        true,
      )
    })

    it('should update Induction and redisplay Qualification List Page given page submitted with removeQualification and needToCompleteJourneyFromCheckYourAnswers is already set', async () => {
      // Given
      req.query = {}

      const inductionDto = aValidInductionDto()
      inductionDto.previousQualifications.needToCompleteJourneyFromCheckYourAnswers = true
      req.journeyData.inductionDto = inductionDto
      /* The Induction has Secondary School with Exams as the highest level of education, and the following qualification:
           - Level 4 Pottery, Grade C
       */

      req.body = { removeQualification: '0' } // We expect to delete Pottery, as it is the first qualification (zero indexed)

      const expectedHighestLevelOfEducation: EducationLevelValue = EducationLevelValue.SECONDARY_SCHOOL_TOOK_EXAMS
      const expectedQualifications: Array<AchievedQualificationDto> = []

      // When
      await controller.submitQualificationsListView(req, res, next)

      // Then
      const updatedInduction: InductionDto = req.journeyData.inductionDto
      expect(updatedInduction.previousQualifications.educationLevel).toEqual(expectedHighestLevelOfEducation)
      expect(updatedInduction.previousQualifications.qualifications).toEqual(expectedQualifications)
      expect(updatedInduction.previousQualifications.needToCompleteJourneyFromCheckYourAnswers).toEqual(true)
      expect(res.redirect).toHaveBeenCalledWith('qualifications')
    })

    it('should redirect to Qualification Level Page given page submitted with addQualification and needToCompleteJourneyFromCheckYourAnswers is already set', async () => {
      // Given
      req.query = {}

      const inductionDto = aValidInductionDto()
      inductionDto.previousQualifications.needToCompleteJourneyFromCheckYourAnswers = true
      req.journeyData.inductionDto = inductionDto

      req.body = { addQualification: '' }

      // When
      await controller.submitQualificationsListView(req, res, next)

      // Then
      expect(res.redirect).toHaveBeenCalledWith('qualification-level')
      expect(req.journeyData.inductionDto.previousQualifications.needToCompleteJourneyFromCheckYourAnswers).toEqual(
        true,
      )
    })

    it('should redirect to Highest Level of Education Page given page submitted with no qualifications on the Induction and previous page was not Check Your Answers', async () => {
      // Given
      req.query = {}

      const inductionDto = aValidInductionDto()
      inductionDto.previousQualifications.qualifications = [] // No qualifications on the Induction
      inductionDto.previousQualifications.needToCompleteJourneyFromCheckYourAnswers = false
      req.journeyData.inductionDto = inductionDto

      // When
      await controller.submitQualificationsListView(req, res, next)

      // Then
      expect(res.redirect).toHaveBeenCalledWith('highest-level-of-education')
      expect(req.journeyData.inductionDto.previousQualifications.needToCompleteJourneyFromCheckYourAnswers).toEqual(
        false,
      )
    })

    it('should redirect to Additional Training Page given user has not come from Check Your Answers and page submitted with qualifications on the Induction', async () => {
      // Given
      req.query = {}

      const inductionDto = aValidInductionDto()
      inductionDto.previousQualifications.needToCompleteJourneyFromCheckYourAnswers = false
      req.journeyData.inductionDto = inductionDto
      /* The Induction has Secondary School with Exams as the highest level of education, and the following qualification:
           - Level 4 Pottery, Grade C
       */

      // When
      await controller.submitQualificationsListView(req, res, next)

      // Then
      expect(res.redirect).toHaveBeenCalledWith('additional-training')
      expect(req.journeyData.inductionDto.previousQualifications.needToCompleteJourneyFromCheckYourAnswers).toEqual(
        false,
      )
    })

    it('should redirect to Check Your Answers given user has come from Check Your Answers and page submitted with qualifications on the Induction', async () => {
      // Given
      req.query = { submitToCheckAnswers: 'true' }

      const inductionDto = aValidInductionDto()
      inductionDto.previousQualifications.needToCompleteJourneyFromCheckYourAnswers = false
      req.journeyData.inductionDto = inductionDto
      /* The Induction has Secondary School with Exams as the highest level of education, and the following qualification:
           - Level 4 Pottery, Grade C
       */

      // When
      await controller.submitQualificationsListView(req, res, next)

      // Then
      expect(res.redirect).toHaveBeenCalledWith('check-your-answers')
      expect(req.journeyData.inductionDto.previousQualifications.needToCompleteJourneyFromCheckYourAnswers).toEqual(
        false,
      )
    })
  })
})
