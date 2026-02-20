import type { PageFlow, PrisonerSummary } from 'viewModels'
import type { ArchiveGoalForm, CreateGoalsForm, UpdateGoalForm } from 'forms'
import type { EducationDto, ReviewPlanDto, ReviewExemptionDto, CreateEmployabilitySkillDto } from 'dto'
import type { InductionDto, InductionExemptionDto } from 'inductionDto'
import QualificationLevelValue from '../../enums/qualificationLevelValue'
import { HmppsUser } from '../../interfaces/hmppsUser'

export default {}

declare module 'express-session' {
  // Declare that the session will potentially contain these additional fields
  interface SessionData {
    returnTo: string
    nowInMinutes: number
    prisonerListSortOptions: string
    sessionListSortOptions: string

    pageFlowQueue: PageFlow

    prisonerContexts: PrisonerContexts
  }
  export interface PrisonerContext {
    // Goal related forms
    updateGoalForm?: UpdateGoalForm
    archiveGoalForm?: ArchiveGoalForm
  }

  export type PrisonerContexts = Record<string, PrisonerContext>
}

export declare global {
  namespace Express {
    interface User {
      username: string
      token: string
      authSource: string
    }

    interface JourneyData {
      inductionDto?: InductionDto
      inductionExemptionDto?: InductionExemptionDto
      reviewPlanDto?: ReviewPlanDto
      reviewExemptionDto?: ReviewExemptionDto
      createGoalsForm?: CreateGoalsForm
      educationDto?: EducationDto
      qualificationLevel?: QualificationLevelValue
      createEmployabilitySkillDto?: CreateEmployabilitySkillDto
    }

    interface Response {
      redirectWithSuccess?(path: string, message: string): void

      redirectWithErrors?(path: string, message: Record<string, string>[]): void
    }

    interface Request {
      verified?: boolean
      id: string
      journeyData: JourneyData
      middleware?: {
        prisonerData?: PrisonerSummary
      }
      logout(done: (err: unknown) => void): void
      flash(type: string, message: Array<Record<string, string>>): number
    }

    interface Locals {
      user: HmppsUser
    }
  }
}
