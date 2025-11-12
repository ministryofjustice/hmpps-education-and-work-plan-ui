import { NextFunction, Request, RequestHandler, Response } from 'express'
import QualificationDetailsController from '../common/qualificationDetailsController'
import { getPrisonerContext } from '../../../data/session/prisonerContexts'

export default class QualificationDetailsUpdateController extends QualificationDetailsController {
  journeyPathElement = 'education'

  submitQualificationDetailsForm: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { prisonNumber, journeyId } = req.params

    const { educationDto } = req.journeyData
    const { qualificationLevelForm } = getPrisonerContext(req.session, prisonNumber)
    const qualificationDetailsForm = { ...req.body }
    getPrisonerContext(req.session, prisonNumber).qualificationDetailsForm = qualificationDetailsForm

    const updatedEducation = this.addQualificationToEducationDto(
      educationDto,
      qualificationDetailsForm,
      qualificationLevelForm.qualificationLevel,
    )
    req.journeyData.educationDto = updatedEducation

    getPrisonerContext(req.session, prisonNumber).qualificationDetailsForm = undefined
    getPrisonerContext(req.session, prisonNumber).qualificationLevelForm = undefined

    return res.redirect(`/prisoners/${prisonNumber}/education/${journeyId}/qualifications`)
  }
}
