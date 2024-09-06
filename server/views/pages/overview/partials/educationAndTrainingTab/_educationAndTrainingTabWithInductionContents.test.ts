import nunjucks, { Template } from 'nunjucks'
import * as fs from 'fs'
import * as cheerio from 'cheerio'
import aValidPrisonerSummary from '../../../../../testsupport/prisonerSummaryTestDataBuilder'
import aValidInductionResponse from '../../../../../testsupport/inductionResponseTestDataBuilder'

describe('educationAndTrainingTabContents', () => {
  const template = fs.readFileSync(
    'server/views/pages/overview/partials/educationAndTrainingTab/_educationAndTrainingTabWithInductionContents.njk',
  )

  let compiledTemplate: Template
  let viewContext: Record<string, unknown>
  const njkEnv = nunjucks.configure([
    'node_modules/govuk-frontend/dist/',
    'node_modules/@ministryofjustice/frontend/',
    'server/views/',
    __dirname,
  ])

  beforeEach(() => {
    compiledTemplate = nunjucks.compile(template.toString(), njkEnv)
  })

  it('should render the correct content when qualificationsEnabled is true', () => {
    // Given
    njkEnv.addGlobal('featureToggles', { qualificationsEnabled: true })

    const induction = aValidInductionResponse()
    const prisonerSummary = aValidPrisonerSummary()
    viewContext = { prisonerSummary, tab: 'education-and-training', induction }

    // When
    const $ = cheerio.load(compiledTemplate.render(viewContext))

    // Then
    expect($('[data-qa=education-and-qualifications-history]').text().trim()).toEqual(
      'Education and qualifications history',
    )
    expect($('[data-qa=qualifications-and-education-history]').length).toBe(0)
    expect($('[data-qa=educational-qualifications]').text().trim()).toEqual('Educational qualifications')
    expect($('[data-qa=add-educational-qualifications]').text().trim()).toEqual('Add educational qualifications')
    expect($('[data-qa=other-qualifications]').text().trim()).toEqual('Other qualifications and education history')
    expect($('[data-qa=add-education-history]').text().replace(/\s+/g, ' ').trim()).toEqual(
      'To add education history, including vocational qualifications, create a learning and work progress plan with Jimmy Lightfingers.',
    )
  })

  it('should render the correct content when qualificationsEnabled is false', () => {
    // Given
    njkEnv.addGlobal('featureToggles', { qualificationsEnabled: false })

    const induction = aValidInductionResponse()
    const prisonerSummary = aValidPrisonerSummary()
    viewContext = { prisonerSummary, tab: 'education-and-training', induction }

    // When
    const $ = cheerio.load(compiledTemplate.render(viewContext))

    // Then
    expect($('[data-qa=qualifications-and-education-history]').text().trim()).toEqual(
      'Qualifications and education history',
    )
    expect($('[data-qa=education-and-qualifications-history]').length).toBe(0)
    expect($('[data-qa=educational-qualifications]').length).toBe(0)
    expect($('[data-qa=add-educational-qualifications]').length).toBe(0)
    expect($('[data-qa=other-qualifications]').length).toBe(0)
    expect($('[data-qa=add-education-history]').length).toBe(0)
    expect($('[data-qa=add-education-and-training]').text().replace(/\s+/g, ' ').trim()).toEqual(
      'To add education and training information you need to create a learning and work progress plan with Jimmy Lightfingers.',
    )
  })

  it('should show data unavailable message if there is a problem retrieving induction data', () => {
    // Given
    const prisonerSummary = aValidPrisonerSummary()
    viewContext = {
      tab: 'education-and-training',
      induction: {
        problemRetrievingData: true,
      },
      prisonerSummary,
    }

    // When
    const $ = cheerio.load(compiledTemplate.render(viewContext))

    // Then
    expect($('[data-qa=induction-unavailable-message]').text().trim()).toEqual('We cannot show these details right now')
    expect($('[data-qa=data-unavailable-message-body]').text().trim()).toEqual(
      'Reload the page or try again later. Other parts of this service may still be available.',
    )
  })
})
