import { RequestHandler } from 'express'
import type { InductionDto } from 'inductionDto'
import type { InductionNoteForm } from 'inductionForms'
import validateInductionNoteForm from '../../validators/induction/inductionNoteFormValidator'
import InductionNoteController from '../common/inductionNoteController'

export default class InductionNoteCreateController extends InductionNoteController {
  submitInductionNoteForm: RequestHandler = async (req, res, next): Promise<void> => {
    const { inductionDto } = req.session
    const { prisonNumber, journeyId } = req.params

    const inductionNoteForm: InductionNoteForm = { ...req.body }

    const updatedInductionDto = updateDtoWithFormContents(inductionDto, inductionNoteForm)
    req.session.inductionDto = updatedInductionDto

    const errors = validateInductionNoteForm(inductionNoteForm)
    if (errors.length > 0) {
      return res.redirectWithErrors(`/prisoners/${prisonNumber}/create-induction/${journeyId}/notes`, errors)
    }

    return res.redirect(`/prisoners/${prisonNumber}/create-induction/${journeyId}/check-your-answers`)
  }
}

const updateDtoWithFormContents = (dto: InductionDto, form: InductionNoteForm): InductionDto => ({
  ...dto,
  notes: form.notes,
})
