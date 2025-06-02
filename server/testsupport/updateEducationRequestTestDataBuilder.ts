import type { CreateOrUpdateAchievedQualificationRequest, UpdateEducationRequest } from 'educationAndWorkPlanApiClient'
import { anUpdatedAchievedQualificationRequest } from './createOrUpdateAchievedQualificationRequestTestDataBuilder'
import EducationLevelValue from '../enums/educationLevelValue'

const aValidUpdateEducationRequest = (options?: {
  reference?: string
  prisonId?: string
  educationLevel?: EducationLevelValue
  qualifications?: Array<CreateOrUpdateAchievedQualificationRequest>
}): UpdateEducationRequest => ({
  reference: options?.reference || 'bcabb7ec-893e-4b0b-b999-6ff883fd8c6b',
  prisonId: options?.prisonId || 'BXI',
  educationLevel: options?.educationLevel || 'FURTHER_EDUCATION_COLLEGE',
  qualifications: options?.qualifications || [anUpdatedAchievedQualificationRequest()],
})

export default aValidUpdateEducationRequest
