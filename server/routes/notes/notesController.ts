import type { RequestHandler } from 'express'
import PrisonerNotesView from './prisonerNotesView'

export default class NotesController {
  getPrisonerNotesView: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonerSummary } = res.locals

    const view = new PrisonerNotesView(prisonerSummary)
    return res.render('pages/notes/prisonerNotesList/index', { ...view.renderArgs })
  }
}
