import type { CreateAchievedQualificationRequest, CreateEducationRequest } from 'educationAndWorkPlanApiClient'
import aValidCreateAchievedQualificationRequest from './createAchievedQualificationRequestTestDataBuilder'
import EducationLevelValue from '../enums/educationLevelValue'

const aValidCreateEducationRequest = (options?: {
  prisonId?: string
  educationLevel?: EducationLevelValue
  qualifications?: Array<CreateAchievedQualificationRequest>
}): CreateEducationRequest => ({
  prisonId: options?.prisonId || 'BXI',
  educationLevel: options?.educationLevel || EducationLevelValue.FURTHER_EDUCATION_COLLEGE,
  qualifications: options?.qualifications || [aValidCreateAchievedQualificationRequest()],
})

export default aValidCreateEducationRequest
