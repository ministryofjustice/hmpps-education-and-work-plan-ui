import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { EducationDto } from 'dto'
import type { QualificationDetailsForm } from 'forms'
import QualificationDetailsView from './qualificationDetailsView'
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
    const { prisonerSummary, invalidForm } = res.locals
    const { prisonNumber, journeyId } = req.params

    const { qualificationLevel } = req.journeyData
    if (!qualificationLevel) {
      // Guard against the user using the back button to return to this page, which can cause a NPE creating the QualificationDetailsView below (depending on which pages they've been to)
      return res.redirect(`/prisoners/${prisonNumber}/${this.journeyPathElement}/${journeyId}/qualification-level`)
    }

    const qualificationDetailsForm = invalidForm ?? {
      qualificationSubject: '',
      qualificationGrade: '',
    }

    const view = new QualificationDetailsView(prisonerSummary, qualificationDetailsForm, qualificationLevel)
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
