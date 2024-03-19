import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { InductionDto } from 'inductionDto'
import type { QualificationDetailsForm } from 'inductionForms'
import QualificationDetailsController from '../common/qualificationDetailsController'
import validateQualificationDetailsForm from './qualificationDetailsFormValidator'
import QualificationLevelValue from '../../../enums/qualificationLevelValue'
import { getPreviousPage } from '../../pageFlowQueue'

/**
 * Controller for the Update of the Qualification Details screen of the Induction.
 */
export default class QualificationDetailsUpdateController extends QualificationDetailsController {
  getBackLinkUrl(req: Request): string {
    const { pageFlowQueue } = req.session
    return getPreviousPage(pageFlowQueue)
  }

  getBackLinkAriaText(_req: Request): string {
    return 'Back to <TODO - check what CIAG UI does here>'
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

    req.session.qualificationDetailsForm = undefined
    req.session.qualificationLevelForm = undefined
    req.session.pageFlowQueue = undefined

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
