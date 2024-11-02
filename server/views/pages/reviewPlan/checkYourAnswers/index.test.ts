import nunjucks from 'nunjucks'
import * as cheerio from 'cheerio'
import aValidPrisonerSummary from '../../../../testsupport/prisonerSummaryTestDataBuilder'
import ReviewPlanCompletedByValue from '../../../../enums/reviewPlanCompletedByValue'
import { initialiseName } from '../../../../utils/utils'

describe('ReviewPlanCheckYourAnswersPage', () => {
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
    .addFilter('initialiseName', initialiseName)

  const prisonerSummary = aValidPrisonerSummary()

  it('should render the correct content when "I did the review myself" is selected', () => {
    // Given
    const model = {
      prisonerSummary,
      reviewPlanDto: {
        completedBy: ReviewPlanCompletedByValue.MYSELF,
        notes: 'Progress noted in review.',
      },
    }

    // When
    const content = njkEnv.render('index.njk', model)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa="page-heading"]').text().replace(/\s+/g, ' ').trim()).toBe(
      `Check Jimmy Lightfingers's review information`,
    )
    expect($('[data-qa="review-completed-by-change-link"]').attr('href')).toBe(
      `/plan/${prisonerSummary.prisonNumber}/review`,
    )
    expect($('[data-qa="review-completed-by"]').text().trim()).toBe('I completed the review myself')
    expect($('[data-qa="job-role"]').length).toEqual(0)
    expect($('[data-qa="review-note-change-link"]').attr('href')).toBe(
      `/plan/${prisonerSummary.prisonNumber}/review/notes`,
    )
    expect($('[data-qa="review-note"]').text().trim()).toBe('Progress noted in review.')
  })

  it('should render the correct content when "Somebody else did the review" is selected', () => {
    // Given
    const model = {
      prisonerSummary,
      reviewPlanDto: {
        completedBy: ReviewPlanCompletedByValue.SOMEBODY_ELSE,
        completedByOtherFullName: 'Larry David',
        completedByOtherJobRole: 'CIAG',
        notes: 'Progress noted in review.',
      },
    }

    // When
    const content = njkEnv.render('index.njk', model)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa="page-heading"]').text().replace(/\s+/g, ' ').trim()).toBe(
      `Check Jimmy Lightfingers's review information`,
    )
    expect($('[data-qa="review-completed-by-change-link"]').attr('href')).toBe(
      `/plan/${prisonerSummary.prisonNumber}/review`,
    )
    expect($('[data-qa="review-completed-by"]').text().trim()).toBe('Larry David')
    expect($('[data-qa="job-role"]').text().trim()).toBe('CIAG')
    expect($('[data-qa="review-note-change-link"]').attr('href')).toBe(
      `/plan/${prisonerSummary.prisonNumber}/review/notes`,
    )
    expect($('[data-qa="review-note"]').text().trim()).toBe('Progress noted in review.')
  })
})
