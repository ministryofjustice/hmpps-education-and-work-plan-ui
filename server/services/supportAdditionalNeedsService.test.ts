import SupportAdditionalNeedsService from './supportAdditionalNeedsService'
import SupportAdditionalNeedsApiClient from '../data/supportAdditionalNeedsApiClient'

jest.mock('../data/supportAdditionalNeedsApiClient')

describe('supportAdditionalNeedsService', () => {
  const supportAdditionalNeedsApiClient = new SupportAdditionalNeedsApiClient(
    null,
  ) as jest.Mocked<SupportAdditionalNeedsApiClient>
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const supportAdditionalNeedsService = new SupportAdditionalNeedsService(supportAdditionalNeedsApiClient)

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const prisonNumber = 'A1234BC'

  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should return support additional needs', async () => {
    // TODO - implement
  })
})
