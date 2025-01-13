import nunjucks from 'nunjucks'
import * as cheerio from 'cheerio'
import aValidPrisonerSummary from '../../../../../testsupport/prisonerSummaryTestDataBuilder'
import SessionCompletedByValue from '../../../../../enums/sessionCompletedByValue'
import findErrorFilter from '../../../../../filters/findErrorFilter'

describe('ReviewNotePage', () => {
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
    .addFilter('findError', findErrorFilter)

  const prisonerSummary = aValidPrisonerSummary()

  it('should render the correct content', () => {
    // Given
    const model = {
      prisonerSummary,
      reviewPlanDto: {
        completedBy: SessionCompletedByValue.MYSELF,
      },
    }

    // When
    const content = njkEnv.render('index.njk', model)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa="page-heading"]').text().trim()).toBe('Add a note to this review')
    expect($('[data-qa="warning-text"]').text().replace(/\s+/g, ' ').trim()).toBe(
      '! Warning This note will not be sent to case notes',
    )
    expect($('[data-qa="first-paragraph"]').text().trim()).toBe(
      'To help allocations, referrals, and personal development include any details of:',
    )
    const listItems = $('[data-qa="unordered-list"] li')
      .map((_, el) => $(el).text().trim())
      .get()
    expect(listItems).toEqual([
      'reviewing pathways based on skills, aspirations, and the activities available in your prison if the prisoner has transferred',
      'helping them develop their CV and disclosure letters',
      'referring and signposting them to other organisations to find employment - specify which ones',
      'supporting the learning and skills manager and prison employment lead',
      'any CIAG programme content provided - specify the type and subject, like job fairs, recruitment events, mock interviews, employer presentations (for example on application tips or career and sector awareness)',
    ])
  })
})
