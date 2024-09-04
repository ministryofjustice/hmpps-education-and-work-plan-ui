import nunjucks from 'nunjucks'
import * as cheerio from 'cheerio'
import type { InductionDto } from 'inductionDto'
import { aValidInductionDto } from '../../../../../testsupport/inductionDtoTestDataBuilder'
import formatQualificationLevel from '../../../../../filters/formatQualificationLevelFilter'
import formatEducationLevel from '../../../../../filters/formatEducationLevelFilter'
import formatDateFilter from '../../../../../filters/formatDateFilter'
import EducationAndTrainingView from '../../../../../routes/overview/educationAndTrainingView'
import aValidPrisonerSummary from '../../../../../testsupport/prisonerSummaryTestDataBuilder'
import achievedQualificationObjectsSortedInScreenOrderFilter from '../../../../../filters/achievedQualificationObjectsSortedInScreenOrderFilter'
import sortedAlphabeticallyWithOtherLastFilter from '../../../../../filters/sortedAlphabeticallyWithOtherLastFilter'
import formatAdditionalTrainingFilter from '../../../../../filters/formatAdditionalTrainingFilter'

const njkEnv = nunjucks.configure([
  'node_modules/govuk-frontend/dist/',
  'node_modules/@ministryofjustice/frontend/',
  'server/views/',
  __dirname,
])
njkEnv
  .addFilter('achievedQualificationObjectsSortedInScreenOrder', achievedQualificationObjectsSortedInScreenOrderFilter)
  .addFilter('sortedAlphabeticallyWithOtherLast', sortedAlphabeticallyWithOtherLastFilter)
  .addFilter('formatAdditionalTraining', formatAdditionalTrainingFilter)
  .addFilter('formatQualificationLevel', formatQualificationLevel)
  .addFilter('formatEducationLevel', formatEducationLevel)
  .addFilter('formatDate', formatDateFilter)

describe('_educationAndQualificationsHistoryWithInduction.njk', () => {
  it('should display qualifications table when there are educational qualifications recorded', () => {
    // Given
    const inductionDto = aValidInductionDto()
    const pageViewModel = educationAndTrainingView(inductionDto)

    // When
    const content = nunjucks.render('_educationAndQualificationsHistoryWithInduction.njk', pageViewModel)
    const $ = cheerio.load(content)

    // Then
    const qualifications = $('[data-qa="induction-previous-qualifications-table"] tbody tr')
      .toArray()
      .map(row => {
        const cells = $(row).find('td').toArray()
        return cells.map(cell => $(cell).text().trim())
      })
    expect(qualifications).toEqual([['Pottery', 'Level 4', 'C']])
    expect($('[data-qa=educational-qualifications-change-link]').text().replace(/\s+/g, ' ').trim()).toEqual(
      'Change qualifications by adding or removing qualifications',
    )
  })

  it('should display message when no educational qualifications recorded', () => {
    // Given
    const inductionDto = aValidInductionDto()
    inductionDto.previousQualifications.qualifications = []
    inductionDto.previousQualifications.educationLevel = []
    const pageViewModel = educationAndTrainingView(inductionDto)

    // When
    const content = nunjucks.render('_educationAndQualificationsHistoryWithInduction.njk', pageViewModel)
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
    const inductionDto = aValidInductionDto()
    const pageViewModel = educationAndTrainingView(inductionDto)

    // When
    const content = nunjucks.render('_educationAndQualificationsHistoryWithInduction.njk', pageViewModel)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=highest-level-of-education]').text().trim()).toEqual('Secondary school, took exams')
    expect($('[data-qa=highest-level-of-education-change-link]').text().replace(/\s+/g, ' ').trim()).toEqual(
      'Change highest level of education before prison',
    )
  })

  it('should display "Not recorded" when highest level of education is not recorded', () => {
    // Given
    const inductionDto = aValidInductionDto()
    inductionDto.previousQualifications.educationLevel = ''
    const pageViewModel = educationAndTrainingView(inductionDto)

    // When
    const content = nunjucks.render('_educationAndQualificationsHistoryWithInduction.njk', pageViewModel)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=highest-level-of-education]').text().trim()).toEqual('Not recorded.')
    expect($('[data-qa=highest-level-of-education-change-link]').text().replace(/\s+/g, ' ').trim()).toEqual(
      'Add highest level of education before prison',
    )
  })

  it('should display other training when recorded', () => {
    // Given
    const inductionDto = aValidInductionDto()
    const pageViewModel = educationAndTrainingView(inductionDto)

    // When
    const content = nunjucks.render('_educationAndQualificationsHistoryWithInduction.njk', pageViewModel)
    const $ = cheerio.load(content)

    // Then
    const otherTraining = $('[data-qa=other-training] li')
      .toArray()
      .map(el => $(el).text().replace(/\s+/g, ' ').trim())
    expect(otherTraining).toEqual(['First aid certificate', 'Manual handling', 'Other - Advanced origami'])
  })

  it('should display "No additional training recorded" when no other training recorded', () => {
    // Given
    const inductionDto = aValidInductionDto()
    inductionDto.previousTraining.trainingTypes = []
    inductionDto.previousTraining.trainingTypeOther = ''
    const pageViewModel = educationAndTrainingView(inductionDto)

    // When
    const content = nunjucks.render('_educationAndQualificationsHistoryWithInduction.njk', pageViewModel)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=other-training] li').length).toEqual(0)
    expect($('[data-qa=additional-training-change-link]').text().replace(/\s+/g, ' ').trim()).toEqual(
      'Change other training or qualifications',
    )
  })

  it('should display last updated information', () => {
    // Given
    const inductionDto = aValidInductionDto()
    const pageViewModel = educationAndTrainingView(inductionDto)

    // When
    const content = nunjucks.render('_educationAndQualificationsHistoryWithInduction.njk', pageViewModel)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=last-updated]').text().replace(/\s+/g, ' ').trim()).toEqual(
      'Last updated: 19 June 2023 by Alex Smith',
    )
  })
})

const educationAndTrainingView = (inductionDto: InductionDto) =>
  new EducationAndTrainingView(
    aValidPrisonerSummary(),
    null,
    null,
    { problemRetrievingData: false, inductionDto },
    { problemRetrievingData: false, educationDto: null },
  )
