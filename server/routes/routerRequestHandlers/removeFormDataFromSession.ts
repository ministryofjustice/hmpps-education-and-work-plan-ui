import { NextFunction, Request, Response } from 'express'
import { clearPrisonerContext } from '../../data/session/prisonerContexts'

/**
 *  Request handler function that removes all form and DTO related data the session and/or prisoner context.
 *  This is useful in cases such as the user has started a user journey (eg: updating the Induction) and has used either
 *  the Back link or browser Back button to essentially cancel the process.
 */
const removeFormDataFromSession = async (req: Request, res: Response, next: NextFunction) => {
  const { session } = req
  const { prisonNumber } = req.params

  clearPrisonerContext(session, prisonNumber)

  session.pageFlowQueue = undefined
  session.pageFlowHistory = undefined
  session.inPrisonWorkForm = undefined
  session.personalInterestsForm = undefined
  session.workedBeforeForm = undefined
  session.previousWorkExperienceTypesForm = undefined
  session.previousWorkExperienceDetailForm = undefined
  session.affectAbilityToWorkForm = undefined
  session.workInterestTypesForm = undefined
  session.inPrisonTrainingForm = undefined
  session.wantToAddQualificationsForm = undefined
  session.highestLevelOfEducationForm = undefined
  session.qualificationLevelForm = undefined
  session.qualificationDetailsForm = undefined
  session.additionalTrainingForm = undefined

  next()
}
export default removeFormDataFromSession
