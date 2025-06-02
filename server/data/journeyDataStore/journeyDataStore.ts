export default interface JourneyDataStore {
  setJourneyData(
    username: string,
    journeyId: string,
    journeyData: Express.JourneyData,
    durationHours: number,
  ): Promise<void>

  getJourneyData(username: string, journeyId: string): Promise<Express.JourneyData>

  deleteJourneyData(username: string, journeyId: string): Promise<void>
}
