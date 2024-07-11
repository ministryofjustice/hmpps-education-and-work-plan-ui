import { NextFunction, Request, Response, Router } from 'express'
import { Services } from '../services'
import { Page, PageViewEventDetails } from '../services/auditService'
import asyncMiddleware from './asyncMiddleware'
import logger from '../../logger'

const pageViewEventMap: Record<string, Page> = {
  '/': Page.PRISONER_LIST,
  '/prisoner/:prisonNumber/work-and-skills/in-prison-courses-and-qualifications':
    Page.IN_PRISON_COURSES_AND_QUALIFICATIONS,

  // Overview pages
  '/plan/:prisonNumber/view/overview': Page.OVERVIEW,
  '/plan/:prisonNumber/view/support-needs': Page.SUPPORT_NEEDS,
  '/plan/:prisonNumber/view/education-and-training': Page.EDUCATION_AND_TRAINING,
  '/plan/:prisonNumber/view/work-and-interests': Page.WORK_AND_INTERESTS,
  '/plan/:prisonNumber/view/timeline': Page.TIMELINE,

  // Create goals
  '/plan/:prisonNumber/goals/create': Page.CREATE_GOALS,

  // Update goals
  '/plan/:prisonNumber/goals/:goalReference/update': Page.UPDATE_GOALS,
  '/plan/:prisonNumber/goals/:goalReference/update/review': Page.UPDATE_GOALS_REVIEW,

  // Archive goals
  '/plan/:prisonNumber/goals/:goalReference/archive': Page.ARCHIVE_GOALS,
  '/plan/:prisonNumber/goals/:goalReference/archive/review': Page.ARCHIVE_GOALS_REVIEW,
  '/plan/:prisonNumber/goals/:goalReference/archive/cancel': Page.ARCHIVE_GOALS_CANCEL,

  // Un-archive goals
  '/plan/:prisonNumber/goals/:goalReference/unarchive': Page.UNARCHIVE_GOALS,

  // Functional skills
  '/plan/:prisonNumber/functional-skills': Page.FUNCTIONAL_SKILLS,

  // In prison course and qualifications
  '/plan/:prisonNumber/in-prison-courses-and-qualifications': Page.IN_PRISON_COURSES_AND_QUALIFICATIONS,

  // Notes
  '/plan/:prisonNumber/notes': Page.NOTES_LIST,

  // Create induction
  '/prisoners/:prisonNumber/create-induction/hoping-to-work-on-release':
    Page.INDUCTION_CREATE_HOPING_TO_WORK_ON_RELEASE,
  '/prisoners/:prisonNumber/create-induction/want-to-add-qualifications': Page.INDUCTION_CREATE_ADD_QUALIFICATION,
  '/prisoners/:prisonNumber/create-induction/qualifications': Page.INDUCTION_CREATE_QUALIFICATIONS,
  '/prisoners/:prisonNumber/create-induction/highest-level-of-education':
    Page.INDUCTION_CREATE_HIGHEST_LEVEL_OF_EDUCATION,
  '/prisoners/:prisonNumber/create-induction/qualification-level': Page.INDUCTION_CREATE_QUALIFICATION_LEVEL,
  '/prisoners/:prisonNumber/create-induction/additional-training': Page.INDUCTION_CREATE_ADDITIONAL_TRAINING,
  '/prisoners/:prisonNumber/create-induction/qualification-details': Page.INDUCTION_CREATE_QUALIFICATION_DETAILS,
  '/prisoners/:prisonNumber/create-induction/qualification-training': Page.INDUCTION_CREATE_ADDITIONAL_TRAINING,
  '/prisoners/:prisonNumber/create-induction/has-worked-before': Page.INDUCTION_CREATE_HAS_WORKED_BEFORE,
  '/prisoners/:prisonNumber/create-induction/previous-work-experience':
    Page.INDUCTION_CREATE_PREVIOUS_WORK_EXPERIENCE_TYPE,
  '/prisoners/:prisonNumber/create-induction/previous-work-experience/:typeOfWorkExperience':
    Page.INDUCTION_CREATE_PREVIOUS_WORK_EXPERIENCE_DETAILS,
  '/prisoners/:prisonNumber/create-induction/work-interest-types': Page.INDUCTION_CREATE_WORK_INTEREST_TYPES,
  '/prisoners/:prisonNumber/create-induction/work-interest-roles': Page.INDUCTION_CREATE_WORK_INTEREST_ROLES,
  '/prisoners/:prisonNumber/create-induction/skills': Page.INDUCTION_CREATE_SKILLS,
  '/prisoners/:prisonNumber/create-induction/personal-interests': Page.INDUCTION_CREATE_PERSONAL_INTERESTS,
  '/prisoners/:prisonNumber/create-induction/affect-ability-to-work': Page.INDUCTION_CREATE_AFFECT_ABILITY_TO_WORK,
  '/prisoners/:prisonNumber/create-induction/reasons-not-to-get-work': Page.INDUCTION_CREATE_REASONS_NOT_TO_GET_WORK,
  '/prisoners/:prisonNumber/create-induction/in-prison-work': Page.INDUCTION_CREATE_IN_PRISON_WORK,
  '/prisoners/:prisonNumber/create-induction/in-prison-training': Page.INDUCTION_CREATE_IN_PRISON_TRAINING,
  '/prisoners/:prisonNumber/create-induction/check-your-answers': Page.INDUCTION_CREATE_CHECK_YOUR_ANSWERS,

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

  // Non audit routes. These routes do not raise an audit event
  '/plan/:prisonNumber/induction-created': null,
}

export default function auditMiddleware({ auditService }: Services) {
  const auditPageView = (page: Page) =>
    asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
      res.locals.auditPageViewEvent = page

      if (!page) return next()

      const auditDetails: PageViewEventDetails = {
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

      await auditService.logPageViewAttempt(page, auditDetails)

      res.prependOnceListener('finish', () => {
        if (res.statusCode === 200) {
          auditService.logPageView(page, auditDetails)
        }
      })

      return next()
    })

  const router = Router()

  Object.entries(pageViewEventMap).forEach(([route, pageViewEvent]) => router.get(route, auditPageView(pageViewEvent)))

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
