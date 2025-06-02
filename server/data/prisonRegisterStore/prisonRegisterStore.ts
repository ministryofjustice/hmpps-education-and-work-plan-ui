import type { PrisonResponse } from 'prisonRegisterApiClient'

export default interface PrisonRegisterStore {
  setActivePrisons(activePrisons: Array<PrisonResponse>, durationDays: number): Promise<void>

  getActivePrisons(): Promise<Array<PrisonResponse>>
}
