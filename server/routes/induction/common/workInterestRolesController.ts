import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { InductionDto } from 'inductionDto'
import type { WorkInterestRolesForm } from 'inductionForms'
import InductionController from './inductionController'
import WorkInterestRolesView from './workInterestRolesView'
import WorkInterestTypeValue from '../../../enums/workInterestTypeValue'

/**
 * Abstract controller class defining functionality common to both the Create and Update Induction journeys.
 */
export default abstract class WorkInterestRolesController extends InductionController {
  /**
   * Returns the Future Work Interest Roles view; suitable for use by the Create and Update journeys.
   */
  getWorkInterestRolesView: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { prisonerSummary, inductionDto } = req.session

    this.addCurrentPageToFlowHistoryWhenComingFromCheckYourAnswers(req)

    const workInterestRolesForm = toWorkInterestRolesForm(inductionDto)

    const view = new WorkInterestRolesView(
      prisonerSummary,
      this.getBackLinkUrl(req),
      this.getBackLinkAriaText(req),
      workInterestRolesForm,
    )
    return res.render('pages/induction/workInterests/workInterestRoles', { ...view.renderArgs })
  }

  protected updatedInductionDtoWithWorkInterestRoles(
    inductionDto: InductionDto,
    workInterestRolesForm: WorkInterestRolesForm,
  ): InductionDto {
    const updatedWorkInterests = inductionDto.futureWorkInterests.interests.map(interest => {
      return {
        workType: interest.workType,
        workTypeOther: interest.workTypeOther,
        role: workInterestRolesForm.workInterestRoles?.get(interest.workType),
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

const toWorkInterestRolesForm = (inductionDto: InductionDto): WorkInterestRolesForm => {
  const workInterestRoles = new Map<WorkInterestTypeValue, string>()
  inductionDto.futureWorkInterests?.interests.forEach(interest => {
    workInterestRoles.set(interest.workType, interest.role)
  })

  return {
    workInterestRoles,
    workInterestTypesOther: inductionDto.futureWorkInterests?.interests.find(
      interest => interest.workType === WorkInterestTypeValue.OTHER,
    )?.workTypeOther,
  }
}
