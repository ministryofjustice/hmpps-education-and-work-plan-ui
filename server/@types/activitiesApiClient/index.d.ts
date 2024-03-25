import { components, operations } from '../activitiesApi'

declare module 'activitiesApiClient' {
  // Allocation types
  export type PrisonerAllocation = components['schemas']['Allocation']
  export type PrisonerAllocations = components['schemas']['PrisonerAllocations']

  export type PrisonersAllocationsRequest = string[]
  export type PrisonersAllocationsResponse = Array<PrisonerAllocations>

  // Waiting list types
  export type WaitingListApplication = components['schemas']['WaitingListApplication']

  export type WaitingListSearchRequestQueryParams = operations['searchWaitingLists']['parameters']['query']
  export type WaitingListSearchRequest = components['schemas']['WaitingListSearchRequest']
  export type WaitingListSearchResponse = components['schemas']['PagedWaitingListApplication']
}
