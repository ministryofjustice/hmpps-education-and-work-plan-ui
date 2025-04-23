import { Request, Response } from 'express'
import JourneyDataStore from '../../data/journeyDataStore/journeyDataStore'
import storeJourneyData from './storeJourneyData'
import { aValidInductionDto } from '../../testsupport/inductionDtoTestDataBuilder'

jest.mock('../../data/journeyDataStore/journeyDataStore')

describe('storeJourneyData', () => {
  const journeyDataStore = new JourneyDataStore(null) as jest.Mocked<JourneyDataStore>
  const requestHandler = storeJourneyData(journeyDataStore)

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

  it('should add response callback function that stores journey data given the request contains journeyData', async () => {
    // Given
    req.journeyData = { inductionDto: aValidInductionDto() }

    await requestHandler(req, res, next)
    const responseCallbackFunction = prependOnceListener.mock.calls[0][1]

    // When
    await responseCallbackFunction()

    // Then
    expect(res.prependOnceListener).toHaveBeenCalledWith('close', responseCallbackFunction)
    expect(journeyDataStore.setJourneyData).toHaveBeenCalledWith(username, journeyId, req.journeyData, 1)
    expect(next).toHaveBeenCalled()
  })

  it('should add response callback function that removes journey data given the request does not contain journeyData', async () => {
    // Given
    req.journeyData = undefined

    await requestHandler(req, res, next)
    const responseCallbackFunction = prependOnceListener.mock.calls[0][1]

    // When
    await responseCallbackFunction()

    // Then
    expect(res.prependOnceListener).toHaveBeenCalledWith('close', responseCallbackFunction)
    expect(journeyDataStore.deleteJourneyData).toHaveBeenCalledWith(username, journeyId)
    expect(next).toHaveBeenCalled()
  })
})
