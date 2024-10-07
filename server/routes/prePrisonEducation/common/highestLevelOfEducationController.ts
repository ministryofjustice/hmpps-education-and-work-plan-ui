import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { EducationDto } from 'dto'
import type { HighestLevelOfEducationForm } from 'forms'
import HighestLevelOfEducationView from './highestLevelOfEducationView'
import { getPrisonerContext } from '../../../data/session/prisonerContexts'
import EducationController from './educationController'

/**
 * Abstract controller class defining functionality common to both the Create and Update journeys.
 */
export default abstract class HighestLevelOfEducationController extends EducationController {
  getHighestLevelOfEducationView: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { prisonNumber } = req.params
    const { prisonerSummary } = req.session

    const { educationDto } = getPrisonerContext(req.session, prisonNumber)
    const highestLevelOfEducationForm =
      getPrisonerContext(req.session, prisonNumber).highestLevelOfEducationForm ||
      this.toHighestLevelOfEducationForm(educationDto)
    getPrisonerContext(req.session, prisonNumber).highestLevelOfEducationForm = undefined

    const view = new HighestLevelOfEducationView(
      prisonerSummary,
      this.getBackLinkUrl(req),
      this.getBackLinkAriaText(req),
      highestLevelOfEducationForm,
    )
    return res.render('pages/prePrisonEducation/highestLevelOfEducation', { ...view.renderArgs })
  }

  private toHighestLevelOfEducationForm = (educationDto: EducationDto): HighestLevelOfEducationForm => {
    return {
      educationLevel: educationDto.educationLevel,
    }
  }

  protected updatedEducationDtoWithHighestLevelOfEducation = (
    educationDto: EducationDto,
    highestLevelOfEducationForm: HighestLevelOfEducationForm,
  ) => {
    return {
      ...educationDto,
      educationLevel: highestLevelOfEducationForm.educationLevel,
    }
  }
}
