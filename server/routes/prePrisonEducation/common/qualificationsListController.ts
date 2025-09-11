import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { EducationDto } from 'dto'

/**
 * Abstract controller class defining functionality common to both the Create and Update journeys.
 */
export default abstract class QualificationsListController {
  getQualificationsListView: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { prisonNumber, journeyId } = req.params
    const { prisonerSummary, prisonerFunctionalSkills, prisonNamesById, curiousInPrisonCourses } = res.locals

    const { educationDto } = req.journeyData

    if (!educationDto.educationLevel) {
      return res.redirect(`/prisoners/${prisonNumber}/create-education/${journeyId}/highest-level-of-education`)
    }

    return res.render('pages/prePrisonEducation/qualificationsList', {
      prisonerSummary,
      prisonNamesById,
      prisonerFunctionalSkills,
      qualifications: educationDto.qualifications,
      inPrisonCourses: curiousInPrisonCourses,
    })
  }

  protected educationHasQualifications = (educationDto: EducationDto): boolean =>
    educationDto.qualifications?.length > 0

  protected userClickedOnButton = (request: Request, buttonName: string): boolean =>
    Object.prototype.hasOwnProperty.call(request.body, buttonName)

  protected educationWithRemovedQualification = (
    educationDto: EducationDto,
    qualificationIndexToRemove: number,
  ): EducationDto => {
    const updatedQualifications = [...educationDto.qualifications]
    updatedQualifications.splice(qualificationIndexToRemove, 1)
    return {
      ...educationDto,
      qualifications: updatedQualifications,
    }
  }
}
