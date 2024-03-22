import createError from 'http-errors'
import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { InPrisonCourseRecords } from 'viewModels'
import logger from '../../logger'
import PrisonerSearchService from '../services/prisonerSearchService'
import { CuriousService, InductionService } from '../services'
import { setCurrentPageIndex } from './pageFlowQueue'

/**
 * A module exporting request handler functions to support ensuring page requests have been followed
 * in the correct sequence - IE. pages are not being called out of sequence.
 */

/**
 * Request handler function to check the CreateGoalForm exists in the session for the prisoner referenced in the
 * request URL.
 * In the case of an 'edit mode' request, the handler function gets the relevant new goal from the array of new goals held
 * in session first.
 */
const checkCreateGoalFormExistsInSession = async (req: Request, res: Response, next: NextFunction) => {
  if (isEditMode(req)) {
    // If the request is an edit mode request we need to get the relevant newGoal object from the newGoals array
    const { goalIndex } = req.params
    req.session.newGoal = req.session.newGoals[parseInt(goalIndex, 10) - 1]
  }

  if (!req.session.newGoal?.createGoalForm) {
    logger.warn(
      `No CreateGoalForm object in session - user attempting to navigate to path ${req.path} out of sequence. Redirecting to start of Create Goal journey.`,
    )
    res.redirect(`/plan/${req.params.prisonNumber}/goals/1/create`)
  } else if (req.session.newGoal.createGoalForm.prisonNumber !== req.params.prisonNumber) {
    logger.warn(
      'CreateGoalForm object in session references a different prisoner. Redirecting to start of Create Goal journey.',
    )
    req.session.newGoal.createGoalForm = undefined
    res.redirect(`/plan/${req.params.prisonNumber}/goals/1/create`)
  } else {
    next()
  }
}

/**
 * Request handler function to check the AddStepForms array exists in the session and whether there is at least 1
 * Add Step Form within it.
 */
const checkAddStepFormsArrayExistsInSession = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.newGoal?.addStepForms) {
    logger.warn(
      `No AddStepForms object in session - user attempting to navigate to path ${req.path} out of sequence. Redirecting to start of Create Goal journey.`,
    )
    res.redirect(`/plan/${req.params.prisonNumber}/goals/1/create`)
  } else if (req.session.newGoal.addStepForms.length < 1) {
    logger.warn('AddStepForms object in session is empty. Redirecting to Add Step page.')
    res.redirect(`/plan/${req.params.prisonNumber}/goals/1/add-step/1`)
  } else {
    next()
  }
}

/**
 * Request handler function to check the PrisonerSummary exists in the session for the prisoner referenced in the
 * request URL.
 */
const checkPrisonerSummaryExistsInSession = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.prisonerSummary) {
    logger.warn(
      `No PrisonerSummary object in session - user attempting to navigate to path ${req.path} out of sequence. Redirecting to prisoner Overview page.`,
    )
    res.redirect(`/plan/${req.params.prisonNumber}/view/overview`)
  } else if (req.session.prisonerSummary.prisonNumber !== req.params.prisonNumber) {
    logger.warn(
      'PrisonerSummary object in session references a different prisoner. Redirecting to prisoner Overview page.',
    )
    req.session.prisonerSummary = undefined
    res.redirect(`/plan/${req.params.prisonNumber}/view/overview`)
  } else {
    next()
  }
}

/**
 * Request handler function to check the UpdateGoalForm exists in the session for the prisoner referenced in the
 * request URL.
 */
const checkUpdateGoalFormExistsInSession = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.updateGoalForm) {
    logger.warn(
      `No UpdateGoalForm object in session - user attempting to navigate to path ${req.path} out of sequence. Redirecting to Overview page.`,
    )
    res.redirect(`/plan/${req.params.prisonNumber}/view/overview`)
  } else {
    next()
  }
}

/**
 * Request handler function to check the NewGoal array exists in the session and contains at least 1 element, where each
 * element contains an AddNoteForm (if a given element does not contain an AddNoteForm it means the pages are being navigated
 * out of sequence)
 */
const checkNewGoalsFormExistsInSession = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.newGoals) {
    logger.warn(
      `No NewGoal objects in session - user attempting to navigate to path ${req.path} out of sequence. Redirecting to start of Create Goal journey.`,
    )
    res.redirect(`/plan/${req.params.prisonNumber}/goals/1/create`)
  } else if (req.session.newGoals.length < 1) {
    logger.warn('NewGoal array in session is empty. Redirecting to Add Note page.')
    res.redirect(`/plan/${req.params.prisonNumber}/goals/1/add-note`)
  } else if (req.session.newGoals.some(newGoal => newGoal.addNoteForm === undefined || newGoal.addNoteForm === null)) {
    logger.warn(
      `At least 1 NewGoal has no AddNoteForm object - user attempting to navigate to path ${req.path} out of sequence. Redirecting to Add Note page.`,
    )
    res.redirect(`/plan/${req.params.prisonNumber}/goals/1/add-note`)
  } else {
    next()
  }
}

