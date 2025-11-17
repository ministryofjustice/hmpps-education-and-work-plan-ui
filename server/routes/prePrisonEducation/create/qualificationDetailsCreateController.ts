import { NextFunction, Request, RequestHandler, Response } from 'express'
import QualificationDetailsController from '../common/qualificationDetailsController'
import { getPrisonerContext } from '../../../data/session/prisonerContexts'

export default class QualificationDetailsCreateController extends QualificationDetailsController {
  journeyPathElement = 'create-education'

  submitQualificationDetailsForm: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { prisonNumber, journeyId } = req.params

    const { educationDto } = req.journeyData
    const { qualificationLevelForm } = getPrisonerContext(req.session, prisonNumber)
    const qualificationDetailsForm = { ...req.body }

    const updatedEducation = this.addQualificationToEducationDto(
      educationDto,
      qualificationDetailsForm,
      qualificationLevelForm.qualificationLevel,
    )
    req.journeyData.educationDto = updatedEducation

    getPrisonerContext(req.session, prisonNumber).qualificationLevelForm = undefined

    return res.redirect(`/prisoners/${prisonNumber}/create-education/${journeyId}/qualifications`)
  }
}
