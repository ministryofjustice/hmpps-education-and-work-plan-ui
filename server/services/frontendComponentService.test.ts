import type { FrontendComponentsPageAdditions } from 'viewModels'
import { FrontendComponentApiClient } from '../data'
import FrontendComponentService from './frontendComponentService'
import {
  aValidFrontEndComponentFooter,
  aValidFrontEndComponentHeader,
} from '../testsupport/frontendComponentTestDataBuilder'
import toFrontendComponentsPageAdditions from '../data/mappers/frontendComponentMapper'

jest.mock('../data/mappers/frontendComponentMapper')

describe('frontendComponentService', () => {
  const mockedFrontendComponentsPageAdditionsMapper = toFrontendComponentsPageAdditions as jest.MockedFunction<
    typeof toFrontendComponentsPageAdditions
  >

  const frontendComponentApiClient = {
    getComponents: jest.fn(),
  }

  const frontendComponentService = new FrontendComponentService(
    frontendComponentApiClient as unknown as FrontendComponentApiClient,
  )

  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('getComponents', () => {
    it('should get frontend components page additions', async () => {
      // Given
      const userToken = 'a-user-token'

      const header = aValidFrontEndComponentHeader()
      const footer = aValidFrontEndComponentFooter()
      frontendComponentApiClient.getComponents.mockResolvedValueOnce(header)
      frontendComponentApiClient.getComponents.mockResolvedValueOnce(footer)

      const expectedPageAdditions: FrontendComponentsPageAdditions = {
        headerHtml: '<div>Header</div>',
        footerHtml: '<div>Footer</div>',
        cssIncludes: [
          'https://frontend-componenents-dev/common.css',
          'https://frontend-componenents-dev/headerStyles.css',
          'https://frontend-componenents-dev/footerStyles.css',
        ],
        jsIncludes: [
          'https://frontend-componenents-dev/common.js',
          'https://frontend-componenents-dev/headerScripts.js',
          'https://frontend-componenents-dev/footerScripts.js',
        ],
        problemRetrievingData: false,
      }
      mockedFrontendComponentsPageAdditionsMapper.mockReturnValue(expectedPageAdditions)

      // When
      const actual = await frontendComponentService.getComponents(userToken)

      // Then
      expect(actual).toEqual(expectedPageAdditions)
      expect(frontendComponentApiClient.getComponents).toBeCalledTimes(2)
      expect(frontendComponentApiClient.getComponents).toHaveBeenCalledWith('header', userToken)
      expect(frontendComponentApiClient.getComponents).toHaveBeenCalledWith('footer', userToken)
      expect(mockedFrontendComponentsPageAdditionsMapper).toHaveBeenCalledWith(header, footer)
    })

    it('should not get frontend components page additions given API call to get header returns an error', async () => {
      // Given
      const userToken = 'a-user-token'

      frontendComponentApiClient.getComponents.mockRejectedValue(Error('Service Unavailable'))

      const expectedPageAdditions = {
        problemRetrievingData: true,
      } as FrontendComponentsPageAdditions

      // When
      const actual = await frontendComponentService.getComponents(userToken)

      // Then
      expect(actual).toEqual(expectedPageAdditions)
      expect(mockedFrontendComponentsPageAdditionsMapper).not.toHaveBeenCalled()
    })

    it('should not get frontend components page additions given API call to get footer returns an error', async () => {
      // Given
      const userToken = 'a-user-token'

      const header = aValidFrontEndComponentHeader()
      frontendComponentApiClient.getComponents.mockResolvedValueOnce(header)
      frontendComponentApiClient.getComponents.mockRejectedValue(Error('Service Unavailable'))

      const expectedPageAdditions = {
        problemRetrievingData: true,
      } as FrontendComponentsPageAdditions

      // When
      const actual = await frontendComponentService.getComponents(userToken)

      // Then
      expect(actual).toEqual(expectedPageAdditions)
      expect(mockedFrontendComponentsPageAdditionsMapper).not.toHaveBeenCalled()
    })
  })
})
