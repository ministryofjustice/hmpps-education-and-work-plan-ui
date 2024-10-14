import nunjucks from 'nunjucks'
import * as cheerio from 'cheerio'
import aValidPrisonerSummary from '../../../../../testsupport/prisonerSummaryTestDataBuilder'
import { aValidGoalResponse } from '../../../../../testsupport/actionPlanResponseTestDataBuilder'
import GoalStatusValue from '../../../../../enums/goalStatusValue'
import formatDateFilter from '../../../../../filters/formatDateFilter'
import formatStepStatusValueFilter from '../../../../../filters/formatStepStatusValueFilter'
import formatReasonToArchiveGoalFilter from '../../../../../filters/formatReasonToArchiveGoalFilter'

const njkEnv = nunjucks.configure([
  'node_modules/govuk-frontend/govuk/',
  'node_modules/govuk-frontend/govuk/components/',
  'node_modules/govuk-frontend/govuk/template/',
  'node_modules/govuk-frontend/dist/',
  'node_modules/@ministryofjustice/frontend/',
  'server/views/',
  __dirname,
])

njkEnv.addFilter('formatDate', formatDateFilter)
njkEnv.addFilter('formatStepStatusValue', formatStepStatusValueFilter)
njkEnv.addFilter('formatReasonToArchiveGoal', formatReasonToArchiveGoalFilter)

const prisonerSummary = aValidPrisonerSummary()
const inProgressGoal = { ...aValidGoalResponse(), status: GoalStatusValue.ACTIVE, steps: [{ title: 'Learn French' }] }
const archivedGoal = {
  ...aValidGoalResponse(),
  status: GoalStatusValue.ARCHIVED,
  steps: [{ title: 'Learn woodwork' }],
  archiveReason: 'PRISONER_NO_LONGER_WANTS_TO_WORK_TOWARDS_GOAL',
}
const template = 'goalsTabContents.njk'

describe('ViewGoalsController', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render in-progress goals correctly', async () => {
    // Given
    const pageViewModel = {
      prisonerSummary,
      inProgressGoals: [inProgressGoal],
      problemRetrievingData: false,
      tab: 'goals',
      isInProgressGoalsTab: true,
      currentUrlPath: `/plan/${prisonerSummary.prisonNumber}/view/goals/in-progress-goals`,
    }

    // When
    const content = njkEnv.render(template, pageViewModel)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa="in-progress-goal-summary-card"]').length).toEqual(1)
    expect($(`[data-qa="goal-${inProgressGoal.goalReference}-update-button"]`).length).toEqual(1)
    expect($('[data-qa="in-progress-goal-summary-card"]').first().text()).toContain('Learn French')
    const hint = $('[data-qa=goal-last-updated-hint]').first()
    expect(hint.text().trim()).toEqual('Last updated on 23 September 2023 by Alex Smith')
  })

  it('should render archived goals correctly', async () => {
    // Given
    const pageViewModel = {
      prisonerSummary,
      archivedGoals: [archivedGoal],
      problemRetrievingData: false,
      tab: 'goals',
      isInProgressGoalsTab: false,
      currentUrlPath: `/plan/${prisonerSummary.prisonNumber}/view/goals/archived-goals`,
    }

    // When
    const content = njkEnv.render(template, pageViewModel)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa="archived-goal-summary-card"]').length).toEqual(1)
    expect($(`[data-qa="goal-${archivedGoal.goalReference}-unarchive-button"]`).length).toEqual(1)
    expect($('[data-qa="archived-goal-summary-card"]').first().text()).toContain('Learn woodwork')
    const lastUpdatedHint = $('[data-qa=goal-last-updated-hint]').first()
    expect(lastUpdatedHint.text().trim()).toEqual('Archived on 23 September 2023 by Alex Smith')
    const reasonHint = $('[data-qa=goal-archive-reason-hint]').first()
    expect(reasonHint.text().trim()).toEqual('Reason: Prisoner no longer wants to work towards this goal')
  })
})
