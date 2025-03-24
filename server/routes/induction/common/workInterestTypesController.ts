import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { FutureWorkInterestDto, InductionDto } from 'inductionDto'
import type { WorkInterestTypesForm } from 'inductionForms'
import InductionController from './inductionController'
import WorkInterestTypesView from './workInterestTypesView'
import WorkInterestTypeValue from '../../../enums/workInterestTypeValue'
import { getPrisonerContext } from '../../../data/session/prisonerContexts'

/**
 * Abstract controller class defining functionality common to both the Create and Update Induction journeys.
 */
export default abstract class WorkInterestTypesController extends InductionController {
  /**
   * Returns the Future Work Interest Types view; suitable for use by the Create and Update journeys.
   */
  getWorkInterestTypesView: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { prisonNumber } = req.params
    const { prisonerSummary } = res.locals
    const { inductionDto } = getPrisonerContext(req.session, prisonNumber)

    this.addCurrentPageToFlowHistoryWhenComingFromCheckYourAnswers(req)

    const workInterestTypesForm: WorkInterestTypesForm =
      getPrisonerContext(req.session, prisonNumber).workInterestTypesForm || toWorkInterestTypesForm(inductionDto)
    getPrisonerContext(req.session, prisonNumber).workInterestTypesForm = undefined

    const view = new WorkInterestTypesView(prisonerSummary, workInterestTypesForm)
    return res.render('pages/induction/workInterests/workInterestTypes', { ...view.renderArgs })
  }

  protected updatedInductionDtoWithWorkInterestTypes(
    inductionDto: InductionDto,
    workInterestTypesForm: WorkInterestTypesForm,
  ): InductionDto {
    const updatedWorkInterests: Array<FutureWorkInterestDto> = workInterestTypesForm.workInterestTypes.map(workType => {
      return {
        workType,
        workTypeOther:
          workType === WorkInterestTypeValue.OTHER ? workInterestTypesForm.workInterestTypesOther : undefined,
        role: inductionDto.futureWorkInterests?.interests?.find(interest => interest.workType === workType)?.role,
      }
    })
    return {
      ...inductionDto,
      futureWorkInterests: {
        ...inductionDto.futureWorkInterests,
        interests: updatedWorkInterests,
      },
    }
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
