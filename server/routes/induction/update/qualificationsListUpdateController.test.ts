import createError from 'http-errors'
import { Request, Response } from 'express'
import type { AchievedQualificationDto, InductionDto } from 'inductionDto'
import QualificationsListUpdateController from './qualificationsListUpdateController'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import {
  aLongQuestionSetInductionDto,
  aShortQuestionSetInductionDto,
} from '../../../testsupport/inductionDtoTestDataBuilder'
import { validFunctionalSkills } from '../../../testsupport/functionalSkillsTestDataBuilder'
import QualificationLevelValue from '../../../enums/qualificationLevelValue'
import toCreateOrUpdateInductionDto from '../../../data/mappers/createOrUpdateInductionDtoMapper'
import InductionService from '../../../services/inductionService'
import { aLongQuestionSetUpdateInductionDto } from '../../../testsupport/updateInductionDtoTestDataBuilder'
import EducationLevelValue from '../../../enums/educationLevelValue'

jest.mock('../../../data/mappers/createOrUpdateInductionDtoMapper')
jest.mock('../../../services/inductionService')

describe('qualificationsListUpdateController', () => {
  const mockedCreateOrUpdateInductionDtoMapper = toCreateOrUpdateInductionDto as jest.MockedFunction<
    typeof toCreateOrUpdateInductionDto
  >

  const inductionService = new InductionService(null) as jest.Mocked<InductionService>
  const controller = new QualificationsListUpdateController(inductionService)

  const prisonNumber = 'A1234BC'
  const prisonerSummary = aValidPrisonerSummary()

  let req: Request
  const res = {
    redirect: jest.fn(),
    render: jest.fn(),
    locals: {} as Record<string, unknown>,
  } as unknown as Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
    req = {
      body: {},
      session: { prisonerSummary },
      params: { prisonNumber },
      path: `/prisoners/${prisonNumber}/induction/qualifications`,
      user: { token: 'some-token' },
    } as unknown as Request
  })

  describe('getQualificationsListView', () => {
    it('should get the Qualifications List view', async () => {
      // Given
      const inductionDto = aLongQuestionSetInductionDto()
      req.session.inductionDto = inductionDto
      const functionalSkills = validFunctionalSkills()
      res.locals.prisonerFunctionalSkills = functionalSkills

      const expectedQualifications: Array<AchievedQualificationDto> = [
        { subject: 'Pottery', grade: 'C', level: QualificationLevelValue.LEVEL_4 },
      ]

      const expectedFunctionalSkills = functionalSkills

      const expectedView = {
        prisonerSummary,
        backLinkUrl: '/plan/A1234BC/view/education-and-training',
        backLinkAriaText: `Back to Jimmy Lightfingers's learning and work progress`,
        qualifications: expectedQualifications,
        functionalSkills: expectedFunctionalSkills,
      }

      // When
      await controller.getQualificationsListView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/induction/prePrisonEducation/qualificationsList', expectedView)
      expect(req.session.inductionDto).toEqual(inductionDto)
    })
  })

  describe('submitQualificationsListView', () => {
    it('should update Induction and call API and redirect to Education and Training tab given page submitted without addQualification or removeQualification flags', async () => {
      // Given
      req.body = {}

      const inductionDto = aLongQuestionSetInductionDto()
      req.session.inductionDto = inductionDto

      const updateInductionDto = aLongQuestionSetUpdateInductionDto()
      // Long question set Update Induction DTO contains highest level of education as SECONDARY_SCHOOL_TOOK_EXAMS
      // with 1 qualification: Level 4 Pottery grade C
      mockedCreateOrUpdateInductionDtoMapper.mockReturnValueOnce(updateInductionDto)

      const expectedHighestLevelOfEducation = EducationLevelValue.SECONDARY_SCHOOL_TOOK_EXAMS
      const expectedQualifications: Array<AchievedQualificationDto> = [
        { subject: 'Pottery', grade: 'C', level: QualificationLevelValue.LEVEL_4 },
      ]

      // When
      await controller.submitQualificationsListView(req, res, next)

      // Then
      // Extract the first call to the mock and the second argument (i.e. the updated Induction)
      const updatedInduction = mockedCreateOrUpdateInductionDtoMapper.mock.calls[0][1]
      expect(mockedCreateOrUpdateInductionDtoMapper).toHaveBeenCalledWith(prisonerSummary.prisonId, updatedInduction)
      expect(updatedInduction.previousQualifications.educationLevel).toEqual(expectedHighestLevelOfEducation)
      expect(updatedInduction.previousQualifications.qualifications).toEqual(expectedQualifications)

      expect(inductionService.updateInduction).toHaveBeenCalledWith(prisonNumber, updateInductionDto, 'some-token')

      expect(res.redirect).toHaveBeenCalledWith('/plan/A1234BC/view/education-and-training')
      expect(req.session.highestLevelOfEducationForm).toBeUndefined()
      expect(req.session.inductionDto).toBeUndefined()
    })

    it('should not update Induction given error calling service', async () => {
      // Given
      req.body = {}

      const inductionDto = aLongQuestionSetInductionDto()
      req.session.inductionDto = inductionDto

      const updateInductionDto = aLongQuestionSetUpdateInductionDto()
      // Long question set Update Induction DTO contains highest level of education as SECONDARY_SCHOOL_TOOK_EXAMS
      // with 1 qualification: Level 4 Pottery grade C
      mockedCreateOrUpdateInductionDtoMapper.mockReturnValueOnce(updateInductionDto)

      const expectedHighestLevelOfEducation = EducationLevelValue.SECONDARY_SCHOOL_TOOK_EXAMS
      const expectedQualifications: Array<AchievedQualificationDto> = [
        { subject: 'Pottery', grade: 'C', level: QualificationLevelValue.LEVEL_4 },
      ]

      inductionService.updateInduction.mockRejectedValue(createError(500, 'Service unavailable'))
      const expectedError = createError(
        500,
        `Error updating Induction for prisoner ${prisonNumber}. Error: InternalServerError: Service unavailable`,
      )

      // When
      await controller.submitQualificationsListView(req, res, next)

      // Then
      // Extract the first call to the mock and the second argument (i.e. the updated Induction)
      const updatedInduction = mockedCreateOrUpdateInductionDtoMapper.mock.calls[0][1]
      expect(mockedCreateOrUpdateInductionDtoMapper).toHaveBeenCalledWith(prisonerSummary.prisonId, updatedInduction)
      expect(updatedInduction.previousQualifications.educationLevel).toEqual(expectedHighestLevelOfEducation)
      expect(updatedInduction.previousQualifications.qualifications).toEqual(expectedQualifications)

      expect(inductionService.updateInduction).toHaveBeenCalledWith(prisonNumber, updateInductionDto, 'some-token')
      expect(next).toHaveBeenCalledWith(expectedError)
      expect(req.session.inductionDto).toEqual(inductionDto)
    })

    it('should update Induction but not call API and redisplay Qualification List Page given page submitted with removeQualification', async () => {
      // Given
      const inductionDto = aShortQuestionSetInductionDto()
      req.session.inductionDto = inductionDto
      /* The short question set induction has no highest level of education, but does have qualifications:
           - Level 6 English, Grade C
           - Level 6 Maths, Grade A*
       */

      req.body = { removeQualification: '0' } // We expect to delete English, as it is the first qualification (zero indexed)

      const expectedHighestLevelOfEducation: EducationLevelValue = null
      const expectedQualifications: Array<AchievedQualificationDto> = [
        { subject: 'Maths', grade: 'A*', level: QualificationLevelValue.LEVEL_6 },
      ]

      // When
      await controller.submitQualificationsListView(req, res, next)

      // Then
      const updatedInduction: InductionDto = req.session.inductionDto
      expect(updatedInduction.previousQualifications.educationLevel).toEqual(expectedHighestLevelOfEducation)
      expect(updatedInduction.previousQualifications.qualifications).toEqual(expectedQualifications)

      expect(mockedCreateOrUpdateInductionDtoMapper).not.toHaveBeenCalled()
      expect(inductionService.updateInduction).not.toHaveBeenCalled()

      expect(res.redirect).toHaveBeenCalledWith('/prisoners/A1234BC/induction/qualifications')
    })
  })

  it('should redirect to Qualification Level page given page submitted with addQualification', async () => {
    // Given
    req.body = { addQualification: '' }

    const expectedPageFlowHistory = {
      pageUrls: [`/prisoners/${prisonNumber}/induction/qualifications`],
      currentPageIndex: 0,
    }

    // When
    await controller.submitQualificationsListView(req, res, next)

    // Then
    expect(req.session.pageFlowHistory).toEqual(expectedPageFlowHistory)
    expect(res.redirect).toHaveBeenCalledWith('/prisoners/A1234BC/induction/qualification-level')
  })

  it('should update InductionDto and redirect to Check Your Answers given previous page was Check Your Answers', async () => {
    // Given
    const inductionDto = aLongQuestionSetInductionDto()
    req.session.inductionDto = inductionDto

    req.body = {}

    req.session.pageFlowHistory = {
      pageUrls: ['/prisoners/A1234BC/induction/check-your-answers', '/prisoners/A1234BC/induction/qualifications'],
      currentPageIndex: 1,
    }
    const expectedNextPage = '/prisoners/A1234BC/induction/check-your-answers'

    // When
    await controller.submitQualificationsListView(req, res, next)

    // Then
    expect(res.redirect).toHaveBeenCalledWith(expectedNextPage)
    expect(req.session.inductionDto).toEqual(inductionDto)
  })
})
