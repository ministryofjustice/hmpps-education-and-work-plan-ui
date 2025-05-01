import { Request, Response } from 'express'
import checkReviewExemptionDtoExistsInJourneyData from './checkReviewExemptionDtoExistsInJourneyData'
import aValidReviewExemptionDto from '../../testsupport/reviewExemptionDtoTestDataBuilder'

describe('checkReviewExemptionDtoExistsInJourneyData', () => {
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

  it(`should invoke next handler given ReviewExemptionDto exists in journeyData`, async () => {
    // Given
    const prisonNumber = 'A1234BC'
    req.params.prisonNumber = prisonNumber
    req.journeyData.reviewExemptionDto = aValidReviewExemptionDto()

    // When
    await checkReviewExemptionDtoExistsInJourneyData(req, res, next)

    // Then
    expect(next).toHaveBeenCalled()
    expect(res.redirect).not.toHaveBeenCalled()
  })

  it(`should redirect to Overview page given no ReviewExemptionDto exists in journeyData`, async () => {
    // Given
    const prisonNumber = 'A1234BC'
    req.params.prisonNumber = prisonNumber

    req.journeyData.reviewExemptionDto = undefined

    // When
    await checkReviewExemptionDtoExistsInJourneyData(req, res, next)

    // Then
    expect(res.redirect).toHaveBeenCalledWith(`/plan/${prisonNumber}/view/overview`)
    expect(next).not.toHaveBeenCalled()
  })
})
