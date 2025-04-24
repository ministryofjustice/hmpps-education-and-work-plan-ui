import { Request, Response } from 'express'
import { aValidInductionDto } from '../../testsupport/inductionDtoTestDataBuilder'
import JourneyDataService from '../../services/journeyDataService'
import setupJourneyData from './setupJourneyData'

jest.mock('../../services/journeyDataService')

describe('setupJourneyData', () => {
  const journeyDataService = new JourneyDataService(null) as jest.Mocked<JourneyDataService>
  const requestHandler = setupJourneyData(journeyDataService)

  const journeyId = '99bca142-9a5e-4a92-8087-0da925b9f331'
  const username = 'a-dps-user'

  let req: Request
  let res: Response
  const next = jest.fn()
  const prependOnceListener = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
    req = {
      user: { username },
      params: { journeyId },
      journeyData: undefined,
    } as unknown as Request
    res = {
      prependOnceListener,
    } as unknown as Response
  })

  it('should retrieve journey data given journeyData is returned by JourneyDataService', async () => {
    // Given
    const expectedJourneyData = { inductionDto: aValidInductionDto() }
    journeyDataService.getJourneyData.mockResolvedValue(expectedJourneyData)

    // When
    await requestHandler(req, res, next)

    // Then
    expect(req.journeyData).toEqual(expectedJourneyData)
    expect(journeyDataService.getJourneyData).toHaveBeenCalledWith(username, journeyId)
    expect(next).toHaveBeenCalled()
  })

  it('should retrieve empty journey data given journeyData is not returned by JourneyDataService', async () => {
    // Given
    journeyDataService.getJourneyData.mockResolvedValue({})

    // When
    await requestHandler(req, res, next)

    // Then
    expect(req.journeyData).toEqual({})
    expect(journeyDataService.getJourneyData).toHaveBeenCalledWith(username, journeyId)
    expect(next).toHaveBeenCalled()
  })

  it('should add response callback function that sets journey data given the request contains journeyData', async () => {
    // Given
    req.journeyData = { inductionDto: aValidInductionDto() }

    await requestHandler(req, res, next)
    const responseCallbackFunction = prependOnceListener.mock.calls[0][1]

    // When
    await responseCallbackFunction()

    // Then
    expect(res.prependOnceListener).toHaveBeenCalledWith('close', responseCallbackFunction)
    expect(journeyDataService.setJourneyData).toHaveBeenCalledWith(username, journeyId, req.journeyData, 1)
    expect(next).toHaveBeenCalled()
  })

  it('should add response callback function that deletes journey data given the request does not contain journeyData', async () => {
    // Given
    req.journeyData = undefined

    await requestHandler(req, res, next)
    const responseCallbackFunction = prependOnceListener.mock.calls[0][1]

    // When
    await responseCallbackFunction()

    // Then
    expect(res.prependOnceListener).toHaveBeenCalledWith('close', responseCallbackFunction)
    expect(journeyDataService.deleteJourneyData).toHaveBeenCalledWith(username, journeyId)
    expect(next).toHaveBeenCalled()
  })
})
