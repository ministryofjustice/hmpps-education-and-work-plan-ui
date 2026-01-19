import nunjucks from 'nunjucks'
import * as cheerio from 'cheerio'
import assetMapFilter from '../../../filters/assetMapFilter'
import aValidPrisonerSearch from '../../../testsupport/prisonerSearchTestDataBuilder'
import { Result } from '../../../utils/result/result'
import formatPrisonerNameFilter, { NameFormat } from '../../../filters/formatPrisonerNameFilter'
import formatDateFilter from '../../../filters/formatDateFilter'
import aValidPrisonerSearchSummary from '../../../testsupport/prisonerSearchSummaryTestDataBuilder'
import SearchPlanStatus from '../../../enums/searchPlanStatus'

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
  .addFilter('assetMap', assetMapFilter)
  .addFilter('formatLast_name_comma_First_name', formatPrisonerNameFilter(NameFormat.Last_name_comma_First_name))
  .addFilter('formatDate', formatDateFilter)
  .addGlobal('featureToggles', { newSearchApiEnabled: true })

const userHasPermissionTo = jest.fn()
const templateParams = {
  userHasPermissionTo,
  prisonerListResults: Result.fulfilled(aValidPrisonerSearch()),
  searchOptions: {},
}

describe('prisoner list page', () => {
  beforeEach(() => {
    jest.resetAllMocks()
    userHasPermissionTo.mockReturnValue(false)
  })

  it('should render page', () => {
    const params = {
      ...templateParams,
      prisonerListResults: Result.fulfilled(
        aValidPrisonerSearch({
          prisoners: [
            aValidPrisonerSearchSummary({ prisonNumber: 'A1234BC', planStatus: SearchPlanStatus.ACTIVE_PLAN }),
            aValidPrisonerSearchSummary({ prisonNumber: 'B4567CD', planStatus: SearchPlanStatus.NEEDS_PLAN }),
            aValidPrisonerSearchSummary({ prisonNumber: 'C8901EF', planStatus: SearchPlanStatus.EXEMPT }),
          ],
        }),
      ),
    }

    // When
    const content = nunjucks.render('index.njk', params)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=search-options-form]').length).toEqual(1)
    expect($('[data-qa=search-results-form]').length).toEqual(1)
    expect($('[data-qa=prisoner-list-results-table] tbody tr').length).toEqual(3)
    expect($('[data-qa=zero-results-message]').length).toEqual(0)
  })

  it('should render page given search service returns zero results', () => {
    // Given
    const params = {
      ...templateParams,
      prisonerListResults: Result.fulfilled(aValidPrisonerSearch({ prisoners: [] })),
      searchOptions: { searchTerm: 'some unknown prisoner' },
    }

    // When
    const content = nunjucks.render('index.njk', params)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=search-options-form]').length).toEqual(1)
    expect($('[data-qa=search-results-form]').length).toEqual(0)
    expect($('[data-qa=zero-results-message]').length).toEqual(1)
    expect($('[data-qa=zero-results-message]').text().trim()).toEqual('0 results for "some unknown prisoner"')
  })

  it('should render page given search service returns an error', () => {
    // Given
    const params = {
      ...templateParams,
      prisonerListResults: Result.rejected(new Error('Failed to get search results')),
    }

    // When
    const content = nunjucks.render('index.njk', params)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=search-options-form]').length).toEqual(1)
    expect($('[data-qa=search-results-form]').length).toEqual(0)
    expect($('[data-qa=zero-results-message]').length).toEqual(0)
  })

  describe('breadcrumb link tests', () => {
    it('should only render a breadcrumb link to DPS Homepage given user does not have permission to view the session summary pages', () => {
      // Given
      userHasPermissionTo.mockReturnValue(false)

      const params = {
        ...templateParams,
      }

      // When
      const content = nunjucks.render('index.njk', params)
      const $ = cheerio.load(content)

      // Then
      expect($('.govuk-breadcrumbs__list li').length).toEqual(1)
      expect($('.govuk-breadcrumbs__list li:nth-of-type(1)').text().trim()).toEqual('Digital Prison Services')
      expect(userHasPermissionTo).toHaveBeenCalledWith('VIEW_SESSION_SUMMARIES')
    })

    it('should only render a breadcrumb link to DPS Homepage and Session Summary page given user has permission to view the session summary pages', () => {
      // Given
      userHasPermissionTo.mockReturnValue(true)

      const params = {
        ...templateParams,
      }

      // When
      const content = nunjucks.render('index.njk', params)
      const $ = cheerio.load(content)

      // Then
      expect($('.govuk-breadcrumbs__list li').length).toEqual(2)
      expect($('.govuk-breadcrumbs__list li:nth-of-type(1)').text().trim()).toEqual('Digital Prison Services')
      expect($('.govuk-breadcrumbs__list li:nth-of-type(2)').text().trim()).toEqual('Manage learning and work progress')
      expect(userHasPermissionTo).toHaveBeenCalledWith('VIEW_SESSION_SUMMARIES')
    })
  })
})
