import * as cheerio from 'cheerio'
import nunjucks from 'nunjucks'
import { toDate } from 'date-fns'
import type { Goal } from 'viewModels'
import type { GoalSummaryCardParams } from 'viewComponents'
import formatDateFilter from '../../../filters/formatDateFilter'
import { aValidGoal } from '../../../testsupport/actionPlanTestDataBuilder'
import formatStepStatusValueFilter from '../../../filters/formatStepStatusValueFilter'
import formatReasonToArchiveGoalFilter from '../../../filters/formatReasonToArchiveGoalFilter'
import ReasonToArchiveGoalValue from '../../../enums/ReasonToArchiveGoalValue'
import config from '../../../config'

const njkEnv = nunjucks.configure([
  'node_modules/govuk-frontend/dist/',
  'node_modules/@ministryofjustice/frontend/',
  'server/views/',
  __dirname,
])

jest.mock('../../../config', () => ({
  featureToggles: {
    archiveGoalNotesEnabled: true,
  },
}))

njkEnv //
  .addGlobal('featureToggles', config.featureToggles)
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

  it('should render goal with goal and goal archival notes', () => {
    // Given
    const goal: Goal = {
      ...aValidGoal(),
      notesByType: {
        GOAL: [
          {
            content: 'Prisoner is not good at listening',
            createdAt: toDate('2023-01-16T09:34:12.453Z'),
            createdAtPrisonName: 'Brixton (HMP)',
            createdBy: 'asmith_gen',
            createdByDisplayName: 'Alex Smith',
            reference: '8092b80e-4d60-418f-983a-da457ff8df40',
            type: 'GOAL',
            updatedAt: toDate('2023-09-23T13:42:01.401Z'),
            updatedAtPrisonName: 'Brixton (HMP)',
            updatedBy: 'asmith_gen',
            updatedByDisplayName: 'Alex Smith',
          },
        ],
        GOAL_COMPLETION: [],
        GOAL_ARCHIVAL: [
          {
            content: 'Due to prisoner not being a good listener, we have agreed to archive this goal',
            createdAt: toDate('2023-01-16T09:34:12.453Z'),
            createdAtPrisonName: 'Brixton (HMP)',
            createdBy: 'asmith_gen',
            createdByDisplayName: 'Alex Smith',
            reference: '8092b80e-4d60-418f-983a-da457ff8df40',
            type: 'GOAL',
            updatedAt: toDate('2023-09-23T13:42:01.401Z'),
            updatedAtPrisonName: 'Brixton (HMP)',
            updatedBy: 'asmith_gen',
            updatedByDisplayName: 'Alex Smith',
          },
        ],
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
    expect($('[data-qa=goal-notes-expander]').length).toEqual(1)
    expect($('[data-qa=goal-notes-expander] .govuk-details__text').text().trim()).toEqual(
      'Prisoner is not good at listening',
    )
    expect($('[data-qa=goal-archive-note]').text().trim()).toEqual(
      'Due to prisoner not being a good listener, we have agreed to archive this goal',
    )
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
    const hint = $('[data-qa=goal-archive-reason]').first()
    expect(hint.text().trim()).toEqual('Prisoner no longer wants to work towards this goal')
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
    const hint = $('[data-qa=goal-archive-reason]').first()
    expect(hint.text().trim()).toEqual('Other - Some other reason')
  })
})
