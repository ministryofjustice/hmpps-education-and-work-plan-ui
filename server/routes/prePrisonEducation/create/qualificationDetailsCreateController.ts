import { NextFunction, Request, RequestHandler, Response } from 'express'
import QualificationDetailsController from '../common/qualificationDetailsController'
import { getPrisonerContext } from '../../../data/session/prisonerContexts'
import validateQualificationDetailsForm from '../../validators/induction/qualificationDetailsFormValidator'
import getDynamicBackLinkAriaText from '../../dynamicAriaTextResolver'

export default class QualificationDetailsCreateController extends QualificationDetailsController {
  journeyPathElement = 'create-education'

  getBackLinkUrl(req: Request): string {
    const { prisonNumber } = req.params
    return `/prisoners/${prisonNumber}/create-education/qualification-level`
  }

  getBackLinkAriaText(req: Request, res: Response): string {
    return getDynamicBackLinkAriaText(req, res, this.getBackLinkUrl(req))
  }

  submitQualificationDetailsForm: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { prisonNumber } = req.params
    const { prisonerSummary } = res.locals

    const { educationDto, qualificationLevelForm } = getPrisonerContext(req.session, prisonNumber)
    const qualificationDetailsForm = { ...req.body }
    getPrisonerContext(req.session, prisonNumber).qualificationDetailsForm = qualificationDetailsForm

    const errors = validateQualificationDetailsForm(
      qualificationDetailsForm,
      qualificationLevelForm.qualificationLevel,
      prisonerSummary,
    )
    if (errors.length > 0) {
      return res.redirectWithErrors(`/prisoners/${prisonNumber}/create-education/qualification-details`, errors)
    }

    const updatedEducation = this.addQualificationToEducationDto(
      educationDto,
      qualificationDetailsForm,
      qualificationLevelForm.qualificationLevel,
    )
    getPrisonerContext(req.session, prisonNumber).educationDto = updatedEducation

    getPrisonerContext(req.session, prisonNumber).qualificationDetailsForm = undefined
    getPrisonerContext(req.session, prisonNumber).qualificationLevelForm = undefined

    return res.redirect(`/prisoners/${prisonNumber}/create-education/qualifications`)
  }
}
