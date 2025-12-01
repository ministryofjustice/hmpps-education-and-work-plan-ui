import { format } from 'date-fns'
import type { LearningEvent } from 'learnerRecordsApiClient'

const aLearningEvent = (options?: {
  id?: number
  achievementProviderUkprn?: string
  achievementProviderName?: string
  awardingOrganisationName?: string
  qualificationType?: string
  subjectCode?: string
  achievementAwardDate?: Date
  credits?: number
  source?: string
  dateLoaded?: Date
  underDataChallenge?: string
  level?: string
  status?: string
  subject?: string
  grade?: string
  awardingOrganisationUkprn?: string
  collectionType?: string
  returnNumber?: string
  participationStartDate?: Date
  participationEndDate?: Date
  languageForAssessment?: string
}): LearningEvent => ({
  id: options?.id || 513,
  achievementProviderUkprn: options?.achievementProviderUkprn || '10032743',
  achievementProviderName: options?.achievementProviderName || 'PRIORSLEE PRIMARY SCHOOL ACADEMY TRUST',
  awardingOrganisationName: options?.awardingOrganisationName || 'Assessment and Qualifications Alliance',
  qualificationType: options?.qualificationType || 'Applied GCE Double Award',
  subjectCode: options?.subjectCode || '10045636',
  achievementAwardDate: options?.achievementAwardDate
    ? format(options.achievementAwardDate, 'yyyy-MM-dd')
    : '2010-07-01',
  credits: options?.credits || 1,
  source: options?.source || 'NPD',
  dateLoaded:
    options?.dateLoaded || options?.achievementAwardDate
      ? format(options.achievementAwardDate, 'yyyy-MM-dd HH:mm:ss')
      : '2012-05-30 17:28:02',
  underDataChallenge: options?.underDataChallenge || 'N',
  level: options?.level,
  status: options?.status || 'F',
  subject:
    options?.subject || 'AQA Level 3 Advanced GCE in Applied Information and Communication Technology (Double Award)',
  grade: options?.grade || 'A',
  awardingOrganisationUkprn: options?.awardingOrganisationUkprn || '100062',
  collectionType: options?.collectionType || 'A',
  returnNumber: options?.returnNumber || '01',
  participationStartDate: options?.participationStartDate
    ? format(options.participationStartDate, 'yyyy-MM-dd')
    : '2009-09-01',
  participationEndDate: options?.participationEndDate
    ? format(options.participationEndDate, 'yyyy-MM-dd')
    : '2010-06-01',
  languageForAssessment: options?.languageForAssessment || 'English',
})

export default aLearningEvent