/**
 *  Middleware function that returns a Request handler function to look up the prisoner from prisoner-search, map to a PrisonerSummary, and store in the session
 */
const retrievePrisonerSummaryIfNotInSession = (prisonerSearchService: PrisonerSearchService): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { prisonNumber } = req.params

    try {
      // Lookup the prisoner and store in the session if its either not there, or is for a different prisoner
      if (!req.session.prisonerSummary || req.session.prisonerSummary.prisonNumber !== prisonNumber) {
        req.session.prisonerSummary = await prisonerSearchService.getPrisonerByPrisonNumber(
          prisonNumber,
          req.user.username,
        )
      }
      next()
    } catch (error) {
      next(createError(error.status, `Prisoner ${prisonNumber} not returned by the Prisoner Search Service API`))
    }
  }
}

/**
 *  Middleware function that returns a Request handler function to retrieve the Induction from InductionService, map to a PrisonerSummary, and store in the session
 */
const retrieveInductionIfNotInSession = (inductionService: InductionService): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { prisonNumber } = req.params

    try {
      // Retrieve the Induction and store in the session if its either not there, or is for a different prisoner
      if (!req.session.inductionDto || req.session.inductionDto.prisonNumber !== prisonNumber) {
        req.session.inductionDto = await inductionService.getInduction(prisonNumber, req.user.token)
      }
      next()
    } catch (error) {
      next(createError(error.status, `Induction for prisoner ${prisonNumber} not returned by the Induction Service`))
    }
  }
}

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

/**
 * Request handler function that sets the current page in the [PageFlowQueue] if this page request is part of a page
 * flow (designated by the presence of a [PageFlowQueue] on the session)
 */
const setCurrentPageInPageFlowQueue = async (req: Request, res: Response, next: NextFunction) => {
  const { pageFlowQueue } = req.session
  if (pageFlowQueue) {
    req.session.pageFlowQueue = setCurrentPageIndex(pageFlowQueue, req.path)
  }
  next()
}

/**
 *  Middleware function that returns a Request handler function to look up the prisoner's functional skills from Curious and store in the session
 */
const retrieveFunctionalSkillsIfNotInSession = (curiousService: CuriousService): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { prisonNumber } = req.params

    // Lookup the prisoners functional skills and store in the session if its either not there, or is for a different prisoner
    if (
      !req.session.prisonerFunctionalSkills ||
      req.session.prisonerFunctionalSkills.prisonNumber !== prisonNumber ||
      req.session.prisonerFunctionalSkills.problemRetrievingData === true
    ) {
      req.session.prisonerFunctionalSkills = await curiousService.getPrisonerFunctionalSkills(
        prisonNumber,
        req.user.username,
      )
    }
    next()
  }
}

/**
 *  Middleware function that returns a Request handler function to look up the prisoner's In Prison Courses from Curious
 */
const retrieveCuriousInPrisonCourses = (curiousService: CuriousService): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { prisonNumber } = req.params

    // Lookup the prisoners In Prison Courses and store in res.locals if its either not there, or is for a different prisoner
    const curiousInPrisonCourses = res.locals.curiousInPrisonCourses as InPrisonCourseRecords
    if (
      !curiousInPrisonCourses ||
      curiousInPrisonCourses.prisonNumber !== prisonNumber ||
      curiousInPrisonCourses.problemRetrievingData === true
    ) {
      res.locals.curiousInPrisonCourses = await curiousService.getPrisonerInPrisonCourses(
        prisonNumber,
        req.user.username,
      )
    }
    next()
  }
}

export {
  checkCreateGoalFormExistsInSession,
  checkAddStepFormsArrayExistsInSession,
  checkPrisonerSummaryExistsInSession,
  checkUpdateGoalFormExistsInSession,
  checkNewGoalsFormExistsInSession,
  retrievePrisonerSummaryIfNotInSession,
  retrieveInductionIfNotInSession,
  removeInductionFormsFromSession,
  setCurrentPageInPageFlowQueue,
  retrieveFunctionalSkillsIfNotInSession,
  retrieveCuriousInPrisonCourses,
}

const isEditMode = (req: Request): boolean => req.query?.mode === 'edit'
