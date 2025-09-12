import nunjucks from 'nunjucks'
import * as cheerio from 'cheerio'
import { startOfDay } from 'date-fns'
import aValidPrisonerSummary from '../../../../../testsupport/prisonerSummaryTestDataBuilder'
import formatDate from '../../../../../filters/formatDateFilter'
import formatFunctionalSkillTypeFilter from '../../../../../filters/formatFunctionalSkillTypeFilter'
import formatInductionExemptionReasonFilter from '../../../../../filters/formatInductionExemptionReasonFilter'
import { Result } from '../../../../../utils/result/result'
import validFunctionalSkills from '../../../../../testsupport/functionalSkillsTestDataBuilder'
import filterArrayOnPropertyFilter from '../../../../../filters/filterArrayOnPropertyFilter'
import validInPrisonCourseRecords from '../../../../../testsupport/inPrisonCourseRecordsTestDataBuilder'

const njkEnv = nunjucks.configure([
  'node_modules/govuk-frontend/govuk/',
  'node_modules/govuk-frontend/govuk/components/',
  'node_modules/govuk-frontend/govuk/template/',
  'node_modules/govuk-frontend/dist/',
  'node_modules/@ministryofjustice/frontend/',
  'server/views/',
  __dirname,
])

njkEnv //
  .addFilter('formatDate', formatDate)
  .addFilter('formatFunctionalSkillType', formatFunctionalSkillTypeFilter)
  .addFilter('formatInductionExemptionReason', formatInductionExemptionReasonFilter)
  .addFilter('filterArrayOnProperty', filterArrayOnPropertyFilter)
  .addGlobal('userHasPermissionTo', () => true)

const prisonerSummary = aValidPrisonerSummary()
const prisonNamesById = Result.fulfilled({ BXI: 'Brixton (HMP)', MDI: 'Moorland (HMP & YOI)' })
const prisonerFunctionalSkills = Result.fulfilled(validFunctionalSkills())
const curiousInPrisonCourses = Result.fulfilled(validInPrisonCourseRecords())

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
  curiousInPrisonCourses,
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
  prisonerFunctionalSkills,
  prisonNamesById,
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

    expect(userHasPermissionTo).toHaveBeenCalledWith('RECORD_INDUCTION')
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

    expect(userHasPermissionTo).toHaveBeenCalledWith('RECORD_INDUCTION')
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
