import { NextFunction, Request, Response } from 'express'
import logger from '../../../logger'

/**
 * Middleware function to check that the [CreateEmployabilitySkillDto] exists in the journeyData.
 */
const checkCreateEmployabilitySkillDtoExistsInJourneyData = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.journeyData?.createEmployabilitySkillDto) {
    logger.warn(
      `No CreateEmployabilitySkillDto in journeyData - user attempting to navigate to path ${req.originalUrl} out of sequence. Redirecting to Overview Employability Skills page.`,
    )
    return res.redirect(`/plan/${req.params.prisonNumber}/view/employability-skills`)
  }
  return next()
}

export default checkCreateEmployabilitySkillDtoExistsInJourneyData
