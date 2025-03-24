import { RequestHandler } from 'express'
import type { InductionDto } from 'inductionDto'
import type { InductionNoteForm } from 'inductionForms'
import { getPrisonerContext } from '../../../data/session/prisonerContexts'
import InductionNoteView from './inductionNoteView'
import InductionController from './inductionController'

export default abstract class InductionNoteController extends InductionController {
  getInductionNoteView: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonNumber } = req.params
    const { prisonerSummary } = res.locals
    const { inductionDto } = getPrisonerContext(req.session, prisonNumber)

    const inductionNoteForm: InductionNoteForm =
      getPrisonerContext(req.session, prisonNumber).inductionNoteForm || toInductionNoteForm(inductionDto)
    getPrisonerContext(req.session, prisonNumber).inductionNoteForm = undefined

    const view = new InductionNoteView(prisonerSummary, inductionNoteForm)
    return res.render('pages/induction/inductionNote/index', { ...view.renderArgs })
  }
}

const toInductionNoteForm = (dto: InductionDto): InductionNoteForm => ({
  notes: dto.notes,
})
