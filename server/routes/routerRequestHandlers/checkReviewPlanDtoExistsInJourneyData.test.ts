import { Request, Response } from 'express'
import checkReviewPlanDtoExistsInJourneyData from './checkReviewPlanDtoExistsInJourneyData'
import aValidReviewPlanDto from '../../testsupport/reviewPlanDtoTestDataBuilder'

describe('checkReviewPlanDtoExistsInJourneyData', () => {
  const req = {
    journeyData: {},
    params: {},
  } as unknown as Request
  const res = {
    redirect: jest.fn(),
  } as unknown as Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
    req.journeyData = {}
    req.params = {}
  })

  it(`should invoke next handler given ReviewPlanDto exists in journeyData`, async () => {
    // Given
    const prisonNumber = 'A1234BC'
    req.params.prisonNumber = prisonNumber
    req.journeyData.reviewPlanDto = aValidReviewPlanDto()

    // When
    await checkReviewPlanDtoExistsInJourneyData(req, res, next)

    // Then
    expect(next).toHaveBeenCalled()
    expect(res.redirect).not.toHaveBeenCalled()
  })

  it(`should redirect to Overview page given no ReviewPlanDto exists in journeyData`, async () => {
    // Given
    const prisonNumber = 'A1234BC'
    req.params.prisonNumber = prisonNumber

    req.journeyData.reviewPlanDto = undefined

    // When
    await checkReviewPlanDtoExistsInJourneyData(req, res, next)

    // Then
    expect(res.redirect).toHaveBeenCalledWith(`/plan/${prisonNumber}/view/overview`)
    expect(next).not.toHaveBeenCalled()
  })
})
