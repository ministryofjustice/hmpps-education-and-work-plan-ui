declare module 'prisonRegisterApiClient' {
  import { components } from '../prisonRegisterApi'

  export type Prison = components['schemas']['PrisonDto']
}
