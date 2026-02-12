import nunjucks from 'nunjucks'
import * as cheerio from 'cheerio'
import { parseISO } from 'date-fns'
import formatDate from '../../../../../filters/formatDateFilter'
import aValidPrisonerSummary from '../../../../../testsupport/prisonerSummaryTestDataBuilder'
import formatFunctionalSkillTypeFilter from '../../../../../filters/formatFunctionalSkillTypeFilter'
import filterArrayOnPropertyFilter from '../../../../../filters/filterArrayOnPropertyFilter'
import validFunctionalSkills from '../../../../../testsupport/functionalSkillsTestDataBuilder'
import { Result } from '../../../../../utils/result/result'
import {
  aVerifiedQualification,
  verifiedQualifications as aVerifiedQualifications,
} from '../../../../../testsupport/verifiedQualificationsTestDataBuilder'
import { aValidEnglishInPrisonCourseCompletedWithinLast12Months } from '../../../../../testsupport/inPrisonCourseTestDataBuilder'
import {
  aValidCurious1Assessment,
  aValidCurious2Assessment,
} from '../../../../../testsupport/assessmentTestDataBuilder'
import AssessmentTypeValue from '../../../../../enums/assessmentTypeValue'
import aValidEducationDto from '../../../../../testsupport/educationDtoTestDataBuilder'
import validInPrisonCourseRecords from '../../../../../testsupport/inPrisonCourseRecordsTestDataBuilder'
import { anAchievedQualificationDto } from '../../../../../testsupport/achievedQualificationDtoTestDataBuilder'

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
const curiousInPrisonCourses = Result.fulfilled(validInPrisonCourseRecords())
const verifiedQualifications = Result.fulfilled(aVerifiedQualifications())
const education = Result.fulfilled(aValidEducationDto())

const templateParams = {
  prisonerSummary,
  prisonerFunctionalSkills,
  curiousInPrisonCourses,
  verifiedQualifications,
  education,
  prisonNamesById,
}

const template = '_newEducationAndTrainingSummaryCard.njk'

