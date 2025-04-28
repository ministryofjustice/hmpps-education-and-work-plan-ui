import { RequestHandler } from 'express'
import type { InductionDto } from 'inductionDto'
import type { InductionNoteForm } from 'inductionForms'
import { getPrisonerContext } from '../../../data/session/prisonerContexts'
import InductionNoteView from './inductionNoteView'
import InductionController from './inductionController'

export default abstract class InductionNoteController extends InductionController {
  getInductionNoteView: RequestHandler = async (req, res, next): Promise<void> => {
    const { inductionDto } = req.journeyData
    const { prisonNumber } = req.params
    const { prisonerSummary } = res.locals

    let inductionNoteForm: InductionNoteForm
    if (getPrisonerContext(req.session, prisonNumber).inductionNoteForm) {
      inductionNoteForm = getPrisonerContext(req.session, prisonNumber).inductionNoteForm
    } else {
      inductionNoteForm = toInductionNoteForm(inductionDto)
    }

    getPrisonerContext(req.session, prisonNumber).inductionNoteForm = undefined

    const view = new InductionNoteView(prisonerSummary, inductionNoteForm)
    return res.render('pages/induction/inductionNote/index', { ...view.renderArgs })
  }
}

const toInductionNoteForm = (dto: InductionDto): InductionNoteForm => ({
  notes: dto.notes,
})
