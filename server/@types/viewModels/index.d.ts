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
    targetCompletionDate: Date
    note?: string
  }

  export interface Step {
    stepReference: string
    title: string
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
   * View model interface representing the 'Work interests' tab on the Overview page.
   */
  export interface WorkAndInterests {
    problemRetrievingData: boolean
    inductionQuestionSet?: 'SHORT_QUESTION_SET' | 'LONG_QUESTION_SET'
    data?: WorkAndInterestsData
  }

  /**
   * A prisoner's work experience, skills, and future work interests.
   * A prisoner is only asked about work experience and skills in the Induction long question set. If the short
   * question set was asked these fields are undefined.
   * */
  export interface WorkAndInterestsData {
    workExperience?: WorkExperience
    workInterests: WorkInterests
    skillsAndInterests?: SkillsAndInterests
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

  /**
   * The prisoner's work interests. The Induction asks this data differently in the long question set to the short
   * question set. Only one of `longQuestionSetAnswers` or `shortQuestionSetAnswers` will be populated, with the other
   * left undefined.
   */
  export interface WorkInterests {
    hopingToWorkOnRelease: 'YES' | 'NO' | 'NOT_SURE'
    longQuestionSetAnswers?: WorkInterestsLongQuestionSet
    shortQuestionSetAnswers?: WorkInterestsShortQuestionSet
    updatedBy: string
    updatedAt: Date
  }

  export interface WorkInterestsLongQuestionSet {
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
  }

  export interface WorkInterestsShortQuestionSet {
    inPrisonWorkInterests: Array<
      | 'CLEANING_AND_HYGIENE'
      | 'COMPUTERS_OR_DESK_BASED'
      | 'GARDENING_AND_OUTDOORS'
      | 'KITCHENS_AND_COOKING'
      | 'MAINTENANCE'
      | 'PRISON_LAUNDRY'
      | 'PRISON_LIBRARY'
      | 'TEXTILES_AND_SEWING'
      | 'WELDING_AND_METALWORK'
      | 'WOODWORK_AND_JOINERY'
      | 'OTHER'
    >
    otherInPrisonerWorkInterest?: string
    reasonsForNotWantingToWork: Array<
      | 'LIMIT_THEIR_ABILITY'
      | 'FULL_TIME_CARER'
      | 'LACKS_CONFIDENCE_OR_MOTIVATION'
      | 'HEALTH'
      | 'RETIRED'
      | 'NO_RIGHT_TO_WORK'
      | 'NOT_SURE'
      | 'OTHER'
      | 'NO_REASON'
    >
    otherReasonForNotWantingToWork?: string
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
   * View model interface representing the 'Education and training' tab on the Overview page.
   */
  export interface EducationAndTraining {
    problemRetrievingData: boolean
    inductionQuestionSet?: 'SHORT_QUESTION_SET' | 'LONG_QUESTION_SET'
    data?: EducationAndTrainingData
  }

  /**
   * The prisoner's Education and Training. The Induction asks this data differently in the long question set to the short
   * question set. Only one of `longQuestionSetAnswers` or `shortQuestionSetAnswers` will be populated, with the other
   * left undefined.
   */
  export interface EducationAndTrainingData {
    longQuestionSetAnswers?: EducationAndTrainingLongQuestionSet
    shortQuestionSetAnswers?: EducationAndTrainingShortQuestionSet
    updatedBy: string
    updatedAt: Date
  }

  export interface EducationAndTrainingLongQuestionSet {
    highestEducationLevel:
      | 'PRIMARY_SCHOOL'
      | 'SECONDARY_SCHOOL_LEFT_BEFORE_TAKING_EXAMS'
      | 'SECONDARY_SCHOOL_TOOK_EXAMS'
      | 'FURTHER_EDUCATION_COLLEGE'
      | 'UNDERGRADUATE_DEGREE_AT_UNIVERSITY'
      | 'POSTGRADUATE_DEGREE_AT_UNIVERSITY'
      | 'NOT_SURE'
    additionalTraining: (
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
    otherAdditionalTraining?: string
    educationalQualifications: EducationalQualifications[]
  }

  export interface EducationAndTrainingShortQuestionSet {
    additionalTraining: (
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
    otherAdditionalTraining?: string
    educationalQualifications: EducationalQualifications[]
    inPrisonInterestsEducation: (
      | 'BARBERING_AND_HAIRDRESSING'
      | 'CATERING'
      | 'COMMUNICATION_SKILLS'
      | 'ENGLISH_LANGUAGE_SKILLS'
      | 'FORKLIFT_DRIVING'
      | 'INTERVIEW_SKILLS'
      | 'MACHINERY_TICKETS'
      | 'NUMERACY_SKILLS'
      | 'RUNNING_A_BUSINESS'
      | 'SOCIAL_AND_LIFE_SKILLS'
      | 'WELDING_AND_METALWORK'
      | 'WOODWORK_AND_JOINERY'
      | 'OTHER'
    )[]
    inPrisonInterestsEducationOther?: string
  }

  export interface EducationalQualifications {
    subject: string
    grade: string
    level:
      | 'ENTRY_LEVEL_2'
      | 'ENTRY_LEVEL_3'
      | 'LEVEL_1'
      | 'LEVEL_2'
      | 'LEVEL_3'
      | 'LEVEL_4'
      | 'LEVEL_5'
      | 'LEVEL_6'
      | 'LEVEL_7'
      | 'LEVEL_8'
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
