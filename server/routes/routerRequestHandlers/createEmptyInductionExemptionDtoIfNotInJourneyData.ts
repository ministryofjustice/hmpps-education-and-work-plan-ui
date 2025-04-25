import { NextFunction, Request, Response } from 'express'
import type { InductionExemptionDto } from 'inductionDto'

/**
 * Request handler function to check whether an Induction Exemption DTO exists in the journeyData.
 * If one does not exist create a new empty Induction Exemption DTO for the prisoner.
 */
const createEmptyInductionExemptionDtoIfNotInJourneyData = async (req: Request, res: Response, next: NextFunction) => {
  const { prisonNumber } = req.params

  if (!req.journeyData?.inductionExemptionDto) {
    req.journeyData = {
      inductionExemptionDto: { prisonNumber } as InductionExemptionDto,
    }
  }

  next()
}

export default createEmptyInductionExemptionDtoIfNotInJourneyData
