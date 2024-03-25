import { NextFunction, Request, Response } from 'express'

/**
 *  Request handler function that removes any Induction related forms or DTOs on the session. This is useful in the case
 *  where the user has started updating the Induction in some way and has used either the Back link or browser Back
 *  button to essentially cancel the process.
 */
const removeInductionFormsFromSession = async (req: Request, res: Response, next: NextFunction) => {
  req.session.pageFlowQueue = undefined
  req.session.inductionDto = undefined
  req.session.hopingToWorkOnReleaseForm = undefined
  req.session.inPrisonWorkForm = undefined
  req.session.skillsForm = undefined
  req.session.personalInterestsForm = undefined
  req.session.workedBeforeForm = undefined
  req.session.previousWorkExperienceTypesForm = undefined
  req.session.previousWorkExperienceDetailForm = undefined
  req.session.affectAbilityToWorkForm = undefined
  req.session.reasonsNotToGetWorkForm = undefined
  req.session.workInterestTypesForm = undefined
  req.session.workInterestRolesForm = undefined
  req.session.inPrisonTrainingForm = undefined
  req.session.wantToAddQualificationsForm = undefined
  req.session.highestLevelOfEducationForm = undefined
  req.session.qualificationLevelForm = undefined
  req.session.qualificationDetailsForm = undefined
  req.session.additionalTrainingForm = undefined

  next()
}
export default removeInductionFormsFromSession
