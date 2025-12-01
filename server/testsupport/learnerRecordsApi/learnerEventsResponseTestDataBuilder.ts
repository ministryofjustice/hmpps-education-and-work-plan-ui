import type { LearnerEventsRequest, LearnerEventsResponse, LearningEvent } from 'learnerRecordsApiClient'
import aLearnerEventsRequest from './learnerEventsRequestTestDataBuilder'
import aLearningEvent from './learningEventTestDataBuilder'

const aLearnerEventsResponse = (options?: {
  searchParameters?: LearnerEventsRequest
  responseType?:
    | 'No Match'
    | 'Too Many Matches'
    | 'Possible Match'
    | 'Exact Match'
    | 'Linked Learner Match'
    | 'Learner opted to not share data'
    | 'Learner could not be verified'
  foundUln?: string
  incomingUln?: string
  learnerRecords?: Array<LearningEvent>
}): LearnerEventsResponse => ({
  searchParameters: options?.searchParameters || aLearnerEventsRequest(),
  responseType: options?.responseType || 'Exact Match',
  incomingUln: options?.incomingUln || '1234567890',
  foundUln: options?.foundUln || '1234567890',
  learnerRecord: options?.learnerRecords || [aLearningEvent()],
})

export default aLearnerEventsResponse
