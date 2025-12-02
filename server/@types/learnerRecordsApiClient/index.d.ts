declare module 'learnerRecordsApiClient' {
  import { components } from '../learnerRecordsApi'

  export type LearnerEventsRequest = components['schemas']['LearnerEventsRequest']
  export type LearnerEventsResponse = components['schemas']['LearnerEventsResponse']
  export type LearningEvent = components['schemas']['LearningEvent']
}
