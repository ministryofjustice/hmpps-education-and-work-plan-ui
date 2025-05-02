import { NextFunction, Request, RequestHandler, Response } from 'express'
import createError from 'http-errors'
import QualificationsListController from '../common/qualificationsListController'
import toCreateEducationDto from '../../../data/mappers/createCreateOrUpdateEducationDtoMapper'
import logger from '../../../../logger'
import { EducationAndWorkPlanService } from '../../../services'

export default class QualificationsListCreateController extends QualificationsListController {
  constructor(private readonly educationAndWorkPlanService: EducationAndWorkPlanService) {
    super()
  }

  submitQualificationsListView: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { prisonNumber, journeyId } = req.params
    const { prisonId } = res.locals.prisonerSummary

    if (this.userClickedOnButton(req, 'addQualification')) {
      return res.redirect(`/prisoners/${prisonNumber}/create-education/${journeyId}/qualification-level`)
    }

    const { educationDto } = req.journeyData

    if (this.userClickedOnButton(req, 'removeQualification')) {
      const qualificationIndexToRemove = req.body.removeQualification as number
      const updatedEducation = this.educationWithRemovedQualification(educationDto, qualificationIndexToRemove)
      req.journeyData.educationDto = updatedEducation
      return res.redirect(`/prisoners/${prisonNumber}/create-education/${journeyId}/qualifications`)
    }

    if (!this.educationHasQualifications(educationDto)) {
      return res.redirect(`/prisoners/${prisonNumber}/create-education/${journeyId}/qualification-level`)
    }

    const createdEducationDto = toCreateEducationDto(prisonId, educationDto)

    try {
      await this.educationAndWorkPlanService.createEducation(prisonNumber, createdEducationDto, req.user.username)
      req.journeyData.educationDto = undefined
      return res.redirect(`/plan/${prisonNumber}/view/education-and-training`)
    } catch (e) {
      logger.error(`Error creating Education for prisoner ${prisonNumber}`, e)
      return next(createError(500, `Error creating Education for prisoner ${prisonNumber}. Error: ${e}`))
    }
  }
}
