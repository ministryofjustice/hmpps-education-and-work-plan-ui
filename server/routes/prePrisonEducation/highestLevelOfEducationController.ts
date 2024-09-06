import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { EducationDto } from 'dto'
import type { HighestLevelOfEducationForm } from 'forms'
import HighestLevelOfEducationView from './highestLevelOfEducationView'
import getDynamicBackLinkAriaText from '../dynamicAriaTextResolver'
import getPrisonerContext from '../../data/session/prisonerContexts'
import validateHighestLevelOfEducationForm from '../validators/induction/highestLevelOfEducationFormValidator'

export default class HighestLevelOfEducationController {
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

  submitHighestLevelOfEducationForm: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { prisonNumber } = req.params
    const { prisonerSummary } = req.session

    const highestLevelOfEducationForm = { ...req.body }

    const errors = validateHighestLevelOfEducationForm(highestLevelOfEducationForm, prisonerSummary)
    if (errors.length > 0) {
      getPrisonerContext(req.session, prisonNumber).highestLevelOfEducationForm = highestLevelOfEducationForm
      return res.redirectWithErrors(`/prisoners/${prisonNumber}/highest-level-of-education`, errors)
    }

    const { educationDto } = getPrisonerContext(req.session, prisonNumber)
    const updatedEducationDto = this.updatedEducationDtoWithHighestLevelOfEducation(
      educationDto,
      highestLevelOfEducationForm,
    )
    getPrisonerContext(req.session, prisonNumber).educationDto = updatedEducationDto

    return res.redirect(`/prisoners/${prisonNumber}/qualification-level`)
  }

  private getBackLinkUrl = (req: Request): string => {
    const { prisonNumber } = req.params
    return `/plan/${prisonNumber}/view/education-and-training`
  }

  private getBackLinkAriaText = (req: Request): string => {
    return getDynamicBackLinkAriaText(req, this.getBackLinkUrl(req))
  }

  private toHighestLevelOfEducationForm = (educationDto: EducationDto): HighestLevelOfEducationForm => {
    return {
      educationLevel: educationDto.educationLevel,
    }
  }

  private updatedEducationDtoWithHighestLevelOfEducation = (
    educationDto: EducationDto,
    highestLevelOfEducationForm: HighestLevelOfEducationForm,
  ) => {
    return {
      ...educationDto,
      educationLevel: highestLevelOfEducationForm.educationLevel,
    }
  }
}
