import { Request, Response } from 'express'
import type { ReviewExemptionDto } from 'dto'
import createEmptyReviewExemptionDtoIfNotInJourneyData from './createEmptyReviewExemptionDtoIfNotInJourneyData'
import aValidReviewExemptionDto from '../../testsupport/reviewExemptionDtoTestDataBuilder'

describe('createEmptyReviewExemptionDtoIfNotInJourneyData', () => {
  const req = {
    journeyData: {},
    params: {},
  } as unknown as Request
  const res = {} as unknown as Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
    req.journeyData = {}
    req.params = {}
  })

  it('should create an empty ReviewExemptionDto for the prisoner given there is not one in the journeyData', async () => {
    // Given
    const prisonNumber = 'A1234BC'
    req.params.prisonNumber = prisonNumber

    req.journeyData.reviewExemptionDto = undefined

    const expectedReviewExemptionDto = { prisonNumber } as ReviewExemptionDto

    // When
    await createEmptyReviewExemptionDtoIfNotInJourneyData(req, res, next)

    // Then
    expect(next).toHaveBeenCalled()
    expect(req.journeyData.reviewExemptionDto).toEqual(expectedReviewExemptionDto)
  })

  it('should not create an ReviewExemptionDto for the prisoner given there is already one in the journeyData', async () => {
    // Given
    const prisonNumber = 'A1234BC'
    req.params.prisonNumber = prisonNumber

    const expectedReviewExemptionDto = aValidReviewExemptionDto()
    req.journeyData.reviewExemptionDto = expectedReviewExemptionDto

    // When
    await createEmptyReviewExemptionDtoIfNotInJourneyData(req, res, next)

    // Then
    expect(next).toHaveBeenCalled()
    expect(req.journeyData.reviewExemptionDto).toEqual(expectedReviewExemptionDto)
  })
})
