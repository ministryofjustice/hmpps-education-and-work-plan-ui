import type { CreateAchievedQualificationRequest } from 'educationAndWorkPlanApiClient'

const aValidCreateAchievedQualificationRequest = (options?: {
  subject?: string
  level?: 'ENTRY_LEVEL' | 'LEVEL_1' | 'LEVEL_2' | 'LEVEL_3' | 'LEVEL_4' | 'LEVEL_5' | 'LEVEL_6' | 'LEVEL_7' | 'LEVEL_8'
  grade?: string
}): CreateAchievedQualificationRequest => ({
  subject: options?.subject || 'GCSE Maths',
  grade: options?.grade || 'B',
  level: options?.level || 'LEVEL_2',
})

export default aValidCreateAchievedQualificationRequest
