import * as fs from 'fs'
import cheerio from 'cheerio'
import moment from 'moment'
import nunjucks, { Template } from 'nunjucks'
import { registerNunjucks } from '../../../../../utils/nunjucksSetup'
import aValidPrisonerSummary from '../../../../../testsupport/prisonerSummaryTestDataBuilder'

describe('Education and Training tab view - Other Qualifications and history - Long question set', () => {
  const template = fs.readFileSync(
    'server/views/pages/overview/partials/educationAndTrainingTab/_otherQualifications_inductionLongQuestionSet.njk',
  )
  const prisonerSummary = aValidPrisonerSummary()

  let compiledTemplate: Template
  let viewContext: Record<string, unknown>

  const njkEnv = registerNunjucks()

  beforeEach(() => {
    compiledTemplate = nunjucks.compile(template.toString(), njkEnv)
  })

  it('should render Other Qualifications and history summary list', () => {
    // Given
    viewContext = {
      prisonerSummary,
      tab: 'education-and-training',
      educationAndTraining: {
        problemRetrievingData: false,
        inductionQuestionSet: 'LONG_QUESTION_SET',
        data: {
          longQuestionSetAnswers: {
            highestEducationLevel: 'SECONDARY_SCHOOL_TOOK_EXAMS',
            additionalTraining: ['FIRST_AID_CERTIFICATE', 'HEALTH_AND_SAFETY'],
          },
          updatedAt: moment('2023-08-22T13:02:31.943Z').toDate(),
          updatedBy: 'A_DPS_USER_GEN',
        },
      },
    }

    // When
    const $ = cheerio.load(compiledTemplate.render(viewContext))

    // Then
    expect($('#other-qualifications-list .govuk-summary-list__row').length).toBe(2)
    expect(
      $('#other-qualifications-list .govuk-summary-list__row:nth-of-type(1) .govuk-summary-list__value').text(),
    ).toContain('Secondary school, took exams')
    expect(
      $('#other-qualifications-list .govuk-summary-list__row:nth-of-type(2) .govuk-summary-list__value').text(),
    ).toContain('First aid certificate')
    expect(
      $('#other-qualifications-list .govuk-summary-list__row:nth-of-type(2) .govuk-summary-list__value').text(),
    ).toContain('Health and safety')
  })
})
