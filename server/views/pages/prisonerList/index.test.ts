import nunjucks from 'nunjucks'
import * as cheerio from 'cheerio'
import assetMapFilter from '../../../filters/assetMapFilter'

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

const userHasPermissionTo = jest.fn()
const templateParams = {
  userHasPermissionTo,
}

describe('prisoner list page', () => {
  beforeEach(() => {
    jest.resetAllMocks()
    userHasPermissionTo.mockReturnValue(false)
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
