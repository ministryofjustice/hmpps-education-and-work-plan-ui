import type { AchievedQualificationResponse } from 'educationAndWorkPlanApiClient'
import QualificationLevelValue from '../enums/qualificationLevelValue'

const aValidAchievedQualificationResponse = (options?: {
  reference?: string
  subject?: string
  level?: QualificationLevelValue
  grade?: string
  createdBy?: string
  createdAt?: string
  updatedBy?: string
  updatedAt?: string
}): AchievedQualificationResponse => ({
  reference: options?.reference || '2bb661f2-bfd6-46fa-a7e0-1aa655e94e70',
  subject: options?.subject || 'GCSE Maths',
  grade: options?.grade || 'A*',
  level: options?.level || QualificationLevelValue.LEVEL_2,
  createdBy: options?.createdBy || 'asmith_gen',
  createdAt: options?.createdAt || '2023-06-19T09:39:44Z',
  updatedBy: options?.updatedBy || 'asmith_gen',
  updatedAt: options?.updatedAt || '2023-06-19T09:39:44Z',
})

export default aValidAchievedQualificationResponse
