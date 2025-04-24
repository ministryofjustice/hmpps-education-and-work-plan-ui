import { NextFunction, Request, Response } from 'express'
import asyncMiddleware from '../../middleware/asyncMiddleware'
import { JourneyDataService } from '../../services'

const JOURNEY_DATA_CACHE_TTL_HOURS = 1

/**
 *  Middleware function that returns a Request handler function that:
 *   * populates the journeyData in the Request by retrieving it from the JourneyDataService
 *   * sets up a Response listener to save or remove the JourneyData on completion of the controller handler
 */
const setupJourneyData = (service: JourneyDataService) => {
  const populateJourneyDataInRequestBeforeControllerHandlerExecutes = async (req: Request) => {
    // Get any journeyData from the service and set in the Request
    const journeyId = req.params.journeyId ?? 'default'
    req.journeyData = (await service.getJourneyData(req.user?.username, journeyId)) ?? req.journeyData
  }

  const setupListenerToSaveOrRemoveJourneyDataAfterControllerHandlerExecutes = (req: Request, res: Response) => {
    // Set a listener on the 'close' event of the Response to either save or remove the journeyData
    // IE. a controller's POST endpoint might have updated the journeyData on the Request - this listener will save it
    // on completion of the Response
    const journeyId = req.params.journeyId ?? 'default'
    res.prependOnceListener('close', async () => {
      if (!req.journeyData) {
        await service.deleteJourneyData(req.user?.username, journeyId)
      } else {
        await service.setJourneyData(req.user?.username, journeyId, req.journeyData, JOURNEY_DATA_CACHE_TTL_HOURS)
      }
    })
  }

  return asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
    populateJourneyDataInRequestBeforeControllerHandlerExecutes(req)
    setupListenerToSaveOrRemoveJourneyDataAfterControllerHandlerExecutes(req, res)
    next()
  })
}

export default setupJourneyData
