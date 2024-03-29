import { NextFunction, Request, RequestHandler, Response } from 'express'
import createError from 'http-errors'
import type { InductionDto, InPrisonTrainingInterestDto } from 'inductionDto'
import type { InPrisonTrainingForm } from 'inductionForms'
import InPrisonTrainingController from '../common/inPrisonTrainingController'
import toCreateOrUpdateInductionDto from '../../../data/mappers/createOrUpdateInductionDtoMapper'
import logger from '../../../../logger'
import { InductionService } from '../../../services'
import validateInPrisonTrainingForm from './inPrisonTrainingFormValidator'
import InPrisonTrainingValue from '../../../enums/inPrisonTrainingValue'
import { getPreviousPage } from '../../pageFlowHistory'
import getDynamicBackLinkAriaText from '../dynamicAriaTextResolver'

/**
 * Controller for Updating a Prisoner's In-Prison Education and Training screen of the Induction.
 */
export default class InPrisonTrainingUpdateController extends InPrisonTrainingController {
  constructor(private readonly inductionService: InductionService) {
    super()
  }

  getBackLinkUrl(req: Request): string {
    const { prisonNumber } = req.params
    const { pageFlowHistory } = req.session
    if (pageFlowHistory) {
      return getPreviousPage(pageFlowHistory)
    }
    return `/plan/${prisonNumber}/view/education-and-training`
  }

  getBackLinkAriaText(req: Request): string {
    return getDynamicBackLinkAriaText(req, this.getBackLinkUrl(req))
  }

  submitInPrisonTrainingForm: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { prisonNumber } = req.params
    const { prisonerSummary, inductionDto } = req.session
    const { prisonId } = prisonerSummary

    req.session.inPrisonTrainingForm = { ...req.body }
    if (!req.session.inPrisonTrainingForm.inPrisonTraining) {
      req.session.inPrisonTrainingForm.inPrisonTraining = []
    }
    if (!Array.isArray(req.session.inPrisonTrainingForm.inPrisonTraining)) {
      req.session.inPrisonTrainingForm.inPrisonTraining = [req.session.inPrisonTrainingForm.inPrisonTraining]
    }
    const { inPrisonTrainingForm } = req.session

    const errors = validateInPrisonTrainingForm(inPrisonTrainingForm, prisonerSummary)
    if (errors.length > 0) {
      req.flash('errors', errors)
      return res.redirect(`/prisoners/${prisonNumber}/induction/in-prison-training`)
    }

    const updatedInduction = this.updatedInductionDtoWithInPrisonTraining(inductionDto, inPrisonTrainingForm)

    // if we are switching from the long question set to the short one, forward to the check your answers page
    if (req.session.updateInductionQuestionSet) {
      req.session.inductionDto = updatedInduction
      // TODO - forward to check your answers
      return res.redirect(`/plan/${prisonNumber}/view/work-and-interests`)
    }

    const updateInductionDto = toCreateOrUpdateInductionDto(prisonId, updatedInduction)

    try {
      await this.inductionService.updateInduction(prisonNumber, updateInductionDto, req.user.token)

      req.session.inPrisonTrainingForm = undefined
      req.session.inductionDto = undefined
      return res.redirect(`/plan/${prisonNumber}/view/education-and-training`)
    } catch (e) {
      logger.error(`Error updating Induction for prisoner ${prisonNumber}`, e)
      return next(createError(500, `Error updating Induction for prisoner ${prisonNumber}. Error: ${e}`))
    }
  }

  private updatedInductionDtoWithInPrisonTraining(
    inductionDto: InductionDto,
    inPrisonTrainingForm: InPrisonTrainingForm,
  ): InductionDto {
    const updatedPrisonTrainingInterests: InPrisonTrainingInterestDto[] = inPrisonTrainingForm.inPrisonTraining.map(
      training => {
        return {
          trainingType: training,
          trainingTypeOther:
            training === InPrisonTrainingValue.OTHER ? inPrisonTrainingForm.inPrisonTrainingOther : undefined,
        }
      },
    )
    return {
      ...inductionDto,
      inPrisonInterests: {
        ...inductionDto.inPrisonInterests,
        inPrisonTrainingInterests: updatedPrisonTrainingInterests,
      },
    }
  }
}
