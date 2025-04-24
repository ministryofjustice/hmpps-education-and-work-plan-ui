import { NextFunction, Request, Response, Router } from 'express'
import { Services } from '../services'
import { Page, BaseAuditData } from '../services/auditService'
import asyncMiddleware from './asyncMiddleware'
import logger from '../../logger'
import ApplicationAction from '../enums/applicationAction'

const pageViewEventMap: Record<string, Page> = {
  '/sessions': Page.SESSION_SUMMARIES,
  '/sessions/due': Page.DUE_SESSIONS_LIST,
  '/sessions/overdue': Page.OVERDUE_SESSIONS_LIST,
  '/sessions/on-hold': Page.ONHOLD_SESSIONS_LIST,
  '/search': Page.PRISONER_LIST,
  '/prisoner/:prisonNumber/work-and-skills/in-prison-courses-and-qualifications':
    Page.IN_PRISON_COURSES_AND_QUALIFICATIONS,

  // Overview pages
  '/plan/:prisonNumber/view/overview': Page.OVERVIEW,
  '/plan/:prisonNumber/view/support-needs': Page.SUPPORT_NEEDS,
  '/plan/:prisonNumber/view/education-and-training': Page.EDUCATION_AND_TRAINING,
  '/plan/:prisonNumber/view/work-and-interests': Page.WORK_AND_INTERESTS,
  '/plan/:prisonNumber/view/history': Page.HISTORY,
  '/plan/:prisonNumber/view/archived-goals': Page.VIEW_ARCHIVED_GOALS,
  '/plan/:prisonNumber/view/goals': Page.VIEW_GOALS,

  // Review journey pages
  '/plan/:prisonNumber/review': Page.REVIEW_PLAN,
  '/plan/:prisonNumber/review/notes': Page.REVIEW_PLAN_NOTES,
  '/plan/:prisonNumber/review/check-your-answers': Page.REVIEW_PLAN_CHECK_YOUR_ANSWERS,
  '/plan/:prisonNumber/review/complete': Page.REVIEW_PLAN_COMPLETE,
  '/plan/:prisonNumber/review/exemption': Page.REVIEW_PLAN_EXEMPTION,
  '/plan/:prisonNumber/review/exemption/confirm': Page.REVIEW_PLAN_EXEMPTION_CONFIRM,
  '/plan/:prisonNumber/review/exemption/recorded': Page.REVIEW_PLAN_EXEMPTION_RECORDED,
  '/plan/:prisonNumber/review/exemption/remove': Page.REVIEW_PLAN_EXEMPTION_REMOVAL_CONFIRM,
  '/plan/:prisonNumber/review/exemption/removed': Page.REVIEW_PLAN_EXEMPTION_REMOVED,

  // Create goals
  '/plan/:prisonNumber/goals/create': Page.CREATE_GOALS,

  // Update goals
  '/plan/:prisonNumber/goals/:goalReference/update': Page.UPDATE_GOALS,
  '/plan/:prisonNumber/goals/:goalReference/update/review': Page.UPDATE_GOALS_REVIEW,

  // Archive goals
  '/plan/:prisonNumber/goals/:goalReference/archive': Page.ARCHIVE_GOALS,
  '/plan/:prisonNumber/goals/:goalReference/archive/review': Page.ARCHIVE_GOALS_REVIEW,
  '/plan/:prisonNumber/goals/:goalReference/archive/cancel': Page.ARCHIVE_GOALS_CANCEL,
  '/plan/:prisonNumber/goals/:goalReference/complete': Page.COMPLETE_GOALS,
  '/plan/:prisonNumber/goals/:goalReference/complete-or-archive': Page.COMPLETE_OR_ARCHIVE_GOALS,

  // Un-archive goals
  '/plan/:prisonNumber/goals/:goalReference/unarchive': Page.UNARCHIVE_GOALS,

  // Functional skills
  '/plan/:prisonNumber/functional-skills': Page.FUNCTIONAL_SKILLS,

  // In prison course and qualifications
  '/plan/:prisonNumber/in-prison-courses-and-qualifications': Page.IN_PRISON_COURSES_AND_QUALIFICATIONS,

  // Create induction
  '/prisoners/:prisonNumber/create-induction/hoping-to-work-on-release': null, // route without the journeyId does not raise an audit event because it redirects to the route with a journeyId
  '/prisoners/:prisonNumber/create-induction/:journeyId/hoping-to-work-on-release':
    Page.INDUCTION_CREATE_HOPING_TO_WORK_ON_RELEASE,
  '/prisoners/:prisonNumber/create-induction/:journeyId/want-to-add-qualifications':
    Page.INDUCTION_CREATE_ADD_QUALIFICATION,
  '/prisoners/:prisonNumber/create-induction/:journeyId/qualifications': Page.INDUCTION_CREATE_QUALIFICATIONS,
  '/prisoners/:prisonNumber/create-induction/:journeyId/highest-level-of-education':
    Page.INDUCTION_CREATE_HIGHEST_LEVEL_OF_EDUCATION,
  '/prisoners/:prisonNumber/create-induction/:journeyId/qualification-level': Page.INDUCTION_CREATE_QUALIFICATION_LEVEL,
  '/prisoners/:prisonNumber/create-induction/:journeyId/additional-training': Page.INDUCTION_CREATE_ADDITIONAL_TRAINING,
  '/prisoners/:prisonNumber/create-induction/:journeyId/qualification-details':
    Page.INDUCTION_CREATE_QUALIFICATION_DETAILS,
  '/prisoners/:prisonNumber/create-induction/:journeyId/has-worked-before': Page.INDUCTION_CREATE_HAS_WORKED_BEFORE,
  '/prisoners/:prisonNumber/create-induction/:journeyId/previous-work-experience':
    Page.INDUCTION_CREATE_PREVIOUS_WORK_EXPERIENCE_TYPE,
  '/prisoners/:prisonNumber/create-induction/:journeyId/previous-work-experience/:typeOfWorkExperience':
    Page.INDUCTION_CREATE_PREVIOUS_WORK_EXPERIENCE_DETAILS,
  '/prisoners/:prisonNumber/create-induction/:journeyId/work-interest-types': Page.INDUCTION_CREATE_WORK_INTEREST_TYPES,
  '/prisoners/:prisonNumber/create-induction/:journeyId/work-interest-roles': Page.INDUCTION_CREATE_WORK_INTEREST_ROLES,
  '/prisoners/:prisonNumber/create-induction/:journeyId/skills': Page.INDUCTION_CREATE_SKILLS,
  '/prisoners/:prisonNumber/create-induction/:journeyId/personal-interests': Page.INDUCTION_CREATE_PERSONAL_INTERESTS,
  '/prisoners/:prisonNumber/create-induction/:journeyId/affect-ability-to-work':
    Page.INDUCTION_CREATE_AFFECT_ABILITY_TO_WORK,
  '/prisoners/:prisonNumber/create-induction/:journeyId/reasons-not-to-get-work':
    Page.INDUCTION_CREATE_REASONS_NOT_TO_GET_WORK,
  '/prisoners/:prisonNumber/create-induction/:journeyId/in-prison-work': Page.INDUCTION_CREATE_IN_PRISON_WORK,
  '/prisoners/:prisonNumber/create-induction/:journeyId/in-prison-training': Page.INDUCTION_CREATE_IN_PRISON_TRAINING,
  '/prisoners/:prisonNumber/create-induction/:journeyId/who-completed-induction':
    Page.INDUCTION_CREATE_WHO_COMPLETED_INDUCTION,
  '/prisoners/:prisonNumber/create-induction/:journeyId/notes': Page.INDUCTION_CREATE_NOTES,
  '/prisoners/:prisonNumber/create-induction/:journeyId/check-your-answers': Page.INDUCTION_CREATE_CHECK_YOUR_ANSWERS,

  // Update induction
  '/prisoners/:prisonNumber/induction/in-prison-training': Page.INDUCTION_UPDATE_IN_PRISON_TRAINING,
  '/prisoners/:prisonNumber/induction/personal-interests': Page.INDUCTION_UPDATE_PERSONAL_INTERESTS,
  '/prisoners/:prisonNumber/induction/skills': Page.INDUCTION_UPDATE_SKILLS,
  '/prisoners/:prisonNumber/induction/has-worked-before': Page.INDUCTION_UPDATE_HAS_WORKED_BEFORE,
  '/prisoners/:prisonNumber/induction/previous-work-experience': Page.INDUCTION_UPDATE_PREVIOUS_WORK_EXPERIENCE_TYPE,
  '/prisoners/:prisonNumber/induction/previous-work-experience/:typeOfWorkExperience':
    Page.INDUCTION_UPDATE_PREVIOUS_WORK_EXPERIENCE_DETAILS,
  '/prisoners/:prisonNumber/induction/hoping-to-work-on-release': Page.INDUCTION_UPDATE_HOPING_TO_WORK_ON_RELEASE,
  '/prisoners/:prisonNumber/induction/affect-ability-to-work': Page.INDUCTION_UPDATE_AFFECT_ABILITY_TO_WORK,
  '/prisoners/:prisonNumber/induction/reasons-not-to-get-work': Page.INDUCTION_UPDATE_REASONS_NOT_TO_GET_WORK,
  '/prisoners/:prisonNumber/induction/work-interest-types': Page.INDUCTION_UPDATE_WORK_INTEREST_TYPES,
  '/prisoners/:prisonNumber/induction/work-interest-roles': Page.INDUCTION_UPDATE_WORK_INTEREST_ROLES,
  '/prisoners/:prisonNumber/induction/in-prison-work': Page.INDUCTION_UPDATE_IN_PRISON_WORK,
  '/prisoners/:prisonNumber/induction/qualifications': Page.INDUCTION_UPDATE_QUALIFICATIONS,
  '/prisoners/:prisonNumber/induction/want-to-add-qualifications': Page.INDUCTION_UPDATE_ADD_QUALIFICATION,
  '/prisoners/:prisonNumber/induction/highest-level-of-education': Page.INDUCTION_UPDATE_HIGHEST_LEVEL_OF_EDUCATION,
  '/prisoners/:prisonNumber/induction/qualification-level': Page.INDUCTION_UPDATE_QUALIFICATION_LEVEL,
  '/prisoners/:prisonNumber/induction/qualification-details': Page.INDUCTION_UPDATE_QUALIFICATION_DETAILS,
  '/prisoners/:prisonNumber/induction/additional-training': Page.INDUCTION_UPDATE_ADDITIONAL_TRAINING,
  '/prisoners/:prisonNumber/induction/check-your-answers': Page.INDUCTION_UPDATE_CHECK_YOUR_ANSWERS,

  // Exempt induction
  '/prisoners/:prisonNumber/induction/exemption': null, // route without the journeyId does not raise an audit event because it redirects to the route with a journeyId
  '/prisoners/:prisonNumber/induction/:journeyId/exemption': Page.INDUCTION_EXEMPTION,
  '/prisoners/:prisonNumber/induction/:journeyId/exemption/confirm': Page.INDUCTION_EXEMPTION_CONFIRM,
  '/prisoners/:prisonNumber/induction/:journeyId/exemption/recorded': Page.INDUCTION_EXEMPTION_RECORDED,
  '/prisoners/:prisonNumber/induction/exemption/remove': null, // route without the journeyId does not raise an audit event because it redirects to the route with a journeyId
  '/prisoners/:prisonNumber/induction/:journeyId/exemption/remove': Page.INDUCTION_EXEMPTION_REMOVAL_CONFIRM,
  '/prisoners/:prisonNumber/induction/:journeyId/exemption/removed': Page.INDUCTION_EXEMPTION_REMOVED,

  // Create qualifications (before an Induction)
  '/prisoners/:prisonNumber/create-education/highest-level-of-education': Page.CREATE_HIGHEST_LEVEL_OF_EDUCATION,
  '/prisoners/:prisonNumber/create-education/qualification-level': Page.CREATE_QUALIFICATION_LEVEL,
  '/prisoners/:prisonNumber/create-education/qualification-details': Page.CREATE_QUALIFICATION_DETAILS,
  '/prisoners/:prisonNumber/create-education/qualifications': Page.CREATE_QUALIFICATIONS,

  // Update qualifications
  '/prisoners/:prisonNumber/education/highest-level-of-education': Page.UPDATE_HIGHEST_LEVEL_OF_EDUCATION,
  '/prisoners/:prisonNumber/education/qualifications': Page.UPDATE_QUALIFICATIONS,
  '/prisoners/:prisonNumber/education/qualification-level': Page.UPDATE_QUALIFICATION_LEVEL,
  '/prisoners/:prisonNumber/education/qualification-details': Page.UPDATE_QUALIFICATION_DETAILS,

  // Non audit routes. These routes do not raise an audit event
  '/': null,
  '/plan/:prisonNumber/induction-created': null,
  '/prisoners/:prisonNumber/education/add-qualifications': null,
}

