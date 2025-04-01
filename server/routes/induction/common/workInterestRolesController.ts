import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { InductionDto, FutureWorkInterestDto } from 'inductionDto'
import type { WorkInterestRolesForm } from 'inductionForms'
import InductionController from './inductionController'
import WorkInterestRolesView from './workInterestRolesView'
import WorkInterestTypeValue from '../../../enums/workInterestTypeValue'
import { getPrisonerContext } from '../../../data/session/prisonerContexts'

/**
 * Abstract controller class defining functionality common to both the Create and Update Induction journeys.
 */
export default abstract class WorkInterestRolesController extends InductionController {
  /**
   * Returns the Future Work Interest Roles view; suitable for use by the Create and Update journeys.
   */
  getWorkInterestRolesView: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { prisonNumber } = req.params
    const { prisonerSummary } = res.locals
    const { inductionDto } = getPrisonerContext(req.session, prisonNumber)

    this.addCurrentPageToFlowHistoryWhenComingFromCheckYourAnswers(req)

    const workInterestRolesForm: WorkInterestRolesForm =
      getPrisonerContext(req.session, prisonNumber).workInterestRolesForm || toWorkInterestRolesForm(inductionDto)
    getPrisonerContext(req.session, prisonNumber).workInterestRolesForm = undefined

    const view = new WorkInterestRolesView(prisonerSummary, workInterestRolesForm)
    return res.render('pages/induction/workInterests/workInterestRoles', { ...view.renderArgs })
  }

  protected updatedInductionDtoWithWorkInterestRoles(
    inductionDto: InductionDto,
    workInterestRolesForm: WorkInterestRolesForm,
  ): InductionDto {
    const updatedWorkInterests: Array<FutureWorkInterestDto> = inductionDto.futureWorkInterests.interests.map(
      interest => {
        return {
          workType: interest.workType,
          workTypeOther: interest.workType === WorkInterestTypeValue.OTHER ? interest.workTypeOther : undefined,
          role: workInterestRolesForm.workInterestRoles?.find(keyValuePair => keyValuePair[0] === interest.workType)[1],
        }
      },
    )
    return {
      ...inductionDto,
      futureWorkInterests: {
        ...inductionDto.futureWorkInterests,
        interests: updatedWorkInterests,
      },
    }
  }
}

const toWorkInterestRolesForm = (inductionDto: InductionDto): WorkInterestRolesForm => {
  const workInterestRoles: [WorkInterestTypeValue, string][] =
    inductionDto.futureWorkInterests?.interests.map(interest => {
      return [interest.workType as WorkInterestTypeValue, interest.role]
    }) || []

  return {
    workInterestRoles,
    workInterestTypesOther: inductionDto.futureWorkInterests?.interests.find(
      interest => interest.workType === WorkInterestTypeValue.OTHER,
    )?.workTypeOther,
  }
}
