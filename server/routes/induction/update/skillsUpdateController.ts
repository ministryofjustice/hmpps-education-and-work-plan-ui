import { NextFunction, Request, RequestHandler, Response } from 'express'
import createError from 'http-errors'
import type { SkillsForm } from 'inductionForms'
import SkillsController from '../common/skillsController'
import toCreateOrUpdateInductionDto from '../../../data/mappers/createOrUpdateInductionDtoMapper'
import logger from '../../../../logger'
import { InductionService } from '../../../services'
import validateSkillsForm from '../../validators/induction/skillsFormValidator'
import { asArray } from '../../../utils/utils'

/**
 * Controller for the Update of the Skills screen of the Induction.
 */
export default class SkillsUpdateController extends SkillsController {
  constructor(private readonly inductionService: InductionService) {
    super()
  }

  submitSkillsForm: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { prisonNumber, journeyId } = req.params
    const { inductionDto } = req.session
    const { prisonerSummary } = res.locals
    const { prisonId } = prisonerSummary

    const skillsForm: SkillsForm = {
      skills: asArray(req.body.skills),
      skillsOther: req.body.skillsOther,
    }
    req.session.skillsForm = skillsForm

    const errors = validateSkillsForm(skillsForm, prisonerSummary)
    if (errors.length > 0) {
      return res.redirectWithErrors(`/prisoners/${prisonNumber}/induction/${journeyId}/skills`, errors)
    }

    const updatedInduction = this.updatedInductionDtoWithSkills(inductionDto, skillsForm)

    try {
      const updateInductionDto = toCreateOrUpdateInductionDto(prisonId, updatedInduction)
      await this.inductionService.updateInduction(prisonNumber, updateInductionDto, req.user.username)

      req.session.skillsForm = undefined
      req.session.inductionDto = undefined
      return res.redirect(`/plan/${prisonNumber}/view/work-and-interests`)
    } catch (e) {
      logger.error(`Error updating Induction for prisoner ${prisonNumber}`, e)
      return next(createError(500, `Error updating Induction for prisoner ${prisonNumber}. Error: ${e}`))
    }
  }
}
