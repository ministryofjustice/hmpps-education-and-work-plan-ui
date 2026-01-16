import type { PersonResponse } from 'educationAndWorkPlanApiClient'
import SearchPlanStatus from '../enums/searchPlanStatus'

const aPersonResponse = (options?: {
  forename?: string
  surname?: string
  prisonNumber?: string
  dateOfBirth?: string
  planStatus?: string
  cellLocation?: string
  releaseDate?: string
  enteredPrisonOn?: string
}): PersonResponse => ({
  forename: options?.forename || 'IFEREECA',
  surname: options?.surname || 'PEIGH',
  prisonNumber: options?.prisonNumber || 'A1234BC',
  dateOfBirth: options?.dateOfBirth || '1969-02-12',
  planStatus: options.planStatus || SearchPlanStatus.ACTIVE_PLAN,
  cellLocation: options?.cellLocation || 'A-1-102',
  releaseDate: options?.releaseDate === null ? null : options?.releaseDate || '2025-12-31',
  enteredPrisonOn: options?.enteredPrisonOn === null ? null : options?.enteredPrisonOn || '2025-01-15',
})

export default aPersonResponse
