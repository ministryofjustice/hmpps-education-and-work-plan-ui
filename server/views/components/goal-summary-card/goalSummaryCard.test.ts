import nunjucks from 'nunjucks'
import * as cheerio from 'cheerio'
import type { Action, GoalSummaryCardParams } from 'viewComponents'
import { aValidGoal } from '../../../testsupport/actionPlanTestDataBuilder'
import formatDateFilter from '../../../filters/formatDateFilter'
import formatStepStatusValueFilter from '../../../filters/formatStepStatusValueFilter'

const njkEnv = nunjucks.configure([
  'node_modules/govuk-frontend/dist/',
  'node_modules/@ministryofjustice/frontend/',
  'server/views/',
  __dirname,
])
njkEnv.addFilter('formatDate', formatDateFilter)
njkEnv.addFilter('formatStepStatusValue', formatStepStatusValueFilter)

describe('Tests for goal summary card component', () => {
  it('Should render the goal summary card with requested attributes and id', () => {
    const goal = aValidGoal()
    const params: GoalSummaryCardParams = {
      goal,
      actions: [],
      attributes: { 'data-qa': 'goal-summary-card-qa' },
      id: 'test-goal-card',
    }

    const content = nunjucks.render('test.njk', { params })

    const $ = cheerio.load(content)
    const goalCardByClass = $('.govuk-summary-card')
    expect(goalCardByClass.length).toEqual(1)

    const goalCardByDataQa = $('[data-qa=goal-summary-card-qa]')
    expect(goalCardByDataQa.length).toEqual(1)

    const goalCardByDataId = $('#test-goal-card')
    expect(goalCardByDataId.length).toEqual(1)
  })
  it('should render the actions with optional attributes', () => {
    const actions: Action[] = [
      { title: 'Do a thing', href: '/thing', attributes: { 'data-qa': 'thing-link' } },
      { title: 'Do another thing', href: '/another-thing', attributes: { 'data-qa': 'another-thing-link' } },
    ]
    const goal = aValidGoal()
    const params: GoalSummaryCardParams = {
      goal,
      actions,
    }

    const content = nunjucks.render('test.njk', { params })

    const $ = cheerio.load(content)
    expect($('[data-qa=thing-link]').text().trim()).toEqual('Do a thing')
    expect($('[data-qa=another-thing-link]').text().trim()).toEqual('Do another thing')
  })
  it('should render the actions with visually hidden section', () => {
    const actions: Action[] = [
      {
        title: 'Do a thing<span class="govuk-visually-hidden"> hide me</span>',
        href: '/thing',
        attributes: { 'data-qa': 'thing-link' },
      },
    ]
    const goal = aValidGoal()
    const params: GoalSummaryCardParams = {
      goal,
      actions,
    }

    const content = nunjucks.render('test.njk', { params })

    const $ = cheerio.load(content)
    expect($('[data-qa=thing-link]').text().trim()).toEqual('Do a thing hide me')
  })
  it('should render the actions conditionally', () => {
    const actions: Action[] = [
      { title: 'Do a thing', href: '/thing', attributes: { 'data-qa': 'thing-link' }, 'render-if': true },
      {
        title: 'Do another thing',
        href: '/another-thing',
        attributes: { 'data-qa': 'another-thing-link' },
        'render-if': false,
      },
    ]
    const goal = aValidGoal()
    const params: GoalSummaryCardParams = {
      goal,
      actions,
    }

    const content = nunjucks.render('test.njk', { params })

    const $ = cheerio.load(content)
    expect($('[data-qa=thing-link]')).toHaveLength(1)
    expect($('[data-qa=another-thing-link]')).toHaveLength(0)
  })
})
