import * as cheerio from 'cheerio'
import nunjucks from 'nunjucks'
import type { Goal } from 'viewModels'
import type { GoalSummaryCardParams } from 'viewComponents'
import formatDateFilter from '../../../filters/formatDateFilter'
import { aValidGoal } from '../../../testsupport/actionPlanTestDataBuilder'
import formatStepStatusValueFilter from '../../../filters/formatStepStatusValueFilter'
import formatReasonToArchiveGoalFilter from '../../../filters/formatReasonToArchiveGoalFilter'
import ReasonToArchiveGoalValue from '../../../enums/ReasonToArchiveGoalValue'

const njkEnv = nunjucks.configure([
  'node_modules/govuk-frontend/dist/',
  'node_modules/@ministryofjustice/frontend/',
  'server/views/',
  __dirname,
])
njkEnv //
  .addFilter('formatDate', formatDateFilter)
  .addFilter('formatStepStatusValue', formatStepStatusValueFilter)
  .addFilter('formatReasonToArchiveGoal', formatReasonToArchiveGoalFilter)

describe('_goalSummaryCardContent-goalInStatus-ARCHIVED', () => {
  it('should render goal without any goal or goal archival notes', () => {
    // Given
    const goal: Goal = {
      ...aValidGoal(),
      notesByType: {
        GOAL: [],
        GOAL_COMPLETION: [],
        GOAL_ARCHIVAL: [],
      },
    }

    const params: GoalSummaryCardParams = {
      goal,
      actions: [],
    }

    // When
    const content = nunjucks.render('_goalSummaryCardContent-goalInStatus-ARCHIVED.njk', { params })
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=goal-notes-expander]').length).toEqual(0)
    expect($('[data-qa=goal-archival-note]').length).toEqual(0)
    expect($('[data-qa=goal-archived-hint]').text().trim()).toEqual(
      'Archived on 23 September 2023 by Alex Smith, Brixton (HMP)',
    )
  })

  it('Should show archive reason without other text given archive reason is not OTHER', () => {
    // Given
    const goal = {
      ...aValidGoal(),
      archiveReason: ReasonToArchiveGoalValue.PRISONER_NO_LONGER_WANTS_TO_WORK_TOWARDS_GOAL,
    }

    const params: GoalSummaryCardParams = {
      goal,
      actions: [],
    }

    // When
    const content = nunjucks.render('_goalSummaryCardContent-goalInStatus-ARCHIVED.njk', { params })
    const $ = cheerio.load(content)

    // Then
    const hint = $('[data-qa=goal-archive-reason-hint]').first()
    expect(hint.text().trim()).toEqual('Reason: Prisoner no longer wants to work towards this goal')
  })

  it('Should show archive reason including other text given archive reason is OTHER', () => {
    // Given
    const goal = {
      ...aValidGoal(),
      archiveReason: ReasonToArchiveGoalValue.OTHER,
      archiveReasonOther: 'Some other reason',
    }

    const params: GoalSummaryCardParams = {
      goal,
      actions: [],
    }

    // When
    const content = nunjucks.render('_goalSummaryCardContent-goalInStatus-ARCHIVED.njk', { params })
    const $ = cheerio.load(content)

    // Then
    const hint = $('[data-qa=goal-archive-reason-hint]').first()
    expect(hint.text().trim()).toEqual('Reason: Other - Some other reason')
  })
})
