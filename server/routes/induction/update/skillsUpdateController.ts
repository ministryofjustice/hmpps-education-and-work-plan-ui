import { NextFunction, Request, RequestHandler, Response } from 'express'
import createError from 'http-errors'
import type { InductionDto, PersonalSkillDto } from 'inductionDto'
import type { SkillsForm } from 'inductionForms'
import SkillsController from '../common/skillsController'
import toCreateOrUpdateInductionDto from '../../../data/mappers/createOrUpdateInductionDtoMapper'
import logger from '../../../../logger'
import { InductionService } from '../../../services'
import validateSkillsForm from './skillsFormValidator'
import SkillsValue from '../../../enums/skillsValue'

/**
 * Controller for the Update of the Skills screen of the Induction.
 */
export default class SkillsUpdateController extends SkillsController {
  constructor(private readonly inductionService: InductionService) {
    super()
  }

  getBackLinkUrl(req: Request): string {
    const { prisonNumber } = req.params
    return `/plan/${prisonNumber}/view/work-and-interests`
  }

  getBackLinkAriaText(_req: Request): string {
    return 'Back to <TODO - check what CIAG UI does here>'
  }

  submitSkillsForm: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { prisonNumber } = req.params
    const { prisonerSummary, inductionDto } = req.session
    const { prisonId } = prisonerSummary

    req.session.skillsForm = { ...req.body }
    if (!req.session.skillsForm.skills) {
      req.session.skillsForm.skills = []
    }
    if (!Array.isArray(req.session.skillsForm.skills)) {
      req.session.skillsForm.skills = [req.session.skillsForm.skills]
    }
    const { skillsForm } = req.session

    const errors = validateSkillsForm(skillsForm, prisonerSummary)
    if (errors.length > 0) {
      req.flash('errors', errors)
      return res.redirect(`/prisoners/${prisonNumber}/induction/skills`)
    }

    // create an updated InductionDto with any new values and then map it to a CreateOrUpdateInductionDTO to call the API
    const updatedInduction = this.updatedInductionDtoWithSkills(inductionDto, skillsForm)
    const updateInductionDto = toCreateOrUpdateInductionDto(prisonId, updatedInduction)

    try {
      await this.inductionService.updateInduction(prisonNumber, updateInductionDto, req.user.token)

      req.session.skillsForm = undefined
      req.session.inductionDto = undefined
      return res.redirect(`/plan/${prisonNumber}/view/work-and-interests`)
    } catch (e) {
      logger.error(`Error updating Induction for prisoner ${prisonNumber}`, e)
      return next(createError(500, `Error updating Induction for prisoner ${prisonNumber}. Error: ${e}`))
    }
  }

  private updatedInductionDtoWithSkills(inductionDto: InductionDto, skillsForm: SkillsForm): InductionDto {
    const updatedSkills: PersonalSkillDto[] = skillsForm.skills.map(skill => {
      return {
        skillType: skill,
        skillTypeOther: skill === SkillsValue.OTHER ? skillsForm.skillsOther : undefined,
      }
    })
    return {
      ...inductionDto,
      personalSkillsAndInterests: {
        ...inductionDto.personalSkillsAndInterests,
        skills: updatedSkills,
      },
    }
  }
}
