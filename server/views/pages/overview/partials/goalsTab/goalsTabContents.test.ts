import nunjucks from 'nunjucks'
import * as cheerio from 'cheerio'
import { startOfDay, toDate } from 'date-fns'
import aValidPrisonerSummary from '../../../../../testsupport/prisonerSummaryTestDataBuilder'
import formatDateFilter from '../../../../../filters/formatDateFilter'
import formatStepStatusValueFilter from '../../../../../filters/formatStepStatusValueFilter'
import formatReasonToArchiveGoalFilter from '../../../../../filters/formatReasonToArchiveGoalFilter'
import { aValidGoal } from '../../../../../testsupport/actionPlanTestDataBuilder'
import config from '../../../../../config'
import assetMapFilter from '../../../../../filters/assetMapFilter'

const njkEnv = nunjucks.configure([
  'node_modules/govuk-frontend/govuk/',
  'node_modules/govuk-frontend/govuk/components/',
  'node_modules/govuk-frontend/govuk/template/',
  'node_modules/govuk-frontend/dist/',
  'node_modules/@ministryofjustice/frontend/',
  'server/views/',
  __dirname,
])

jest.mock('../../../../../config', () => ({
  featureToggles: {
    archiveGoalNotesEnabled: true,
  },
}))

njkEnv.addGlobal('featureToggles', config.featureToggles)

njkEnv //
  .addFilter('formatDate', formatDateFilter)
  .addFilter('formatStepStatusValue', formatStepStatusValueFilter)
  .addFilter('formatReasonToArchiveGoal', formatReasonToArchiveGoalFilter)
  .addFilter('assetMap', assetMapFilter)

const prisonerSummary = aValidPrisonerSummary()

const userHasPermissionTo = jest.fn()
const templateParams = {
  prisonerSummary,
  userHasPermissionTo,
  inProgressGoals: [aValidGoal()],
  archivedGoals: [aValidGoal()],
  completedGoals: [aValidGoal()],
  problemRetrievingData: false,
  showServiceOnboardingBanner: false,
  tab: 'goals',
}

