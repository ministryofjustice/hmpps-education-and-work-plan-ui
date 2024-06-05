import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { PersonalInterestsForm } from 'inductionForms'
import PersonalInterestsController from '../common/personalInterestsController'
import getDynamicBackLinkAriaText from '../dynamicAriaTextResolver'
import { asArray } from '../../../utils/utils'
import validatePersonalInterestsForm from '../../validators/induction/personalInterestsFormValidator'
import { getPreviousPage } from '../../pageFlowHistory'
import HopingToGetWorkValue from '../../../enums/hopingToGetWorkValue'

export default class PersonalInterestsCreateController extends PersonalInterestsController {
  getBackLinkUrl(req: Request): string {
    const { prisonNumber } = req.params
    const { pageFlowHistory } = req.session
    const previousPage =
      (pageFlowHistory && getPreviousPage(pageFlowHistory)) || `/prisoners/${prisonNumber}/create-induction/skills`
    return previousPage
  }

  getBackLinkAriaText(req: Request): string {
    return getDynamicBackLinkAriaText(req, this.getBackLinkUrl(req))
  }

  submitPersonalInterestsForm: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { prisonNumber } = req.params
    const { prisonerSummary, inductionDto } = req.session

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

    if (this.previousPageWasCheckYourAnswers(req)) {
      return res.redirect(`/prisoners/${prisonNumber}/create-induction/check-your-answers`)
    }

    return updatedInduction.workOnRelease.hopingToWork === HopingToGetWorkValue.YES
      ? res.redirect(`/prisoners/${prisonNumber}/create-induction/affect-ability-to-work`) // Next page for long question set is factors affecting ability to work
      : res.redirect(`/prisoners/${prisonNumber}/create-induction/in-prison-work`) // Next page for short question set is In-Prison Work Interests
  }
}
