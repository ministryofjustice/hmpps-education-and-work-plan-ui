import type { InductionResponse } from 'educationAndWorkPlanApiClient'

const aValidInductionResponse = (options?: {
  createdBy?: string
  createdByDisplayName?: string
  createdAt?: string
  createdAtPrison?: string
  updatedBy?: string
  updatedByDisplayName?: string
  updatedAt?: string
  updatedAtPrison?: string
}): InductionResponse => {
  return {
    reference: '814ade0a-a3b2-46a3-862f-79211ba13f7b',
    createdBy: options?.createdByDisplayName || 'asmith_gen',
    createdByDisplayName: options?.createdByDisplayName || 'Alex Smith',
    createdAt: options?.createdAt || '2023-06-19T09:39:44Z',
    createdAtPrison: options?.createdAtPrison || 'MDI',
    updatedBy: options?.updatedBy || 'asmith_gen',
    updatedByDisplayName: options?.updatedByDisplayName || 'Alex Smith',
    updatedAt: options?.updatedAt || '2023-06-19T09:39:44Z',
    updatedAtPrison: options?.updatedAtPrison || 'MDI',
    workOnRelease: undefined,
    previousQualifications: undefined,
    previousTraining: undefined,
    previousWorkExperiences: undefined,
    inPrisonInterests: undefined,
    personalSkillsAndInterests: undefined,
    futureWorkInterests: undefined,
  }
}

export default aValidInductionResponse
