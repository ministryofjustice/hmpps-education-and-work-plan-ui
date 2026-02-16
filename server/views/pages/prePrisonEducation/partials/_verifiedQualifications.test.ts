import nunjucks from 'nunjucks'
import * as cheerio from 'cheerio'
import formatDateFilter from '../../../../filters/formatDateFilter'
import { Result } from '../../../../utils/result/result'
import {
  aVerifiedQualification,
  verifiedQualifications as aVerifiedQualifications,
} from '../../../../testsupport/verifiedQualificationsTestDataBuilder'
import filterArrayOnPropertyFilter from '../../../../filters/filterArrayOnPropertyFilter'

const njkEnv = nunjucks.configure([
  'node_modules/govuk-frontend/dist/',
  'node_modules/@ministryofjustice/frontend/',
  'server/views/',
  __dirname,
])

njkEnv //
  .addFilter('formatDate', formatDateFilter)
  .addFilter('filterArrayOnProperty', filterArrayOnPropertyFilter)

const template = './_verifiedQualifications.njk'

const verifiedQualifications = Result.fulfilled(aVerifiedQualifications())
const userHasPermissionTo = jest.fn()
const templateParams = {
  verifiedQualifications,
  userHasPermissionTo,
}

describe('_verifiedQualifications', () => {
  beforeEach(() => {
    jest.resetAllMocks()
    userHasPermissionTo.mockReturnValue(true)
  })

  it('should render given prisoner has some LRS verified qualifications', () => {
    // Given
    const params = {
      ...templateParams,
      verifiedQualifications: Result.fulfilled(
        aVerifiedQualifications({
          status: 'PRN_MATCHED_TO_LEARNER_RECORD',
          qualifications: [
            aVerifiedQualification({ source: 'AO', subject: 'Maths' }),
            aVerifiedQualification({ source: 'NPD' }),
            aVerifiedQualification({ source: 'AO', subject: 'English' }),
          ],
        }),
      ),
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    const verifiedQualificationsTable = $('[data-qa=verified-qualifications-table]')
    expect(verifiedQualificationsTable.length).toEqual(1)
    expect(verifiedQualificationsTable.find('tbody tr').length).toEqual(2)
    expect(verifiedQualificationsTable.find('tbody tr').eq(0).find('td').eq(0).text().trim()).toEqual('Maths')
    expect(verifiedQualificationsTable.find('tbody tr').eq(1).find('td').eq(0).text().trim()).toEqual('English')
    expect(verifiedQualificationsTable.find('.moj-pagination').text().trim()).toEqual('Showing 2 results')
    expect($('[data-qa=no-verified-qualifications]').length).toEqual(0)
    expect($('[data-qa=learner-declined-to-share-data-message]').length).toEqual(0)
    expect($('[data-qa=not-matched-in-lrs-message]').length).toEqual(0)
    expect($('[data-qa=learner-records-unavailable-message]').length).toEqual(0)
  })

  it('should render given prisoner is matched in LRS but has has no verified AO qualifications', () => {
    // Given
    const params = {
      ...templateParams,
      verifiedQualifications: Result.fulfilled(
        aVerifiedQualifications({
          status: 'PRN_MATCHED_TO_LEARNER_RECORD',
          qualifications: [aVerifiedQualification({ source: 'NPD' })],
        }),
      ),
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=verified-qualifications-table]').length).toEqual(0)
    expect($('[data-qa=no-verified-qualifications]').length).toEqual(1)
    expect($('[data-qa=learner-declined-to-share-data-message]').length).toEqual(0)
    expect($('[data-qa=not-matched-in-lrs-message]').length).toEqual(0)
    expect($('[data-qa=learner-records-unavailable-message]').length).toEqual(0)
  })

  it('should render given prisoner is matched in LRS but has has no verified qualifications at all', () => {
    // Given
    const params = {
      ...templateParams,
      verifiedQualifications: Result.fulfilled(
        aVerifiedQualifications({
          status: 'PRN_MATCHED_TO_LEARNER_RECORD',
          qualifications: [],
        }),
      ),
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=verified-qualifications-table]').length).toEqual(0)
    expect($('[data-qa=no-verified-qualifications]').length).toEqual(1)
    expect($('[data-qa=learner-declined-to-share-data-message]').length).toEqual(0)
    expect($('[data-qa=not-matched-in-lrs-message]').length).toEqual(0)
    expect($('[data-qa=learner-records-unavailable-message]').length).toEqual(0)
  })

  it('should render given prisoner is matched in LRS but has declined to share their data', () => {
    // Given
    const params = {
      ...templateParams,
      verifiedQualifications: Result.fulfilled(
        aVerifiedQualifications({
          status: 'LEARNER_DECLINED_TO_SHARE_DATA',
        }),
      ),
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=verified-qualifications-table]').length).toEqual(0)
    expect($('[data-qa=no-verified-qualifications]').length).toEqual(0)
    expect($('[data-qa=learner-declined-to-share-data-message]').length).toEqual(1)
    expect($('[data-qa=not-matched-in-lrs-message]').length).toEqual(0)
    expect($('[data-qa=learner-records-unavailable-message]').length).toEqual(0)
  })

  it('should render given prisoner is not matched in LRS and user has permission to use LRS', () => {
    // Given
    userHasPermissionTo.mockReturnValue(true)
    const params = {
      ...templateParams,
      verifiedQualifications: Result.fulfilled(
        aVerifiedQualifications({
          status: 'PRN_NOT_MATCHED_TO_LEARNER_RECORD',
        }),
      ),
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=verified-qualifications-table]').length).toEqual(0)
    expect($('[data-qa=no-verified-qualifications]').length).toEqual(0)
    expect($('[data-qa=learner-declined-to-share-data-message]').length).toEqual(0)
    expect($('[data-qa=not-matched-in-lrs-message]').length).toEqual(1)
    expect($('[data-qa=link-to-lrs]').length).toEqual(1)
    expect($('[data-qa=learner-records-unavailable-message]').length).toEqual(0)
    expect(userHasPermissionTo).toHaveBeenCalledWith('USE_DPS_LEARNER_RECORD_MATCHING_SERVICE')
  })

  it('should render given prisoner is not matched in LRS and user does not have permission to use LRS', () => {
    // Given
    userHasPermissionTo.mockReturnValue(false)
    const params = {
      ...templateParams,
      verifiedQualifications: Result.fulfilled(
        aVerifiedQualifications({
          status: 'PRN_NOT_MATCHED_TO_LEARNER_RECORD',
        }),
      ),
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=verified-qualifications-table]').length).toEqual(0)
    expect($('[data-qa=no-verified-qualifications]').length).toEqual(0)
    expect($('[data-qa=learner-declined-to-share-data-message]').length).toEqual(0)
    expect($('[data-qa=not-matched-in-lrs-message]').length).toEqual(1)
    expect($('[data-qa=link-to-lrs]').length).toEqual(0)
    expect($('[data-qa=learner-records-unavailable-message]').length).toEqual(0)
    expect(userHasPermissionTo).toHaveBeenCalledWith('USE_DPS_LEARNER_RECORD_MATCHING_SERVICE')
  })

  it('should render LRS unavailable message given LRS API has failed to retrieve verified qualifications', () => {
    // Given
    const params = {
      ...templateParams,
      verifiedQualifications: Result.rejected(new Error('Failed to get Learner Records')),
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=verified-qualifications-table]').length).toEqual(0)
    expect($('[data-qa=no-verified-qualifications]').length).toEqual(0)
    expect($('[data-qa=learner-declined-to-share-data-message]').length).toEqual(0)
    expect($('[data-qa=not-matched-in-lrs-message]').length).toEqual(0)
    expect($('[data-qa=learner-records-unavailable-message]').length).toEqual(1)
  })
})
