import { Request, Response } from 'express'
import type { InductionExemptionDto } from 'inductionDto'
import createEmptyInductionExemptionDtoIfNotInJourneyData from './createEmptyInductionExemptionDtoIfNotInJourneyData'
import aValidInductionExemptionDto from '../../testsupport/inductionExemptionDtoTestDataBuilder'

describe('createEmptyInductionExemptionDtoIfNotInJourneyData', () => {
  const journeyId = '99bca142-9a5e-4a92-8087-0da925b9f331'
  const username = 'a-dps-user'

  const req = {
    user: { username },
    params: { journeyId },
    journeyData: {},
  } as unknown as Request
  const res = {} as unknown as Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
    req.journeyData = {}
  })

  it('should create an empty InductionExemptionDto for the prisoner given there is not one in the journeyData', async () => {
    // Given
    const prisonNumber = 'A1234BC'
    req.params.prisonNumber = prisonNumber

    req.journeyData.inductionExemptionDto = undefined

    const expectedInductionExemptionDto = { prisonNumber } as InductionExemptionDto

    // When
    await createEmptyInductionExemptionDtoIfNotInJourneyData(req, res, next)

    // Then
    expect(next).toHaveBeenCalled()
    expect(req.journeyData.inductionExemptionDto).toEqual(expectedInductionExemptionDto)
  })

  it('should not create an InductionExemptionDto for the prisoner given there is already one in the journeyData', async () => {
    // Given
    const prisonNumber = 'A1234BC'
    req.params.prisonNumber = prisonNumber

    const expectedInductionExemptionDto = aValidInductionExemptionDto()
    req.journeyData.inductionExemptionDto = expectedInductionExemptionDto

    // When
    await createEmptyInductionExemptionDtoIfNotInJourneyData(req, res, next)

    // Then
    expect(next).toHaveBeenCalled()
    expect(req.journeyData.inductionExemptionDto).toEqual(expectedInductionExemptionDto)
  })
})
