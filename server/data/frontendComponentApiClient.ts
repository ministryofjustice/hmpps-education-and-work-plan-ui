import type { FrontendComponent } from 'frontendComponentApiClient'
import RestClient from './restClient'
import config from '../config'

export default class FrontendComponentApiClient {
  private static restClient(token: string): RestClient {
    return new RestClient('Frontend Component API', config.apis.frontendComponents, token)
  }

  async getComponents(component: 'header' | 'footer', token: string) {
    return FrontendComponentApiClient.restClient(token).get({
      path: `/${component}`,
      headers: { 'x-user-token': token },
    }) as Promise<FrontendComponent>
  }
}
