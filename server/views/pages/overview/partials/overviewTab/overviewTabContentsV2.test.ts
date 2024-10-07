import nunjucks from 'nunjucks'
import * as cheerio from 'cheerio'
import aValidPrisonerSummary from '../../../../../testsupport/prisonerSummaryTestDataBuilder'
import formatDate from '../../../../../filters/formatDateFilter'
import formatIsAccreditedFilter from '../../../../../filters/formatIsAccreditedFilter'
import formatFunctionalSkillTypeFilter from '../../../../../filters/formatFunctionalSkillTypeFilter'
import { aValidGoalWithUpdatedAtData } from '../../../../../testsupport/actionPlanTestDataBuilder'

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
njkEnv.addFilter('formatIsAccredited', formatIsAccreditedFilter)
njkEnv.addFilter('formatFunctionalSkillType', formatFunctionalSkillTypeFilter)

const prisonerSummary = aValidPrisonerSummary()
const template = 'overviewTabContentsV2.njk'

describe('overviewTabContents', () => {
  it('should render the complete induction banner when there are goals but no induction', () => {
    // Given
    const pageViewModel = {
      prisonerSummary,
      isPostInduction: false,
      problemRetrievingData: false,
      goalCounts: { activeCount: 1, completedCount: 0, archivedCount: 1 },
    }

    // When
    const content = njkEnv.render(template, pageViewModel)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa="pre-induction-overview"]').length).toEqual(1)
    expect($('[data-qa="notification-banner-heading"]').text().replace(/\s+/g, ' ').trim()).toContain(
      'Create goals and add education, work, skills, and interests to make a progress plan now.',
    )
    expect($('.govuk-notification-banner__link').attr('href')).toEqual(
      `/prisoners/${prisonerSummary.prisonNumber}/create-induction/hoping-to-work-on-release`,
    )
  })

  it('should render the complete induction banner when there are no goals and no induction', () => {
    // Given
    const pageViewModel = {
      prisonerSummary,
      isPostInduction: false,
      problemRetrievingData: false,
      goalCounts: { activeCount: 0, completedCount: 0, archivedCount: 0 },
    }

    // When
    const content = njkEnv.render(template, pageViewModel)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa="pre-induction-overview"]').length).toEqual(1)
    expect($('[data-qa="notification-banner-heading"]').text().replace(/\s+/g, ' ').trim()).toContain(
      'Create goals and add education, work, skills, and interests to make a progress plan now.',
    )
    expect($('[data-qa="notification-banner-link"]').attr('href')).toEqual(
      `/prisoners/${prisonerSummary.prisonNumber}/create-induction/hoping-to-work-on-release`,
    )
  })

  it('should not render the complete induction banner when there is an induction', () => {
    // Given
    const pageViewModel = {
      prisonerSummary,
      isPostInduction: true,
      problemRetrievingData: false,
      goalCounts: { activeCount: 2, completedCount: 1, archivedCount: 1 },
    }

    // When
    const content = njkEnv.render(template, pageViewModel)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa="pre-induction-overview"]').length).toEqual(0)
    expect($('[data-qa="notification-banner-heading"]').length).toEqual(0)
    expect($('[data-qa="notification-banner-link"]').length).toEqual(0)
  })

  it('should render goals summary card correctly', () => {
    // Given
    const pageViewModel = {
      prisonerSummary,
      isPostInduction: false,
      problemRetrievingData: false,
      goalCounts: { activeCount: 3, archivedCount: 2 },
    }

    // When
    const content = njkEnv.render(template, pageViewModel)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa="in-progress-goals-count"]').text().trim()).toEqual('3')
    expect($('[data-qa="archived-goals-count"]').text().trim()).toEqual('2')
    expect($('[data-qa="view-in-progress-goals-button"]').attr('href')).toEqual(
      `/plan/${prisonerSummary.prisonNumber}/view/goals#in-progress-goals`,
    )
    expect($('[data-qa="view-archived-goals-button"]').attr('href')).toEqual(
      `/plan/${prisonerSummary.prisonNumber}/view/goals#archived-goals`,
    )
  })

  it('should render last updated by hint text correctly, showing the data for the last updated goal', () => {
    // Given
    const goal = {
      ...aValidGoalWithUpdatedAtData(),
      updatedByDisplayName: 'Elaine Benes',
      updatedAt: new Date('2024-01-21T13:42:01.401Z'),
      updatedAtPrisonName: 'Brixton (HMP)',
    }
    const pageViewModel = {
      prisonerSummary,
      isPostInduction: false,
      problemRetrievingData: false,
      goals: [goal],
      lastUpdatedBy: goal.updatedByDisplayName,
      lastUpdatedDate: goal.updatedAt,
      lastUpdatedAtPrisonName: goal.updatedAtPrisonName,
    }

    // When
    const content = njkEnv.render(template, pageViewModel)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa="goal-last-updated-hint"]').text().trim()).toEqual(
      'Updated on 21 January 2024 by Elaine Benes, Brixton (HMP)',
    )
  })

  it('should render functional skills section if data is available', () => {
    // Given
    const pageViewModel = {
      prisonerSummary,
      isPostInduction: false,
      problemRetrievingData: false,
      functionalSkills: {
        problemRetrievingData: false,
        assessments: [{ type: 'Maths', grade: 'Level 1', assessmentDate: '2023-01-15T00:00:00Z' }],
      },
      inPrisonCourses: { problemRetrievingData: false },
      goalCounts: { activeCount: 0, completedCount: 0, archivedCount: 0 },
    }

    // When
    const content = njkEnv.render(template, pageViewModel)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa="functional-skills-table"]').length).toEqual(1)
    expect($('[data-qa="functional-skills-heading"]').text().trim()).toEqual(
      'Functional skills initial assessment scores',
    )
    expect($('td').first().text().trim()).toContain('Level 1')
  })

  it('should show "curious unavailable" message when functional skills data cannot be retrieved', () => {
    // Given
    const pageViewModel = {
      prisonerSummary,
      isPostInduction: false,
      problemRetrievingData: false,
      functionalSkills: {
        problemRetrievingData: true,
      },
      inPrisonCourses: { problemRetrievingData: false },
      goalCounts: { activeCount: 0, completedCount: 0, archivedCount: 0 },
    }

    // When
    const content = njkEnv.render(template, pageViewModel)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa="curious-unavailable-message"]').length).toEqual(1)
    expect($('[data-qa="curious-unavailable-message"]').text().trim()).toContain(
      'We cannot show these details from Curious right now',
    )
  })

  it('should render completed in-prison courses correctly if data is available', () => {
    // Given
    const pageViewModel = {
      prisonerSummary,
      isPostInduction: false,
      problemRetrievingData: false,
      inPrisonCourses: {
        problemRetrievingData: false,
        coursesCompletedInLast12Months: [
          {
            courseName: 'Basic English',
            isAccredited: true,
            prisonName: 'HMP Brixton',
            courseCompletionDate: '2023-06-15T00:00:00Z',
            grade: 'Pass',
          },
        ],
      },
      goalCounts: { activeCount: 0, completedCount: 0, archivedCount: 0 },
    }

    // When
    const content = njkEnv.render(template, pageViewModel)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa="completed-in-prison-courses-in-last-12-months-table"]').length).toEqual(1)
    expect($('[data-qa="completed-course-name"]').text().trim()).toEqual('Basic English')
    expect($('td').last().text().trim()).toEqual('Pass')
  })
})
