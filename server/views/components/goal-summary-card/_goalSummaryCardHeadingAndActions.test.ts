import * as cheerio from 'cheerio'
import { startOfDay } from 'date-fns'
import type { Action, GoalSummaryCardParams } from 'viewComponents'
import nunjucks from 'nunjucks'
import formatDateFilter from '../../../filters/formatDateFilter'
import { aValidGoal } from '../../../testsupport/actionPlanTestDataBuilder'

const njkEnv = nunjucks.configure([
  'node_modules/govuk-frontend/dist/',
  'node_modules/@ministryofjustice/frontend/',
  'server/views/',
  __dirname,
])
njkEnv //
  .addFilter('formatDate', formatDateFilter)

const goal = aValidGoal({ targetCompletionDate: startOfDay('2023-08-01') })

describe('_goalSummaryCardHeadingAndActions', () => {
  it('should not render actions whose render-if is false', () => {
    // Given
    const actions: Action[] = [
      { title: 'Do a thing', href: '/thing', 'render-if': false },
      { title: 'Do another thing', href: '/another-thing', 'render-if': true },
      { title: 'Do a 3rd thing', href: '/third-thing', 'render-if': undefined },
    ]

    const params: GoalSummaryCardParams = {
      goal,
      actions,
    }

    // When
    const content = nunjucks.render('_goalSummaryCardHeadingAndActions.njk', { params })
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=goal-summary-card-heading]').text().trim()).toEqual('Achieve goal by 1 August 2023')
    expect($('.govuk-summary-card__actions li').length).toEqual(2)
    expect($('.govuk-summary-card__actions li').eq(0).text().trim()).toEqual('Do another thing')
    expect($('.govuk-summary-card__actions li').eq(1).text().trim()).toEqual('Do a 3rd thing')
  })

  it('should render the actions with optional attributes', () => {
    // Given
    const actions: Action[] = [
      { title: 'Do a thing', href: '/thing', attributes: { 'data-qa': 'thing-link' } },
      { title: 'Do another thing', href: '/another-thing', attributes: { 'data-qa': 'another-thing-link' } },
    ]

    const params: GoalSummaryCardParams = {
      goal,
      actions,
    }

    // When
    const content = nunjucks.render('_goalSummaryCardHeadingAndActions.njk', { params })
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=thing-link]').text().trim()).toEqual('Do a thing')
    expect($('[data-qa=another-thing-link]').text().trim()).toEqual('Do another thing')
  })

  it('should render the actions with visually hidden section', () => {
    // Given
    const actions: Action[] = [
      {
        title: 'Do a thing<span class="govuk-visually-hidden"> hide me</span>',
        href: '/thing',
        attributes: { 'data-qa': 'thing-link' },
      },
    ]

    const params: GoalSummaryCardParams = {
      goal,
      actions,
    }

    // When
    const content = nunjucks.render('_goalSummaryCardHeadingAndActions.njk', { params })
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=thing-link]').text().trim()).toEqual('Do a thing hide me')
  })
})
