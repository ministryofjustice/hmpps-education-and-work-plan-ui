import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { EducationDto } from 'dto'
import type { HighestLevelOfEducationForm } from 'forms'
import HighestLevelOfEducationView from './highestLevelOfEducationView'

/**
 * Abstract controller class defining functionality common to both the Create and Update journeys.
 */
export default abstract class HighestLevelOfEducationController {
  getHighestLevelOfEducationView: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { prisonerSummary, invalidForm } = res.locals

    const { educationDto } = req.journeyData
    const highestLevelOfEducationForm = invalidForm || this.toHighestLevelOfEducationForm(educationDto)

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
