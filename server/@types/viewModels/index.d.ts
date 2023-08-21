declare module 'viewModels' {
  export interface PrisonerSummary {
    prisonNumber: string
    releaseDate: string // TODO ideally change to a Date?
    firstName: string
    lastName: string
    receptionDate: string
    dateOfBirth: string
  }

  export interface PrisonerSupportNeeds {
    problemRetrievingData: boolean
    healthAndSupportNeeds: Array<HealthAndSupportNeeds>
    neurodiversities: Array<Neurodiversity>
  }

  export interface HealthAndSupportNeeds {
    prisonId: string
    prisonName: string
    languageSupportNeeded?: string
    lddAndHealthNeeds: Array<string>
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
    createdAt: string
    updatedBy: string
    updatedByDisplayName: string
    updatedAt: string
    reviewDate?: string
    note?: string
  }

  export interface Step {
    stepReference: string
    title: string
    targetDateRange: 'ZERO_TO_THREE_MONTHS' | 'THREE_TO_SIX_MONTHS' | 'SIX_TO_TWELVE_MONTHS' | 'MORE_THAN_TWELVE_MONTHS'
    status: 'NOT_STARTED' | 'ACTIVE' | 'COMPLETE'
    sequenceNumber: number
  }

  /**
   * A prisoner's record of In-Prison courses and education, which is made up of a collection of InPrisonEducation.
   */
  export interface InPrisonEducationRecords {
    problemRetrievingData: boolean
    educationRecords: Array<InPrisonEducation>
  }

  /**
   * An 'In-Prison' education record.
   */
  export interface InPrisonEducation {
    prisonId: string
    prisonName: string
    courseName: string
    courseCode: string
    courseStartDate: Date
    courseCompleted: boolean
    courseCompletionDate?: Date
    grade?: string
    source: 'CURIOUS'
  }

  /**
   * A prisoner's pre-prison work experience, skills, and future work interests.
   */
  export interface WorkAndInterests {
    problemRetrievingData: boolean
    data?: WorkAndInterestsData
  }

  export interface WorkAndInterestsData {
    workExperience: WorkExperience
    workInterests: WorkInterests
    skillsAndInterests: SkillsAndInterests
  }

  // TODO RR-115 - define the fields
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface WorkExperience {}

  // TODO RR-115 - define the fields
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface WorkInterests {}

  // TODO RR-115 - define the fields
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface SkillsAndInterests {}
}
