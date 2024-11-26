import nunjucks from 'nunjucks'
import * as cheerio from 'cheerio'
import formatDate from '../../../../../filters/formatDateFilter'
import aValidPrisonerSummary from '../../../../../testsupport/prisonerSummaryTestDataBuilder'

const njkEnv = nunjucks.configure([
  'node_modules/govuk-frontend/govuk/',
  'node_modules/govuk-frontend/govuk/components/',
  'node_modules/govuk-frontend/govuk/template/',
  'node_modules/govuk-frontend/dist/',
  'node_modules/@ministryofjustice/frontend/',
  'server/views/',
  __dirname,
])

njkEnv.addFilter('formatDate', formatDate)

const prisonerSummary = aValidPrisonerSummary()
const template = '_goalsSummaryCard.njk'

describe('_goalsSummaryCard', () => {
  it('should render goals summary card correctly given prisoner has goals', () => {
    // Given
    const pageViewModel = {
      prisonerSummary,
      prisonerGoals: {
        problemRetrievingData: false,
        counts: {
          totalGoals: 6,
          activeGoals: 3,
          archivedGoals: 2,
          completedGoals: 1,
        },
        lastUpdatedBy: 'Elaine Benes',
        lastUpdatedDate: new Date('2024-01-21T13:42:01.401Z'),
        lastUpdatedAtPrisonName: 'Brixton (HMP)',
      },
      featureToggles: {
        completedGoalsEnabled: true,
      },
    }

    // When
    const content = njkEnv.render(template, pageViewModel)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa="in-progress-goals-count"]').text().trim()).toEqual('3')
    expect($('[data-qa="archived-goals-count"]').text().trim()).toEqual('2')
    expect($('[data-qa="completed-goals-count"]').text().trim()).toEqual('1')
    expect($('[data-qa="view-in-progress-goals-button"]').attr('href')).toEqual(
      `/plan/${prisonerSummary.prisonNumber}/view/goals#in-progress-goals`,
    )
    expect($('[data-qa="view-archived-goals-button"]').attr('href')).toEqual(
      `/plan/${prisonerSummary.prisonNumber}/view/goals#archived-goals`,
    )
    expect($('[data-qa="view-completed-goals-button"]').attr('href')).toEqual(
      `/plan/${prisonerSummary.prisonNumber}/view/goals#completed-goals`,
    )
    expect($('[data-qa="goal-last-updated-hint"]').text().trim()).toEqual(
      'Updated on 21 January 2024 by Elaine Benes, Brixton (HMP)',
    )
    expect($('[data-qa="goals-unavailable-message"]').length).toEqual(0)
  })

  it('should render goals summary card correctly given prisoner has no goals', () => {
    // Given
    const pageViewModel = {
      prisonerSummary,
      prisonerGoals: {
        problemRetrievingData: false,
        counts: {
          totalGoals: 0,
          activeGoals: 0,
          archivedGoals: 0,
          completedGoals: 0,
        },
        lastUpdatedBy: undefined as string,
        lastUpdatedDate: undefined as string,
        lastUpdatedAtPrisonName: undefined as string,
      },
      featureToggles: {
        completedGoalsEnabled: true,
      },
    }

    // When
    const content = njkEnv.render(template, pageViewModel)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa="in-progress-goals-count"]').text().trim()).toEqual('0')
    expect($('[data-qa="archived-goals-count"]').text().trim()).toEqual('0')
    expect($('[data-qa="completed-goals-count"]').text().trim()).toEqual('0')
    expect($('[data-qa="view-in-progress-goals-button"]').attr('href')).toEqual(
      `/plan/${prisonerSummary.prisonNumber}/view/goals#in-progress-goals`,
    )
    expect($('[data-qa="view-archived-goals-button"]').attr('href')).toEqual(
      `/plan/${prisonerSummary.prisonNumber}/view/goals#archived-goals`,
    )
    expect($('[data-qa="view-completed-goals-button"]').attr('href')).toEqual(
      `/plan/${prisonerSummary.prisonNumber}/view/goals#completed-goals`,
    )
    expect($('[data-qa="goal-last-updated-hint"]').length).toEqual(0)
    expect($('[data-qa="goals-unavailable-message"]').length).toEqual(0)
  })

  it('should not render goals summary given problem retrieving goal data', () => {
    // Given
    const pageViewModel = {
      prisonerSummary,
      prisonerGoals: {
        problemRetrievingData: true,
        counts: {
          totalGoals: 0,
          activeGoals: 0,
          archivedGoals: 0,
          completedGoals: 0,
        },
        lastUpdatedBy: undefined as string,
        lastUpdatedDate: undefined as string,
        lastUpdatedAtPrisonName: undefined as string,
      },
      featureToggles: {
        completedGoalsEnabled: true,
      },
    }

    // When
    const content = njkEnv.render(template, pageViewModel)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa="in-progress-goals-count"]').length).toEqual(0)
    expect($('[data-qa="archived-goals-count"]').length).toEqual(0)
    expect($('[data-qa="completed-goals-count"]').length).toEqual(0)
    expect($('[data-qa="view-in-progress-goals-button"]').length).toEqual(0)
    expect($('[data-qa="view-archived-goals-button"]').length).toEqual(0)
    expect($('[data-qa="view-completed-goals-button"]').length).toEqual(0)
    expect($('[data-qa="goal-last-updated-hint"]').length).toEqual(0)
    expect($('[data-qa="goals-unavailable-message"]').length).toEqual(1)
  })
})
