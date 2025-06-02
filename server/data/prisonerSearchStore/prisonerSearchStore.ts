import type { Prisoner } from 'prisonerSearchApiClient'

export default interface PrisonerSearchStore {
  setPrisoner(prisonNumber: string, prisoner: Prisoner, durationHours: number): Promise<void>

  getPrisoner(prisonNumber: string): Promise<Prisoner>
}
