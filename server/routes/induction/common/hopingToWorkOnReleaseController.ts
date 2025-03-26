import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { InductionDto } from 'inductionDto'
import type { HopingToWorkOnReleaseForm } from 'inductionForms'
import InductionController from './inductionController'
import HopingToWorkOnReleaseView from './hopingToWorkOnReleaseView'
import { getPrisonerContext } from '../../../data/session/prisonerContexts'

/**
 * Abstract controller class defining functionality common to both the Create and Update Induction journeys.
 */
export default abstract class HopingToWorkOnReleaseController extends InductionController {
  /**
   * Returns the Hoping To Work On Release view; suitable for use by the Create and Update journeys.
   */
  getHopingToWorkOnReleaseView: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { prisonNumber } = req.params
    const { prisonerSummary } = res.locals
    const { inductionDto } = getPrisonerContext(req.session, prisonNumber)

    this.addCurrentPageToFlowHistoryWhenComingFromCheckYourAnswers(req)

    const hopingToWorkOnReleaseForm: HopingToWorkOnReleaseForm =
      getPrisonerContext(req.session, prisonNumber).hopingToWorkOnReleaseForm ||
      toHopingToWorkOnReleaseForm(inductionDto)
    getPrisonerContext(req.session, prisonNumber).hopingToWorkOnReleaseForm = undefined

    const view = new HopingToWorkOnReleaseView(prisonerSummary, hopingToWorkOnReleaseForm)
    return res.render('pages/induction/hopingToWorkOnRelease/index', { ...view.renderArgs })
  }

  protected updatedInductionDtoWithHopingToWorkOnRelease = (
    inductionDto: InductionDto,
    hopingToWorkOnReleaseForm: HopingToWorkOnReleaseForm,
  ): InductionDto => {
    return {
      ...inductionDto,
      workOnRelease: {
        ...inductionDto.workOnRelease,
        hopingToWork: hopingToWorkOnReleaseForm.hopingToGetWork,
      },
      futureWorkInterests: {
        ...inductionDto.futureWorkInterests,
        // Set array of future work interests to empty array. However this page is submitted and whetever the submitted answer we should always set this to an empty array so that the data makes sense for subsequent screens
        interests: [],
      },
    }
  }

  protected answerHasNotBeenChanged = (
    originalInduction: InductionDto,
    hopingToWorkOnReleaseForm: HopingToWorkOnReleaseForm,
  ): boolean => originalInduction.workOnRelease.hopingToWork === hopingToWorkOnReleaseForm.hopingToGetWork
}

const toHopingToWorkOnReleaseForm = (inductionDto: InductionDto): HopingToWorkOnReleaseForm => {
  return {
    hopingToGetWork: inductionDto?.workOnRelease?.hopingToWork,
  }
}
