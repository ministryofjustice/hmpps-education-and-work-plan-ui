import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { InductionDto } from 'inductionDto'
import type { WorkInterestTypesForm } from 'inductionForms'
import InductionController from './inductionController'
import WorkInterestTypesView from './workInterestTypesView'
import WorkInterestTypeValue from '../../../enums/workInterestTypeValue'

/**
 * Abstract controller class defining functionality common to both the Create and Update Induction journeys.
 */
export default abstract class WorkInterestTypesController extends InductionController {
  /**
   * Returns the Future Work Interest Types view; suitable for use by the Create and Update journeys.
   */
  getWorkInterestTypesView: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { prisonerSummary, inductionDto } = req.session

    // Check if we are in the midst of changing the main induction question set (in this case from short route to long route)
    if (req.session.updateInductionQuestionSet || req.session.pageFlowHistory) {
      this.addCurrentPageToHistory(req)
    }

    const workInterestTypesForm = req.session.workInterestTypesForm || toWorkInterestTypesForm(inductionDto)
    req.session.workInterestTypesForm = undefined

    const view = new WorkInterestTypesView(
      prisonerSummary,
      this.getBackLinkUrl(req),
      this.getBackLinkAriaText(req),
      workInterestTypesForm,
      req.flash('errors'),
    )
    return res.render('pages/induction/workInterests/workInterestTypes', { ...view.renderArgs })
  }
}

const toWorkInterestTypesForm = (inductionDto: InductionDto): WorkInterestTypesForm => {
  return {
    workInterestTypes: inductionDto.futureWorkInterests?.interests.map(interest => interest.workType) || [],
    workInterestTypesOther: inductionDto.futureWorkInterests?.interests.find(
      interest => interest.workType === WorkInterestTypeValue.OTHER,
    )?.workTypeOther,
  }
}
