import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { InductionDto } from 'inductionDto'
import type { QualificationDetailsForm } from 'inductionForms'
import QualificationDetailsController from '../common/qualificationDetailsController'
import validateQualificationDetailsForm from './qualificationDetailsFormValidator'
import QualificationLevelValue from '../../../enums/qualificationLevelValue'
import { getPreviousPage } from '../../pageFlowHistory'
import getDynamicBackLinkAriaText from '../dynamicAriaTextResolver'

/**
 * Controller for the Update of the Qualification Details screen of the Induction.
 */
export default class QualificationDetailsUpdateController extends QualificationDetailsController {
  getBackLinkUrl(req: Request): string {
    const { pageFlowHistory } = req.session
    return getPreviousPage(pageFlowHistory)
  }

  getBackLinkAriaText(req: Request): string {
    return getDynamicBackLinkAriaText(req, this.getBackLinkUrl(req))
  }

  submitQualificationDetailsForm: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { prisonNumber } = req.params
    const { prisonerSummary, inductionDto, qualificationLevelForm } = req.session

    req.session.qualificationDetailsForm = { ...req.body }
    const { qualificationDetailsForm } = req.session

    const errors = validateQualificationDetailsForm(
      qualificationDetailsForm,
      qualificationLevelForm.qualificationLevel,
      prisonerSummary,
    )
    if (errors.length > 0) {
      req.flash('errors', errors)
      return res.redirect(`/prisoners/${prisonNumber}/induction/qualification-details`)
    }

    this.addQualificationToInductionDto(
      inductionDto,
      qualificationDetailsForm,
      qualificationLevelForm.qualificationLevel,
    )

    if (req.session.updateInductionQuestionSet) {
      req.session.inductionDto = inductionDto
      return res.redirect(`/prisoners/${prisonNumber}/induction/qualifications`)
    }

    req.session.qualificationDetailsForm = undefined
    req.session.qualificationLevelForm = undefined
    req.session.pageFlowHistory = undefined
    return res.redirect(`/prisoners/${prisonNumber}/induction/qualifications`)
  }

  private addQualificationToInductionDto(
    inductionDto: InductionDto,
    qualificationDetailsForm: QualificationDetailsForm,
    qualificationLevel: QualificationLevelValue,
  ) {
    const qualifications = inductionDto.previousQualifications.qualifications || []
    qualifications.push({
      subject: qualificationDetailsForm.qualificationSubject,
      level: qualificationLevel,
      grade: qualificationDetailsForm.qualificationGrade,
    })
  }
}
