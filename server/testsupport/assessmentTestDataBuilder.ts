import type { Assessment } from 'viewModels'

const aValidAssessment = (options?: {
  prisonId?: string
  type?: 'ENGLISH' | 'MATHS' | 'DIGITAL_LITERACY'
  grade?: string
  assessmentDate?: Date
  source?: 'CURIOUS1' | 'CURIOUS2'
}): Assessment => ({
  prisonId: options?.prisonId || 'MDI',
  type: options?.type || 'ENGLISH',
  grade: options?.grade || 'Level 1',
  assessmentDate: options?.assessmentDate || new Date('2021-04-28T00:00:00.000Z'),
  source: options?.source || 'CURIOUS1',
})

export default aValidAssessment
