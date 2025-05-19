import nunjucks from 'nunjucks'
import * as cheerio from 'cheerio'
import aValidPrisonerSummary from '../../../../../testsupport/prisonerSummaryTestDataBuilder'
import findErrorFilter from '../../../../../filters/findErrorFilter'
import formatReviewExemptionReasonFilter from '../../../../../filters/formatReviewExemptionReasonFilter'
import assetMapFilter from '../../../../../filters/assetMapFilter'

describe('ExemptionReasonPage', () => {
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
    .addFilter('formatReviewExemptionReason', formatReviewExemptionReasonFilter)
    .addFilter('assetMap', assetMapFilter)

  const prisonerSummary = aValidPrisonerSummary()

  it('should render the correct content', () => {
    // Given
    const model = {
      prisonerSummary,
    }

    // When
    const content = njkEnv.render('index.njk', model)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa="page-heading"]').text().trim()).toBe(
      "Select an exemption reason to put Ifereeca Peigh's review on hold",
    )
    const radioLabels = $('input[name="exemptionReason"] + label')
    expect($(radioLabels[0]).text().trim()).toBe(`Has a drug or alcohol dependency and is in assessment or treatment`)
    expect($(radioLabels[1]).text().trim()).toBe(`Has a health concern and is in assessment or treatment`)
    expect($(radioLabels[2]).text().trim()).toBe(
      `Has failed to engage or cooperate for a reason outside contractor's control`,
    )
    expect($(radioLabels[3]).text().trim()).toBe(`Has escaped, absconded or failed to return to prison`)
    expect($(radioLabels[4]).text().trim()).toBe(
      `Prison regime changes or circumstances outside the contractor's control`,
    )
    expect($(radioLabels[5]).text().trim()).toBe(`Prisoner safety`)
    expect($('[data-qa="hint-safety-issues"]').text().trim()).toBe(
      'for example, vulnerable prisoners who you cannot visit in cell and cannot move around prison without threat of violence',
    )
    expect($(radioLabels[6]).text().trim()).toBe(`Prison staff redeployed`)
    expect($('[data-qa="hint-staff-redeployment"]').text().trim()).toBe(
      'for example, if the prison cannot facilitate sessions due to staff not being available to escort prisoners',
    )
    expect($(radioLabels[7]).text().trim()).toBe(`Prison operational or security reason`)
    expect($('[data-qa="hint-operation-issue"]').text().trim()).toBe(
      'for example, prison staff retraining or an incident lasting several days',
    )
    expect($(radioLabels[8]).text().trim()).toBe(`Security issue that poses risk to staff`)
    expect($('[data-qa="hint-security-risk"]').text().trim()).toBe(
      'where the prisoner is violent and there is a risk to prison or CIAG staff',
    )
    expect($(radioLabels[9]).text().trim()).toBe(
      `Review logged late due to technical issue with learning and work progress service`,
    )
  })
})
