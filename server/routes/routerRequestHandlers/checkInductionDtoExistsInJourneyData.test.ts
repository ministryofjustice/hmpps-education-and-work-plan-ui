import { Request, Response } from 'express'
import { v4 as uuidV4 } from 'uuid'
import checkInductionDtoExistsInJourneyData from './checkInductionDtoExistsInJourneyData'
import { aValidInductionDto } from '../../testsupport/inductionDtoTestDataBuilder'

describe('checkInductionDtoExistsInJourneyData', () => {
  const prisonNumber = 'A1234BC'
  const journeyId = uuidV4()

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
    req.params = { prisonNumber }
    req.originalUrl = `/prisoners/${prisonNumber}/create-induction/${journeyId}/check-your-answers`
  })

  it(`should invoke next handler given InductionDto exists in journeyData`, async () => {
    // Given
    req.journeyData.inductionDto = aValidInductionDto()

    // When
    await checkInductionDtoExistsInJourneyData(req, res, next)

    // Then
    expect(next).toHaveBeenCalled()
    expect(res.redirect).not.toHaveBeenCalled()
  })

  it(`should redirect to Overview page given no InductionDto exists in journeyData`, async () => {
    // Given
    req.journeyData.inductionDto = undefined

    // When
    await checkInductionDtoExistsInJourneyData(req, res, next)

    // Then
    expect(res.redirect).toHaveBeenCalledWith(`/plan/${prisonNumber}/view/overview`)
    expect(next).not.toHaveBeenCalled()
  })
})
