import { RequestHandler } from 'express'
import { parse, startOfDay } from 'date-fns'
import type { WhoCompletedInductionForm } from 'inductionForms'
import type { InductionDto } from 'inductionDto'
import WhoCompletedInductionController from '../common/whoCompletedInductionController'

export default class WhoCompletedInductionCreateController extends WhoCompletedInductionController {
  submitWhoCompletedInductionForm: RequestHandler = async (req, res, next): Promise<void> => {
    const { inductionDto } = req.journeyData
    const { prisonNumber, journeyId } = req.params

    const whoCompletedInductionForm = { ...req.body }

    const updatedInductionDto = updateDtoWithFormContents(inductionDto, whoCompletedInductionForm)
    req.journeyData.inductionDto = updatedInductionDto

    return res.redirect(
      req.query?.submitToCheckAnswers === 'true'
        ? `/prisoners/${prisonNumber}/create-induction/${journeyId}/check-your-answers`
        : `/prisoners/${prisonNumber}/create-induction/${journeyId}/notes`,
    )
  }
}

const updateDtoWithFormContents = (dto: InductionDto, form: WhoCompletedInductionForm): InductionDto => ({
  ...dto,
  completedBy: form.completedBy,
  completedByOtherFullName: form.completedByOtherFullName,
  completedByOtherJobRole: form.completedByOtherJobRole,
  inductionDate: startOfDay(parse(form.inductionDate, 'd/M/yyyy', new Date())),
})
