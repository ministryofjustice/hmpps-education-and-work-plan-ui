import nunjucks from 'nunjucks'
import * as cheerio from 'cheerio'
import { parseISO } from 'date-fns'
import type { InPrisonCourse } from 'viewModels'
import formatDate from '../../../../../filters/formatDateFilter'
import aValidPrisonerSummary from '../../../../../testsupport/prisonerSummaryTestDataBuilder'
import formatFunctionalSkillTypeFilter from '../../../../../filters/formatFunctionalSkillTypeFilter'

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

const prisonerSummary = aValidPrisonerSummary()
const template = '_educationAndTrainingSummaryCard.njk'

describe('_educationAndTrainingSummaryCard', () => {
  it('should render education and training summary card correctly given prisoner has functional skills and in-prison courses completed in the last 12 months', () => {
    // Given
    const pageViewModel = {
      prisonerSummary,
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
    }

    // When
    const content = njkEnv.render(template, pageViewModel)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa="functional-skills-table"]').length).toEqual(1)
    expect($('[data-qa="functional-skills-table-body"] tr').length).toEqual(2)
    expect($('[data-qa="functional-skills-table-body"] tr:nth-of-type(1) td:nth-of-type(1)').text().trim()).toEqual(
      'Maths skills Level 1',
    )
    expect($('[data-qa="functional-skills-table-body"] tr:nth-of-type(1) td:nth-of-type(2)').text().trim()).toEqual(
      'Assessed on 15 January 2023, Brixton (HMP)',
    )
    expect($('[data-qa="functional-skills-table-body"] tr:nth-of-type(2) td:nth-of-type(1)').text().trim()).toEqual(
      'English skills',
    )
    expect($('[data-qa="functional-skills-table-body"] tr:nth-of-type(2) td:nth-of-type(2)').text().trim()).toEqual(
      'No functional skill assessment scores recorded in Curious',
    )

    expect($('[data-qa="completed-in-prison-courses-in-last-12-months-table"]').length).toEqual(1)
    expect($('[data-qa="completed-courses-table-body"] tr').length).toEqual(1)
    expect(
      $('[data-qa="completed-courses-table-body"] tr:nth-of-type(1) [data-qa="completed-course-name"]').text().trim(),
    ).toEqual('Basic English')
    expect(
      $('[data-qa="completed-courses-table-body"] tr:nth-of-type(1) [data-qa="course-completion-date"]').text().trim(),
    ).toEqual('Completed on 15 June 2023')

    expect($('[data-qa="no-courses-completed-in-last-12-months-message"]').length).toEqual(0)
    expect($('[data-qa="no-courses-completed-yet-message"]').length).toEqual(0)
    expect($('[data-qa="no-courses-recorded-message"]').length).toEqual(0)

    expect($('[data-qa="curious-unavailable-message"]').length).toEqual(0)
  })

  it('should render no course message given prisoner has taken no courses at all', () => {
    // Given
    const pageViewModel = {
      prisonerSummary,
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
        coursesCompletedInLast12Months: [] as Array<InPrisonCourse>,
        hasWithdrawnOrInProgressCourses: false,
        hasCoursesCompletedMoreThan12MonthsAgo: false,
      },
    }

    // When
    const content = njkEnv.render(template, pageViewModel)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa="completed-in-prison-courses-in-last-12-months-table"]').length).toEqual(0)
    expect($('[data-qa="no-courses-completed-in-last-12-months-message"]').length).toEqual(0)
    expect($('[data-qa="no-courses-completed-yet-message"]').length).toEqual(0)
    expect($('[data-qa="no-courses-recorded-message"]').length).toEqual(1)

    expect($('[data-qa="curious-unavailable-message"]').length).toEqual(0)
  })

  it('should render no completed course message given prisoner has taken courses but not completed them', () => {
    // Given
    const pageViewModel = {
      prisonerSummary,
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
        coursesCompletedInLast12Months: [] as Array<InPrisonCourse>,
        hasWithdrawnOrInProgressCourses: true,
        hasCoursesCompletedMoreThan12MonthsAgo: false,
      },
    }

    // When
    const content = njkEnv.render(template, pageViewModel)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa="completed-in-prison-courses-in-last-12-months-table"]').length).toEqual(0)
    expect($('[data-qa="no-courses-completed-in-last-12-months-message"]').length).toEqual(0)
    expect($('[data-qa="no-courses-completed-yet-message"]').length).toEqual(1)
    expect($('[data-qa="no-courses-recorded-message"]').length).toEqual(0)

    expect($('[data-qa="curious-unavailable-message"]').length).toEqual(0)
  })

  it('should render course completed over 12 months ago message given prisoner has courses over 12 moonths ago', () => {
    // Given
    const pageViewModel = {
      prisonerSummary,
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
        coursesCompletedInLast12Months: [] as Array<InPrisonCourse>,
        hasWithdrawnOrInProgressCourses: false,
        hasCoursesCompletedMoreThan12MonthsAgo: true,
      },
    }

    // When
    const content = njkEnv.render(template, pageViewModel)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa="completed-in-prison-courses-in-last-12-months-table"]').length).toEqual(0)
    expect($('[data-qa="no-courses-completed-in-last-12-months-message"]').length).toEqual(1)
    expect($('[data-qa="no-courses-completed-yet-message"]').length).toEqual(0)
    expect($('[data-qa="no-courses-recorded-message"]').length).toEqual(0)

    expect($('[data-qa="curious-unavailable-message"]').length).toEqual(0)
  })

  it('should not render functional skills data given problem retrieving functional skills data', () => {
    // Given
    const pageViewModel = {
      prisonerSummary,
      functionalSkills: {
        problemRetrievingData: true,
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
    }

    // When
    const content = njkEnv.render(template, pageViewModel)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa="functional-skills-table"]').length).toEqual(0)
    expect($('[data-qa="completed-in-prison-courses-in-last-12-months-table"]').length).toEqual(1)
    expect($('[data-qa="curious-unavailable-message"]').length).toEqual(1)
  })

  it('should not render in-prison course data given problem retrieving in-prison course data', () => {
    // Given
    const pageViewModel = {
      prisonerSummary,
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
        problemRetrievingData: true,
      },
    }

    // When
    const content = njkEnv.render(template, pageViewModel)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa="functional-skills-table"]').length).toEqual(1)
    expect($('[data-qa="completed-in-prison-courses-in-last-12-months-table"]').length).toEqual(0)
    expect($('[data-qa="curious-unavailable-message"]').length).toEqual(1)
  })

  it('should not render function skills or in-prison course data given problem retrieving functional skills and in-prison course data', () => {
    // Given
    const pageViewModel = {
      prisonerSummary,
      functionalSkills: {
        problemRetrievingData: true,
      },
      inPrisonCourses: {
        problemRetrievingData: true,
      },
    }

    // When
    const content = njkEnv.render(template, pageViewModel)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa="functional-skills-table"]').length).toEqual(0)
    expect($('[data-qa="completed-in-prison-courses-in-last-12-months-table"]').length).toEqual(0)
    expect($('[data-qa="curious-unavailable-message"]').length).toEqual(2)
  })
})
