import { NextFunction, Request, RequestHandler, Response } from 'express'
import createError from 'http-errors'
import QualificationsListController from '../common/qualificationsListController'
import { getPrisonerContext } from '../../../data/session/prisonerContexts'
import toCreateEducationDto from '../../../data/mappers/createCreateOrUpdateEducationDtoMapper'
import logger from '../../../../logger'
import { EducationAndWorkPlanService } from '../../../services'
import getDynamicBackLinkAriaText from '../../dynamicAriaTextResolver'

export default class QualificationsListCreateController extends QualificationsListController {
  constructor(private readonly educationAndWorkPlanService: EducationAndWorkPlanService) {
    super()
  }

  getBackLinkUrl(req: Request): string {
    const { prisonNumber } = req.params
    return `/prisoners/${prisonNumber}/create-education/highest-level-of-education`
  }

  getBackLinkAriaText(req: Request, res: Response): string {
    return getDynamicBackLinkAriaText(req, res, this.getBackLinkUrl(req))
  }

  submitQualificationsListView: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { prisonNumber } = req.params
    const { prisonId } = res.locals.prisonerSummary

    if (this.userClickedOnButton(req, 'addQualification')) {
      return res.redirect(`/prisoners/${prisonNumber}/create-education/qualification-level`)
    }

    const { educationDto } = getPrisonerContext(req.session, prisonNumber)

    if (this.userClickedOnButton(req, 'removeQualification')) {
      const qualificationIndexToRemove = req.body.removeQualification as number
      const updatedEducation = this.educationWithRemovedQualification(educationDto, qualificationIndexToRemove)
      getPrisonerContext(req.session, prisonNumber).educationDto = updatedEducation
      return res.redirect(`/prisoners/${prisonNumber}/create-education/qualifications`)
    }

    if (!this.educationHasQualifications(educationDto)) {
      return res.redirect(`/prisoners/${prisonNumber}/create-education/qualification-level`)
    }

    const createdEducationDto = toCreateEducationDto(prisonId, educationDto)

    try {
      await this.educationAndWorkPlanService.createEducation(prisonNumber, createdEducationDto, req.user.username)
      getPrisonerContext(req.session, prisonNumber).educationDto = undefined
      return res.redirect(`/plan/${prisonNumber}/view/education-and-training`)
    } catch (e) {
      logger.error(`Error creating Education for prisoner ${prisonNumber}`, e)
      return next(createError(500, `Error creating Education for prisoner ${prisonNumber}. Error: ${e}`))
    }
  }
}
