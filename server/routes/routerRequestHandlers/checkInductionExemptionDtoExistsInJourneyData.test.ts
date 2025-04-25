import { Request, Response } from 'express'
import { Session } from 'express-session'
import checkInductionExemptionDtoExistsInJourneyData from './checkInductionExemptionDtoExistsInJourneyData'
import aValidInductionExemptionDto from '../../testsupport/inductionExemptionDtoTestDataBuilder'

describe('checkInductionExemptionDtoExistsInJourneyData', () => {
  const req = {
    session: {} as Session,
    params: {} as Record<string, string>,
    journeyData: {},
  } as unknown as Request
  const res = {
    redirect: jest.fn(),
  } as unknown as Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
    req.session = {} as Session
    req.params = {} as Record<string, string>
    req.journeyData = {}
  })

  it(`should invoke next handler given InductionExemptionDto exists in journeyData`, async () => {
    // Given
    const prisonNumber = 'A1234BC'
    req.params.prisonNumber = prisonNumber
    req.journeyData.inductionExemptionDto = aValidInductionExemptionDto()

    // When
    await checkInductionExemptionDtoExistsInJourneyData(req, res, next)

    // Then
    expect(next).toHaveBeenCalled()
    expect(res.redirect).not.toHaveBeenCalled()
  })

  it(`should redirect to Overview page given no InductionExemptionDto exists in journeyData`, async () => {
    // Given
    const prisonNumber = 'A1234BC'
    req.params.prisonNumber = prisonNumber

    req.journeyData.inductionExemptionDto = undefined

    // When
    await checkInductionExemptionDtoExistsInJourneyData(req, res, next)

    // Then
    expect(res.redirect).toHaveBeenCalledWith(`/plan/${prisonNumber}/view/overview`)
    expect(next).not.toHaveBeenCalled()
  })
})
