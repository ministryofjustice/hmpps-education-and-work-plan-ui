import { Request, Response, RequestHandler, NextFunction } from 'express'
import type { CreateEmployabilitySkillDto } from 'dto'
import { AuditService, EmployabilitySkillsService } from '../../../services'
import { formatEmployabilitySkillsFilter } from '../../../filters/formatEmployabilitySkillsFilter'
import EmployabilitySkillsValue from '../../../enums/employabilitySkillsValue'
import EmployabilitySkillRatingValue from '../../../enums/employabilitySkillRatingValue'
import { Result } from '../../../utils/result/result'
import { BaseAuditData } from '../../../services/auditService'
import {
  clearRedirectPendingFlag,
  setRedirectPendingFlag,
} from '../../routerRequestHandlers/checkRedirectAtEndOfJourneyIsNotPending'

export default class AddEmployabilitySkillRatingsController {
  constructor(
    private readonly employabilitySkillsService: EmployabilitySkillsService,
    private readonly auditService: AuditService,
  ) {}

  getEmployabilitySkillRatingsView: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { employabilitySkills, invalidForm, prisonerSummary } = res.locals
    const { skillType } = req.params

    clearRedirectPendingFlag(req)

    const employabilitySkillRatingsForm =
      invalidForm ?? this.populateFormFromDto(req.journeyData.createEmployabilitySkillDto)

    res.render('pages/employabilitySkills/add/employability-skill-ratings.njk', {
      prisonerSummary,
      skillType,
      employabilitySkills,
      form: employabilitySkillRatingsForm,
    })
  }

  submitEmployabilitySkillRatingsForm: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { prisonNumber, skillType } = req.params
    const { username } = req.user

    const employabilitySkillRatingsForm = req.body
    this.updateDtoFromForm(req, employabilitySkillRatingsForm, skillType)

    const employabilitySkillDtos = [req.journeyData.createEmployabilitySkillDto]
    const { apiErrorCallback } = res.locals
    const apiResult = await Result.wrap(
      this.employabilitySkillsService.createEmployabilitySkills(prisonNumber, employabilitySkillDtos, username),
      apiErrorCallback,
    )
    if (!apiResult.isFulfilled()) {
      req.flash('pageHasApiErrors', 'true')
      return res.redirect('add')
    }

    req.journeyData.createEmployabilitySkillDto = undefined
    this.auditService.logAddEmployabilitySkillRating(this.addEmployabilitySkillRatingAuditData(req, skillType)) // no need to wait for response
    setRedirectPendingFlag(req)
    return res.redirectWithSuccess(
      `/plan/${prisonNumber}/view/employability-skills`,
      `${formatEmployabilitySkillsFilter(skillType as EmployabilitySkillsValue)} skill updated`,
    )
  }

  private populateFormFromDto = (dto: CreateEmployabilitySkillDto) => {
    return {
      rating: dto.employabilitySkillRating,
      evidence: dto.evidence,
    }
  }

  private updateDtoFromForm = (
    req: Request,
    form: { rating: EmployabilitySkillRatingValue; evidence: string },
    skillType: string,
  ) => {
    const { createEmployabilitySkillDto } = req.journeyData
    createEmployabilitySkillDto.employabilitySkillType = skillType
    createEmployabilitySkillDto.employabilitySkillRating = form.rating
    createEmployabilitySkillDto.evidence = form.evidence
    req.journeyData.createEmployabilitySkillDto = createEmployabilitySkillDto
  }

  private addEmployabilitySkillRatingAuditData = (req: Request, skillType: string): BaseAuditData => {
    return {
      details: { skillType },
      subjectType: 'PRISONER_ID',
      subjectId: req.params.prisonNumber,
      who: req.user?.username ?? 'UNKNOWN',
      correlationId: req.id,
    }
  }
}
