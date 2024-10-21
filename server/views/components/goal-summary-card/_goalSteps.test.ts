import * as cheerio from 'cheerio'
import nunjucks from 'nunjucks'
import type { GoalSummaryCardParams } from 'viewComponents'
import { aValidGoal, aValidStep } from '../../../testsupport/actionPlanTestDataBuilder'
import formatStepStatusValueFilter from '../../../filters/formatStepStatusValueFilter'

const njkEnv = nunjucks.configure([
  'node_modules/govuk-frontend/dist/',
  'node_modules/@ministryofjustice/frontend/',
  'server/views/',
  __dirname,
])
njkEnv //
  .addFilter('formatStepStatusValue', formatStepStatusValueFilter)

const goal = aValidGoal({
  steps: [
    { ...aValidStep(), sequenceNumber: 1, title: 'Step 1', status: 'ACTIVE' },
    { ...aValidStep(), sequenceNumber: 2, title: 'Step 2', status: 'COMPLETE' },
    { ...aValidStep(), sequenceNumber: 3, title: 'Step 3', status: 'NOT_STARTED' },
  ],
})

describe('_goalSteps', () => {
  it('should render a table with the correct structure', () => {
    // Given
    const params: GoalSummaryCardParams = {
      goal,
      actions: [],
    }

    // When
    const content = nunjucks.render('_goalSteps.njk', { params })
    const $ = cheerio.load(content)

    // Then
    expect($('table caption').text().trim()).toEqual('Steps for this goal')
    expect($('table tr th').length).toEqual(2)
    expect($('table tr th').eq(0).text().trim()).toEqual('Steps')
    expect($('table tr th').eq(1).text().trim()).toEqual('Status')
    expect($('table tr th').eq(1).text().trim()).toEqual('Status')
  })

  it('should render each step within the table', () => {
    // Given
    const params: GoalSummaryCardParams = {
      goal,
      actions: [],
    }

    // When
    const content = nunjucks.render('_goalSteps.njk', { params })
    const $ = cheerio.load(content)

    // Then
    expect($('table tbody tr').length).toEqual(3)
    expect($('table tbody tr').eq(0).children('td').eq(0).text().trim()).toEqual('1. Step 1')
    expect($('table tbody tr').eq(0).children('td').eq(1).text().trim()).toEqual('Started')
    expect($('table tbody tr').eq(0).children('td').eq(1).children('strong').hasClass('govuk-tag--blue')).toBeTruthy()
    expect($('table tbody tr').eq(1).children('td').eq(0).text().trim()).toEqual('2. Step 2')
    expect($('table tbody tr').eq(1).children('td').eq(1).text().trim()).toEqual('Completed')
    expect($('table tbody tr').eq(1).children('td').eq(1).children('strong').hasClass('govuk-tag--green')).toBeTruthy()
    expect($('table tbody tr').eq(2).children('td').eq(0).text().trim()).toEqual('3. Step 3')
    expect($('table tbody tr').eq(2).children('td').eq(1).text().trim()).toEqual('Not started')
    expect($('table tbody tr').eq(2).children('td').eq(1).children('strong').hasClass('govuk-tag--grey')).toBeTruthy()
  })
})
