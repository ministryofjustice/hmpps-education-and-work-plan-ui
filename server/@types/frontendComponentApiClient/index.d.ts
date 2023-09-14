declare module 'frontendComponentApiClient' {
  import { components } from '../frontendComponentApi'

  export type FrontendComponent = components['schemas']['Component']
}
