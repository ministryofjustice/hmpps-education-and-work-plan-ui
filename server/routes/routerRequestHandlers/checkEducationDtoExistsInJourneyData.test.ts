import { Request, Response } from 'express'
import checkEducationDtoExistsInJourneyData from './checkEducationDtoExistsInJourneyData'
import aValidEducationDto from '../../testsupport/educationDtoTestDataBuilder'

describe('checkEducationDtoExistsInJourneyData', () => {
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

  it(`should invoke next handler given EducationDto exists in journeyData`, async () => {
    // Given
    const prisonNumber = 'A1234BC'
    req.params.prisonNumber = prisonNumber
    req.journeyData.educationDto = aValidEducationDto({ prisonNumber })

    // When
    await checkEducationDtoExistsInJourneyData(req, res, next)

    // Then
    expect(next).toHaveBeenCalled()
    expect(res.redirect).not.toHaveBeenCalled()
  })

  it(`should redirect to Overview page given no EducationDto exists in journeyData`, async () => {
    // Given
    const prisonNumber = 'A1234BC'
    req.params.prisonNumber = prisonNumber

    req.journeyData.educationDto = undefined

    // When
    await checkEducationDtoExistsInJourneyData(req, res, next)

    // Then
    expect(res.redirect).toHaveBeenCalledWith(`/plan/${prisonNumber}/view/overview`)
    expect(next).not.toHaveBeenCalled()
  })
})
