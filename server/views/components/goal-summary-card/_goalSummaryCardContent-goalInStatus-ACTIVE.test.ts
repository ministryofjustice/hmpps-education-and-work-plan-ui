import * as cheerio from 'cheerio'
import nunjucks from 'nunjucks'
import { toDate } from 'date-fns'
import type { Goal } from 'viewModels'
import type { GoalSummaryCardParams } from 'viewComponents'
import formatDateFilter from '../../../filters/formatDateFilter'
import { aValidGoal } from '../../../testsupport/actionPlanTestDataBuilder'
import formatStepStatusValueFilter from '../../../filters/formatStepStatusValueFilter'

const njkEnv = nunjucks.configure([
  'node_modules/govuk-frontend/dist/',
  'node_modules/@ministryofjustice/frontend/',
  'server/views/',
  __dirname,
])
njkEnv //
  .addFilter('formatDate', formatDateFilter)
  .addFilter('formatStepStatusValue', formatStepStatusValueFilter)

describe('_goalSummaryCardContent-goalInStatus-ACTIVE', () => {
  it('should render goal without any goal notes', () => {
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
    const content = nunjucks.render('_goalSummaryCardContent-goalInStatus-ACTIVE.njk', { params })
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=goal-notes-expander]').length).toEqual(0)
    expect($('[data-qa=goal-last-updated-hint]').text().trim()).toEqual(
      'Last updated 23 September 2023 by Alex Smith, Brixton (HMP)',
    )
  })

  it('should render goal with goal notes', () => {
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
        GOAL_ARCHIVAL: [],
      },
    }

    const params: GoalSummaryCardParams = {
      goal,
      actions: [],
    }

    // When
    const content = nunjucks.render('_goalSummaryCardContent-goalInStatus-ACTIVE.njk', { params })
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=goal-notes-expander]').length).toEqual(1)
    expect($('[data-qa=goal-notes-expander] .govuk-details__text').text().trim()).toEqual(
      'Prisoner is not good at listening',
    )
    expect($('[data-qa=goal-last-updated-hint]').text().trim()).toEqual(
      'Last updated 23 September 2023 by Alex Smith, Brixton (HMP)',
    )
  })
})