export default function auditMiddleware({ auditService }: Services) {
  const auditPageView = (route: string) =>
    asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
      let page: Page
      if (route === '/') {
        // If the route is for '/' we need to work out which page would have been served based on the user's role
        page = res.locals.userHasPermissionTo(ApplicationAction.VIEW_SESSION_SUMMARIES)
          ? Page.SESSION_SUMMARIES
          : Page.PRISONER_LIST
      } else {
        // else use the PageViewEvent from the configured event map
        ;[, page] = Object.entries(pageViewEventMap).find(([url, _pageViewEvent]) => url === route)
      }

      res.locals.auditPageViewEvent = page

      if (!page) return next()

      const auditDetails: BaseAuditData = {
        who: req.user?.username ?? 'UNKNOWN',
        correlationId: req.id,
        details: {
          params: req.params,
          query: req.query,
        },
      }

      if (req.params.prisonNumber) {
        auditDetails.subjectType = 'PRISONER_ID'
        auditDetails.subjectId = req.params.prisonNumber
      }

      auditService.logPageViewAttempt(page, auditDetails) // no need to wait for response

      res.prependOnceListener('finish', () => {
        if (res.statusCode === 200) {
          auditService.logPageView(page, auditDetails)
        }
      })

      return next()
    })

  const router = Router()

  Object.keys(pageViewEventMap).forEach(route => router.get(route, auditPageView(route)))

  return router
}

// Checks page view has been auditted, if no audit event has been raised router will be skipped
export function checkPageViewAuditted(router: Router) {
  router.get('*', (req: Request, res: Response, next: NextFunction) => {
    if (res.locals.auditPageViewEvent || res.locals.auditPageViewEvent === null) return next()
    logger.error(`No audit event found for route, "${req.path}". Skipping router.`)
    return next('router')
  })
}
