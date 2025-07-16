import { RequestHandler } from 'express'
import type { InductionDto } from 'inductionDto'
import type { InductionNoteForm } from 'inductionForms'
import InductionNoteController from '../common/inductionNoteController'

export default class InductionNoteCreateController extends InductionNoteController {
  submitInductionNoteForm: RequestHandler = async (req, res, next): Promise<void> => {
    const { inductionDto } = req.journeyData
    const { prisonNumber, journeyId } = req.params

    const inductionNoteForm: InductionNoteForm = { ...req.body }

    const updatedInductionDto = updateDtoWithFormContents(inductionDto, inductionNoteForm)
    req.journeyData.inductionDto = updatedInductionDto

    return res.redirect(`/prisoners/${prisonNumber}/create-induction/${journeyId}/check-your-answers`)
  }
}

const updateDtoWithFormContents = (dto: InductionDto, form: InductionNoteForm): InductionDto => ({
  ...dto,
  notes: form.notes,
})
