import type { CreateOrUpdateAchievedQualificationRequest, UpdateEducationRequest } from 'educationAndWorkPlanApiClient'
import { anUpdatedAchievedQualificationRequest } from './createOrUpdateAchievedQualificationRequestTestDataBuilder'

const aValidUpdateEducationRequest = (options?: {
  reference?: string
  prisonId?: string
  educationLevel?:
    | 'PRIMARY_SCHOOL'
    | 'SECONDARY_SCHOOL_LEFT_BEFORE_TAKING_EXAMS'
    | 'SECONDARY_SCHOOL_TOOK_EXAMS'
    | 'FURTHER_EDUCATION_COLLEGE'
    | 'UNDERGRADUATE_DEGREE_AT_UNIVERSITY'
    | 'POSTGRADUATE_DEGREE_AT_UNIVERSITY'
    | 'NOT_SURE'
  qualifications?: Array<CreateOrUpdateAchievedQualificationRequest>
}): UpdateEducationRequest => ({
  reference: options?.reference || 'bcabb7ec-893e-4b0b-b999-6ff883fd8c6b',
  prisonId: options?.prisonId || 'BXI',
  educationLevel: options?.educationLevel || 'FURTHER_EDUCATION_COLLEGE',
  qualifications: options?.qualifications || [anUpdatedAchievedQualificationRequest()],
})

export default aValidUpdateEducationRequest
