import { Request, RequestHandler, Response } from 'express'
import type { InductionDto } from 'inductionDto'
import WantToAddQualificationsController from '../common/wantToAddQualificationsController'
import YesNoValue from '../../../enums/yesNoValue'
import getDynamicBackLinkAriaText from '../dynamicAriaTextResolver'
import validateWantToAddQualificationsForm from '../../validators/induction/wantToAddQualificationsFormValidator'
import EducationLevelValue from '../../../enums/educationLevelValue'

export default class WantToAddQualificationsCreateController extends WantToAddQualificationsController {
  getBackLinkUrl(req: Request): string {
    const { prisonNumber } = req.params
    return `/prisoners/${prisonNumber}/create-induction/reasons-not-to-get-work`
  }

  getBackLinkAriaText(req: Request): string {
    return getDynamicBackLinkAriaText(req, this.getBackLinkUrl(req))
  }

  submitWantToAddQualificationsForm: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const { prisonNumber } = req.params
    const { prisonerSummary, inductionDto } = req.session

    req.session.wantToAddQualificationsForm = { ...req.body }
    const { wantToAddQualificationsForm } = req.session

    const errors = validateWantToAddQualificationsForm(wantToAddQualificationsForm, prisonerSummary)
    if (errors.length > 0) {
      return res.redirectWithErrors(`/prisoners/${prisonNumber}/create-induction/want-to-add-qualifications`, errors)
    }

    req.session.wantToAddQualificationsForm = undefined

    const updatedInduction = updatedInductionDtoWithDefaultQualificationData(inductionDto)
    req.session.inductionDto = updatedInduction

    const nextPage =
      wantToAddQualificationsForm.wantToAddQualifications === YesNoValue.YES
        ? `/prisoners/${prisonNumber}/create-induction/qualification-level`
        : `/prisoners/${prisonNumber}/create-induction/additional-training`

    return res.redirect(nextPage)
  }
}

const updatedInductionDtoWithDefaultQualificationData = (inductionDto: InductionDto): InductionDto => {
  return {
    ...inductionDto,
    previousQualifications: {
      ...inductionDto.previousQualifications,
      qualifications: [...(inductionDto.previousQualifications?.qualifications || [])],
      educationLevel: inductionDto.previousQualifications?.educationLevel || EducationLevelValue.NOT_SURE,
    },
  }
}
