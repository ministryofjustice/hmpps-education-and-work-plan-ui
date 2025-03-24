import { RequestHandler } from 'express'
import { startOfDay } from 'date-fns'
import type { WhoCompletedInductionForm } from 'inductionForms'
import type { InductionDto } from 'inductionDto'
import WhoCompletedInductionView from './whoCompletedInductionView'
import { getPrisonerContext } from '../../../data/session/prisonerContexts'
import InductionController from './inductionController'

/**
 * Abstract controller class defining functionality common to both the Create and Update Induction journeys.
 */
export default abstract class WhoCompletedInductionController extends InductionController {
  getWhoCompletedInductionView: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonNumber } = req.params
    const { prisonerSummary } = res.locals
    const { inductionDto } = getPrisonerContext(req.session, prisonNumber)

    const whoCompletedInductionForm: WhoCompletedInductionForm =
      getPrisonerContext(req.session, prisonNumber).whoCompletedInductionForm ||
      toWhoCompletedInductionForm(inductionDto)
    getPrisonerContext(req.session, prisonNumber).whoCompletedInductionForm = undefined

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
    'inductionDate-day': inductionDate ? `${inductionDate.getDate()}`.padStart(2, '0') : undefined,
    'inductionDate-month': inductionDate ? `${inductionDate.getMonth() + 1}`.padStart(2, '0') : undefined,
    'inductionDate-year': inductionDate ? `${inductionDate.getFullYear()}` : undefined,
  }
}
