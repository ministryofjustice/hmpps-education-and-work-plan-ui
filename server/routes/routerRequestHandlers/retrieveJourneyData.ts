import { NextFunction, Request, Response } from 'express'
import { JourneyDataStore } from '../../data'

/**
 *  Middleware function that returns a Request handler function that retrieves journeyData from the JourneyDataStore and
 *  populates it into the request.
 *  IE. before the request is handled by the controller, populate req.journeyData with any journey data held in the
 *  JourneyDataStore
 */
const retrieveJourneyData = (store: JourneyDataStore) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const journeyId = req.params.journeyId ?? 'default'

    req.journeyData = await store.getJourneyData(req.user?.username, journeyId)

    next()
  }
}

export default retrieveJourneyData
