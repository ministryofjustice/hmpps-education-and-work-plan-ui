import { Request, Response } from 'express'
import type { InductionDto } from 'inductionDto'
import createEmptyInductionDtoIfNotInJourneyData from './createEmptyInductionDtoIfNotInJourneyData'
import EducationAndWorkPlanService from '../../services/educationAndWorkPlanService'
import aValidEducationDto from '../../testsupport/educationDtoTestDataBuilder'
import { anAchievedQualificationDto } from '../../testsupport/achievedQualificationDtoTestDataBuilder'
import EducationLevelValue from '../../enums/educationLevelValue'

jest.mock('../../services/educationAndWorkPlanService')

describe('createEmptyInductionDtoIfNotInJourneyData', () => {
  const educationAndWorkPlanService = new EducationAndWorkPlanService(
    null,
    null,
  ) as jest.Mocked<EducationAndWorkPlanService>
  const requestHandler = createEmptyInductionDtoIfNotInJourneyData(educationAndWorkPlanService)

  const prisonNumber = 'A1234BC'
  const username = 'auser_gen'

  let req: Request
  const res = {} as unknown as Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
    req = {
      journeyData: {},
      params: { prisonNumber },
      user: { username },
    } as unknown as Request
  })

  it('should create an empty inductionDto for the prisoner given there is no inductionDto in the journeyData and the prisoner has no education already', async () => {
    // Given
    req.journeyData.inductionDto = undefined

    educationAndWorkPlanService.getEducation.mockResolvedValue(null)

    const expectedInduction = { prisonNumber }

    // When
    await requestHandler(req, res, next)

    // Then
    expect(next).toHaveBeenCalled()
    expect(req.journeyData.inductionDto).toEqual(expectedInduction)
    expect(educationAndWorkPlanService.getEducation).toHaveBeenCalledWith(prisonNumber, username)
  })

  it('should create an empty inductionDto for the prisoner given there is no inductionDto in the journeyData and the prisoner has an education already', async () => {
    // Given
    req.journeyData.inductionDto = undefined

    const qualifications = [anAchievedQualificationDto()]
    const highestLevelOfEducation = EducationLevelValue.SECONDARY_SCHOOL_TOOK_EXAMS
    const educationDto = aValidEducationDto({
      prisonNumber,
      educationLevel: highestLevelOfEducation,
      qualifications,
    })
    educationAndWorkPlanService.getEducation.mockResolvedValue(educationDto)

    const expectedInduction = {
      prisonNumber,
      previousQualifications: {
        educationLevel: highestLevelOfEducation,
        qualifications,
      },
    }

    // When
    await requestHandler(req, res, next)

    // Then
    expect(next).toHaveBeenCalled()
    expect(req.journeyData.inductionDto).toEqual(expectedInduction)
    expect(educationAndWorkPlanService.getEducation).toHaveBeenCalledWith(prisonNumber, username)
  })

  it('should create an empty inductionDto for a prisoner with no previously recorded education given there is an inductionDto in the journeyData for a different prisoner', async () => {
    // Given
    req.journeyData.inductionDto = { prisonNumber: 'Z1234ZZ' } as InductionDto

    educationAndWorkPlanService.getEducation.mockResolvedValue(null)

    const expectedInduction = { prisonNumber }

    // When
    await requestHandler(req, res, next)

    // Then
    expect(next).toHaveBeenCalled()
    expect(req.journeyData.inductionDto).toEqual(expectedInduction)
    expect(educationAndWorkPlanService.getEducation).toHaveBeenCalledWith(prisonNumber, username)
  })

  it('should create an empty inductionDto for a prisoner who has previously recorded education given there is an inductionDto in the journeyData for a different prisoner', async () => {
    // Given
    req.journeyData.inductionDto = { prisonNumber: 'Z1234ZZ' } as InductionDto

    const qualifications = [anAchievedQualificationDto()]
    const highestLevelOfEducation = EducationLevelValue.SECONDARY_SCHOOL_TOOK_EXAMS
    const educationDto = aValidEducationDto({
      prisonNumber,
      educationLevel: highestLevelOfEducation,
      qualifications,
    })
    educationAndWorkPlanService.getEducation.mockResolvedValue(educationDto)

    const expectedInduction = {
      prisonNumber,
      previousQualifications: {
        educationLevel: highestLevelOfEducation,
        qualifications,
      },
    }

    // When
    await requestHandler(req, res, next)

    // Then
    expect(next).toHaveBeenCalled()
    expect(req.journeyData.inductionDto).toEqual(expectedInduction)
    expect(educationAndWorkPlanService.getEducation).toHaveBeenCalledWith(prisonNumber, username)
  })

  it('should not create an empty inductionDto for the prisoner given there is already an inductionDto in the journeyData for the prisoner', async () => {
    // Given
    const expectedInduction = {
      prisonNumber,
      workOnRelease: {
        hopingToWork: true,
      },
    } as InductionDto

    req.journeyData.inductionDto = expectedInduction

    // When
    await requestHandler(req, res, next)

    // Then
    expect(next).toHaveBeenCalled()
    expect(req.journeyData.inductionDto).toEqual(expectedInduction)
    expect(educationAndWorkPlanService.getEducation).not.toHaveBeenCalled()
  })
})
