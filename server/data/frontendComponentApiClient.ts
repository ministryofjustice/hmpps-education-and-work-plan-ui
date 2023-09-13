import type { FrontendComponent } from 'frontendComponentApiClient'
import RestClient from './restClient'
import config from '../config'

export default class FrontendComponentApiClient {
  private static restClient(token: string): RestClient {
    return new RestClient('Frontend Component API', config.apis.frontendComponents, token)
  }

  async getComponents(component: 'header' | 'footer', userToken: string) {
    return FrontendComponentApiClient.restClient(userToken).get({
      path: `/${component}`,
      headers: { 'x-user-token': userToken },
    }) as Promise<FrontendComponent>
  }
}
