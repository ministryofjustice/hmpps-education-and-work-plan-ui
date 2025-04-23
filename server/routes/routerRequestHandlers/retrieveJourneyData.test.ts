import { Request, Response } from 'express'
import retrieveJourneyData from './retrieveJourneyData'
import JourneyDataStore from '../../data/journeyDataStore/journeyDataStore'
import { aValidInductionDto } from '../../testsupport/inductionDtoTestDataBuilder'

jest.mock('../../data/journeyDataStore/journeyDataStore')

describe('retrieveJourneyData', () => {
  const journeyDataStore = new JourneyDataStore(null) as jest.Mocked<JourneyDataStore>
  const requestHandler = retrieveJourneyData(journeyDataStore)

  const journeyId = '99bca142-9a5e-4a92-8087-0da925b9f331'
  const username = 'a-dps-user'

  let req: Request
  let res: Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
    req = {
      user: { username },
      params: { journeyId },
      journeyData: undefined,
    } as unknown as Request
    res = {} as unknown as Response
  })

  it('should retrieve journey data given journeyData exists in JourneyDataStore', async () => {
    // Given
    const expectedJourneyData = { inductionDto: aValidInductionDto() }
    journeyDataStore.getJourneyData.mockResolvedValue(expectedJourneyData)

    // When
    await requestHandler(req, res, next)

    // Then
    expect(req.journeyData).toEqual(expectedJourneyData)
    expect(journeyDataStore.getJourneyData).toHaveBeenCalledWith(username, journeyId)
    expect(next).toHaveBeenCalled()
  })

  it('should retrieve empty journey data given journeyData does not exist in JourneyDataStore', async () => {
    // Given
    journeyDataStore.getJourneyData.mockResolvedValue({})

    // When
    await requestHandler(req, res, next)

    // Then
    expect(req.journeyData).toEqual({})
    expect(journeyDataStore.getJourneyData).toHaveBeenCalledWith(username, journeyId)
    expect(next).toHaveBeenCalled()
  })
})
