import type { FrontendComponentsPageAdditions } from 'viewModels'
import { FrontendComponentApiClient } from '../data'
import logger from '../../logger'
import toFrontendComponentsPageAdditions from '../data/mappers/frontendComponentMapper'

export default class FrontendComponentService {
  constructor(private readonly frontendApiClient: FrontendComponentApiClient) {}

  async getComponents(userToken: string): Promise<FrontendComponentsPageAdditions> {
    try {
      const frontendComponents = await Promise.all(
        Array.of(
          this.frontendApiClient.getComponents('header', userToken),
          this.frontendApiClient.getComponents('footer', userToken),
        ),
      )
      const header = frontendComponents[0]
      const footer = frontendComponents[1]

      return toFrontendComponentsPageAdditions(header, footer)
    } catch (error) {
      logger.error(`Error retrieving DPS frontend components: ${error}`)
      return { problemRetrievingData: true } as FrontendComponentsPageAdditions
    }
  }
}
