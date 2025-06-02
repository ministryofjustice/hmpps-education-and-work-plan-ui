import type { Prisoner } from 'prisonerSearchApiClient'
import PrisonerSearchStore from './prisonerSearchStore'

export default class InMemoryPrisonerSearchStore implements PrisonerSearchStore {
  private data: Map<string, string> = new Map()

  setPrisoner(prisonNumber: string, prisoner: Prisoner, _durationHours: number): Promise<void> {
    this.data.set(`prisoner.${prisonNumber}`, JSON.stringify(prisoner))
    return Promise.resolve()
  }

  getPrisoner(prisonNumber: string): Promise<Prisoner> {
    const serializedPrisoner = this.data.get(`prisoner.${prisonNumber}`)
    return Promise.resolve(serializedPrisoner ? JSON.parse(serializedPrisoner) : undefined)
  }
}
