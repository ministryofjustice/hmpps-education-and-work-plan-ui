import type { VerifiedQualification, VerifiedQualifications } from 'viewModels'
import type { LearnerEventsResponse, LearningEvent } from 'learnerRecordsApiClient'
import { startOfDay } from 'date-fns'

const toVerifiedQualifications = (prisonNumber: string, apiResponse: LearnerEventsResponse): VerifiedQualifications => {
  const status = toMatchStatus(apiResponse)
  return {
    prisonNumber,
    status,
    qualifications:
      status === 'PRN_MATCHED_TO_LEARNER_RECORD' ? (apiResponse?.learnerRecord || []).map(toVerifiedQualification) : [],
  }
}

const toMatchStatus = (
  apiResponse: LearnerEventsResponse,
): 'PRN_MATCHED_TO_LEARNER_RECORD' | 'PRN_NOT_MATCHED_TO_LEARNER_RECORD' | 'LEARNER_DECLINED_TO_SHARE_DATA' => {
  if (apiResponse?.responseType === 'Learner opted to not share data') {
    return 'LEARNER_DECLINED_TO_SHARE_DATA'
  }
  if (apiResponse?.responseType === 'Exact Match') {
    return 'PRN_MATCHED_TO_LEARNER_RECORD'
  }
  return 'PRN_NOT_MATCHED_TO_LEARNER_RECORD'
}

const toVerifiedQualification = (learningEvent: LearningEvent): VerifiedQualification => ({
  subject: learningEvent.subject,
  awardingBodyName: learningEvent.awardingOrganisationName,
  source: learningEvent.source,
  qualificationType: learningEvent.qualificationType,
  level: learningEvent.level,
  grade: learningEvent.grade,
  awardedOn: startOfDay(learningEvent.achievementAwardDate),
})

export default toVerifiedQualifications
