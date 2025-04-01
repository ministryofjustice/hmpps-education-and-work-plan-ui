import { RequestHandler } from 'express'
import { startOfDay } from 'date-fns'
import type { WhoCompletedInductionForm } from 'inductionForms'
import type { InductionDto } from 'inductionDto'
import { getPrisonerContext } from '../../../data/session/prisonerContexts'
import validateWhoCompletedInductionForm from '../../validators/induction/whoCompletedInductionFormValidator'
import WhoCompletedInductionController from '../common/whoCompletedInductionController'

export default class WhoCompletedInductionCreateController extends WhoCompletedInductionController {
  submitWhoCompletedInductionForm: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonNumber } = req.params
    const { inductionDto } = getPrisonerContext(req.session, prisonNumber)

    const whoCompletedInductionForm: WhoCompletedInductionForm = { ...req.body }
    getPrisonerContext(req.session, prisonNumber).whoCompletedInductionForm = whoCompletedInductionForm

    const errors = validateWhoCompletedInductionForm(whoCompletedInductionForm)
    if (errors.length > 0) {
      return res.redirectWithErrors(`/prisoners/${prisonNumber}/create-induction/who-completed-induction`, errors)
    }

    const updatedInductionDto = updateDtoWithFormContents(inductionDto, whoCompletedInductionForm)
    getPrisonerContext(req.session, prisonNumber).inductionDto = updatedInductionDto
    getPrisonerContext(req.session, prisonNumber).whoCompletedInductionForm = undefined

    return this.previousPageWasCheckYourAnswers(req)
      ? res.redirect(`/prisoners/${prisonNumber}/create-induction/check-your-answers`)
      : res.redirect(`/prisoners/${prisonNumber}/create-induction/notes`)
  }
}

const updateDtoWithFormContents = (dto: InductionDto, form: WhoCompletedInductionForm): InductionDto => ({
  ...dto,
  completedBy: form.completedBy,
  completedByOtherFullName: form.completedByOtherFullName,
  completedByOtherJobRole: form.completedByOtherJobRole,
  inductionDate: startOfDay(
    `${form['inductionDate-year']}-${form['inductionDate-month'].padStart(2, '0')}-${form['inductionDate-day'].padStart(2, '0')}`,
  ),
})
