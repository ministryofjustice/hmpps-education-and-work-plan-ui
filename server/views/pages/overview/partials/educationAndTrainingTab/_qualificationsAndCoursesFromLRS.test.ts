import nunjucks from 'nunjucks'
import * as cheerio from 'cheerio'
import { startOfDay } from 'date-fns'
import formatDate from '../../../../../filters/formatDateFilter'
import aValidPrisonerSummary from '../../../../../testsupport/prisonerSummaryTestDataBuilder'
import { Result } from '../../../../../utils/result/result'
import {
  aVerifiedQualification,
  verifiedQualifications,
} from '../../../../../testsupport/verifiedQualificationsTestDataBuilder'
import filterArrayOnPropertyFilter from '../../../../../filters/filterArrayOnPropertyFilter'

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
  .addFilter('filterArrayOnProperty', filterArrayOnPropertyFilter)

const userHasPermissionTo = jest.fn()
const prisonerSummary = aValidPrisonerSummary()
const templateParams = {
  prisonerSummary,
  verifiedQualifications: Result.fulfilled(verifiedQualifications()),
  userHasPermissionTo,
}
const template = '_qualificationsAndCoursesFromLRS.njk'

describe('Education and Training tab view - LRS Qualifications', () => {
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
    expect($('.moj-pagination__results').text().trim()).toEqual('Showing 1 to 2 of 2 results')
    expect($('[data-qa=learner-matched-but-has-no-qualifications-message]').length).toEqual(0)
    expect($('[data-qa=not-matched-in-lrs-message]').length).toEqual(0)
    expect($('[data-qa=link-to-lrs]').length).toEqual(0)
    expect($('[data-qa=learner-declined-to-share-data-message]').length).toEqual(0)
    expect($('[data-qa=learner-records-unavailable-message]').length).toEqual(0)
    expect(userHasPermissionTo).not.toHaveBeenCalled()
  })

  it('should render the content displaying a maximum of 10 records given the Learner Record service returned match and learner has more than 10 AO qualifications', () => {
    // Given
    const params = {
      ...templateParams,
      verifiedQualifications: Result.fulfilled(
        verifiedQualifications({
          status: 'PRN_MATCHED_TO_LEARNER_RECORD',
          qualifications: [
            aVerifiedQualification({ source: 'AO', subject: 'Maths', awardedOn: startOfDay('2010-09-01') }),
            aVerifiedQualification({ source: 'AO', subject: 'English', awardedOn: startOfDay('2010-09-02') }),
            aVerifiedQualification({ source: 'AO', subject: 'French', awardedOn: startOfDay('2010-09-03') }),
            aVerifiedQualification({ source: 'AO', subject: 'German', awardedOn: startOfDay('2010-09-04') }),
            aVerifiedQualification({ source: 'AO', subject: 'Japanese', awardedOn: startOfDay('2010-09-05') }),
            aVerifiedQualification({ source: 'AO', subject: 'Spanish', awardedOn: startOfDay('2010-09-06') }),
            aVerifiedQualification({ source: 'AO', subject: 'Woodwork', awardedOn: startOfDay('2010-09-07') }),
            aVerifiedQualification({ source: 'AO', subject: 'Needlecraft', awardedOn: startOfDay('2010-09-08') }),
            aVerifiedQualification({ source: 'AO', subject: 'Computer Science', awardedOn: startOfDay('2010-08-28') }),
            aVerifiedQualification({
              source: 'AO',
              subject: 'Motorcycle maintenance',
              awardedOn: startOfDay('2010-08-29'),
            }),
            aVerifiedQualification({ source: 'AO', subject: 'History', awardedOn: startOfDay('2011-07-10') }),
            aVerifiedQualification({ source: 'AO', subject: 'Geography', awardedOn: startOfDay('2011-07-29') }),
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
    expect(qualificationsTable.find('tbody tr').length).toEqual(10) // only expect 10 records, even though there are 12
    expect(qualificationsTable.find('tbody tr').eq(0).find('td').eq(0).text().trim()).toEqual('Geography')
    expect(qualificationsTable.find('tbody tr').eq(1).find('td').eq(0).text().trim()).toEqual('History')
    expect(qualificationsTable.find('tbody tr').eq(2).find('td').eq(0).text().trim()).toEqual('Needlecraft')
    expect(qualificationsTable.find('tbody tr').eq(3).find('td').eq(0).text().trim()).toEqual('Woodwork')
    expect(qualificationsTable.find('tbody tr').eq(4).find('td').eq(0).text().trim()).toEqual('Spanish')
    expect(qualificationsTable.find('tbody tr').eq(5).find('td').eq(0).text().trim()).toEqual('Japanese')
    expect(qualificationsTable.find('tbody tr').eq(6).find('td').eq(0).text().trim()).toEqual('German')
    expect(qualificationsTable.find('tbody tr').eq(7).find('td').eq(0).text().trim()).toEqual('French')
    expect(qualificationsTable.find('tbody tr').eq(8).find('td').eq(0).text().trim()).toEqual('English')
    expect(qualificationsTable.find('tbody tr').eq(9).find('td').eq(0).text().trim()).toEqual('Maths')
    expect($('.moj-pagination__results').text().trim()).toEqual('Showing 1 to 10 of 12 results')
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

  it('should render the summary card given the Learner Records Service API promise is not resolved', () => {
    // Given
    const params = {
      ...templateParams,
      verifiedQualifications: Result.rejected(new Error('Failed to retrieve LRS Qualifications')),
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    expect($('[data-qa=verified-qualifications]').length).toEqual(0)
    expect($('[data-qa=learner-records-unavailable-message]').length).toEqual(1)
    expect(userHasPermissionTo).not.toHaveBeenCalled()
  })
})
