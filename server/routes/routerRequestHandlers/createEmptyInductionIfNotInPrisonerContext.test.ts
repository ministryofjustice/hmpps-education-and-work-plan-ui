import { Request, Response } from 'express'
import type { InductionDto } from 'inductionDto'
import createEmptyInductionIfNotInPrisonerContext from './createEmptyInductionIfNotInPrisonerContext'
import EducationAndWorkPlanService from '../../services/educationAndWorkPlanService'
import aValidEducationDto from '../../testsupport/educationDtoTestDataBuilder'
import { anAchievedQualificationDto } from '../../testsupport/achievedQualificationDtoTestDataBuilder'
import EducationLevelValue from '../../enums/educationLevelValue'
import { getPrisonerContext } from '../../data/session/prisonerContexts'

jest.mock('../../services/educationAndWorkPlanService')

describe('createEmptyInductionIfNotInPrisonerContext', () => {
  const educationAndWorkPlanService = new EducationAndWorkPlanService(
    null,
    null,
    null,
  ) as jest.Mocked<EducationAndWorkPlanService>
  const requestHandler = createEmptyInductionIfNotInPrisonerContext(educationAndWorkPlanService)

  const prisonNumber = 'A1234BC'
  const username = 'auser_gen'

  let req: Request
  const res = {} as unknown as Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
    req = {
      session: {},
      params: { prisonNumber },
      user: { username },
    } as unknown as Request
  })

  it('should create an empty induction for the prisoner given there is no induction on the session and the prisoner has no education already', async () => {
    // Given
    getPrisonerContext(req.session, prisonNumber).inductionDto = undefined

    educationAndWorkPlanService.getEducation.mockResolvedValue(null)

    const expectedInduction = { prisonNumber }

    // When
    await requestHandler(req, res, next)

    // Then
    expect(next).toHaveBeenCalled()
    expect(getPrisonerContext(req.session, prisonNumber).inductionDto).toEqual(expectedInduction)
    expect(educationAndWorkPlanService.getEducation).toHaveBeenCalledWith(prisonNumber, username)
  })

  it('should create an empty induction for the prisoner given there is no induction on the session and the prisoner has an education already', async () => {
    // Given
    getPrisonerContext(req.session, prisonNumber).inductionDto = undefined

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
    expect(getPrisonerContext(req.session, prisonNumber).inductionDto).toEqual(expectedInduction)
    expect(educationAndWorkPlanService.getEducation).toHaveBeenCalledWith(prisonNumber, username)
  })

  it('should create an empty induction for a prisoner with no previously recorded education given there is an induction on the session for a different prisoner', async () => {
    // Given
    getPrisonerContext(req.session, prisonNumber).inductionDto = { prisonNumber: 'Z1234ZZ' } as InductionDto

    educationAndWorkPlanService.getEducation.mockResolvedValue(null)

    const expectedInduction = { prisonNumber }

    // When
    await requestHandler(req, res, next)

    // Then
    expect(next).toHaveBeenCalled()
    expect(getPrisonerContext(req.session, prisonNumber).inductionDto).toEqual(expectedInduction)
    expect(educationAndWorkPlanService.getEducation).toHaveBeenCalledWith(prisonNumber, username)
  })

  it('should create an empty induction for a prisoner who has previously recorded education given there is an induction on the session for a different prisoner', async () => {
    // Given
    getPrisonerContext(req.session, prisonNumber).inductionDto = { prisonNumber: 'Z1234ZZ' } as InductionDto

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
    expect(getPrisonerContext(req.session, prisonNumber).inductionDto).toEqual(expectedInduction)
    expect(educationAndWorkPlanService.getEducation).toHaveBeenCalledWith(prisonNumber, username)
  })

  it('should not create an empty induction for the prisoner given there is already an induction on the session for the prisoner', async () => {
    // Given
    const expectedInduction = {
      prisonNumber,
      workOnRelease: {
        hopingToWork: true,
      },
    } as InductionDto

    getPrisonerContext(req.session, prisonNumber).inductionDto = expectedInduction

    // When
    await requestHandler(req, res, next)

    // Then
    expect(next).toHaveBeenCalled()
    expect(getPrisonerContext(req.session, prisonNumber).inductionDto).toEqual(expectedInduction)
    expect(educationAndWorkPlanService.getEducation).not.toHaveBeenCalled()
  })
})
