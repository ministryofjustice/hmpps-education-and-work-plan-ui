import type { Assessment } from 'viewModels'

const aValidAssessment = (options?: {
  prisonId?: string
  prisonName?: string
  type?: 'ENGLISH' | 'MATHS' | 'DIGITAL_LITERACY'
  grade?: string
  assessmentDate?: Date
}): Assessment => {
  return {
    prisonId: options?.prisonId || 'MDI',
    prisonName: options?.prisonName || 'MOORLAND (HMP & YOI)',
    type: options?.type || 'ENGLISH',
    grade: options?.grade || 'Level 1',
    assessmentDate: options?.assessmentDate || new Date('2021-04-28T00:00:00.000Z'),
  }
}

export default aValidAssessment
