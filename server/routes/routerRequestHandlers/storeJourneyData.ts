import { NextFunction, Request, Response } from 'express'
import { JourneyDataStore } from '../../data'

const JOURNEY_DATA_CACHE_TTL_HOURS = 1

/**
 *  Middleware function that returns a Request handler function that stores any journeyData from the request in the
 *  JourneyDataStore on response completion
 *  IE. upon completion of the response store any journeyData on the request in the JourneyDataStore. If the request
 *  has no journeyData, remove any corresponding journeyData in the JourneyDataStore.
 */
const storeJourneyData = (store: JourneyDataStore) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    res.prependOnceListener('close', async () => {
      const journeyId = req.params.journeyId ?? 'default'

      if (!req.journeyData) {
        await store.deleteJourneyData(req.user?.username, journeyId)
      } else {
        await store.setJourneyData(req.user?.username, journeyId, req.journeyData, JOURNEY_DATA_CACHE_TTL_HOURS)
      }
    })

    next()
  }
}

export default storeJourneyData
