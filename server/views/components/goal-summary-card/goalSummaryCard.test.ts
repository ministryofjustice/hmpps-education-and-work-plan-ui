import nunjucks from 'nunjucks'
import * as cheerio from 'cheerio'
import type { GoalSummaryCardParams } from 'viewComponents'
import { aValidGoal } from '../../../testsupport/actionPlanTestDataBuilder'
import formatDateFilter from '../../../filters/formatDateFilter'
import formatStepStatusValueFilter from '../../../filters/formatStepStatusValueFilter'
import config from '../../../config'
import formatReasonToArchiveGoalFilter from '../../../filters/formatReasonToArchiveGoalFilter'

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

njkEnv.addGlobal('featureToggles', config.featureToggles)
njkEnv.addFilter('formatDate', formatDateFilter)
njkEnv.addFilter('formatStepStatusValue', formatStepStatusValueFilter)
njkEnv.addFilter('formatReasonToArchiveGoal', formatReasonToArchiveGoalFilter)

describe('Tests for goal summary card component', () => {
  it('Should render the goal summary card with requested attributes and id', () => {
    // Given
    const goal = aValidGoal()
    const params: GoalSummaryCardParams = {
      goal,
      actions: [],
      attributes: { 'data-qa': 'goal-summary-card-qa' },
      id: 'test-goal-card',
    }

    // When
    const content = nunjucks.render('template.njk', { params })
    const $ = cheerio.load(content)

    // Then
    const goalCardByClass = $('.govuk-summary-card')
    expect(goalCardByClass.length).toEqual(1)

    const goalCardByDataQa = $('[data-qa=goal-summary-card-qa]')
    expect(goalCardByDataQa.length).toEqual(1)

    const goalCardByDataId = $('#test-goal-card')
    expect(goalCardByDataId.length).toEqual(1)
  })

  it('Should render using the ACTIVE goal summary card content given the goal has a status of ACTIVE', () => {
    // Given
    const goal = aValidGoal({ status: 'ACTIVE' })
    const params: GoalSummaryCardParams = {
      goal,
      actions: [],
    }

    // When
    const content = nunjucks.render('template.njk', { params })
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=in-progress-goal]').length).toEqual(1)
    expect($('[data-qa=archived-goal]').length).toEqual(0)
    expect($('[data-qa=completed-goal]').length).toEqual(0)
  })

  it('Should render using the COMPLETED goal summary card content given the goal has a status of COMPLETED', () => {
    // Given
    const goal = aValidGoal({ status: 'COMPLETED' })
    const params: GoalSummaryCardParams = {
      goal,
      actions: [],
    }

    // When
    const content = nunjucks.render('template.njk', { params })
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=in-progress-goal]').length).toEqual(0)
    expect($('[data-qa=archived-goal]').length).toEqual(0)
    expect($('[data-qa=completed-goal]').length).toEqual(1)
  })

  it('Should render using the ARCHIVED goal summary card content given the goal has a status of ARCHIVED', () => {
    // Given
    const goal = aValidGoal({ status: 'ARCHIVED' })
    const params: GoalSummaryCardParams = {
      goal,
      actions: [],
    }

    // When
    const content = nunjucks.render('template.njk', { params })
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=in-progress-goal]').length).toEqual(0)
    expect($('[data-qa=archived-goal]').length).toEqual(1)
    expect($('[data-qa=completed-goal]').length).toEqual(0)
  })
})
