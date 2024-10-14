import HmppsAuditClient, { AuditEvent } from '../data/hmppsAuditClient'

export enum Page {
  NOT_FOUND = 'NOT_FOUND',
  ERROR = 'ERROR',
  PRISONER_LIST = 'PRISONER_LIST',
  OVERVIEW = 'OVERVIEW',
  SUPPORT_NEEDS = 'SUPPORT_NEEDS',
  EDUCATION_AND_TRAINING = 'EDUCATION_AND_TRAINING',
  WORK_AND_INTERESTS = 'WORK_AND_INTERESTS',
  TIMELINE = 'TIMELINE',
  FUNCTIONAL_SKILLS = 'FUNCTIONAL_SKILLS',
  CREATE_GOALS = 'CREATE_GOALS',
  UPDATE_GOALS = 'UPDATE_GOALS',
  UPDATE_GOALS_REVIEW = 'UPDATE_GOALS_REVIEW',
  ARCHIVE_GOALS = 'ARCHIVE_GOALS',
  ARCHIVE_GOALS_REVIEW = 'ARCHIVE_GOALS_REVIEW',
  ARCHIVE_GOALS_CANCEL = 'ARCHIVE_GOALS_CANCEL',
  UNARCHIVE_GOALS = 'UNARCHIVE_GOALS',
  VIEW_IN_PROGRESS_GOALS = 'VIEW_IN_PROGRESS_GOALS',
  VIEW_ARCHIVED_GOALS = 'VIEW_ARCHIVED_GOALS',
  IN_PRISON_COURSES_AND_QUALIFICATIONS = 'IN_PRISON_COURSES_AND_QUALIFICATIONS',
  NOTES_LIST = 'NOTES_LIST',
  INDUCTION_CREATE_HOPING_TO_WORK_ON_RELEASE = 'INDUCTION_CREATE_HOPING_TO_WORK_ON_RELEASE',
  INDUCTION_CREATE_ADD_QUALIFICATION = 'INDUCTION_CREATE_ADD_QUALIFICATION',
  INDUCTION_CREATE_QUALIFICATIONS = 'INDUCTION_CREATE_QUALIFICATIONS',
  INDUCTION_CREATE_HIGHEST_LEVEL_OF_EDUCATION = 'INDUCTION_CREATE_HIGHEST_LEVEL_OF_EDUCATION',
  INDUCTION_CREATE_QUALIFICATION_LEVEL = 'INDUCTION_CREATE_QUALIFICATION_LEVEL',
  INDUCTION_CREATE_QUALIFICATION_DETAILS = 'INDUCTION_CREATE_QUALIFICATION_DETAILS',
  INDUCTION_CREATE_ADDITIONAL_TRAINING = 'INDUCTION_CREATE_ADDITIONAL_TRAINING',
  INDUCTION_CREATE_HAS_WORKED_BEFORE = 'INDUCTION_CREATE_HAS_WORKED_BEFORE',
  INDUCTION_CREATE_PREVIOUS_WORK_EXPERIENCE_TYPE = 'INDUCTION_CREATE_PREVIOUS_WORK_EXPERIENCE_TYPE',
  INDUCTION_CREATE_PREVIOUS_WORK_EXPERIENCE_DETAILS = 'INDUCTION_CREATE_PREVIOUS_WORK_EXPERIENCE_DETAILS',
  INDUCTION_CREATE_WORK_INTEREST_TYPES = 'INDUCTION_CREATE_WORK_INTEREST_TYPES',
  INDUCTION_CREATE_WORK_INTEREST_ROLES = 'INDUCTION_CREATE_WORK_INTEREST_ROLES',
  INDUCTION_CREATE_SKILLS = 'INDUCTION_CREATE_SKILLS',
  INDUCTION_CREATE_PERSONAL_INTERESTS = 'INDUCTION_CREATE_PERSONAL_INTERESTS',
  INDUCTION_CREATE_AFFECT_ABILITY_TO_WORK = 'INDUCTION_CREATE_AFFECT_ABILITY_TO_WORK',
  INDUCTION_CREATE_REASONS_NOT_TO_GET_WORK = 'INDUCTION_CREATE_REASONS_NOT_TO_GET_WORK',
  INDUCTION_CREATE_IN_PRISON_WORK = 'INDUCTION_CREATE_IN_PRISON_WORK',
  INDUCTION_CREATE_IN_PRISON_TRAINING = 'INDUCTION_CREATE_IN_PRISON_TRAINING',
  INDUCTION_CREATE_CHECK_YOUR_ANSWERS = 'INDUCTION_CREATE_CHECK_YOUR_ANSWERS',
  INDUCTION_UPDATE_IN_PRISON_TRAINING = 'INDUCTION_UPDATE_IN_PRISON_TRAINING',
  INDUCTION_UPDATE_PERSONAL_INTERESTS = 'INDUCTION_UPDATE_PERSONAL_INTERESTS',
  INDUCTION_UPDATE_SKILLS = 'INDUCTION_UPDATE_SKILLS',
  INDUCTION_UPDATE_HAS_WORKED_BEFORE = 'INDUCTION_UPDATE_HAS_WORKED_BEFORE',
  INDUCTION_UPDATE_PREVIOUS_WORK_EXPERIENCE_TYPE = 'INDUCTION_UPDATE_PREVIOUS_WORK_EXPERIENCE_TYPE',
  INDUCTION_UPDATE_PREVIOUS_WORK_EXPERIENCE_DETAILS = 'INDUCTION_UPDATE_PREVIOUS_WORK_EXPERIENCE_DETAILS',
  INDUCTION_UPDATE_HOPING_TO_WORK_ON_RELEASE = 'INDUCTION_UPDATE_HOPING_TO_WORK_ON_RELEASE',
  INDUCTION_UPDATE_AFFECT_ABILITY_TO_WORK = 'INDUCTION_UPDATE_AFFECT_ABILITY_TO_WORK',
  INDUCTION_UPDATE_REASONS_NOT_TO_GET_WORK = 'INDUCTION_UPDATE_REASONS_NOT_TO_GET_WORK',
  INDUCTION_UPDATE_WORK_INTEREST_TYPES = 'INDUCTION_UPDATE_WORK_INTEREST_TYPES',
  INDUCTION_UPDATE_WORK_INTEREST_ROLES = 'INDUCTION_UPDATE_WORK_INTEREST_ROLES',
  INDUCTION_UPDATE_IN_PRISON_WORK = 'INDUCTION_UPDATE_IN_PRISON_WORK',
  INDUCTION_UPDATE_CHECK_ANSWERS = 'INDUCTION_UPDATE_CHECK_ANSWERS',
  INDUCTION_UPDATE_QUALIFICATIONS = 'INDUCTION_UPDATE_QUALIFICATIONS',
  INDUCTION_UPDATE_ADD_QUALIFICATION = 'INDUCTION_UPDATE_ADD_QUALIFICATION',
  INDUCTION_UPDATE_HIGHEST_LEVEL_OF_EDUCATION = 'INDUCTION_UPDATE_HIGHEST_LEVEL_OF_EDUCATION',
  INDUCTION_UPDATE_QUALIFICATION_LEVEL = 'INDUCTION_UPDATE_QUALIFICATION_LEVEL',
  INDUCTION_UPDATE_QUALIFICATION_DETAILS = 'INDUCTION_UPDATE_QUALIFICATION_DETAILS',
  INDUCTION_UPDATE_ADDITIONAL_TRAINING = 'INDUCTION_UPDATE_ADDITIONAL_TRAINING',
  INDUCTION_UPDATE_CHECK_YOUR_ANSWERS = 'INDUCTION_UPDATE_CHECK_YOUR_ANSWERS',
  CREATE_QUALIFICATIONS = 'CREATE_QUALIFICATIONS',
  CREATE_HIGHEST_LEVEL_OF_EDUCATION = 'CREATE_HIGHEST_LEVEL_OF_EDUCATION',
  CREATE_QUALIFICATION_LEVEL = 'CREATE_QUALIFICATION_LEVEL',
  CREATE_QUALIFICATION_DETAILS = 'CREATE_QUALIFICATION_DETAILS',
  UPDATE_QUALIFICATIONS = 'UPDATE_QUALIFICATIONS',
  UPDATE_HIGHEST_LEVEL_OF_EDUCATION = 'UPDATE_HIGHEST_LEVEL_OF_EDUCATION',
  UPDATE_QUALIFICATION_LEVEL = 'UPDATE_QUALIFICATION_LEVEL',
  UPDATE_QUALIFICATION_DETAILS = 'UPDATE_QUALIFICATION_DETAILS',
  REVIEW_PLAN = 'REVIEW_PLAN',
  REVIEW_PLAN_NOTES = 'REVIEW_PLAN_NOTES',
  REVIEW_PLAN_CHECK_YOUR_ANSWERS = 'REVIEW_PLAN_CHECK_YOUR_ANSWERS',
  REVIEW_PLAN_COMPLETE = 'REVIEW_PLAN_COMPLETE',
  REVIEW_PLAN_EXEMPTION = 'REVIEW_PLAN_EXEMPTION',
  REVIEW_PLAN_EXEMPTION_RECORDED = 'REVIEW_PLAN_EXEMPTION_RECORDED',
}

