import createError from 'http-errors'
import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { PreviousWorkExperienceDetailForm } from 'inductionForms'
import type { InductionDto } from 'inductionDto'
import { InductionService } from '../../../services'
import PreviousWorkExperienceDetailController from '../common/previousWorkExperienceDetailController'
import toCreateOrUpdateInductionDto from '../../../data/mappers/createOrUpdateInductionDtoMapper'
import logger from '../../../../logger'
import validatePreviousWorkExperienceDetailForm from '../../validators/induction/previousWorkExperienceDetailFormValidator'
import TypeOfWorkExperienceValue from '../../../enums/typeOfWorkExperienceValue'
import { getNextPage, isLastPage } from '../../pageFlowQueue'
import { getPrisonerContext } from '../../../data/session/prisonerContexts'

/**
 * Controller for the Update of the Previous Work Experience Detail screen of the Induction.
 */

export default class PreviousWorkExperienceDetailUpdateController extends PreviousWorkExperienceDetailController {
  constructor(private readonly inductionService: InductionService) {
    super()
  }

  submitPreviousWorkExperienceDetailForm: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { prisonNumber } = req.params
    const { prisonerSummary } = res.locals
    const { prisonId } = prisonerSummary
    const { typeOfWorkExperience } = req.params
    const { inductionDto } = getPrisonerContext(req.session, prisonNumber)

    let previousWorkExperienceType: TypeOfWorkExperienceValue
    try {
      previousWorkExperienceType = this.validateInductionContainsPreviousWorkExperienceOfType({
        req,
        inductionDto: inductionDto as InductionDto,
        invalidTypeOfWorkExperienceMessage: `Attempt to submit PreviousWorkExperienceDetailForm for invalid work experience type ${typeOfWorkExperience} from ${prisonerSummary.prisonNumber}'s Induction`,
        typeOfWorkExperienceMissingOnInductionMessage: `Attempt to submit PreviousWorkExperienceDetailForm for work experience type ${typeOfWorkExperience} that does not exist on ${prisonerSummary.prisonNumber}'s Induction`,
      })
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return next(createError(404, `Previous Work Experience type ${typeOfWorkExperience} not found on Induction`))
    }

    const previousWorkExperienceDetailForm: PreviousWorkExperienceDetailForm = { ...req.body }
    getPrisonerContext(req.session, prisonNumber).previousWorkExperienceDetailForm = previousWorkExperienceDetailForm

    const errors = validatePreviousWorkExperienceDetailForm(previousWorkExperienceDetailForm, prisonerSummary)
    if (errors.length > 0) {
      return res.redirectWithErrors(
        `/prisoners/${prisonNumber}/induction/previous-work-experience/${typeOfWorkExperience}`,
        errors,
      )
    }

    const updatedInduction = this.updatedInductionDtoWithPreviousWorkExperienceDetail(
      inductionDto,
      previousWorkExperienceDetailForm,
      previousWorkExperienceType,
    )

    const { pageFlowQueue } = req.session
    if (pageFlowQueue && !isLastPage(pageFlowQueue)) {
      // There is a page flow queue, and we are not on the last page of the queue yet
      // Put the updated InductionDto on the session and redirect to the next page in the queue
      getPrisonerContext(req.session, prisonNumber).inductionDto = updatedInduction
      getPrisonerContext(req.session, prisonNumber).previousWorkExperienceDetailForm = undefined
      return res.redirect(getNextPage(pageFlowQueue))
    }

    try {
      const updateInductionDto = toCreateOrUpdateInductionDto(prisonId, updatedInduction)
      await this.inductionService.updateInduction(prisonNumber, updateInductionDto, req.user.username)

      getPrisonerContext(req.session, prisonNumber).previousWorkExperienceDetailForm = undefined
      getPrisonerContext(req.session, prisonNumber).inductionDto = undefined
      return res.redirect(`/plan/${prisonNumber}/view/work-and-interests`)
    } catch (e) {
      logger.error(`Error updating Induction for prisoner ${prisonNumber}`, e)
      return next(createError(500, `Error updating Induction for prisoner ${prisonNumber}. Error: ${e}`))
    }
  }
}
