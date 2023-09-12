import type { FrontendComponent } from 'frontendComponentApiClient'
import { FrontendComponentApiClient } from '../data'

export default class FrontendComponentService {
  constructor(private readonly frontendApiClient: FrontendComponentApiClient) {}

  async getComponents(component: 'header' | 'footer', token: string): Promise<FrontendComponent> {
    return this.frontendApiClient.getComponents(component, token)
  }
}
