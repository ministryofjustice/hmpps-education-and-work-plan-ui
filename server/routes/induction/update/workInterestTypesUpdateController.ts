import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { WorkInterestTypesForm } from 'inductionForms'
import WorkInterestTypesController from '../common/workInterestTypesController'
import toCreateOrUpdateInductionDto from '../../../data/mappers/createOrUpdateInductionDtoMapper'
import logger from '../../../../logger'
import { InductionService } from '../../../services'
import HopingToGetWorkValue from '../../../enums/hopingToGetWorkValue'
import { Result } from '../../../utils/result/result'
import { asArray } from '../../../utils/utils'
import { setRedirectPendingFlag } from '../../routerRequestHandlers/checkRedirectAtEndOfJourneyIsNotPending'

/**
 * Controller for updating a Prisoner's Future Work Interest Types part of an Induction.
 */
export default class WorkInterestTypesUpdateController extends WorkInterestTypesController {
  constructor(private readonly inductionService: InductionService) {
    super()
  }

  submitWorkInterestTypesForm: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { prisonNumber, journeyId } = req.params
    const { inductionDto } = req.journeyData
    const { prisonerSummary } = res.locals
    const { prisonId } = prisonerSummary

    const workInterestTypesForm: WorkInterestTypesForm = {
      workInterestTypes: asArray(req.body.workInterestTypes),
      workInterestTypesOther: req.body.workInterestTypesOther,
    }

    const updatedInduction = this.updatedInductionDtoWithWorkInterestTypes(inductionDto, workInterestTypesForm)

    // If on the original induction the prisoner is hoping to work on release but there are no future work interests
    // then we have come from the Hoping To Work On Release page and we need to go to Work Interest Roles in order to
    // complete the capture the prisoners future work interests.
    if (
      inductionDto.workOnRelease.hopingToWork === HopingToGetWorkValue.YES &&
      (inductionDto.futureWorkInterests?.interests || []).length === 0
    ) {
      req.journeyData.inductionDto = updatedInduction
      return res.redirect(`/prisoners/${prisonNumber}/induction/${journeyId}/work-interest-roles`)
    }

    // Else we can simply call the API to update the Induction and return to Work & Interests tab
    const updateInductionDto = toCreateOrUpdateInductionDto(prisonId, updatedInduction)

    const { apiErrorCallback } = res.locals
    const apiResult = await Result.wrap(
      this.inductionService.updateInduction(prisonNumber, updateInductionDto, req.user.username),
      apiErrorCallback,
    )
    if (!apiResult.isFulfilled()) {
      apiResult.getOrHandle(e => logger.error(`Error updating Induction for prisoner ${prisonNumber}`, e))
      req.flash('pageHasApiErrors', 'true')
      return res.redirect('work-interest-types')
    }

    req.journeyData.inductionDto = undefined
    setRedirectPendingFlag(req)
    return res.redirect(`/plan/${prisonNumber}/view/work-and-interests`)
  }
}
