import { Request, Response } from 'express'
import type { ReviewPlanDto } from 'dto'
import createEmptyReviewPlanDtoIfNotInJourneyData from './createEmptyReviewPlanDtoIfNotInJourneyData'
import aValidReviewPlanDto from '../../testsupport/reviewPlanDtoTestDataBuilder'

describe('createEmptyReviewPlanDtoIfNotInJourneyData', () => {
  const req = {
    journeyData: {},
  } as unknown as Request
  const res = {} as unknown as Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
    req.journeyData = {}
  })

  it('should create an empty ReviewPlanDto given there is not one in the journeyData', async () => {
    // Given
    req.journeyData.reviewPlanDto = undefined

    const expectedReviewPlanDto = {} as ReviewPlanDto

    // When
    await createEmptyReviewPlanDtoIfNotInJourneyData(req, res, next)

    // Then
    expect(next).toHaveBeenCalled()
    expect(req.journeyData.reviewPlanDto).toEqual(expectedReviewPlanDto)
  })

  it('should not create an ReviewPlanDto given there is already one in the journeyData', async () => {
    // Given
    const expectedReviewPlanDto = aValidReviewPlanDto()
    req.journeyData.reviewPlanDto = expectedReviewPlanDto

    // When
    await createEmptyReviewPlanDtoIfNotInJourneyData(req, res, next)

    // Then
    expect(next).toHaveBeenCalled()
    expect(req.journeyData.reviewPlanDto).toEqual(expectedReviewPlanDto)
  })
})
