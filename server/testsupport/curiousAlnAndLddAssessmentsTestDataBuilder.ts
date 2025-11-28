import type { AlnAssessment, CuriousAlnAndLddAssessments, LddAssessment } from 'viewModels'
import { startOfDay } from 'date-fns'
import AlnAssessmentReferral from '../enums/alnAssessmentReferral'

const validCuriousAlnAndLddAssessments = (options?: {
  lddAssessments?: Array<LddAssessment>
  alnAssessments?: Array<AlnAssessment>
}): CuriousAlnAndLddAssessments => ({
  lddAssessments: options?.lddAssessments || [aLddAssessment()],
  alnAssessments: options?.alnAssessments || [anAlnAssessment()],
})

const aLddAssessment = (options?: {
  prisonId?: string
  rapidAssessmentDate?: Date
  inDepthAssessmentDate?: Date
  primaryLddAndHealthNeed?: string
  additionalLddAndHealthNeeds?: Array<string>
}): LddAssessment => ({
  prisonId: options?.prisonId || 'BXI',
  rapidAssessmentDate:
    options?.rapidAssessmentDate === null ? null : options?.rapidAssessmentDate || startOfDay('2024-10-20'),
  inDepthAssessmentDate:
    options?.inDepthAssessmentDate === null ? null : options?.inDepthAssessmentDate || startOfDay('2024-10-25'),
  primaryLddAndHealthNeed:
    options?.primaryLddAndHealthNeed === null ? null : options?.primaryLddAndHealthNeed || 'Visual impairment',
  additionalLddAndHealthNeeds: options?.additionalLddAndHealthNeeds || [
    'Hearing impairment',
    'Mental health difficulty',
    'Social and emotional difficulties',
  ],
})

const anAlnAssessment = (options?: {
  prisonId?: string
  assessmentDate?: Date
  referral?: Array<AlnAssessmentReferral>
  additionalNeedsIdentified?: boolean
}): AlnAssessment => ({
  prisonId: options?.prisonId || 'BXI',
  assessmentDate: options?.assessmentDate || startOfDay('2025-10-02'),
  referral: options?.referral === null ? null : options?.referral || [AlnAssessmentReferral.PSYCHOLOGY],
  additionalNeedsIdentified:
    options?.additionalNeedsIdentified === false ? false : options?.additionalNeedsIdentified || true,
})

export { validCuriousAlnAndLddAssessments, aLddAssessment, anAlnAssessment }
