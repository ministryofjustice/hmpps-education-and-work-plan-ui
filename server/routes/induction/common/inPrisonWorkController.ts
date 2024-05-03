import type { InductionDto, InPrisonWorkInterestDto } from 'inductionDto'
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
      this.addCurrentPageToHistory(req)
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

  protected updatedInductionDtoWithInPrisonWork(
    inductionDto: InductionDto,
    inPrisonWorkForm: InPrisonWorkForm,
  ): InductionDto {
    const updatedPrisonWorkInterests: InPrisonWorkInterestDto[] = inPrisonWorkForm.inPrisonWork.map(interest => {
      return {
        workType: interest,
        workTypeOther: interest === InPrisonWorkValue.OTHER ? inPrisonWorkForm.inPrisonWorkOther : undefined,
      }
    })
    return {
      ...inductionDto,
      inPrisonInterests: {
        ...inductionDto.inPrisonInterests,
        inPrisonWorkInterests: updatedPrisonWorkInterests,
      },
    }
  }
}

const toInPrisonWorkForm = (inductionDto: InductionDto): InPrisonWorkForm => {
  return {
    inPrisonWork:
      inductionDto.inPrisonInterests?.inPrisonWorkInterests?.map(workInterest => workInterest.workType) || [],
    inPrisonWorkOther: inductionDto.inPrisonInterests?.inPrisonWorkInterests?.find(
      workInterest => workInterest.workType === InPrisonWorkValue.OTHER,
    )?.workTypeOther,
  }
}
