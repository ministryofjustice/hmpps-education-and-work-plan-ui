import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { FutureWorkInterestDto, InductionDto } from 'inductionDto'
import type { WorkInterestTypesForm } from 'inductionForms'
import WorkInterestTypesView from './workInterestTypesView'
import WorkInterestTypeValue from '../../../enums/workInterestTypeValue'
import { asArray } from '../../../utils/utils'

/**
 * Abstract controller class defining functionality common to both the Create and Update Induction journeys.
 */
export default abstract class WorkInterestTypesController {
  /**
   * Returns the Future Work Interest Types view; suitable for use by the Create and Update journeys.
   */
  getWorkInterestTypesView: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { inductionDto } = req.journeyData
    const { prisonerSummary, invalidForm } = res.locals

    const workInterestTypesForm = invalidForm
      ? {
          workInterestTypes: asArray(invalidForm.workInterestTypes),
          workInterestTypesOther: invalidForm.workInterestTypesOther,
        }
      : toWorkInterestTypesForm(inductionDto)

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
