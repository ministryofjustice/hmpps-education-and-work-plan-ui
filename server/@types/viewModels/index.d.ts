declare module 'viewModels' {
  import InductionScheduleCalculationRuleValue from '../../enums/inductionScheduleCalculationRuleValue'
  import InductionScheduleStatusValue from '../../enums/inductionScheduleStatusValue'
  import ActionPlanReviewStatusValue from '../../enums/actionPlanReviewStatusValue'
  import ActionPlanReviewCalculationRuleValue from '../../enums/actionPlanReviewCalculationRuleValue'
  import NoteTypeValue from '../../enums/noteTypeValue'
  import TimelineEventTypeValue from '../../enums/timelineEventTypeValue'
  import GoalStatusValue from '../../enums/goalStatusValue'
  import StepStatusValue from '../../enums/stepStatusValue'
  import SessionTypeValue from '../../enums/sessionTypeValue'
  import InductionExemptionReasonValue from '../../enums/inductionExemptionReasonValue'
  import ReviewPlanExemptionReasonValue from '../../enums/reviewPlanExemptionReasonValue'
  import TimelineFilterTypeValue from '../../enums/timelineFilterTypeValue'
  import AssessmentTypeValue from '../../enums/assessmentTypeValue'

  export interface SessionsSummary {
    overdueSessionCount: number
    dueSessionCount: number
    onHoldSessionCount: number
    problemRetrievingData: boolean
  }

  export interface PrisonerSummaries {
    problemRetrievingData: boolean
    prisoners: Array<PrisonerSummary>
  }

  export interface Sessions {
    sessions: PrisonerSession[]
    problemRetrievingData: boolean
  }

  export interface PrisonerSession {
    prisonNumber: string
    reference: string
    sessionType: SessionTypeValue
    deadlineDate: Date
    exemption?: {
      exemptionReason: InductionExemptionReasonValue | ReviewPlanExemptionReasonValue
      exemptionDate: Date
    }
  }

  export interface PrisonerSummaryPrisonerSession extends PrisonerSummary, PrisonerSession {}

  export interface PrisonerSummary {
    prisonNumber: string
    prisonId: string
    releaseDate?: Date
    firstName: string
    lastName: string
    receptionDate?: Date
    dateOfBirth?: Date
    location: string
    restrictedPatient: boolean
    supportingPrisonId?: string
  }

  export interface PrisonerSearchSummary extends PrisonerSummary {
    hasCiagInduction: boolean
    hasActionPlan: boolean
  }

  export interface PrisonerSupportNeeds {
    lddAssessments: Array<LddAssessment>
    // TODO - add property for Curious 2 ALN assessments
  }

  export interface LddAssessment {
    prisonId: string
    rapidAssessmentDate?: Date
    inDepthAssessmentDate?: Date
    primaryLddAndHealthNeeds?: string
    additionalLddAndHealthNeeds: Array<string>
    hasSupportNeeds: boolean
  }

  /**
   * A prisoner's Functional Skills, which is made up of a collection of Assessments.
   */
  export interface FunctionalSkills {
    assessments: Array<Assessment>
  }

  /**
   * An Assessment of a single functional skill.
   */
  export interface Assessment {
    prisonId: string
    type: AssessmentTypeValue
    assessmentDate: Date
    level: string
    levelBanding: string | null
    referral: string | null
    nextStep: string | null
    source: 'CURIOUS1' | 'CURIOUS2'
  }

  export interface ActionPlan {
    prisonNumber: string
    goals: Array<Goal>
    problemRetrievingData: boolean
  }

  export interface Goals {
    goals: Array<Goal>
    problemRetrievingData: boolean
  }

  export interface Goal {
    goalReference: string
    title: string
    status: GoalStatusValue
    steps: Array<Step>
    createdBy: string
    createdByDisplayName: string
    createdAt: Date
    createdAtPrisonName: string
    updatedBy: string
    updatedByDisplayName: string
    updatedAt: Date
    updatedAtPrisonName: string
    targetCompletionDate: Date
    notesByType: Record<'GOAL' | 'GOAL_ARCHIVAL' | 'GOAL_COMPLETION', Array<Note>>
    archiveReason?:
      | 'PRISONER_NO_LONGER_WANTS_TO_WORK_TOWARDS_GOAL'
      | 'PRISONER_NO_LONGER_WANTS_TO_WORK_WITH_CIAG'
      | 'SUITABLE_ACTIVITIES_NOT_AVAILABLE_IN_THIS_PRISON'
      | 'OTHER'
    archiveReasonOther?: string
  }

  export interface Step {
    stepReference: string
    title: string
    status: StepStatusValue
    sequenceNumber: number
  }

  export interface Note {
    reference: string
    content: string
    type: NoteTypeValue
    createdBy: string
    createdByDisplayName: string
    createdAt: Date
    createdAtPrisonName: string
    updatedBy: string
    updatedByDisplayName: string
    updatedAt: Date
    updatedAtPrisonName: string
  }

  /**
   * A prisoner's Induction Schedule
   */
  export interface InductionSchedule {
    reference: string
    prisonNumber: string
    deadlineDate: Date
    scheduleCalculationRule: InductionScheduleCalculationRuleValue
    scheduleStatus: InductionScheduleStatusValue
    inductionPerformedBy?: string
    inductionPerformedAt?: Date
    createdBy: string
    createdByDisplayName: string
    createdAt: Date
    createdAtPrison: string
    updatedBy: string
    updatedByDisplayName: string
    updatedAt: Date
    updatedAtPrison: string
    problemRetrievingData: boolean
  }

  export interface CreatedActionPlanReview {
    wasLastReviewBeforeRelease: boolean
    latestReviewSchedule: ScheduledActionPlanReview
  }

  /**
   * All completed reviews and the latest review schedule for a prisoner
   */
  export interface ActionPlanReviews {
    latestReviewSchedule: ScheduledActionPlanReview
    completedReviews: Array<CompletedActionPlanReview>
    problemRetrievingData: boolean
  }

  /**
   * A scheduled review for a prisoner's Action Plan
   */
  export interface ScheduledActionPlanReview {
    reference: string
    reviewDateFrom: Date
    reviewDateTo: Date
    status: ActionPlanReviewStatusValue
    calculationRule: ActionPlanReviewCalculationRuleValue
    createdBy: string
    createdByDisplayName: string
    createdAt: Date
    createdAtPrison: string
    updatedBy: string
    updatedByDisplayName: string
    updatedAt: Date
    updatedAtPrison: string
  }

  /**
   * A prisoner's completed review for their Action Plan
   */
  export interface CompletedActionPlanReview {
    reference: string
    deadlineDate: Date
    completedDate: Date
    note: Note
    conductedBy?: string
    conductedByRole?: string
    createdBy: string
    createdByDisplayName: string
    createdAt: Date
    createdAtPrison: string
  }

  /**
   * A prisoner's record of In-Prison courses, which is made up of collections of [InPrisonCourse].
   */
  export interface InPrisonCourseRecords {
    totalRecords: number
    coursesByStatus: Record<'COMPLETED' | 'IN_PROGRESS' | 'WITHDRAWN' | 'TEMPORARILY_WITHDRAWN', Array<InPrisonCourse>>
    coursesCompletedInLast12Months: Array<InPrisonCourse>
    hasCoursesCompletedMoreThan12MonthsAgo: () => boolean
    hasWithdrawnOrInProgressCourses: () => boolean
  }

  /**
   * All of a prisoner's Goals, grouped by status.
   */
  export interface PrisonerGoals {
    problemRetrievingData: boolean
    goals: Record<'ACTIVE' | 'ARCHIVED' | 'COMPLETED', Array<Goal>>
    prisonNumber: string
  }

  /**
   * An 'In-Prison' course record.
   */
  export interface InPrisonCourse {
    prisonId: string
    courseName: string
    courseCode: string
    courseStartDate: Date
    courseStatus: 'COMPLETED' | 'IN_PROGRESS' | 'WITHDRAWN' | 'TEMPORARILY_WITHDRAWN'
    courseCompletionDate?: Date
    coursePlannedEndDate?: Date
    isAccredited: boolean
    grade?: string
    withdrawalReason?: string
    source: 'CURIOUS1' | 'CURIOUS2'
  }

  export interface Job {
    type:
      | 'OUTDOOR'
      | 'CONSTRUCTION'
      | 'DRIVING'
      | 'BEAUTY'
      | 'HOSPITALITY'
      | 'TECHNICAL'
      | 'MANUFACTURING'
      | 'OFFICE'
      | 'RETAIL'
      | 'SPORTS'
      | 'WAREHOUSING'
      | 'WASTE_MANAGEMENT'
      | 'EDUCATION_TRAINING'
      | 'CLEANING_AND_MAINTENANCE'
      | 'OTHER'
    other?: string
    role: string
    responsibilities: string
  }

  export interface WorkInterestJob {
    jobType:
      | 'OUTDOOR'
      | 'CONSTRUCTION'
      | 'DRIVING'
      | 'BEAUTY'
      | 'HOSPITALITY'
      | 'TECHNICAL'
      | 'MANUFACTURING'
      | 'OFFICE'
      | 'RETAIL'
      | 'SPORTS'
      | 'WAREHOUSING'
      | 'WASTE_MANAGEMENT'
      | 'EDUCATION_TRAINING'
      | 'CLEANING_AND_MAINTENANCE'
      | 'OTHER'
    otherJobType?: string
    specificJobRole?: string
  }

  export interface Timeline {
    problemRetrievingData: boolean
    reference?: string
    prisonNumber: string
    events?: Array<TimelineEvent>
    filteredBy: Array<TimelineFilterTypeValue>
  }

  export interface TimelineEvent {
    reference: string
    sourceReference: string
    eventType: TimelineEventTypeValue & 'MULTIPLE_GOALS_CREATED'
    prisonName: string
    timestamp: Date
    correlationId: string
    contextualInfo: {
      [key: string]: string
    }
    actionedByDisplayName?: string
  }

  export interface Prison {
    prisonId: string
    prisonName?: string
  }

  export interface PageFlow {
    pageUrls: Array<string>
    currentPageIndex: number
  }
}
