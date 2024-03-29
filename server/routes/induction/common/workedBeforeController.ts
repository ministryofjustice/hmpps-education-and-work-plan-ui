import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { InductionDto } from 'inductionDto'
import type { WorkedBeforeForm } from 'inductionForms'
import InductionController from './inductionController'
import WorkedBeforeView from './workedBeforeView'
import YesNoValue from '../../../enums/yesNoValue'

/**
 * Abstract controller class defining functionality common to both the Create and Update Induction journeys.
 */
export default abstract class WorkedBeforeController extends InductionController {
  /**
   * Returns the WorkedBefore view; suitable for use by the Create and Update journeys.
   */
  getWorkedBeforeView: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { prisonerSummary, inductionDto } = req.session

    const workedBeforeForm = req.session.workedBeforeForm || toWorkedBeforeForm(inductionDto)
    req.session.workedBeforeForm = undefined

    const view = new WorkedBeforeView(
      prisonerSummary,
      this.getBackLinkUrl(req),
      this.getBackLinkAriaText(req),
      workedBeforeForm,
      req.flash('errors'),
    )
    return res.render('pages/induction/workedBefore/index', { ...view.renderArgs })
  }
}

const toWorkedBeforeForm = (inductionDto: InductionDto): WorkedBeforeForm => {
  return {
    hasWorkedBefore: inductionDto.previousWorkExperiences?.hasWorkedBefore === true ? YesNoValue.YES : YesNoValue.NO,
  }
}
