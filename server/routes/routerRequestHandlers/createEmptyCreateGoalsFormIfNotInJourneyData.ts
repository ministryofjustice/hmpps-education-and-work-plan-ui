import { NextFunction, Request, Response } from 'express'

/**
 * Request handler function to check whether a CreateGoalsForm exists in the journeyData.
 * If one does not exist create a new empty CreateGoalsForm for the prisoner.
 */
const createEmptyCreateGoalsFormIfNotInJourneyData = async (req: Request, res: Response, next: NextFunction) => {
  const { prisonNumber } = req.params

  if (!req.journeyData?.createGoalsForm) {
    req.journeyData = {
      createGoalsForm: { prisonNumber, goals: undefined },
    }
  }

  next()
}

export default createEmptyCreateGoalsFormIfNotInJourneyData
