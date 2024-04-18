import { NextFunction, Request, RequestHandler, Response } from 'express'
import createError from 'http-errors'
import type { InductionDto, PersonalInterestDto } from 'inductionDto'
import type { PersonalInterestsForm } from 'inductionForms'
import PersonalInterestsController from '../common/personalInterestsController'
import toCreateOrUpdateInductionDto from '../../../data/mappers/createOrUpdateInductionDtoMapper'
import logger from '../../../../logger'
import { InductionService } from '../../../services'
import validatePersonalInterestsForm from './personalInterestsFormValidator'
import PersonalInterestsValue from '../../../enums/personalInterestsValue'
import { buildNewPageFlowHistory, getPreviousPage } from '../../pageFlowHistory'
import getDynamicBackLinkAriaText from '../dynamicAriaTextResolver'

/**
 * Controller for the Update of the Personal Interests screen of the Induction.
 */
export default class PersonalInterestsUpdateController extends PersonalInterestsController {
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

  submitPersonalInterestsForm: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { prisonNumber } = req.params
    const { prisonerSummary, inductionDto } = req.session
    const { prisonId } = prisonerSummary

    req.session.personalInterestsForm = { ...req.body }
    if (!req.session.personalInterestsForm.personalInterests) {
      req.session.personalInterestsForm.personalInterests = []
    }
    if (!Array.isArray(req.session.personalInterestsForm.personalInterests)) {
      req.session.personalInterestsForm.personalInterests = [req.session.personalInterestsForm.personalInterests]
    }
    const { personalInterestsForm } = req.session

    const errors = validatePersonalInterestsForm(personalInterestsForm, prisonerSummary)
    if (errors.length > 0) {
      req.flash('errors', errors)
      return res.redirect(`/prisoners/${prisonNumber}/induction/personal-interests`)
    }

    const updatedInduction = this.updatedInductionDtoWithPersonalInterests(inductionDto, personalInterestsForm)

    // If the previous page was Check Your Answers, decide whether to redirect back check answers on submission
    if (this.previousPageWasCheckYourAnswers(req)) {
      req.session.inductionDto = updatedInduction
      return res.redirect(`/prisoners/${prisonNumber}/induction/check-your-answers`)
    }

    if (req.session.updateInductionQuestionSet) {
      req.session.inductionDto = updatedInduction
      const nextPage = `/prisoners/${prisonNumber}/induction/affect-ability-to-work`
      req.session.pageFlowHistory = buildNewPageFlowHistory(req)
      req.session.personalInterestsForm = undefined
      return res.redirect(nextPage)
    }

    try {
      const updateInductionDto = toCreateOrUpdateInductionDto(prisonId, updatedInduction)
      await this.inductionService.updateInduction(prisonNumber, updateInductionDto, req.user.token)

      req.session.personalInterestsForm = undefined
      req.session.inductionDto = undefined
      return res.redirect(`/plan/${prisonNumber}/view/work-and-interests`)
    } catch (e) {
      logger.error(`Error updating Induction for prisoner ${prisonNumber}`, e)
      return next(createError(500, `Error updating Induction for prisoner ${prisonNumber}. Error: ${e}`))
    }
  }

  private updatedInductionDtoWithPersonalInterests(
    inductionDto: InductionDto,
    personalInterestsForm: PersonalInterestsForm,
  ): InductionDto {
    const updatedInterests: PersonalInterestDto[] = personalInterestsForm.personalInterests.map(interest => {
      return {
        interestType: interest,
        interestTypeOther:
          interest === PersonalInterestsValue.OTHER ? personalInterestsForm.personalInterestsOther : undefined,
      }
    })
    return {
      ...inductionDto,
      personalSkillsAndInterests: {
        ...inductionDto.personalSkillsAndInterests,
        interests: updatedInterests,
      },
    }
  }
}
