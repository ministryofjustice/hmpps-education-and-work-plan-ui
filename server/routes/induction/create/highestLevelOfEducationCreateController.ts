import { NextFunction, Request, RequestHandler, Response } from 'express'
import HighestLevelOfEducationController from '../common/highestLevelOfEducationController'
import getDynamicBackLinkAriaText from '../dynamicAriaTextResolver'
import validateHighestLevelOfEducationForm from '../../validators/induction/highestLevelOfEducationFormValidator'

export default class HighestLevelOfEducationCreateController extends HighestLevelOfEducationController {
  getBackLinkUrl(req: Request): string {
    const { prisonNumber } = req.params
    return `/prisoners/${prisonNumber}/create-induction/qualifications`
  }

  getBackLinkAriaText(req: Request): string {
    return getDynamicBackLinkAriaText(req, this.getBackLinkUrl(req))
  }

  submitHighestLevelOfEducationForm: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { prisonNumber } = req.params
    const { prisonerSummary, inductionDto } = req.session

    req.session.highestLevelOfEducationForm = { ...req.body }
    const { highestLevelOfEducationForm } = req.session

    const errors = validateHighestLevelOfEducationForm(highestLevelOfEducationForm, prisonerSummary)
    if (errors.length > 0) {
      req.flash('errors', errors)
      return res.redirect(`/prisoners/${prisonNumber}/create-induction/highest-level-of-education`)
    }

    const updatedInduction = this.updatedInductionDtoWithHighestLevelOfEducation(
      inductionDto,
      highestLevelOfEducationForm,
    )
    req.session.inductionDto = updatedInduction
    req.session.highestLevelOfEducationForm = undefined

    if (this.highestLevelOfEducationDoesNotRequireQualifications(highestLevelOfEducationForm)) {
      return res.redirect(`/prisoners/${prisonNumber}/create-induction/additional-training`)
    }

    return res.redirect(`/prisoners/${prisonNumber}/create-induction/qualification-level`)
  }
}
