import { NextFunction, Request, Response } from 'express'
import logger from '../../../logger'
import { getPrisonerContext } from '../../data/session/prisonerContexts'

/**
 * Request handler function to check the EducationDto exists in the prisoner context.
 */
const checkEducationDtoExistsInPrisonerContext = async (req: Request, res: Response, next: NextFunction) => {
  if (!getPrisonerContext(req.session, req.params.prisonNumber).educationDto) {
    logger.warn(
      `No EducationDto object in prisonerContext - user attempting to navigate to path ${req.path} out of sequence. Redirecting to Overview page.`,
    )
    res.redirect(`/plan/${req.params.prisonNumber}/view/overview`)
  } else {
    next()
  }
}
export default checkEducationDtoExistsInPrisonerContext
