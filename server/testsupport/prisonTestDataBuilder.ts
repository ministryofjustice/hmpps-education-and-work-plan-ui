import type { Prison } from 'viewModels'

const aValidPrison = (options?: { prisonId?: string; prisonName?: string }): Prison => {
  return {
    prisonId: options?.prisonId || 'MDI',
    prisonName: options?.prisonName || 'Moorland (HMP & YOI)',
  }
}

export default aValidPrison
