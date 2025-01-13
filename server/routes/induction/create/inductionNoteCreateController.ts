import { Request, RequestHandler } from 'express'
import type { InductionDto } from 'inductionDto'
import type { InductionNoteForm } from 'inductionForms'
import validateInductionNoteForm from '../../validators/induction/inductionNoteFormValidator'
import InductionNoteController from '../common/inductionNoteController'

export default class InductionNoteCreateController extends InductionNoteController {
  getBackLinkUrl(_req: Request): string {
    // Default implementation - a JS back link is used on the Who Completed The Induction page
    return undefined
  }

  getBackLinkAriaText(_req: Request): string {
    // Default implementation - a JS back link is used on the Who Completed The Induction page
    return undefined
  }

  submitInductionNoteForm: RequestHandler = async (req, res, next): Promise<void> => {
    const { inductionDto } = req.session
    const { prisonNumber } = req.params

    const inductionNoteForm: InductionNoteForm = { ...req.body }

    const updatedInductionDto = updateDtoWithFormContents(inductionDto, inductionNoteForm)
    req.session.inductionDto = updatedInductionDto

    const errors = validateInductionNoteForm(inductionNoteForm)
    if (errors.length > 0) {
      return res.redirectWithErrors(`/prisoners/${prisonNumber}/create-induction/notes`, errors)
    }

    return res.redirect(`/prisoners/${prisonNumber}/create-induction/check-your-answers`)
  }
}

const updateDtoWithFormContents = (dto: InductionDto, form: InductionNoteForm): InductionDto => ({
  ...dto,
  notes: form.notes,
})
