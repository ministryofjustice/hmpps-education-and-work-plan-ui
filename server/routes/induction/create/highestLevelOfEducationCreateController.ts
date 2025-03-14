import { NextFunction, Request, RequestHandler, Response } from 'express'
import HighestLevelOfEducationController from '../common/highestLevelOfEducationController'
import validateHighestLevelOfEducationForm from '../../validators/induction/highestLevelOfEducationFormValidator'

export default class HighestLevelOfEducationCreateController extends HighestLevelOfEducationController {
  submitHighestLevelOfEducationForm: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { prisonNumber } = req.params
    const { inductionDto } = req.session
    const { prisonerSummary } = res.locals

    req.session.highestLevelOfEducationForm = { ...req.body }
    const { highestLevelOfEducationForm } = req.session

    const errors = validateHighestLevelOfEducationForm(highestLevelOfEducationForm, prisonerSummary)
    if (errors.length > 0) {
      return res.redirectWithErrors(`/prisoners/${prisonNumber}/create-induction/highest-level-of-education`, errors)
    }

    const updatedInduction = this.updatedInductionDtoWithHighestLevelOfEducation(
      inductionDto,
      highestLevelOfEducationForm,
    )
    req.session.inductionDto = updatedInduction
    req.session.highestLevelOfEducationForm = undefined

    if (this.previousPageWasCheckYourAnswers(req)) {
      return res.redirect(`/prisoners/${prisonNumber}/create-induction/check-your-answers`)
    }

    const nextPage =
      updatedInduction.previousQualifications.qualifications?.length > 0
        ? `/prisoners/${prisonNumber}/create-induction/qualifications` // if the induction already has qualifications (from being entered prior to the Induction) skip straight to the Qualifications List page
        : `/prisoners/${prisonNumber}/create-induction/want-to-add-qualifications`
    return res.redirect(nextPage)
  }
}
