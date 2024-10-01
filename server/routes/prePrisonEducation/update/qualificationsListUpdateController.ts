import { NextFunction, Request, RequestHandler, Response } from 'express'
import createError from 'http-errors'
import QualificationsListController from '../common/qualificationsListController'
import getDynamicBackLinkAriaText from '../../dynamicAriaTextResolver'
import logger from '../../../../logger'
import { getPrisonerContext } from '../../../data/session/prisonerContexts'
import toUpdateEducationDto from '../../../data/mappers/updateCreateOrUpdateEducationDtoMapper'
import { EducationAndWorkPlanService } from '../../../services'

export default class QualificationsListUpdateController extends QualificationsListController {
  constructor(private readonly educationAndWorkPlanService: EducationAndWorkPlanService) {
    super()
  }

  getBackLinkUrl = (req: Request): string => {
    const { prisonNumber } = req.params
    return `/plan/${prisonNumber}/view/education-and-training`
  }

  getBackLinkAriaText = (req: Request, res: Response): string => {
    return getDynamicBackLinkAriaText(req, res, this.getBackLinkUrl(req))
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
      return res.redirect(`/prisoners/${prisonNumber}/education/qualification-level`)
    }

    const { educationDto } = getPrisonerContext(req.session, prisonNumber)

    if (this.userClickedOnButton(req, 'removeQualification')) {
      const qualificationIndexToRemove = req.body.removeQualification as number
      const updatedEducation = this.educationWithRemovedQualification(educationDto, qualificationIndexToRemove)
      getPrisonerContext(req.session, prisonNumber).educationDto = updatedEducation
      return res.redirect(`/prisoners/${prisonNumber}/education/qualifications`)
    }

    // By submitting the form without adding/removing any other educational qualifications, the user is indicating their
    // updates to Educational Qualifications are complete.
    // Update the Education record and return to Education and Training
    try {
      const updateEducationDto = toUpdateEducationDto(prisonId, educationDto)
      await this.educationAndWorkPlanService.updateEducation(prisonNumber, updateEducationDto, req.user.token)
      getPrisonerContext(req.session, prisonNumber).educationDto = undefined
      return res.redirect(`/plan/${prisonNumber}/view/education-and-training`)
    } catch (e) {
      logger.error(`Error updating Education for prisoner ${prisonNumber}`, e)
      return next(createError(500, `Error updating Education for prisoner ${prisonNumber}. Error: ${e}`))
    }
  }
}
