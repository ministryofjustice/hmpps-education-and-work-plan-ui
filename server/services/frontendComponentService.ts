import type { FrontendComponent } from 'frontendComponentApiClient'
import { FrontendComponentApiClient } from '../data'
import logger from '../../logger'

export default class FrontendComponentService {
  constructor(private readonly frontendApiClient: FrontendComponentApiClient) {}

  async getComponents(component: 'header' | 'footer', token: string): Promise<FrontendComponent> {
    try {
      const frontendComponentResponse = await this.frontendApiClient.getComponents(component, token)
      return frontendComponentResponse
    } catch (error) {
      logger.error(`Error retrieving DPS frontend components: ${error}`)
      return { problemRetrievingData: true }
    }
  }
}
