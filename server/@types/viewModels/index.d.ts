declare module 'viewModels' {
  export interface PrisonerSummary {
    prisonNumber: string
    prisonId: string
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
   * A prisoner's work experience, skills, and future work interests.
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

  export interface WorkExperience {
    hasWorkedPreviously: boolean
    jobs: Array<Job>
    updatedBy: string
    updatedAt: Date
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

  export interface WorkInterests {
    hopingToWorkOnRelease: 'YES' | 'NO' | 'NOT_SURE'
    constraintsOnAbilityToWork: Array<
      'CARING_RESPONSIBILITIES' | 'LIMITED_BY_OFFENSE' | 'HEALTH_ISSUES' | 'NO_RIGHT_TO_WORK' | 'OTHER' | 'NONE'
    >
    otherConstraintOnAbilityToWork?: string
    jobTypes: Array<
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
    >
    specificJobRoles: Array<string>
    updatedBy: string
    updatedAt: Date
  }

  export interface SkillsAndInterests {
    skills: Array<
      | 'COMMUNICATION'
      | 'POSITIVE_ATTITUDE'
      | 'RESILIENCE'
      | 'SELF_MANAGEMENT'
      | 'TEAMWORK'
      | 'THINKING_AND_PROBLEM_SOLVING'
      | 'WILLINGNESS_TO_LEARN'
      | 'OTHER'
      | 'NONE'
    >
    otherSkill?: string
    personalInterests: Array<
      | 'COMMUNITY'
      | 'CRAFTS'
      | 'CREATIVE'
      | 'DIGITAL'
      | 'KNOWLEDGE_BASED'
      | 'MUSICAL'
      | 'OUTDOOR'
      | 'NATURE_AND_ANIMALS'
      | 'SOCIAL'
      | 'SOLO_ACTIVITIES'
      | 'SOLO_SPORTS'
      | 'TEAM_SPORTS'
      | 'WELLNESS'
      | 'OTHER'
      | 'NONE'
    >
    otherPersonalInterest?: string
    updatedBy: string
    updatedAt: Date
  }

  /**
   * Details of a prisoner's other qualifications and training that been completed.
   */
  export interface OtherQualifications {
    problemRetrievingData: boolean
    highestEducationLevel?:
      | 'PRIMARY_SCHOOL'
      | 'SECONDARY_SCHOOL_LEFT_BEFORE_TAKING_EXAMS'
      | 'SECONDARY_SCHOOL_TOOK_EXAMS'
      | 'FURTHER_EDUCATION_COLLEGE'
      | 'UNDERGRADUATE_DEGREE_AT_UNIVERSITY'
      | 'POSTGRADUATE_DEGREE_AT_UNIVERSITY'
      | 'NOT_SURE'
    additionalTraining?: (
      | 'CSCS_CARD'
      | 'FIRST_AID_CERTIFICATE'
      | 'FOOD_HYGIENE_CERTIFICATE'
      | 'FULL_UK_DRIVING_LICENCE'
      | 'HEALTH_AND_SAFETY'
      | 'HGV_LICENCE'
      | 'MACHINERY_TICKETS'
      | 'MANUAL_HANDLING'
      | 'TRADE_COURSE'
      | 'OTHER'
      | 'NONE'
    )[]
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
}
