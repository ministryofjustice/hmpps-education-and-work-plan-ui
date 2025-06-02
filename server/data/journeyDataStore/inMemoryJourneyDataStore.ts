import JourneyDataStore from './journeyDataStore'
import dataParsingReviver from './dataParsingReviver'

const DATE_FIELDS = ['createdAt', 'updatedAt']

export default class InMemoryJourneyDataStore implements JourneyDataStore {
  private data: Map<string, string> = new Map()

  setJourneyData(
    username: string,
    journeyId: string,
    journeyData: Express.JourneyData,
    _durationHours: number,
  ): Promise<void> {
    this.data.set(`journey.${username}.${journeyId}`, JSON.stringify(journeyData))
    return Promise.resolve()
  }

  getJourneyData(username: string, journeyId: string): Promise<Express.JourneyData> {
    const serializedJourneyData = this.data.get(`journey.${username}.${journeyId}`)
    return Promise.resolve(
      serializedJourneyData ? JSON.parse(serializedJourneyData.toString(), dataParsingReviver(DATE_FIELDS)) : {},
    )
  }

  deleteJourneyData(username: string, journeyId: string): Promise<void> {
    this.data.delete(`journey.${username}.${journeyId}`)
    return Promise.resolve()
  }
}
