import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { EducationDto } from 'dto'
import type { QualificationDetailsForm } from 'forms'
import getDynamicBackLinkAriaText from '../dynamicAriaTextResolver'
import validateQualificationDetailsForm from '../validators/induction/qualificationDetailsFormValidator'
import QualificationDetailsView from './qualificationDetailsView'
import getPrisonerContext from '../../data/session/prisonerContexts'
import QualificationLevelValue from '../../enums/qualificationLevelValue'

export default class QualificationDetailsController {
  getQualificationDetailsView: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { prisonerSummary } = req.session
    const { prisonNumber } = req.params

    const { qualificationLevelForm } = getPrisonerContext(req.session, prisonNumber)
    if (!qualificationLevelForm) {
      // Guard against the user using the back button to return to this page, which can cause a NPE creating the QualificationDetailsView below (depending on which pages they've been to)
      return res.redirect(`/prisoners/${prisonNumber}/qualification-level`)
    }

    const qualificationDetailsForm = getPrisonerContext(req.session, prisonNumber).qualificationDetailsForm || {
      qualificationSubject: '',
      qualificationGrade: '',
    }
    getPrisonerContext(req.session, prisonNumber).qualificationDetailsForm = undefined

    const view = new QualificationDetailsView(
      prisonerSummary,
      this.getBackLinkUrl(req),
      this.getBackLinkAriaText(req),
      qualificationDetailsForm,
      qualificationLevelForm.qualificationLevel,
    )
    return res.render('pages/prePrisonEducation/qualificationDetails', { ...view.renderArgs })
  }

  submitQualificationDetailsForm: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { prisonNumber } = req.params
    const { prisonerSummary } = req.session

    const { educationDto, qualificationLevelForm } = getPrisonerContext(req.session, prisonNumber)
    const qualificationDetailsForm = { ...req.body }
    getPrisonerContext(req.session, prisonNumber).qualificationDetailsForm = qualificationDetailsForm

    const errors = validateQualificationDetailsForm(
      qualificationDetailsForm,
      qualificationLevelForm.qualificationLevel,
      prisonerSummary,
    )
    if (errors.length > 0) {
      return res.redirectWithErrors(`/prisoners/${prisonNumber}/qualification-details`, errors)
    }

    const updatedInduction = this.addQualificationToEducationDto(
      educationDto,
      qualificationDetailsForm,
      qualificationLevelForm.qualificationLevel,
    )
    getPrisonerContext(req.session, prisonNumber).educationDto = updatedInduction

    getPrisonerContext(req.session, prisonNumber).qualificationDetailsForm = undefined
    getPrisonerContext(req.session, prisonNumber).qualificationLevelForm = undefined

    return res.redirect(`/prisoners/${prisonNumber}/qualifications`)
  }

  private getBackLinkUrl(req: Request): string {
    const { prisonNumber } = req.params
    return `/prisoners/${prisonNumber}/qualification-level`
  }

  private getBackLinkAriaText(req: Request): string {
    return getDynamicBackLinkAriaText(req, this.getBackLinkUrl(req))
  }

  private addQualificationToEducationDto(
    educationDto: EducationDto,
    qualificationDetailsForm: QualificationDetailsForm,
    qualificationLevel: QualificationLevelValue,
  ): EducationDto {
    const qualifications = [...educationDto.qualifications]
    qualifications.push({
      subject: qualificationDetailsForm.qualificationSubject,
      level: qualificationLevel,
      grade: qualificationDetailsForm.qualificationGrade,
    })
    return {
      ...educationDto,
      qualifications,
    }
  }
}
