import { NextFunction, Request, RequestHandler, Response } from 'express'
import createError from 'http-errors'
import HighestLevelOfEducationController from '../common/highestLevelOfEducationController'
import { EducationAndWorkPlanService } from '../../../services'
import logger from '../../../../logger'
import toUpdateEducationDto from '../../../data/mappers/updateCreateOrUpdateEducationDtoMapper'

export default class HighestLevelOfEducationUpdateController extends HighestLevelOfEducationController {
  constructor(private readonly educationAndWorkPlanService: EducationAndWorkPlanService) {
    super()
  }

  submitHighestLevelOfEducationForm: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { prisonNumber } = req.params
    const { prisonerSummary } = res.locals
    const { prisonId } = prisonerSummary
    const { educationDto } = req.journeyData

    if (!educationDto) {
      logger.warn(
        'Possible resubmission of form following HTTP 0 (Update Highest Level of Education). Redirecting to Education & Training',
      )
      return res.redirect(`/plan/${prisonNumber}/view/education-and-training`)
    }

    const highestLevelOfEducationForm = { ...req.body }

    const updatedEducationDto = this.updatedEducationDtoWithHighestLevelOfEducation(
      educationDto,
      highestLevelOfEducationForm,
    )
    req.journeyData.educationDto = updatedEducationDto

    try {
      const updateEducationDto = toUpdateEducationDto(prisonId, updatedEducationDto)
      await this.educationAndWorkPlanService.updateEducation(prisonNumber, updateEducationDto, req.user.username)
      req.journeyData.educationDto = undefined
      return res.redirect(`/plan/${prisonNumber}/view/education-and-training`)
    } catch (e) {
      logger.error(`Error updating Education for prisoner ${prisonNumber}`, e)
      return next(createError(500, `Error updating Education for prisoner ${prisonNumber}. Error: ${e}`))
    }
  }
}