describe('goalTabContents', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    userHasPermissionTo.mockReturnValue(true)
  })

  it('should render in-progress goals correctly, in order of target completion date, soonest first', async () => {
    // Given
    const inProgressGoal1 = aValidGoal({
      targetCompletionDate: startOfDay('2024-12-01'),
      status: 'ACTIVE',
      title: 'Learn French',
    })
    const inProgressGoal2 = aValidGoal({
      targetCompletionDate: startOfDay('2024-11-01'),
      status: 'ACTIVE',
      title: 'Learn Spanish',
    })
    const inProgressGoal3 = aValidGoal({
      targetCompletionDate: startOfDay('2025-01-01'),
      status: 'ACTIVE',
      title: 'Learn German',
    })

    const params = {
      ...templateParams,
      inProgressGoals: [inProgressGoal1, inProgressGoal2, inProgressGoal3],
    }

    // When
    const content = njkEnv.render('goalsTabContents.njk', params)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa="in-progress-goal-summary-card"] [data-qa="goal-summary-card-heading"]').length).toEqual(3)
    // Assert the goals are in the correct order, based on target completion date, soonest first
    // First rendered goal ....
    expect(
      $('[data-qa="in-progress-goal-summary-card"] [data-qa="goal-summary-card-goal-title"]').eq(0).text().trim(),
    ).toEqual('Learn Spanish')
    // Second rendered goal ....
    expect(
      $('[data-qa="in-progress-goal-summary-card"] [data-qa="goal-summary-card-goal-title"]').eq(1).text().trim(),
    ).toEqual('Learn French')
    // Third rendered goal ....
    expect(
      $('[data-qa="in-progress-goal-summary-card"] [data-qa="goal-summary-card-goal-title"]').eq(2).text().trim(),
    ).toEqual('Learn German')

    expect($('#problem-retrieving-goals-message').length).toEqual(0)
  })

  it('should render archived goals correctly, in order or archival date (updatedDate), soonest last', async () => {
    // Given
    const archivedGoal1 = aValidGoal({
      updatedAt: toDate('2024-12-01T09:12:23.123Z'),
      targetCompletionDate: startOfDay('2024-12-31'),
      status: 'ARCHIVED',
      title: 'Learn French',
    })
    const archivedGoal2 = aValidGoal({
      updatedAt: toDate('2024-12-01T08:57:18.561Z'),
      targetCompletionDate: startOfDay('2024-12-31'),
      status: 'ARCHIVED',
      title: 'Learn Spanish',
    })
    const archivedGoal3 = aValidGoal({
      updatedAt: toDate('2025-01-01T14:43:09.931Z'),
      targetCompletionDate: startOfDay('2025-06-30'),
      status: 'ARCHIVED',
      title: 'Learn German',
    })

    const params = {
      ...templateParams,
      archivedGoals: [archivedGoal1, archivedGoal2, archivedGoal3],
    }

    // When
    const content = njkEnv.render('goalsTabContents.njk', params)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa="archived-goal-summary-card"] [data-qa="goal-summary-card-heading"]').length).toEqual(3)
    // Assert the goals are in the correct order, based on updated date, soonest last
    // First rendered goal ....
    expect(
      $('[data-qa="archived-goal-summary-card"] [data-qa="goal-summary-card-goal-title"]').eq(0).text().trim(),
    ).toEqual('Learn German')
    // Second rendered goal ....
    expect(
      $('[data-qa="archived-goal-summary-card"] [data-qa="goal-summary-card-goal-title"]').eq(1).text().trim(),
    ).toEqual('Learn French')
    // Third rendered goal ....
    expect(
      $('[data-qa="archived-goal-summary-card"] [data-qa="goal-summary-card-goal-title"]').eq(2).text().trim(),
    ).toEqual('Learn Spanish')

    expect($('#problem-retrieving-goals-message').length).toEqual(0)
  })

  it('should render completed goals correctly, in order or completion date (updatedDate), soonest last', async () => {
    // Given
    const completedGoal1 = aValidGoal({
      updatedAt: toDate('2024-12-01T09:12:23.123Z'),
      targetCompletionDate: startOfDay('2024-12-31'),
      status: 'COMPLETED',
      title: 'Learn French',
    })
    const completedGoal2 = aValidGoal({
      updatedAt: toDate('2024-12-01T08:57:18.561Z'),
      targetCompletionDate: startOfDay('2024-12-31'),
      status: 'COMPLETED',
      title: 'Learn Spanish',
    })
    const completedGoal3 = aValidGoal({
      updatedAt: toDate('2025-01-01T14:43:09.931Z'),
      targetCompletionDate: startOfDay('2025-06-30'),
      status: 'COMPLETED',
      title: 'Learn German',
    })

    const params = {
      ...templateParams,
      completedGoals: [completedGoal1, completedGoal2, completedGoal3],
    }

    // When
    const content = njkEnv.render('goalsTabContents.njk', params)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa="completed-goal-summary-card"] [data-qa="goal-summary-card-heading"]').length).toEqual(3)
    // Assert the goals are in the correct order, based on updated date, soonest last
    // First rendered goal ....
    expect(
      $('[data-qa="completed-goal-summary-card"] [data-qa="goal-summary-card-goal-title"]').eq(0).text().trim(),
    ).toEqual('Learn German')
    // Second rendered goal ....
    expect(
      $('[data-qa="completed-goal-summary-card"] [data-qa="goal-summary-card-goal-title"]').eq(1).text().trim(),
    ).toEqual('Learn French')
    // Third rendered goal ....
    expect(
      $('[data-qa="completed-goal-summary-card"] [data-qa="goal-summary-card-goal-title"]').eq(2).text().trim(),
    ).toEqual('Learn Spanish')

    expect($('#problem-retrieving-goals-message').length).toEqual(0)
  })

  it('should not render any goals given problem retrieving data is true', async () => {
    // Given
    const params = {
      ...templateParams,
      problemRetrievingData: true,
    }

    // When
    const content = njkEnv.render('goalsTabContents.njk', params)
    const $ = cheerio.load(content)

    // Then
    expect($('#problem-retrieving-goals-message').length).toEqual(1)
    expect($('[data-qa="in-progress-goal-summary-card"]').length).toEqual(0)
    expect($('[data-qa="archived-goal-summary-card"]').length).toEqual(0)
    expect($('[data-qa="completed-goal-summary-card"]').length).toEqual(0)
  })

  it('should render service onboarding banner given showServiceOnboardingBanner is true', async () => {
    // Given
    const params = {
      ...templateParams,
      showServiceOnboardingBanner: true,
    }

    // When
    const content = njkEnv.render('goalsTabContents.njk', params)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa="service-onboarding-banner"]').text().replace(/\s+/g, ' ').trim()).toContain(
      'You have read only access. If you need to add or edit information ask your head of education, skills and work to email learningandworkprogress@digital.justice.gov.uk so we can onboard your prison.',
    )
  })
})
