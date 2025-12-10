import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { InductionDto } from 'inductionDto'
import QualificationsListController from '../common/qualificationsListController'

export default class QualificationsListCreateController extends QualificationsListController {
  submitQualificationsListView: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { inductionDto } = req.journeyData

    const previousPageWasCheckYourAnswers = req.query?.submitToCheckAnswers === 'true'

    if (userClickedOnButton(req, 'addQualification')) {
      req.journeyData.inductionDto.previousQualifications.needToCompleteJourneyFromCheckYourAnswers =
        req.journeyData.inductionDto.previousQualifications.needToCompleteJourneyFromCheckYourAnswers ||
        previousPageWasCheckYourAnswers
      return res.redirect('qualification-level')
    }

    if (userClickedOnButton(req, 'removeQualification')) {
      req.journeyData.inductionDto.previousQualifications.needToCompleteJourneyFromCheckYourAnswers =
        req.journeyData.inductionDto.previousQualifications.needToCompleteJourneyFromCheckYourAnswers ||
        previousPageWasCheckYourAnswers
      const qualificationIndexToRemove = req.body.removeQualification as number
      req.journeyData.inductionDto = inductionWithRemovedQualification(inductionDto, qualificationIndexToRemove)
      return res.redirect('qualifications')
    }

    if (
      previousPageWasCheckYourAnswers ||
      inductionDto.previousQualifications.needToCompleteJourneyFromCheckYourAnswers
    ) {
      return res.redirect('check-your-answers')
    }

    return res.redirect(inductionHasQualifications(inductionDto) ? 'additional-training' : 'highest-level-of-education')
  }
}

const inductionHasQualifications = (inductionDto: InductionDto): boolean =>
  inductionDto.previousQualifications?.qualifications?.length > 0

const userClickedOnButton = (request: Request, buttonName: string): boolean =>
  Object.prototype.hasOwnProperty.call(request.body, buttonName)

const inductionWithRemovedQualification = (
  inductionDto: InductionDto,
  qualificationIndexToRemove: number,
): InductionDto => {
  const updatedQualifications = [...inductionDto.previousQualifications.qualifications]
  updatedQualifications.splice(qualificationIndexToRemove, 1)
  return {
    ...inductionDto,
    previousQualifications: {
      ...inductionDto.previousQualifications,
      qualifications: updatedQualifications,
    },
  }
}
