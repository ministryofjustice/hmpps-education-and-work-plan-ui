import { Request, Response } from 'express'
import type { CreateEmployabilitySkillDto } from 'dto'
import createEmptyCreateEmployabilitySkillDtoIfNotInJourneyData from './createEmptyCreateEmployabilitySkillDtoIfNotInJourneyData'
import aCreateEmployabilitySkillDto from '../../testsupport/ createEmployabilitySkillDtoTestDataBuilder'

describe('createEmptyCreateEmployabilitySkillDtoIfNotInJourneyData', () => {
  const prisonId = 'BXI'

  const req = {
    journeyData: {},
    params: {},
  } as unknown as Request
  const res = {
    locals: {
      user: { activeCaseLoadId: prisonId },
    },
  } as unknown as Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
    req.journeyData = {}
    req.params = {}
  })

  it('should create an empty CreateEmployabilitySkillDto given there is not one in the journeyData', async () => {
    // Given
    req.journeyData.createEmployabilitySkillDto = undefined

    const expectedCreateEmployabilitySkillDto = { prisonId } as CreateEmployabilitySkillDto

    // When
    await createEmptyCreateEmployabilitySkillDtoIfNotInJourneyData(req, res, next)

    // Then
    expect(next).toHaveBeenCalled()
    expect(req.journeyData.createEmployabilitySkillDto).toEqual(expectedCreateEmployabilitySkillDto)
  })

  it('should not create an CreateEmployabilitySkillDto given there is already one in the journeyData', async () => {
    // Given
    const expectedCreateEmployabilitySkillDto = aCreateEmployabilitySkillDto({ prisonId })
    req.journeyData.createEmployabilitySkillDto = expectedCreateEmployabilitySkillDto

    // When
    await createEmptyCreateEmployabilitySkillDtoIfNotInJourneyData(req, res, next)

    // Then
    expect(next).toHaveBeenCalled()
    expect(req.journeyData.createEmployabilitySkillDto).toEqual(expectedCreateEmployabilitySkillDto)
  })
})
