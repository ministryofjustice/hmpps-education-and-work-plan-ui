import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { EducationDto } from 'dto'
import type { QualificationDetailsForm } from 'forms'
import QualificationDetailsView from './qualificationDetailsView'
import { getPrisonerContext } from '../../../data/session/prisonerContexts'
import QualificationLevelValue from '../../../enums/qualificationLevelValue'

/**
 * Abstract controller class defining functionality common to both the Create and Update journeys.
 */
export default abstract class QualificationDetailsController {
  abstract journeyPathElement: string

  getQualificationDetailsView: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { prisonerSummary } = res.locals
    const { prisonNumber } = req.params

    const { qualificationLevelForm } = getPrisonerContext(req.session, prisonNumber)
    if (!qualificationLevelForm) {
      // Guard against the user using the back button to return to this page, which can cause a NPE creating the QualificationDetailsView below (depending on which pages they've been to)
      return res.redirect(`/prisoners/${prisonNumber}/${this.journeyPathElement}/qualification-level`)
    }

    const qualificationDetailsForm = getPrisonerContext(req.session, prisonNumber).qualificationDetailsForm || {
      qualificationSubject: '',
      qualificationGrade: '',
    }
    getPrisonerContext(req.session, prisonNumber).qualificationDetailsForm = undefined

    const view = new QualificationDetailsView(
      prisonerSummary,
      qualificationDetailsForm,
      qualificationLevelForm.qualificationLevel,
    )
    return res.render('pages/prePrisonEducation/qualificationDetails', { ...view.renderArgs })
  }

  protected addQualificationToEducationDto(
    educationDto: EducationDto,
    qualificationDetailsForm: QualificationDetailsForm,
    qualificationLevel: QualificationLevelValue,
  ): EducationDto {
    const qualifications = [...educationDto.qualifications]
    qualifications.push({
      subject: qualificationDetailsForm.qualificationSubject,
      level: qualificationLevel,
      grade: qualificationDetailsForm.qualificationGrade,
    })
    return {
      ...educationDto,
      qualifications,
    }
  }
}
