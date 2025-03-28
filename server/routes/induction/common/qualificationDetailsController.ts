import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { InductionDto } from 'inductionDto'
import type { QualificationDetailsForm } from 'forms'
import InductionController from './inductionController'
import QualificationDetailsView from './qualificationDetailsView'
import QualificationLevelValue from '../../../enums/qualificationLevelValue'

/**
 * Abstract controller class defining functionality common to both the Create and Update Induction journeys.
 */
export default abstract class QualificationDetailsController extends InductionController {
  /**
   * Returns the Qualification Details view; suitable for use by the Create and Update journeys.
   */
  getQualificationDetailsView: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { qualificationLevelForm } = req.session
    const { prisonerSummary } = res.locals

    const { prisonNumber } = req.params
    if (!qualificationLevelForm) {
      // Guard against the user using the back button to return to this page, which can cause a NPE (depending on which pages they've been to)
      return res.redirect(`/prisoners/${prisonNumber}/induction/qualification-level`)
    }

    this.addCurrentPageToFlowHistoryWhenComingFromCheckYourAnswers(req)

    const qualificationDetailsForm = req.session.qualificationDetailsForm || {
      qualificationSubject: '',
      qualificationGrade: '',
    }
    req.session.qualificationDetailsForm = undefined

    const view = new QualificationDetailsView(
      prisonerSummary,
      qualificationDetailsForm,
      qualificationLevelForm.qualificationLevel,
    )
    return res.render('pages/prePrisonEducation/qualificationDetails', { ...view.renderArgs })
  }

  addQualificationToInductionDto(
    inductionDto: InductionDto,
    qualificationDetailsForm: QualificationDetailsForm,
    qualificationLevel: QualificationLevelValue,
  ): InductionDto {
    const qualifications = [...(inductionDto.previousQualifications?.qualifications || [])]
    qualifications.push({
      subject: qualificationDetailsForm.qualificationSubject,
      level: qualificationLevel,
      grade: qualificationDetailsForm.qualificationGrade,
    })
    return {
      ...inductionDto,
      previousQualifications: {
        ...inductionDto.previousQualifications,
        qualifications,
      },
    }
  }
}
