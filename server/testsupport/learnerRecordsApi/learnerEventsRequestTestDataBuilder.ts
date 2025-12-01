import { format } from 'date-fns'
import type { LearnerEventsRequest } from 'learnerRecordsApiClient'

const aLearnerEventsRequest = (options?: {
  givenName?: string
  familyName?: string
  uln?: string
  dateOfBirth?: Date
  gender?: 'MALE' | 'FEMALE' | 'NOT_KNOWN' | 'NOT_SPECIFIED'
}): LearnerEventsRequest => ({
  givenName: options?.givenName || 'John',
  familyName: options?.givenName || 'Doe',
  uln: options?.uln || '1234567890',
  dateOfBirth: options?.dateOfBirth ? format(options.dateOfBirth, 'yyyy-MM-dd') : undefined,
  gender: options?.gender,
})

export default aLearnerEventsRequest
