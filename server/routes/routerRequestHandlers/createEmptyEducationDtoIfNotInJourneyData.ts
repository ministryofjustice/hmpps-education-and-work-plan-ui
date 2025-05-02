import { NextFunction, Request, Response } from 'express'
import type { EducationDto } from 'dto'

/**
 * Request handler function to check whether an Education DTO exists in the journeyData.
 * If one does not exist create a new empty Education DTO for the prisoner.
 */
const createEmptyEducationDtoIfNotInJourneyData = async (req: Request, res: Response, next: NextFunction) => {
  const { prisonNumber } = req.params

  if (!req.journeyData.educationDto) {
    req.journeyData.educationDto = { prisonNumber, qualifications: [] } as EducationDto
  }

  next()
}

export default createEmptyEducationDtoIfNotInJourneyData
