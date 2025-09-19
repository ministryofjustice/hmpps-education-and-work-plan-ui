import nunjucks from 'nunjucks'
import * as cheerio from 'cheerio'
import { parseISO } from 'date-fns'
import type { InPrisonCourse } from 'viewModels'
import formatDate from '../../../../../filters/formatDateFilter'
import aValidPrisonerSummary from '../../../../../testsupport/prisonerSummaryTestDataBuilder'
import formatFunctionalSkillTypeFilter from '../../../../../filters/formatFunctionalSkillTypeFilter'
import filterArrayOnPropertyFilter from '../../../../../filters/filterArrayOnPropertyFilter'
import validFunctionalSkills from '../../../../../testsupport/functionalSkillsTestDataBuilder'
import { Result } from '../../../../../utils/result/result'
import { aValidInPrisonCourse } from '../../../../../testsupport/inPrisonCourseTestDataBuilder'
import {
  aValidCurious1Assessment,
  aValidCurious2Assessment,
} from '../../../../../testsupport/assessmentTestDataBuilder'
import AssessmentTypeValue from '../../../../../enums/assessmentTypeValue'

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
  .addFilter('filterArrayOnProperty', filterArrayOnPropertyFilter)

const prisonerSummary = aValidPrisonerSummary()
const prisonNamesById = { BXI: 'Brixton (HMP)', MDI: 'Moorland (HMP & YOI)' }
const prisonerFunctionalSkills = Result.fulfilled(validFunctionalSkills())
const curiousInPrisonCourses = Result.fulfilled({
  coursesCompletedInLast12Months: [
    aValidInPrisonCourse({
      prisonId: 'BXI',
      courseName: 'Basic English',
      courseCode: 'ENG_01',
      isAccredited: true,
      courseStartDate: parseISO('2022-12-01T00:00:00Z'),
      courseCompletionDate: parseISO('2023-06-15T00:00:00Z'),
      courseStatus: 'COMPLETED',
      grade: 'Pass',
      source: 'CURIOUS1',
    }),
  ],
  hasWithdrawnOrInProgressCourses: () => false,
  hasCoursesCompletedMoreThan12MonthsAgo: () => false,
})
const templateParams = {
  prisonerSummary,
  prisonerFunctionalSkills,
  curiousInPrisonCourses,
  prisonNamesById,
}

const template = '_educationAndTrainingSummaryCard.njk'

