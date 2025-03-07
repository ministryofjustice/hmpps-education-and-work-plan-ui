import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { PersonalInterestsForm } from 'inductionForms'
import PersonalInterestsController from '../common/personalInterestsController'
import { asArray } from '../../../utils/utils'
import validatePersonalInterestsForm from '../../validators/induction/personalInterestsFormValidator'

export default class PersonalInterestsCreateController extends PersonalInterestsController {
  submitPersonalInterestsForm: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { prisonNumber } = req.params
    const { inductionDto } = req.session
    const { prisonerSummary } = res.locals

    const personalInterestsForm: PersonalInterestsForm = {
      personalInterests: asArray(req.body.personalInterests),
      personalInterestsOther: req.body.personalInterestsOther,
    }
    req.session.personalInterestsForm = personalInterestsForm

    const errors = validatePersonalInterestsForm(personalInterestsForm, prisonerSummary)
    if (errors.length > 0) {
      return res.redirectWithErrors(`/prisoners/${prisonNumber}/create-induction/personal-interests`, errors)
    }

    const updatedInduction = this.updatedInductionDtoWithPersonalInterests(inductionDto, personalInterestsForm)
    req.session.inductionDto = updatedInduction
    req.session.personalInterestsForm = undefined

    const nextPage = this.previousPageWasCheckYourAnswers(req)
      ? `/prisoners/${prisonNumber}/create-induction/check-your-answers`
      : `/prisoners/${prisonNumber}/create-induction/in-prison-work`
    return res.redirect(nextPage)
  }
}
