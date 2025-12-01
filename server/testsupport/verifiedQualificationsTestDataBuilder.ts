import type { VerifiedQualification, VerifiedQualifications } from 'viewModels'
import { startOfDay } from 'date-fns'

const verifiedQualifications = (options?: {
  prisonNumber?: string
  status?: 'PRN_MATCHED_TO_LEARNER_RECORD' | 'PRN_NOT_MATCHED_TO_LEARNER_RECORD' | 'LEARNER_DECLINED_TO_SHARE_DATA'
  qualifications?: Array<VerifiedQualification>
}): VerifiedQualifications => ({
  prisonNumber: options?.prisonNumber || 'A1234BC',
  status: options?.status || 'PRN_MATCHED_TO_LEARNER_RECORD',
  qualifications: options?.qualifications || [aVerifiedQualification()],
})

const aVerifiedQualification = (options?: {
  subject?: string
  awardingBodyName?: string
  source?: string
  qualificationType?: string
  level?: string
  grade?: string
  awardedOn?: Date
}): VerifiedQualification => ({
  subject:
    options?.subject || 'AQA Level 3 Advanced GCE in Applied Information and Communication Technology (Double Award)',
  awardingBodyName: options?.awardingBodyName || 'Assessment and Qualifications Alliance',
  source: options?.source || 'AO',
  qualificationType: options?.qualificationType || 'Applied GCE Double Award',
  grade: options?.grade || 'A',
  awardedOn: options?.awardedOn || startOfDay('2010-07-01'),
  level: options?.level === null ? null : options?.level || 'Level 3',
})

export { verifiedQualifications, aVerifiedQualification }
