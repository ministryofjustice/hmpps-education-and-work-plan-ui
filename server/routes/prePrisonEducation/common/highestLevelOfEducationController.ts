import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { EducationDto } from 'dto'
import type { HighestLevelOfEducationForm } from 'forms'
import HighestLevelOfEducationView from './highestLevelOfEducationView'
import { getPrisonerContext } from '../../../data/session/prisonerContexts'

/**
 * Abstract controller class defining functionality common to both the Create and Update journeys.
 */
export default abstract class HighestLevelOfEducationController {
  getHighestLevelOfEducationView: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { prisonNumber } = req.params
    const { prisonerSummary } = res.locals

    const { educationDto } = req.journeyData
    const highestLevelOfEducationForm =
      getPrisonerContext(req.session, prisonNumber).highestLevelOfEducationForm ||
      this.toHighestLevelOfEducationForm(educationDto)
    getPrisonerContext(req.session, prisonNumber).highestLevelOfEducationForm = undefined

    const view = new HighestLevelOfEducationView(prisonerSummary, highestLevelOfEducationForm)
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
