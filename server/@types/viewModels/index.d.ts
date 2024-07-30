declare module 'viewModels' {
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
    problemRetrievingData: boolean
    healthAndSupportNeeds: Array<HealthAndSupportNeeds>
    neurodiversities: Array<Neurodiversity>
  }

  export interface HealthAndSupportNeeds {
    prisonId: string
    prisonName: string
    rapidAssessmentDate?: Date
    inDepthAssessmentDate?: Date
    primaryLddAndHealthNeeds?: string
    additionalLddAndHealthNeeds: Array<string>
  }

  export interface Neurodiversity {
    prisonId: string
    prisonName: string
    supportNeeded: Array<string>
    supportNeededRecordedDate?: Date
    selfDeclaredNeurodiversity: Array<string>
    selfDeclaredRecordedDate?: Date
    assessedNeurodiversity: Array<string>
    assessmentDate?: Date
  }

  /**
   * A prisoner's Functional Skills, which is made up of a collection of Assessments.
   */
  export interface FunctionalSkills {
    problemRetrievingData: boolean
    assessments: Array<Assessment>
    prisonNumber: string
  }

  /**
   * An Assessment of a single functional skill.
   */
  export interface Assessment {
    prisonId: string
    prisonName: string
    type?: 'ENGLISH' | 'MATHS' | 'DIGITAL_LITERACY'
    grade?: string
    assessmentDate?: Date
  }

  export interface ActionPlan {
    prisonNumber: string
    goals: Array<Goal>
    problemRetrievingData: boolean
  }

  export interface Goals {
    goals?: Array<Goal>
    problemRetrievingData: boolean
  }

  export interface Goal {
    goalReference: string
    title: string
    status: 'ACTIVE' | 'COMPLETED' | 'ARCHIVED'
    steps: Array<Step>
    createdBy: string
    createdByDisplayName: string
    createdAt: Date
    createdAtPrisonName?: string
    updatedBy: string
    updatedByDisplayName: string
    updatedAt: Date
    updatedAtPrisonName?: string
    targetCompletionDate: Date
    note?: string
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
    status: 'NOT_STARTED' | 'ACTIVE' | 'COMPLETE'
    sequenceNumber: number
  }

  /**
   * A prisoner's record of In-Prison courses, which is made up of collections of [InPrisonCourse].
   */
  export interface InPrisonCourseRecords {
    problemRetrievingData: boolean
    totalRecords: number
    coursesByStatus: Record<'COMPLETED' | 'IN_PROGRESS' | 'WITHDRAWN' | 'TEMPORARILY_WITHDRAWN', Array<InPrisonCourse>>
    coursesCompletedInLast12Months: Array<InPrisonCourse>
    prisonNumber: string
  }

  /**
   * An 'In-Prison' course record.
   */
  export interface InPrisonCourse {
    prisonId: string
    prisonName: string
    courseName: string
    courseCode: string
    courseStartDate: Date
    courseStatus: 'COMPLETED' | 'IN_PROGRESS' | 'WITHDRAWN' | 'TEMPORARILY_WITHDRAWN'
    courseCompletionDate?: Date
    coursePlannedEndDate?: Date
    isAccredited: boolean
    grade?: string
    withdrawalReason?: string
    source: 'CURIOUS'
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
  }

  export interface TimelineEvent {
    reference: string
    sourceReference: string
    eventType:
      | 'INDUCTION_CREATED'
      | 'INDUCTION_UPDATED'
      | 'ACTION_PLAN_CREATED'
      | 'GOAL_CREATED'
      | 'MULTIPLE_GOALS_CREATED'
      | 'GOAL_UPDATED'
      | 'GOAL_COMPLETED'
      | 'GOAL_ARCHIVED'
      | 'GOAL_UNARCHIVED'
      | 'STEP_UPDATED'
      | 'STEP_NOT_STARTED'
      | 'STEP_STARTED'
      | 'STEP_COMPLETED'
      | 'CONVERSATION_CREATED'
      | 'CONVERSATION_UPDATED'
      | 'PRISON_ADMISSION'
      | 'PRISON_RELEASE'
      | 'PRISON_TRANSFER'
    prisonName: string
    timestamp: Date
    correlationId: string
    contextualInfo: {
      [key: string]: string
    }
    actionedByDisplayName?: string
  }

  /**
   * DPS frontend components
   */
  export interface FrontendComponentsPageAdditions {
    headerHtml: string
    footerHtml: string
    cssIncludes: Array<string>
    jsIncludes: Array<string>
    problemRetrievingData: boolean
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
