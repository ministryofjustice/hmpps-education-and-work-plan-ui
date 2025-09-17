import type { Assessment } from 'viewModels'
import { startOfDay } from 'date-fns'

const aValidCurious1Assessment = (options?: {
  prisonId?: string
  type?: 'ENGLISH' | 'MATHS' | 'DIGITAL_LITERACY'
  level?: string
  assessmentDate?: Date
}): Assessment =>
  aValidAssessment({
    prisonId: options?.prisonId,
    type: options?.type,
    level: options?.level,
    levelBanding: null,
    referral: null,
    nextStep: null,
    assessmentDate: options?.assessmentDate,
    source: 'CURIOUS1',
  })

const aValidCurious2Assessment = (options?: {
  prisonId?: string
  type?: 'ENGLISH' | 'MATHS' | 'DIGITAL_LITERACY'
  level?: string
  levelBanding?: string
  referral?: string
  nextStep?: string
  assessmentDate?: Date
}): Assessment =>
  aValidAssessment({
    prisonId: options?.prisonId,
    type: options?.type,
    level: options?.level,
    levelBanding: options?.levelBanding === null ? null : options?.levelBanding || '1.2',
    referral: options?.referral === null ? null : options?.referral || 'Education',
    nextStep: options.nextStep === null ? null : options?.nextStep || 'Progress to course at same level as assessed',
    assessmentDate: options?.assessmentDate,
    source: 'CURIOUS2',
  })

const aValidAssessment = (options?: {
  prisonId?: string
  type?: 'ENGLISH' | 'MATHS' | 'DIGITAL_LITERACY'
  level?: string
  levelBanding?: string
  referral?: string
  nextStep?: string
  assessmentDate?: Date
  source?: 'CURIOUS1' | 'CURIOUS2'
}): Assessment => ({
  prisonId: options?.prisonId || 'MDI',
  type: options?.type || 'ENGLISH',
  level: options?.level || 'Level 1',
  levelBanding: options?.levelBanding,
  referral: options?.referral,
  nextStep: options.nextStep,
  assessmentDate: options?.assessmentDate || startOfDay('2021-04-28'),
  source: options?.source || 'CURIOUS1',
})

export { aValidCurious1Assessment, aValidCurious2Assessment }
