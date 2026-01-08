import { NextFunction, Request, RequestHandler, Response } from 'express'
import QualificationsListController from '../common/qualificationsListController'
import logger from '../../../../logger'
import toUpdateEducationDto from '../../../data/mappers/updateCreateOrUpdateEducationDtoMapper'
import { EducationAndWorkPlanService } from '../../../services'
import { Result } from '../../../utils/result/result'

export default class QualificationsListUpdateController extends QualificationsListController {
  constructor(private readonly educationAndWorkPlanService: EducationAndWorkPlanService) {
    super()
  }

  submitQualificationsListView: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { prisonNumber } = req.params
    const { prisonerSummary } = res.locals
    const { prisonId } = prisonerSummary

    // Behaviour and subsequent routing of the submission of the Qualifications List page depends on whether the page
    // is submitted with the values `addQualification`, `removeQualification`.
    if (this.userClickedOnButton(req, 'addQualification')) {
      return res.redirect('qualification-level')
    }

    const { educationDto } = req.journeyData

    if (this.userClickedOnButton(req, 'removeQualification')) {
      const qualificationIndexToRemove = req.body.removeQualification as number
      const updatedEducation = this.educationWithRemovedQualification(educationDto, qualificationIndexToRemove)
      req.journeyData.educationDto = updatedEducation
      return res.redirect('qualifications')
    }

    // By submitting the form without adding/removing any other educational qualifications, the user is indicating their
    // updates to Educational Qualifications are complete.
    // Update the Education record and return to Education and Training
    const updateEducationDto = toUpdateEducationDto(prisonId, educationDto)

    const { apiErrorCallback } = res.locals
    const apiResult = await Result.wrap(
      this.educationAndWorkPlanService.updateEducation(prisonNumber, updateEducationDto, req.user.username),
      apiErrorCallback,
    )
    if (!apiResult.isFulfilled()) {
      apiResult.getOrHandle(e => logger.error(`Error updating Education for prisoner ${prisonNumber}`, e))
      req.flash('pageHasApiErrors', 'true')
      return res.redirect('qualifications')
    }

    req.journeyData.educationDto = undefined
    return res.redirect(`/plan/${prisonNumber}/view/education-and-training`)
  }
}
