import nunjucks from 'nunjucks'
import * as cheerio from 'cheerio'
import type { EducationDto } from 'dto'
import formatQualificationLevel from '../../../../../filters/formatQualificationLevelFilter'
import formatEducationLevel from '../../../../../filters/formatEducationLevelFilter'
import formatDateFilter from '../../../../../filters/formatDateFilter'
import aValidPrisonerSummary from '../../../../../testsupport/prisonerSummaryTestDataBuilder'
import achievedQualificationObjectsSortedInScreenOrderFilter from '../../../../../filters/achievedQualificationObjectsSortedInScreenOrderFilter'
import aValidEducationDto from '../../../../../testsupport/educationDtoTestDataBuilder'

const njkEnv = nunjucks.configure([
  'node_modules/govuk-frontend/dist/',
  'node_modules/@ministryofjustice/frontend/',
  'server/views/',
  __dirname,
])
njkEnv
  .addFilter('achievedQualificationObjectsSortedInScreenOrder', achievedQualificationObjectsSortedInScreenOrderFilter)
  .addFilter('formatQualificationLevel', formatQualificationLevel)
  .addFilter('formatEducationLevel', formatEducationLevel)
  .addFilter('formatDate', formatDateFilter)

describe('_educationAndQualificationsHistoryWithoutInduction.njk', () => {
  it('should display qualifications table when there are educational qualifications recorded outside of an induction', () => {
    // Given
    const educationDto = aValidEducationDto()
    const pageViewModel = educationAndTrainingView(educationDto)

    // When
    const content = nunjucks.render('_educationAndQualificationsHistoryWithoutInduction.njk', pageViewModel)
    const $ = cheerio.load(content)
    const qualifications = $('[data-qa="education-previous-qualifications-table"] tbody tr')
      .toArray()
      .map(row => {
        const cells = $(row).find('td').toArray()
        return cells.map(cell => $(cell).text().trim())
      })

    // Then
    expect(qualifications).toEqual([['GCSE Maths', 'Level 2', 'A*']])

    expect($('[data-qa=educational-qualifications-change-link]').text().replace(/\s+/g, ' ').trim()).toEqual(
      'Change qualifications by adding or removing qualifications',
    )
  })

  it('should display a message when no educational qualifications recorded', () => {
    // Given
    const educationDto: EducationDto = null
    const pageViewModel = educationAndTrainingView(educationDto)

    // When
    const content = nunjucks.render('_educationAndQualificationsHistoryWithoutInduction.njk', pageViewModel)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=no-educational-qualifications-recorded]').text().trim()).toEqual(
      'No educational qualifications recorded',
    )
    expect($('[data-qa=educational-qualifications-change-link]').text().replace(/\s+/g, ' ').trim()).toEqual(
      'Change qualifications by setting the highest level of education and adding one or more qualifications if they took exams',
    )
  })

  it('should display highest level of education when recorded', () => {
    // Given
    const educationDto = aValidEducationDto()
    const pageViewModel = educationAndTrainingView(educationDto)

    // When
    const content = nunjucks.render('_educationAndQualificationsHistoryWithoutInduction.njk', pageViewModel)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=highest-level-of-education]').text().trim()).toEqual('Secondary school, took exams')
    const changeLinkText = $('[data-qa=highest-level-of-education-change-link]').text().replace(/\s+/g, ' ').trim()
    expect(changeLinkText).toEqual('Change highest level of education before prison')
  })

  it('should display "Not recorded" when highest level of education is not recorded', () => {
    // Given
    const educationDto = aValidEducationDto()
    educationDto.educationLevel = ''
    const pageViewModel = educationAndTrainingView(educationDto)

    // When
    const content = nunjucks.render('_educationAndQualificationsHistoryWithoutInduction.njk', pageViewModel)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=highest-level-of-education]').text().trim()).toEqual('Not recorded.')
    const changeLinkText = $('[data-qa=highest-level-of-education-change-link]').text().replace(/\s+/g, ' ').trim()
    expect(changeLinkText).toEqual('Change highest level of education before prison')
  })

  it('should display last updated information', () => {
    // Given
    const educationDto = aValidEducationDto()
    const pageViewModel = educationAndTrainingView(educationDto)

    // When
    const content = nunjucks.render('_educationAndQualificationsHistoryWithoutInduction.njk', pageViewModel)
    const $ = cheerio.load(content)

    // Then
    const lastUpdated = $('[data-qa=last-updated]').text().replace(/\s+/g, ' ').trim()
    expect(lastUpdated).toEqual('Last updated: 19 June 2023 by Alex Smith')
  })
})

const educationAndTrainingView = (educationDto: EducationDto) => ({
  prisonerSummary: aValidPrisonerSummary(),
  education: {
    problemRetrievingData: false,
    educationDto,
  },
})
