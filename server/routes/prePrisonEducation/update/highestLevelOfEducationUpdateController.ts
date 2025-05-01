import { NextFunction, Request, RequestHandler, Response } from 'express'
import createError from 'http-errors'
import HighestLevelOfEducationController from '../common/highestLevelOfEducationController'
import validateHighestLevelOfEducationForm from '../../validators/induction/highestLevelOfEducationFormValidator'
import { getPrisonerContext } from '../../../data/session/prisonerContexts'
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
    const { prisonNumber, journeyId } = req.params
    const { prisonerSummary } = res.locals
    const { prisonId } = prisonerSummary

    const highestLevelOfEducationForm = { ...req.body }

    const errors = validateHighestLevelOfEducationForm(highestLevelOfEducationForm, prisonerSummary)
    if (errors.length > 0) {
      getPrisonerContext(req.session, prisonNumber).highestLevelOfEducationForm = highestLevelOfEducationForm
      return res.redirectWithErrors(
        `/prisoners/${prisonNumber}/education/${journeyId}/highest-level-of-education`,
        errors,
      )
    }

    const { educationDto } = getPrisonerContext(req.session, prisonNumber)
    const updatedEducationDto = this.updatedEducationDtoWithHighestLevelOfEducation(
      educationDto,
      highestLevelOfEducationForm,
    )
    getPrisonerContext(req.session, prisonNumber).educationDto = updatedEducationDto

    try {
      const updateEducationDto = toUpdateEducationDto(prisonId, updatedEducationDto)
      await this.educationAndWorkPlanService.updateEducation(prisonNumber, updateEducationDto, req.user.username)
      getPrisonerContext(req.session, prisonNumber).educationDto = undefined
      return res.redirect(`/plan/${prisonNumber}/view/education-and-training`)
    } catch (e) {
      logger.error(`Error updating Education for prisoner ${prisonNumber}`, e)
      return next(createError(500, `Error updating Education for prisoner ${prisonNumber}. Error: ${e}`))
    }
  }
}
