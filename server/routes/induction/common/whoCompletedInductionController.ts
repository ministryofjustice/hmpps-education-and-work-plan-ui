import { RequestHandler } from 'express'
import { format, startOfDay } from 'date-fns'
import type { WhoCompletedInductionForm } from 'inductionForms'
import type { InductionDto } from 'inductionDto'
import WhoCompletedInductionView from './whoCompletedInductionView'

/**
 * Abstract controller class defining functionality common to both the Create and Update Induction journeys.
 */
export default abstract class WhoCompletedInductionController {
  getWhoCompletedInductionView: RequestHandler = async (req, res, next): Promise<void> => {
    const { inductionDto } = req.journeyData
    const { prisonerSummary, invalidForm } = res.locals

    const whoCompletedInductionForm = invalidForm ?? toWhoCompletedInductionForm(inductionDto)

    const view = new WhoCompletedInductionView(prisonerSummary, whoCompletedInductionForm)
    return res.render('pages/induction/whoCompletedInduction/index', { ...view.renderArgs })
  }
}

const toWhoCompletedInductionForm = (dto: InductionDto): WhoCompletedInductionForm => {
  const inductionDate = dto.inductionDate ? startOfDay(dto.inductionDate) : undefined
  return {
    completedBy: dto.completedBy,
    completedByOtherFullName: dto.completedByOtherFullName,
    completedByOtherJobRole: dto.completedByOtherJobRole,
    inductionDate: inductionDate ? format(inductionDate, 'd/M/yyyy') : undefined,
  }
}
