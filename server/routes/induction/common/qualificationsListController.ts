import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { AchievedQualificationDto } from 'dto'

/**
 * Abstract controller class defining functionality common to both the Create and Update Induction journeys.
 */
export default abstract class QualificationsListController {
  /**
   * Returns the Qualifications List view; suitable for use by the Create and Update journeys.
   */
  getQualificationsListView: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { inductionDto } = req.journeyData
    const { prisonerSummary, prisonerFunctionalSkills, prisonNamesById, curiousInPrisonCourses } = res.locals

    const qualifications: Array<AchievedQualificationDto> = inductionDto.previousQualifications?.qualifications

    return res.render('pages/prePrisonEducation/qualificationsList', {
      prisonerSummary,
      prisonNamesById,
      prisonerFunctionalSkills,
      qualifications,
      inPrisonCourses: curiousInPrisonCourses,
    })
  }
}
