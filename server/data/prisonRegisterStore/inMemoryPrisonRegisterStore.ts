import type { PrisonResponse } from 'prisonRegisterApiClient'
import PrisonRegisterStore from './prisonRegisterStore'

export default class InMemoryPrisonRegisterStore implements PrisonRegisterStore {
  private activePrisons: Array<PrisonResponse> = []

  async setActivePrisons(activePrisons: Array<PrisonResponse>, _durationDays: number): Promise<void> {
    this.activePrisons = activePrisons
    return Promise.resolve()
  }

  async getActivePrisons(): Promise<Array<PrisonResponse>> {
    return Promise.resolve(this.activePrisons)
  }
}
