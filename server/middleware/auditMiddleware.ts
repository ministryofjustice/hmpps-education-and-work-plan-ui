import { NextFunction, Request, Response, Router } from 'express'
import { Services } from '../services'
import { Page, PageViewEventDetails } from '../services/auditService'
import asyncMiddleware from './asyncMiddleware'

const pageViewEventMap: Record<string, Page> = {
  '/': Page.PRISONER_LIST,
  '/plan/:prisonNumber/view/overview': Page.OVERVIEW,
  '/plan/:prisonNumber/view/support-needs': Page.SUPPORT_NEEDS,
  '/plan/:prisonNumber/view/education-and-training': Page.EDUCATION_AND_TRAINING,
  '/plan/:prisonNumber/view/work-and-interests': Page.WORK_AND_INTERESTS,
  '/plan/:prisonNumber/view/timeline': Page.TIMELINE,
  '/plan/:prisonNumber/functional-skills': Page.FUNCTIONAL_SKILLS,
  '/plan/:prisonNumber/goals/create': Page.CREATE_GOALS,
  '/plan/:prisonNumber/goals/:goalIndex/add-step/:stepIndex': Page.CREATE_GOAL_ADD_STEP,
  '/plan/:prisonNumber/goals/:goalIndex/add-note': Page.CREATE_GOAL_ADD_NOTE,
  '/plan/:prisonNumber/goals/:goalIndex/create': Page.CREATE_GOAL,
  '/plan/:prisonNumber/goals/review': Page.CREATE_GOALS_REVIEW,
  '/plan/:prisonNumber/goals/:goalReference/update': Page.UPDATE_GOALS,
  '/plan/:prisonNumber/goals/:goalReference/update/review': Page.UPDATE_GOALS_REVIEW,
  '/plan/:prisonNumber/in-prison-courses-and-qualifications': Page.IN_PRISON_COURSES_AND_QUALIFICATIONS,
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
}

export default function auditMiddleware({ auditService }: Services): Router {
  const auditPageView = (page: Page) =>
    asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
      const auditDetails: PageViewEventDetails = {
        who: req.user.username ?? 'UNKNOWN',
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

      next()
    })

  const router = Router()

  Object.entries(pageViewEventMap).forEach(([route, pageViewEvent]) => router.get(route, auditPageView(pageViewEvent)))

  return router
}
