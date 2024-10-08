declare module 'prisonerSearchApiClient' {
  import { components } from '../prisonerSearchApi'

  export type PagedCollectionOfPrisoners = components['schemas']['PagePrisoner']
  export type Prisoner = components['schemas']['Prisoner']
}