enum AuditableUserAction {
  PAGE_VIEW_ATTEMPT = 'PAGE_VIEW_ATTEMPT',
  PAGE_VIEW = 'PAGE_VIEW',
  CREATE_PRISONER_GOAL = 'CREATE_PRISONER_GOAL',
  UPDATE_PRISONER_GOAL = 'UPDATE_PRISONER_GOAL',
  ARCHIVE_PRISONER_GOAL = 'ARCHIVE_PRISONER_GOAL',
  UNARCHIVE_PRISONER_GOAL = 'UNARCHIVE_PRISONER_GOAL',
}

export interface BaseAuditData {
  who: string
  subjectId?: string
  subjectType?: string
  correlationId?: string
  details?: object
}

export default class AuditService {
  constructor(private readonly hmppsAuditClient: HmppsAuditClient) {}

  private async logAuditEvent(event: AuditEvent) {
    return this.hmppsAuditClient.sendMessage(event, false)
  }

  async logPageViewAttempt(page: Page, baseAuditData: BaseAuditData) {
    const event: AuditEvent = {
      ...baseAuditData,
      what: `${AuditableUserAction.PAGE_VIEW_ATTEMPT}_${page}`,
    }
    return this.logAuditEvent(event)
  }

  async logPageView(page: Page, baseAuditData: BaseAuditData) {
    const event: AuditEvent = {
      ...baseAuditData,
      what: `${AuditableUserAction.PAGE_VIEW}_${page}`,
    }
    return this.logAuditEvent(event)
  }

  async logCreateGoal(baseAuditData: BaseAuditData) {
    return this.logAuditEvent({ ...baseAuditData, what: AuditableUserAction.CREATE_PRISONER_GOAL })
  }

  async logUpdateGoal(baseAuditData: BaseAuditData) {
    return this.logAuditEvent({ ...baseAuditData, what: AuditableUserAction.UPDATE_PRISONER_GOAL })
  }

  async logArchiveGoal(baseAuditData: BaseAuditData) {
    return this.logAuditEvent({ ...baseAuditData, what: AuditableUserAction.ARCHIVE_PRISONER_GOAL })
  }

  async logUnarchiveGoal(baseAuditData: BaseAuditData) {
    return this.logAuditEvent({ ...baseAuditData, what: AuditableUserAction.UNARCHIVE_PRISONER_GOAL })
  }
}
