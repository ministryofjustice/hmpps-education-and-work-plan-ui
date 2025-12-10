import { RequestHandler } from 'express'
import type { InductionDto } from 'inductionDto'
import type { InductionNoteForm } from 'inductionForms'
import InductionNoteView from './inductionNoteView'

export default abstract class InductionNoteController {
  getInductionNoteView: RequestHandler = async (req, res, next): Promise<void> => {
    const { inductionDto } = req.journeyData
    const { prisonerSummary, invalidForm } = res.locals

    const inductionNoteForm = invalidForm ?? toInductionNoteForm(inductionDto)

    const view = new InductionNoteView(prisonerSummary, inductionNoteForm)
    return res.render('pages/induction/inductionNote/index', { ...view.renderArgs })
  }
}

const toInductionNoteForm = (dto: InductionDto): InductionNoteForm => ({
  notes: dto.notes,
})
