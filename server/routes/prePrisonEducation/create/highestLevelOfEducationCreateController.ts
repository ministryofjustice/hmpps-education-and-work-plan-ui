import { NextFunction, Request, RequestHandler, Response } from 'express'
import HighestLevelOfEducationController from '../common/highestLevelOfEducationController'
import validateHighestLevelOfEducationForm from '../../validators/induction/highestLevelOfEducationFormValidator'
import { getPrisonerContext } from '../../../data/session/prisonerContexts'

export default class HighestLevelOfEducationCreateController extends HighestLevelOfEducationController {
  submitHighestLevelOfEducationForm: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { prisonNumber } = req.params
    const { prisonerSummary } = res.locals

    const highestLevelOfEducationForm = { ...req.body }

    const errors = validateHighestLevelOfEducationForm(highestLevelOfEducationForm, prisonerSummary)
    if (errors.length > 0) {
      getPrisonerContext(req.session, prisonNumber).highestLevelOfEducationForm = highestLevelOfEducationForm
      return res.redirectWithErrors(`/prisoners/${prisonNumber}/create-education/highest-level-of-education`, errors)
    }

    const { educationDto } = getPrisonerContext(req.session, prisonNumber)
    const updatedEducationDto = this.updatedEducationDtoWithHighestLevelOfEducation(
      educationDto,
      highestLevelOfEducationForm,
    )
    getPrisonerContext(req.session, prisonNumber).educationDto = updatedEducationDto

    return res.redirect(`/prisoners/${prisonNumber}/create-education/qualification-level`)
  }
}
