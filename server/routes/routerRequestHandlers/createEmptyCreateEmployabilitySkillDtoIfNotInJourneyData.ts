import { NextFunction, Request, Response } from 'express'
import type { CreateEmployabilitySkillDto } from 'dto'
import { PrisonUser } from '../../interfaces/hmppsUser'

/**
 * Request handler function to check whether a Create Employability Skill DTO exists in the journeyData.
 * If one does not exist create a new empty Create Employability Skill DTO for the prisoner.
 */
const createEmptyCreateEmployabilitySkillDtoIfNotInJourneyData = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { activeCaseLoadId } = res.locals.user as PrisonUser

  if (!req.journeyData.createEmployabilitySkillDto) {
    req.journeyData.createEmployabilitySkillDto = { prisonId: activeCaseLoadId } as CreateEmployabilitySkillDto
  }

  next()
}

export default createEmptyCreateEmployabilitySkillDtoIfNotInJourneyData
