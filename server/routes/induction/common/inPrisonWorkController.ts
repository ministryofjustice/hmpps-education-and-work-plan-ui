import type { InductionDto } from 'inductionDto'
import type { InPrisonWorkForm } from 'inductionForms'
import { NextFunction, Request, RequestHandler, Response } from 'express'
import InPrisonWorkView from './inPrisonWorkView'
import InductionController from './inductionController'
import InPrisonWorkValue from '../../../enums/inPrisonWorkValue'
import formatInPrisonWorkInterestFilter from '../../../filters/formatInPrisonWorkInterestFilter'

/**
 * Abstract controller class defining functionality common to both the Create and Update Induction journeys.
 */
export default abstract class InPrisonWorkController extends InductionController {
  constructor() {
    super()
  }

  /**
   * Returns the In Prison Work view; suitable for use by the Create and Update journeys.
   */
  getInPrisonWorkView: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { prisonerSummary, inductionDto } = req.session

    const inPrisonWorkForm = req.session.inPrisonWorkForm || toInPrisonWorkForm(inductionDto)
    req.session.inPrisonWorkForm = undefined

    const formValues = Object.values(InPrisonWorkValue)
      .filter(value => value !== 'OTHER')
      .map(value => {
        return {
          value,
          text: formatInPrisonWorkInterestFilter(value),
          checked: inPrisonWorkForm.inPrisonWork.includes(value),
        }
      })

    const view = new InPrisonWorkView(
      prisonerSummary,
      this.getBackLinkUrl(req),
      this.getBackLinkAriaText(req),
      inPrisonWorkForm,
      formValues,
      req.flash('errors'),
    )
    return res.render('pages/induction/inPrisonWork/index', { ...view.renderArgs })
  }
}

const toInPrisonWorkForm = (inductionDto: InductionDto): InPrisonWorkForm => {
  return {
    inPrisonWork: inductionDto.inPrisonInterests.inPrisonWorkInterests.map(workInterest => workInterest.workType),
    inPrisonWorkOther: inductionDto.inPrisonInterests.inPrisonWorkInterests.find(
      workInterest => workInterest.workType === InPrisonWorkValue.OTHER,
    )?.workTypeOther,
  }
}