describe('_educationAndTrainingSummaryCard', () => {
  it('should render education and training summary card correctly given prisoner has functional skills and in-prison courses completed in the last 12 months', () => {
    // Given
    const params = {
      ...templateParams,
      prisonerFunctionalSkills: Result.fulfilled(
        validFunctionalSkills({
          assessments: [
            aValidCurious1Assessment({
              prisonId: 'LEI',
              type: AssessmentTypeValue.MATHS,
              level: 'Level 1',
              assessmentDate: parseISO('2022-01-15T00:00:00Z'),
            }),
            aValidCurious1Assessment({
              prisonId: 'BXI',
              type: AssessmentTypeValue.MATHS,
              level: 'Level 2',
              assessmentDate: parseISO('2023-01-15T00:00:00Z'),
            }),
            aValidCurious2Assessment({
              prisonId: 'MDI',
              type: AssessmentTypeValue.READING,
              level: 'emerging reader',
            }),
          ],
        }),
      ),
      curiousInPrisonCourses: Result.fulfilled({
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
        hasWithdrawnOrInProgressCourses: () => false,
        hasCoursesCompletedMoreThan12MonthsAgo: () => false,
      }),
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    const functionalSkillsRows = $('[data-qa="functional-skills-table-body"] tr')
    expect(functionalSkillsRows.length).toEqual(2)
    expect(functionalSkillsRows.eq(0).find('td').eq(0).text().trim()).toEqual('Maths skills')
    expect(functionalSkillsRows.eq(0).find('td').eq(1).text().trim()).toEqual('Level 2')
    expect(functionalSkillsRows.eq(0).find('td').eq(2).text().trim()).toEqual('Assessed on 15 Jan 2023, Brixton (HMP)')
    expect(functionalSkillsRows.eq(1).find('td').eq(0).text().trim()).toEqual('Reading')
    expect(functionalSkillsRows.eq(1).find('td').eq(1).text().trim()).toEqual('emerging reader')
    expect(functionalSkillsRows.eq(1).find('td').eq(2).text().trim()).toEqual(
      'Assessed on 28 Apr 2021, Moorland (HMP & YOI)',
    )

    expect($('[data-qa=no-functional-skills-in-curious-message]').length).toEqual(0)

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

  it('should render no functional skills message given prisoner has no functional skills at all', () => {
    // Given
    const params = {
      ...templateParams,
      prisonerFunctionalSkills: Result.fulfilled(
        validFunctionalSkills({
          assessments: [],
        }),
      ),
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa="no-functional-skills-in-curious-message"]').length).toEqual(1)
    expect($('[data-qa="functional-skills-table-body"]').length).toEqual(0)

    expect($('[data-qa="curious-unavailable-message"]').length).toEqual(0)
  })

  it('should render no course message given prisoner has taken no courses at all', () => {
    // Given
    const params = {
      ...templateParams,
      curiousInPrisonCourses: Result.fulfilled({
        coursesCompletedInLast12Months: [] as Array<InPrisonCourse>,
        hasWithdrawnOrInProgressCourses: () => false,
        hasCoursesCompletedMoreThan12MonthsAgo: () => false,
      }),
    }

    // When
    const content = njkEnv.render(template, params)
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
    const params = {
      ...templateParams,
      curiousInPrisonCourses: Result.fulfilled({
        coursesCompletedInLast12Months: [] as Array<InPrisonCourse>,
        hasWithdrawnOrInProgressCourses: () => true,
        hasCoursesCompletedMoreThan12MonthsAgo: () => false,
      }),
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa="completed-in-prison-courses-in-last-12-months-table"]').length).toEqual(0)
    expect($('[data-qa="no-courses-completed-in-last-12-months-message"]').length).toEqual(0)
    expect($('[data-qa="no-courses-completed-yet-message"]').length).toEqual(1)
    expect($('[data-qa="no-courses-recorded-message"]').length).toEqual(0)

    expect($('[data-qa="curious-unavailable-message"]').length).toEqual(0)
  })

  it('should render course completed over 12 months ago message given prisoner has courses over 12 months ago', () => {
    // Given
    const params = {
      ...templateParams,
      curiousInPrisonCourses: Result.fulfilled({
        coursesCompletedInLast12Months: [] as Array<InPrisonCourse>,
        hasWithdrawnOrInProgressCourses: () => false,
        hasCoursesCompletedMoreThan12MonthsAgo: () => true,
      }),
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa="completed-in-prison-courses-in-last-12-months-table"]').length).toEqual(0)
    expect($('[data-qa="no-courses-completed-in-last-12-months-message"]').length).toEqual(1)
    expect($('[data-qa="no-courses-completed-yet-message"]').length).toEqual(0)
    expect($('[data-qa="no-courses-recorded-message"]').length).toEqual(0)

    expect($('[data-qa="curious-unavailable-message"]').length).toEqual(0)
  })

  it('should not render functional skills data given Functional Skills promise is not resolved', () => {
    // Given
    const params = {
      ...templateParams,
      prisonerFunctionalSkills: Result.rejected(new Error('Failed to retrieve functional skills')),
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa="functional-skills-table"]').length).toEqual(0)
    expect($('[data-qa="completed-in-prison-courses-in-last-12-months-table"]').length).toEqual(1)
    expect($('[data-qa="curious-unavailable-message"]').length).toEqual(1)
  })

  it('should not render in-prison course data given problem retrieving in-prison course data', () => {
    // Given
    const params = {
      ...templateParams,
      curiousInPrisonCourses: Result.rejected(new Error('Failed to retrieve in-prison courses')),
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa="functional-skills-table"]').length).toEqual(1)
    expect($('[data-qa="completed-in-prison-courses-in-last-12-months-table"]').length).toEqual(0)
    expect($('[data-qa="curious-unavailable-message"]').length).toEqual(1)
  })

  it('should not render function skills or in-prison course data given problem retrieving functional skills and in-prison course data', () => {
    // Given
    const params = {
      ...templateParams,
      prisonerFunctionalSkills: Result.rejected(new Error('Failed to retrieve functional skills')),
      curiousInPrisonCourses: Result.rejected(new Error('Failed to retrieve in-prison courses')),
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa="functional-skills-table"]').length).toEqual(0)
    expect($('[data-qa="completed-in-prison-courses-in-last-12-months-table"]').length).toEqual(0)
    expect($('[data-qa="curious-unavailable-message"]').length).toEqual(2)
  })
})
