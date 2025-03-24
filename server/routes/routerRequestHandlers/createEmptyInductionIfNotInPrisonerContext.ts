import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { EducationDto } from 'dto'
import type { InductionDto } from 'inductionDto'
import { EducationAndWorkPlanService } from '../../services'
import asyncMiddleware from '../../middleware/asyncMiddleware'
import logger from '../../../logger'
import { getPrisonerContext } from '../../data/session/prisonerContexts'

/**
 * Middleware function that returns a request handler function to check whether an Induction exists in the
 * Prisoner Context for the prisoner referenced in the request URL.
 * If one does not exist, or it is for a different prisoner, create a new empty Induction for the prisoner.
 * If the prisoner already has qualifications, add them to the Induction.
 */
const createEmptyInductionIfNotInPrisonerContext = (
  educationAndWorkPlanService: EducationAndWorkPlanService,
): RequestHandler => {
  return asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
    const { prisonNumber } = req.params

    // Either no Induction in the Prisoner Context, or it's for a different prisoner. Create a new one, including the prisoners education if it has been previously recorded.
    if (getPrisonerContext(req.session, prisonNumber).inductionDto?.prisonNumber !== prisonNumber) {
      logger.debug(
        `RR-1300 - Setting up new InductionDto in the Prisoner Context for ${prisonNumber} because ${!getPrisonerContext(req.session, prisonNumber).inductionDto ? 'InductionDto is not in the Prisoner Context' : 'InductionDto in the Prisoner Context is for a different prisoner'}`,
      )

      let educationDto: EducationDto
      try {
        educationDto = await educationAndWorkPlanService.getEducation(prisonNumber, req.user.username)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (e) {
        educationDto = undefined
      }

      getPrisonerContext(req.session, prisonNumber).inductionDto = {
        prisonNumber,
        previousQualifications: educationDto
          ? {
              educationLevel: educationDto.educationLevel,
              qualifications: educationDto.qualifications,
            }
          : undefined,
      } as InductionDto
    }

    next()
  })
}

export default createEmptyInductionIfNotInPrisonerContext
