import { RequestHandler } from 'express'
import type { InductionDto } from 'inductionDto'
import type { InductionNoteForm } from 'inductionForms'
import validateInductionNoteForm from '../../validators/induction/inductionNoteFormValidator'
import InductionNoteController from '../common/inductionNoteController'
import { getPrisonerContext } from '../../../data/session/prisonerContexts'

export default class InductionNoteCreateController extends InductionNoteController {
  submitInductionNoteForm: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonNumber } = req.params
    const { inductionDto } = getPrisonerContext(req.session, prisonNumber)

    const inductionNoteForm: InductionNoteForm = { ...req.body }

    const updatedInductionDto = updateDtoWithFormContents(inductionDto, inductionNoteForm)
    getPrisonerContext(req.session, prisonNumber).inductionDto = updatedInductionDto

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
