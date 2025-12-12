import nunjucks from 'nunjucks'
import * as cheerio from 'cheerio'
import formatDate from '../../../../../filters/formatDateFilter'
import aValidPrisonerSummary from '../../../../../testsupport/prisonerSummaryTestDataBuilder'
import { Result } from '../../../../../utils/result/result'
import { verifiedQualifications } from '../../../../../testsupport/verifiedQualificationsTestDataBuilder'

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

const prisonerSummary = aValidPrisonerSummary()
const templateParams = {
  prisonerSummary,
  verifiedQualifications: Result.fulfilled(verifiedQualifications()),
}
const template = '_qualificationsAndCoursesFromLRS.njk'

describe('Education and Training tab view - LRS Qualifications', () => {
  it('should render the summary card given the Learner Records Service API promise is not resolved', () => {
    // Given
    const params = {
      ...templateParams,
      verifiedQualifications: Result.rejected(new Error('Failed to retrieve LRS Qualifications')),
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    expect($('[data-qa="learner-records-unavailable-message"]').length).toEqual(1)
  })
})
