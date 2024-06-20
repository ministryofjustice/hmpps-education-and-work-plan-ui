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

  export interface Goal {
    goalReference: string
    title: string
    status: 'ACTIVE' | 'COMPLETED' | 'ARCHIVED'
    steps: Array<Step>
    createdBy: string
    createdByDisplayName: string
    createdAt: Date
    updatedBy: string
    updatedByDisplayName: string
    updatedAt: Date
    targetCompletionDate: Date
    note?: string
    sequenceNumber: number
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
      | 'ACTION_PLAN_CREATED'
      | 'GOAL_CREATED'
      | 'MULTIPLE_GOALS_CREATED'
      | 'GOAL_UPDATED'
      | 'INDUCTION_UPDATED'
      | 'PRISON_ADMISSION'
      | 'PRISON_RELEASE'
      | 'PRISON_TRANSFER'
    prison: Prison
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
    prisonName: string
  }

  export interface PageFlow {
    pageUrls: Array<string>
    currentPageIndex: number
  }

  export interface Action {
    title: string
    href: string
    dataQa?: string
  }
}
