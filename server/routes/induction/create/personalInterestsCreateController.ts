import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { PersonalInterestsForm } from 'inductionForms'
import PersonalInterestsController from '../common/personalInterestsController'
import getDynamicBackLinkAriaText from '../../dynamicAriaTextResolver'
import { asArray } from '../../../utils/utils'
import validatePersonalInterestsForm from '../../validators/induction/personalInterestsFormValidator'
import { getPreviousPage } from '../../pageFlowHistory'

export default class PersonalInterestsCreateController extends PersonalInterestsController {
  getBackLinkUrl(req: Request): string {
    const { prisonNumber } = req.params
    const { pageFlowHistory } = req.session
    const previousPage =
      (pageFlowHistory && getPreviousPage(pageFlowHistory)) || `/prisoners/${prisonNumber}/create-induction/skills`
    return previousPage
  }

  getBackLinkAriaText(req: Request, res: Response): string {
    return getDynamicBackLinkAriaText(req, res, this.getBackLinkUrl(req))
  }

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
