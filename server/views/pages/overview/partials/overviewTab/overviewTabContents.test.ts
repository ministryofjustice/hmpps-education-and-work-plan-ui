import nunjucks from 'nunjucks'
import * as cheerio from 'cheerio'
import { parseISO, startOfDay } from 'date-fns'
import aValidPrisonerSummary from '../../../../../testsupport/prisonerSummaryTestDataBuilder'
import formatDate from '../../../../../filters/formatDateFilter'
import formatFunctionalSkillTypeFilter from '../../../../../filters/formatFunctionalSkillTypeFilter'
import formatInductionExemptionReasonFilter from '../../../../../filters/formatInductionExemptionReasonFilter'

const njkEnv = nunjucks.configure([
  'node_modules/govuk-frontend/govuk/',
  'node_modules/govuk-frontend/govuk/components/',
  'node_modules/govuk-frontend/govuk/template/',
  'node_modules/govuk-frontend/dist/',
  'node_modules/@ministryofjustice/frontend/',
  'server/views/',
  __dirname,
])

njkEnv.addFilter('formatDate', formatDate)
njkEnv.addFilter('formatFunctionalSkillType', formatFunctionalSkillTypeFilter)
njkEnv.addFilter('formatInductionExemptionReason', formatInductionExemptionReasonFilter)
njkEnv.addGlobal('userHasPermissionTo', () => true)

const prisonerSummary = aValidPrisonerSummary()
const template = 'overviewTabContents.njk'

const userHasPermissionTo = jest.fn()
const templateParams = {
  prisonerSummary,
  userHasPermissionTo,
  prisonerGoals: {
    problemRetrievingData: false,
    counts: {
      totalGoals: 6,
      activeGoals: 3,
      archivedGoals: 2,
      completedGoals: 1,
    },
    lastUpdatedBy: 'Elaine Benes',
    lastUpdatedDate: new Date('2024-01-21T13:42:01.401Z'),
    lastUpdatedAtPrisonName: 'Brixton (HMP)',
  },
  functionalSkills: {
    problemRetrievingData: false,
    mostRecentAssessments: [
      {
        prisonId: 'BXI',
        prisonName: 'Brixton (HMP)',
        type: 'MATHS',
        grade: 'Level 1',
        assessmentDate: parseISO('2023-01-15T00:00:00Z'),
      },
      {
        type: 'ENGLISH',
      },
    ],
  },
  inPrisonCourses: {
    problemRetrievingData: false,
    coursesCompletedInLast12Months: [
      {
        prisonId: 'BXI',
        prisonName: 'Brixton (HMP)',
        courseName: 'Basic English',
        courseCode: 'ENG_01',
        isAccredited: true,
        courseStartDate: parseISO('2022-12-01T00:00:00Z'),
        courseCompletionDate: parseISO('2023-06-15T00:00:00Z'),
        courseStatus: 'COMPLETED',
        grade: 'Pass',
        source: 'CURIOUS',
      },
    ],
    hasWithdrawnOrInProgressCourses: false,
    hasCoursesCompletedMoreThan12MonthsAgo: false,
  },
  sessionHistory: {
    problemRetrievingData: false,
    counts: {
      totalSessions: 1,
      reviewSessions: 0,
      inductionSessions: 1,
    },
    lastSessionConductedBy: 'Elaine Benes',
    lastSessionConductedAt: new Date('2024-01-21T13:42:01.401Z'),
    lastSessionConductedAtPrison: 'Brixton (HMP)',
  },
  induction: {
    problemRetrievingData: false,
    isPostInduction: false,
  },
  inductionSchedule: {
    problemRetrievingData: false,
    inductionStatus: 'INDUCTION_DUE',
    inductionDueDate: startOfDay('2025-02-15'),
  },
  actionPlanReview: {
    problemRetrievingData: false,
    reviewStatus: 'NO_SCHEDULED_REVIEW',
  },
}

describe('overviewTabContents', () => {
  beforeEach(() => {
    jest.resetAllMocks()
    userHasPermissionTo.mockReturnValue(true)
  })

  it('should render the complete induction banner when the prisoner has not had an induction and the induction schedule is not on hold and the user has permission to create inductions', () => {
    // Given
    userHasPermissionTo.mockReturnValue(true)
    const pageViewModel = {
      ...templateParams,
    }

    // When
    const content = njkEnv.render(template, pageViewModel)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa="pre-induction-overview"]').length).toEqual(1)
    expect($('.govuk-notification-banner__link').attr('href')).toEqual(
      `/prisoners/${prisonerSummary.prisonNumber}/create-induction/hoping-to-work-on-release`,
    )

    expect(userHasPermissionTo).toBeCalledWith('RECORD_INDUCTION')
  })

  it('should not render the complete induction banner when the the user does not have permission to create inductions', () => {
    // Given
    userHasPermissionTo.mockReturnValue(false)
    const pageViewModel = {
      ...templateParams,
    }

    // When
    const content = njkEnv.render(template, pageViewModel)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa="pre-induction-overview"]').length).toEqual(0)

    expect(userHasPermissionTo).toBeCalledWith('RECORD_INDUCTION')
  })

  it('should not render the complete induction banner when the prisoner has had an induction', () => {
    // Given
    const pageViewModel = {
      ...templateParams,
      induction: {
        problemRetrievingData: false,
        isPostInduction: true,
      },
    }

    // When
    const content = njkEnv.render(template, pageViewModel)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa="pre-induction-overview"]').length).toEqual(0)
  })

  it('should not render the complete induction banner given there was a problem retrieving the induction', () => {
    // Given
    const pageViewModel = {
      ...templateParams,
      induction: {
        problemRetrievingData: true,
        isPostInduction: false,
      },
    }

    // When
    const content = njkEnv.render(template, pageViewModel)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa="pre-induction-overview"]').length).toEqual(0)
  })

  it('should not render the complete induction banner given there was a problem retrieving the induction schedule', () => {
    // Given
    const pageViewModel = {
      ...templateParams,
      inductionSchedule: {
        problemRetrievingData: true,
      },
    }

    // When
    const content = njkEnv.render(template, pageViewModel)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa="pre-induction-overview"]').length).toEqual(0)
  })

  it('should not render the complete induction banner given the induction schedule is exempt (on hold)', () => {
    // Given
    const pageViewModel = {
      ...templateParams,
      inductionSchedule: {
        problemRetrievingData: false,
        inductionStatus: 'ON_HOLD',
        inductionDueDate: startOfDay('2025-02-15'),
      },
    }

    // When
    const content = njkEnv.render(template, pageViewModel)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa="pre-induction-overview"]').length).toEqual(0)
  })
})
