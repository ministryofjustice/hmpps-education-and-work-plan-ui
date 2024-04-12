import { NextFunction, Request, RequestHandler, Response } from 'express'
import createError from 'http-errors'
import type { InductionDto, PersonalSkillDto } from 'inductionDto'
import type { SkillsForm } from 'inductionForms'
import type { PageFlow } from 'viewModels'
import SkillsController from '../common/skillsController'
import toCreateOrUpdateInductionDto from '../../../data/mappers/createOrUpdateInductionDtoMapper'
import logger from '../../../../logger'
import { InductionService } from '../../../services'
import validateSkillsForm from './skillsFormValidator'
import SkillsValue from '../../../enums/skillsValue'
import { getPreviousPage } from '../../pageFlowHistory'
import getDynamicBackLinkAriaText from '../dynamicAriaTextResolver'

/**
 * Controller for the Update of the Skills screen of the Induction.
 */
export default class SkillsUpdateController extends SkillsController {
  constructor(private readonly inductionService: InductionService) {
    super()
  }

  getBackLinkUrl(req: Request): string {
    const { prisonNumber } = req.params
    const { pageFlowHistory } = req.session
    if (pageFlowHistory) {
      return getPreviousPage(pageFlowHistory)
    }
    return `/plan/${prisonNumber}/view/work-and-interests`
  }

  getBackLinkAriaText(req: Request): string {
    return getDynamicBackLinkAriaText(req, this.getBackLinkUrl(req))
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

    const updatedInduction = this.updatedInductionDtoWithSkills(inductionDto, skillsForm)

    if (req.session.updateInductionQuestionSet) {
      req.session.inductionDto = updatedInduction
      const nextPage = `/prisoners/${prisonNumber}/induction/personal-interests`
      req.session.pageFlowHistory = this.buildPageFlowHistory(prisonNumber)
      req.session.skillsForm = undefined
      return res.redirect(nextPage)
    }

    try {
      const updateInductionDto = toCreateOrUpdateInductionDto(prisonId, updatedInduction)
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

  private buildPageFlowHistory = (prisonNumber: string): PageFlow => {
    const pageUrls = [`/prisoners/${prisonNumber}/induction/skills`]
    return {
      pageUrls,
      currentPageIndex: 0,
    }
  }
}
