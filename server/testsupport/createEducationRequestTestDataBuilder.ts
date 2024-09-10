import type { CreateAchievedQualificationRequest, CreateEducationRequest } from 'educationAndWorkPlanApiClient'
import aValidCreateAchievedQualificationRequest from './createAchievedQualificationRequestTestDataBuilder'

const aValidCreateEducationRequest = (options?: {
  prisonId?: string
  educationLevel?:
    | 'PRIMARY_SCHOOL'
    | 'SECONDARY_SCHOOL_LEFT_BEFORE_TAKING_EXAMS'
    | 'SECONDARY_SCHOOL_TOOK_EXAMS'
    | 'FURTHER_EDUCATION_COLLEGE'
    | 'UNDERGRADUATE_DEGREE_AT_UNIVERSITY'
    | 'POSTGRADUATE_DEGREE_AT_UNIVERSITY'
    | 'NOT_SURE'
  qualifications?: Array<CreateAchievedQualificationRequest>
}): CreateEducationRequest => ({
  prisonId: options?.prisonId || 'BXI',
  educationLevel: options?.educationLevel || 'FURTHER_EDUCATION_COLLEGE',
  qualifications: options?.qualifications || [aValidCreateAchievedQualificationRequest()],
})

export default aValidCreateEducationRequest
