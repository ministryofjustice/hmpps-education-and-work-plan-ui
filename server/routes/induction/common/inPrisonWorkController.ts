import type { InductionDto } from 'inductionDto'
import type { InPrisonWorkForm } from 'inductionForms'
import { NextFunction, Request, RequestHandler, Response } from 'express'
import InPrisonWorkView from './inPrisonWorkView'
import InductionController from './inductionController'
import InPrisonWorkValue from '../../../enums/inPrisonWorkValue'

/**
 * Abstract controller class defining functionality common to both the Create and Update Induction journeys.
 */
export default abstract class InPrisonWorkController extends InductionController {
  /**
   * Returns the In Prison Work view; suitable for use by the Create and Update journeys.
   */
  getInPrisonWorkView: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { prisonerSummary, inductionDto } = req.session

    // Check if we are in the midst of changing the main induction question set (in this case from long route to short route)
    if (req.session.updateInductionQuestionSet) {
      const { prisonNumber } = req.params
      this.addCurrentPageToHistory(req, `/prisoners/${prisonNumber}/induction/in-prison-work`)
    }

    const inPrisonWorkForm = req.session.inPrisonWorkForm || toInPrisonWorkForm(inductionDto)
    req.session.inPrisonWorkForm = undefined

    const view = new InPrisonWorkView(
      prisonerSummary,
      this.getBackLinkUrl(req),
      this.getBackLinkAriaText(req),
      inPrisonWorkForm,
      req.flash('errors'),
    )
    return res.render('pages/induction/inPrisonWork/index', { ...view.renderArgs })
  }
}

const toInPrisonWorkForm = (inductionDto: InductionDto): InPrisonWorkForm => {
  return {
    inPrisonWork:
      inductionDto.inPrisonInterests?.inPrisonWorkInterests.map(workInterest => workInterest.workType) || [],
    inPrisonWorkOther: inductionDto.inPrisonInterests?.inPrisonWorkInterests.find(
      workInterest => workInterest.workType === InPrisonWorkValue.OTHER,
    )?.workTypeOther,
  }
}
