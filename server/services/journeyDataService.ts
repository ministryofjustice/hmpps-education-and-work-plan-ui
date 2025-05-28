import { JourneyDataStore } from '../data'

export default class JourneyDataService {
  constructor(private readonly journeyDataStore: JourneyDataStore) {}

  async getJourneyData(username: string, journeyId: string): Promise<Express.JourneyData> {
    return this.journeyDataStore.getJourneyData(username, journeyId)
  }

  async setJourneyData(
    username: string,
    journeyId: string,
    journeyData: Express.JourneyData,
    durationHours: number,
  ): Promise<void> {
    await this.journeyDataStore.setJourneyData(username, journeyId, journeyData, durationHours)
  }

  async deleteJourneyData(username: string, journeyId: string): Promise<void> {
    return this.journeyDataStore.deleteJourneyData(username, journeyId)
  }
}
