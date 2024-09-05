import type { AchievedQualificationResponse, EducationResponse } from 'educationAndWorkPlanApiClient'
import EducationLevelValue from '../enums/educationLevelValue'
import aValidAchievedQualificationResponse from './achievedQualificationResponseTestDataBuilder'

const aValidEducationResponse = (options?: {
  reference?: string
  educationLevel?: EducationLevelValue
  qualifications?: Array<AchievedQualificationResponse>
  createdBy?: string
  createdByDisplayName?: string
  createdAt?: string
  createdAtPrison?: string
  updatedBy?: string
  updatedByDisplayName?: string
  updatedAt?: string
  updatedAtPrison?: string
}): EducationResponse => ({
  reference: options?.reference || 'dea24acc-fde5-4ead-a9eb-e1757de2542c',
  educationLevel: options?.educationLevel || EducationLevelValue.SECONDARY_SCHOOL_TOOK_EXAMS,
  qualifications: options?.qualifications || [aValidAchievedQualificationResponse()],
  createdBy: options?.createdBy || 'asmith_gen',
  createdByDisplayName: options?.createdByDisplayName || 'Alex Smith',
  createdAt: options?.createdAt || '2023-06-19T09:39:44Z',
  createdAtPrison: options?.createdAtPrison || 'MDI',
  updatedBy: options?.updatedBy || 'asmith_gen',
  updatedByDisplayName: options?.updatedByDisplayName || 'Alex Smith',
  updatedAt: options?.updatedAt || '2023-06-19T09:39:44Z',
  updatedAtPrison: options?.updatedAtPrison || 'MDI',
})

export default aValidEducationResponse
