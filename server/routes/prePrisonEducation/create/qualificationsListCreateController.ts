import { NextFunction, Request, RequestHandler, Response } from 'express'
import QualificationsListController from '../common/qualificationsListController'
import toCreateEducationDto from '../../../data/mappers/createCreateOrUpdateEducationDtoMapper'
import logger from '../../../../logger'
import { EducationAndWorkPlanService } from '../../../services'
import { setRedirectPendingFlag } from '../../routerRequestHandlers/checkRedirectAtEndOfJourneyIsNotPending'
import { Result } from '../../../utils/result/result'

export default class QualificationsListCreateController extends QualificationsListController {
  constructor(private readonly educationAndWorkPlanService: EducationAndWorkPlanService) {
    super()
  }

  submitQualificationsListView: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { prisonNumber } = req.params
    const { prisonId } = res.locals.prisonerSummary

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

    if (!this.educationHasQualifications(educationDto)) {
      return res.redirect('qualification-level')
    }

    const createdEducationDto = toCreateEducationDto(prisonId, educationDto)

    const { apiErrorCallback } = res.locals
    const apiResult = await Result.wrap(
      this.educationAndWorkPlanService.createEducation(prisonNumber, createdEducationDto, req.user.username),
      apiErrorCallback,
    )
    if (!apiResult.isFulfilled()) {
      apiResult.getOrHandle(e => logger.error(`Error creating Education for prisoner ${prisonNumber}`, e))
      req.flash('pageHasApiErrors', 'true')
      return res.redirect('qualifications')
    }

    req.journeyData.educationDto = undefined
    setRedirectPendingFlag(req)
    return res.redirect(`/plan/${prisonNumber}/view/education-and-training`)
  }
}
