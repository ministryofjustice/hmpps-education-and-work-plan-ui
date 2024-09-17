import type { CreateOrUpdateAchievedQualificationRequest } from 'educationAndWorkPlanApiClient'

const aNewAchievedQualificationRequest = (options?: {
  subject?: string
  level?: 'ENTRY_LEVEL' | 'LEVEL_1' | 'LEVEL_2' | 'LEVEL_3' | 'LEVEL_4' | 'LEVEL_5' | 'LEVEL_6' | 'LEVEL_7' | 'LEVEL_8'
  grade?: string
}): CreateOrUpdateAchievedQualificationRequest => ({
  reference: undefined,
  subject: options?.subject || 'GCSE Maths',
  grade: options?.grade || 'B',
  level: options?.level || 'LEVEL_2',
})

const anUpdatedAchievedQualificationRequest = (options?: {
  reference?: string
  subject?: string
  level?: 'ENTRY_LEVEL' | 'LEVEL_1' | 'LEVEL_2' | 'LEVEL_3' | 'LEVEL_4' | 'LEVEL_5' | 'LEVEL_6' | 'LEVEL_7' | 'LEVEL_8'
  grade?: string
}): CreateOrUpdateAchievedQualificationRequest => ({
  ...aNewAchievedQualificationRequest(),
  reference: options?.reference || 'bcabb7ec-893e-4b0b-b999-6ff883fd8c6b',
})

export { aNewAchievedQualificationRequest, anUpdatedAchievedQualificationRequest }
