import { NextFunction, Request, RequestHandler, Response } from 'express'
import createError from 'http-errors'
import QualificationsListController from '../common/qualificationsListController'
import logger from '../../../../logger'
import toUpdateEducationDto from '../../../data/mappers/updateCreateOrUpdateEducationDtoMapper'
import { EducationAndWorkPlanService } from '../../../services'

export default class QualificationsListUpdateController extends QualificationsListController {
  constructor(private readonly educationAndWorkPlanService: EducationAndWorkPlanService) {
    super()
  }

  submitQualificationsListView: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { prisonNumber, journeyId } = req.params
    const { prisonerSummary } = res.locals
    const { prisonId } = prisonerSummary

    // Behaviour and subsequent routing of the submission of the Qualifications List page depends on whether the page
    // is submitted with the values `addQualification`, `removeQualification`.
    if (this.userClickedOnButton(req, 'addQualification')) {
      return res.redirect(`/prisoners/${prisonNumber}/education/${journeyId}/qualification-level`)
    }

    const { educationDto } = req.journeyData

    if (!educationDto) {
      logger.warn(
        'Possible resubmission of form following HTTP 0 (Update Education). Redirecting to Education & Training',
      )
      return res.redirect(`/plan/${prisonNumber}/view/education-and-training`)
    }

    if (this.userClickedOnButton(req, 'removeQualification')) {
      const qualificationIndexToRemove = req.body.removeQualification as number
      const updatedEducation = this.educationWithRemovedQualification(educationDto, qualificationIndexToRemove)
      req.journeyData.educationDto = updatedEducation
      return res.redirect(`/prisoners/${prisonNumber}/education/${journeyId}/qualifications`)
    }

    // By submitting the form without adding/removing any other educational qualifications, the user is indicating their
    // updates to Educational Qualifications are complete.
    // Update the Education record and return to Education and Training
    try {
      const updateEducationDto = toUpdateEducationDto(prisonId, educationDto)
      await this.educationAndWorkPlanService.updateEducation(prisonNumber, updateEducationDto, req.user.username)
      req.journeyData.educationDto = undefined
      return res.redirect(`/plan/${prisonNumber}/view/education-and-training`)
    } catch (e) {
      logger.error(`Error updating Education for prisoner ${prisonNumber}`, e)
      return next(createError(500, `Error updating Education for prisoner ${prisonNumber}. Error: ${e}`))
    }
  }
}