describe('_newEducationAndTrainingSummaryCard', () => {
  describe('Functional skills section', () => {
    it('should render functional skills', () => {
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
      }

      // When
      const content = njkEnv.render(template, params)
      const $ = cheerio.load(content)

      // Then
      expect($('section[data-qa=curious-functional-skills]').length).toEqual(1)

      const functionalSkillsRows = $('[data-qa="functional-skills-table-body"] tr')
      expect(functionalSkillsRows.length).toEqual(2)
      expect(functionalSkillsRows.eq(0).find('td').eq(0).text().trim()).toEqual('Maths skills')
      expect(functionalSkillsRows.eq(0).find('td').eq(1).text().trim()).toEqual('Level 2')
      expect(functionalSkillsRows.eq(0).find('td').eq(2).text().trim()).toEqual(
        'Assessed on 15 Jan 2023, Brixton (HMP)',
      )
      expect(functionalSkillsRows.eq(1).find('td').eq(0).text().trim()).toEqual('Reading')
      expect(functionalSkillsRows.eq(1).find('td').eq(1).text().trim()).toEqual('emerging reader')
      expect(functionalSkillsRows.eq(1).find('td').eq(2).text().trim()).toEqual(
        'Assessed on 28 Apr 2021, Moorland (HMP & YOI)',
      )

      expect($('[data-qa=no-functional-skills-in-curious-message]').length).toEqual(0)
      expect($('[data-qa=functional-skills-unavailable-message]').length).toEqual(0)
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
      expect($('section[data-qa=curious-functional-skills]').length).toEqual(1)
      expect($('[data-qa=no-functional-skills-in-curious-message]').length).toEqual(1)
      expect($('[data-qa=functional-skills-table]').length).toEqual(0)
      expect($('[data-qa=functional-skills-unavailable-message]').length).toEqual(0)
    })

    it('should render functional skills not available message given only functional skills API promises fail to resolve', () => {
      // Given
      const params = {
        ...templateParams,
        prisonerFunctionalSkills: Result.rejected(new Error('Failed to retrieve functional skills')),
      }

      // When
      const content = njkEnv.render(template, params)
      const $ = cheerio.load(content)

      // Then
      expect($('[data-qa=education-and-training-summary-card-api-error-banner]').length).toEqual(1)

      expect($('section[data-qa=curious-functional-skills]').length).toEqual(1)
      expect($('[data-qa=functional-skills-unavailable-message]').length).toEqual(1)
      expect($('[data-qa=functional-skills-table]').length).toEqual(0)

      expect($('section[data-qa=qualifications-courses-and-assessments]').length).toEqual(1)
      expect($('[data-qa=qualifications-courses-and-assessments-unavailable-message]').length).toEqual(0)
    })
  })

  describe('Qualifications, courses and assessments section', () => {
    it('should render counts given prisoner has LRS qualifications, in prison courses, and LWP educational qualifications', () => {
      // Given
      const params = {
        ...templateParams,
        verifiedQualifications: Result.fulfilled(
          aVerifiedQualifications({
            qualifications: [
              aVerifiedQualification({ source: 'AO' }),
              aVerifiedQualification({ source: 'NPD' }),
              aVerifiedQualification({ source: 'AO' }),
            ],
          }),
        ),
        curiousInPrisonCourses: Result.fulfilled(
          validInPrisonCourseRecords({
            coursesCompletedInLast12Months: [aValidEnglishInPrisonCourseCompletedWithinLast12Months()],
          }),
        ),
        education: Result.fulfilled(
          aValidEducationDto({
            qualifications: [anAchievedQualificationDto(), anAchievedQualificationDto(), anAchievedQualificationDto()],
          }),
        ),
      }

      // When
      const content = njkEnv.render(template, params)
      const $ = cheerio.load(content)

      // Then
      expect($('section[data-qa=qualifications-courses-and-assessments]').length).toEqual(1)
      expect($('[data-qa=qualifications-courses-and-assessments-counts]').length).toEqual(1)

      expect($('[data-qa=lrs-verified-qualifications-count]').text().trim()).toEqual('2')
      expect($('[data-qa=curious-in-prison-courses-count]').text().trim()).toEqual('1')
      expect($('[data-qa=lwp-qualifications-count]').text().trim()).toEqual('3')

      expect($('[data-qa=lrs-verified-qualifications-unavailable-message]').length).toEqual(0)
      expect($('[data-qa=curious-in-prison-courses-unavailable-message]').length).toEqual(0)
      expect($('[data-qa=lwp-qualifications-unavailable-message]').length).toEqual(0)

      expect($('[data-qa=qualifications-courses-and-assessments-unavailable-message]').length).toEqual(0)
    })

    it('should render counts given prisoner has no LRS qualifications, no in prison courses, and no LWP educational qualifications', () => {
      // Given
      const params = {
        ...templateParams,
        verifiedQualifications: Result.fulfilled(aVerifiedQualifications({ qualifications: [] })),
        curiousInPrisonCourses: Result.fulfilled(validInPrisonCourseRecords({ coursesCompletedInLast12Months: [] })),
        education: Result.fulfilled(aValidEducationDto({ qualifications: [] })),
      }

      // When
      const content = njkEnv.render(template, params)
      const $ = cheerio.load(content)

      // Then
      expect($('section[data-qa=qualifications-courses-and-assessments]').length).toEqual(1)
      expect($('[data-qa=qualifications-courses-and-assessments-counts]').length).toEqual(1)

      expect($('[data-qa=lrs-verified-qualifications-count]').text().trim()).toEqual('0')
      expect($('[data-qa=curious-in-prison-courses-count]').text().trim()).toEqual('0')
      expect($('[data-qa=lwp-qualifications-count]').text().trim()).toEqual('0')

      expect($('[data-qa=lrs-verified-qualifications-unavailable-message]').length).toEqual(0)
      expect($('[data-qa=curious-in-prison-courses-unavailable-message]').length).toEqual(0)
      expect($('[data-qa=lwp-qualifications-unavailable-message]').length).toEqual(0)

      expect($('[data-qa=qualifications-courses-and-assessments-unavailable-message]').length).toEqual(0)
    })

    it('should render counts and LRS unavailable message given LRS API promise fails but prisoner has in prison courses and LWP educational qualifications', () => {
      // Given
      const params = {
        ...templateParams,
        verifiedQualifications: Result.rejected(new Error('Failed to retrieve verified qualifications')),
        curiousInPrisonCourses: Result.fulfilled(
          validInPrisonCourseRecords({
            coursesCompletedInLast12Months: [aValidEnglishInPrisonCourseCompletedWithinLast12Months()],
          }),
        ),
        education: Result.fulfilled(
          aValidEducationDto({
            qualifications: [anAchievedQualificationDto(), anAchievedQualificationDto(), anAchievedQualificationDto()],
          }),
        ),
      }

      // When
      const content = njkEnv.render(template, params)
      const $ = cheerio.load(content)

      // Then
      expect($('section[data-qa=qualifications-courses-and-assessments]').length).toEqual(1)
      expect($('[data-qa=qualifications-courses-and-assessments-counts]').length).toEqual(1)

      expect($('[data-qa=lrs-verified-qualifications-unavailable-message]').length).toEqual(1)
      expect($('[data-qa=lrs-verified-qualifications-count]').length).toEqual(0)

      expect($('[data-qa=curious-in-prison-courses-count]').text().trim()).toEqual('1')
      expect($('[data-qa=lwp-qualifications-count]').text().trim()).toEqual('3')

      expect($('[data-qa=curious-in-prison-courses-unavailable-message]').length).toEqual(0)
      expect($('[data-qa=lwp-qualifications-unavailable-message]').length).toEqual(0)

      expect($('[data-qa=qualifications-courses-and-assessments-unavailable-message]').length).toEqual(0)
    })

    it('should render counts and curious in-prison courses unavailable message given Curious API promise fails but prisoner has LRS qualifications and LWP educational qualifications', () => {
      // Given
      const params = {
        ...templateParams,
        verifiedQualifications: Result.fulfilled(
          aVerifiedQualifications({
            qualifications: [
              aVerifiedQualification({ source: 'AO' }),
              aVerifiedQualification({ source: 'NPD' }),
              aVerifiedQualification({ source: 'AO' }),
            ],
          }),
        ),
        curiousInPrisonCourses: Result.rejected(new Error('Failed to retrieve in prison courses')),
        education: Result.fulfilled(
          aValidEducationDto({
            qualifications: [anAchievedQualificationDto(), anAchievedQualificationDto(), anAchievedQualificationDto()],
          }),
        ),
      }

      // When
      const content = njkEnv.render(template, params)
      const $ = cheerio.load(content)

      // Then
      expect($('section[data-qa=qualifications-courses-and-assessments]').length).toEqual(1)
      expect($('[data-qa=qualifications-courses-and-assessments-counts]').length).toEqual(1)

      expect($('[data-qa=curious-in-prison-courses-unavailable-message]').length).toEqual(1)
      expect($('[data-qa=curious-in-prison-courses-count]').length).toEqual(0)

      expect($('[data-qa=lrs-verified-qualifications-count]').text().trim()).toEqual('2')
      expect($('[data-qa=lwp-qualifications-count]').text().trim()).toEqual('3')

      expect($('[data-qa=lrs-verified-qualifications-unavailable-message]').length).toEqual(0)
      expect($('[data-qa=lwp-qualifications-unavailable-message]').length).toEqual(0)

      expect($('[data-qa=qualifications-courses-and-assessments-unavailable-message]').length).toEqual(0)
    })

    it('should render counts and LWP educational qualifications unavailable message given LWP API promise fails but prisoner has LRS qualifications and Curious in prison courses', () => {
      // Given
      const params = {
        ...templateParams,
        verifiedQualifications: Result.fulfilled(
          aVerifiedQualifications({
            qualifications: [
              aVerifiedQualification({ source: 'AO' }),
              aVerifiedQualification({ source: 'NPD' }),
              aVerifiedQualification({ source: 'AO' }),
            ],
          }),
        ),
        curiousInPrisonCourses: Result.fulfilled(
          validInPrisonCourseRecords({
            coursesCompletedInLast12Months: [aValidEnglishInPrisonCourseCompletedWithinLast12Months()],
          }),
        ),
        education: Result.rejected(new Error('Failed to retrieve education')),
      }

      // When
      const content = njkEnv.render(template, params)
      const $ = cheerio.load(content)

      // Then
      expect($('section[data-qa=qualifications-courses-and-assessments]').length).toEqual(1)
      expect($('[data-qa=qualifications-courses-and-assessments-counts]').length).toEqual(1)

      expect($('[data-qa=lwp-qualifications-unavailable-message]').length).toEqual(1)
      expect($('[data-qa=lwp-qualifications-count]').length).toEqual(0)

      expect($('[data-qa=lrs-verified-qualifications-count]').text().trim()).toEqual('2')
      expect($('[data-qa=curious-in-prison-courses-count]').text().trim()).toEqual('1')

      expect($('[data-qa=lrs-verified-qualifications-unavailable-message]').length).toEqual(0)
      expect($('[data-qa=curious-in-prison-courses-unavailable-message]').length).toEqual(0)

      expect($('[data-qa=qualifications-courses-and-assessments-unavailable-message]').length).toEqual(0)
    })
  })

  it('should not render functional skills or qualifications given all API promises fail to resolve', () => {
    // Given
    const params = {
      ...templateParams,
      prisonerFunctionalSkills: Result.rejected(new Error('Failed to retrieve functional skills')),
      curiousInPrisonCourses: Result.rejected(new Error('Failed to retrieve in prison courses')),
      verifiedQualifications: Result.rejected(new Error('Failed to retrieve verified qualifications')),
      education: Result.rejected(new Error('Failed to retrieve education')),
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=education-and-training-summary-card-api-error-banner]').length).toEqual(1)

    expect($('section[data-qa=curious-functional-skills]').length).toEqual(1)
    expect($('[data-qa=functional-skills-unavailable-message]').length).toEqual(1)
    expect($('[data-qa=functional-skills-table]').length).toEqual(0)

    expect($('section[data-qa=qualifications-courses-and-assessments]').length).toEqual(1)
    expect($('[data-qa=qualifications-courses-and-assessments-counts]').length).toEqual(0)
    expect($('[data-qa=qualifications-courses-and-assessments-unavailable-message]').length).toEqual(1)
  })
})
