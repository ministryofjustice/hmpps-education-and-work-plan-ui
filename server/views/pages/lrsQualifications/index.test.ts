import nunjucks from 'nunjucks'
import * as cheerio from 'cheerio'
import { startOfDay } from 'date-fns'
import formatDateFilter from '../../../filters/formatDateFilter'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import { Result } from '../../../utils/result/result'
import {
  aVerifiedQualification,
  verifiedQualifications,
} from '../../../testsupport/verifiedQualificationsTestDataBuilder'
import filterArrayOnPropertyFilter from '../../../filters/filterArrayOnPropertyFilter'

const njkEnv = nunjucks.configure([
  'node_modules/govuk-frontend/dist/',
  'node_modules/@ministryofjustice/frontend/',
  'server/views/',
  __dirname,
])

njkEnv //
  .addFilter('assetMap', () => '')
  .addFilter('formatDate', formatDateFilter)
  .addFilter('filterArrayOnProperty', filterArrayOnPropertyFilter)

const template = './index.njk'

const userHasPermissionTo = jest.fn()
const templateParams = {
  verifiedQualifications: Result.fulfilled(verifiedQualifications()),
  prisonerSummary: aValidPrisonerSummary(),
  userHasPermissionTo,
}

describe('LRS Qualifications Page tests', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should render the content given the Learner Record service returned match and learner has qualifications', () => {
    // Given
    const params = {
      ...templateParams,
      verifiedQualifications: Result.fulfilled(
        verifiedQualifications({
          status: 'PRN_MATCHED_TO_LEARNER_RECORD',
          qualifications: [
            aVerifiedQualification({ source: 'ILR', subject: 'Spanish' }),
            aVerifiedQualification({ source: 'AO', subject: 'Maths', awardedOn: startOfDay('2010-09-01') }),
            aVerifiedQualification({ source: 'ILR', subject: 'Woodwork' }),
            aVerifiedQualification({ source: 'AO', subject: 'English', awardedOn: startOfDay('2010-09-02') }),
          ],
        }),
      ),
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    const qualificationsTable = $('[data-qa=verified-qualifications]')
    expect(qualificationsTable.length).toEqual(1)
    expect(qualificationsTable.find('tbody tr').length).toEqual(2)
    expect(qualificationsTable.find('tbody tr').eq(0).find('td').eq(0).text().trim()).toEqual('English')
    expect(qualificationsTable.find('tbody tr').eq(0).find('td').eq(5).text().trim()).toEqual('2 September 2010')
    expect(qualificationsTable.find('tbody tr').eq(1).find('td').eq(0).text().trim()).toEqual('Maths')
    expect(qualificationsTable.find('tbody tr').eq(1).find('td').eq(5).text().trim()).toEqual('1 September 2010')
    expect($('[data-qa=learner-matched-but-has-no-qualifications-message]').length).toEqual(0)
    expect($('[data-qa=not-matched-in-lrs-message]').length).toEqual(0)
    expect($('[data-qa=link-to-lrs]').length).toEqual(0)
    expect($('[data-qa=learner-declined-to-share-data-message]').length).toEqual(0)
    expect($('[data-qa=learner-records-unavailable-message]').length).toEqual(0)
    expect(userHasPermissionTo).not.toHaveBeenCalled()
  })

  it('should render the content given the Learner Record service returned match but learner has no AO qualifications', () => {
    // Given
    const params = {
      ...templateParams,
      verifiedQualifications: Result.fulfilled(
        verifiedQualifications({
          status: 'PRN_MATCHED_TO_LEARNER_RECORD',
          qualifications: [aVerifiedQualification({ source: 'ILR' })],
        }),
      ),
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=verified-qualifications]').length).toEqual(0)
    expect($('[data-qa=learner-matched-but-has-no-qualifications-message]').length).toEqual(1)
    expect($('[data-qa=not-matched-in-lrs-message]').length).toEqual(0)
    expect($('[data-qa=link-to-lrs]').length).toEqual(0)
    expect($('[data-qa=learner-declined-to-share-data-message]').length).toEqual(0)
    expect($('[data-qa=learner-records-unavailable-message]').length).toEqual(0)
    expect(userHasPermissionTo).not.toHaveBeenCalled()
  })

  it('should render the content given the Learner Record service returned match but learner has no qualifications at all', () => {
    // Given
    const params = {
      ...templateParams,
      verifiedQualifications: Result.fulfilled(
        verifiedQualifications({
          status: 'PRN_MATCHED_TO_LEARNER_RECORD',
          qualifications: [],
        }),
      ),
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=verified-qualifications]').length).toEqual(0)
    expect($('[data-qa=learner-matched-but-has-no-qualifications-message]').length).toEqual(1)
    expect($('[data-qa=not-matched-in-lrs-message]').length).toEqual(0)
    expect($('[data-qa=link-to-lrs]').length).toEqual(0)
    expect($('[data-qa=learner-declined-to-share-data-message]').length).toEqual(0)
    expect($('[data-qa=learner-records-unavailable-message]').length).toEqual(0)
    expect(userHasPermissionTo).not.toHaveBeenCalled()
  })

  it('should render the content given the Learner Record service returned match but learner has declined to share data', () => {
    // Given
    const params = {
      ...templateParams,
      verifiedQualifications: Result.fulfilled(
        verifiedQualifications({
          status: 'LEARNER_DECLINED_TO_SHARE_DATA',
          qualifications: [],
        }),
      ),
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=verified-qualifications]').length).toEqual(0)
    expect($('[data-qa=learner-matched-but-has-no-qualifications-message]').length).toEqual(0)
    expect($('[data-qa=not-matched-in-lrs-message]').length).toEqual(0)
    expect($('[data-qa=link-to-lrs]').length).toEqual(0)
    expect($('[data-qa=learner-declined-to-share-data-message]').length).toEqual(1)
    expect($('[data-qa=learner-records-unavailable-message]').length).toEqual(0)
    expect(userHasPermissionTo).not.toHaveBeenCalled()
  })

  it('should render the content given the Learner Record service returned no match and user has permission to use LRS', () => {
    // Given
    userHasPermissionTo.mockReturnValue(true)

    const params = {
      ...templateParams,
      verifiedQualifications: Result.fulfilled(
        verifiedQualifications({
          status: 'PRN_NOT_MATCHED_TO_LEARNER_RECORD',
          qualifications: [],
        }),
      ),
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=verified-qualifications]').length).toEqual(0)
    expect($('[data-qa=learner-matched-but-has-no-qualifications-message]').length).toEqual(0)
    expect($('[data-qa=not-matched-in-lrs-message]').length).toEqual(1)
    expect($('[data-qa=link-to-lrs]').length).toEqual(1)
    expect($('[data-qa=learner-declined-to-share-data-message]').length).toEqual(0)
    expect($('[data-qa=learner-records-unavailable-message]').length).toEqual(0)
    expect(userHasPermissionTo).toHaveBeenCalledWith('USE_DPS_LEARNER_RECORD_MATCHING_SERVICE')
  })

  it('should render the content given the Learner Record service returned no match and user does not have permission to use LRS', () => {
    // Given
    userHasPermissionTo.mockReturnValue(false)

    const params = {
      ...templateParams,
      verifiedQualifications: Result.fulfilled(
        verifiedQualifications({
          status: 'PRN_NOT_MATCHED_TO_LEARNER_RECORD',
          qualifications: [],
        }),
      ),
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=verified-qualifications]').length).toEqual(0)
    expect($('[data-qa=learner-matched-but-has-no-qualifications-message]').length).toEqual(0)
    expect($('[data-qa=not-matched-in-lrs-message]').length).toEqual(1)
    expect($('[data-qa=link-to-lrs]').length).toEqual(0)
    expect($('[data-qa=learner-declined-to-share-data-message]').length).toEqual(0)
    expect($('[data-qa=learner-records-unavailable-message]').length).toEqual(0)
    expect(userHasPermissionTo).toHaveBeenCalledWith('USE_DPS_LEARNER_RECORD_MATCHING_SERVICE')
  })

  it('should render the content given the Learner Record service API promise is not resolved', () => {
    // Given
    const params = {
      ...templateParams,
      verifiedQualifications: Result.rejected(new Error('Failed to get Learner Records')),
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=verified-qualifications]').length).toEqual(0)
    expect($('[data-qa=learner-matched-but-has-no-qualifications-message]').length).toEqual(0)
    expect($('[data-qa=learner-records-unavailable-message]').length).toEqual(1)
    expect($('[data-qa=not-matched-in-lrs-message]').length).toEqual(0)
    expect($('[data-qa=learner-declined-to-share-data-message]').length).toEqual(0)
    expect($('[data-qa=link-to-lrs]').length).toEqual(0)
    expect(userHasPermissionTo).not.toHaveBeenCalled()
  })
})
