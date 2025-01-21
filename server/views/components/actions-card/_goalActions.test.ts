import nunjucks from 'nunjucks'
import type { ActionsCardParams } from 'viewComponents'
import * as cheerio from 'cheerio'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'

nunjucks.configure([
  'node_modules/govuk-frontend/dist/',
  'node_modules/@ministryofjustice/frontend/',
  'server/views/',
  __dirname,
])

describe('_goalActions', () => {
  it('should render heading and add goal link', () => {
    // Given
    const params: ActionsCardParams = {
      prisonerSummary: aValidPrisonerSummary(),
      hasEditAuthority: true,
      reviewJourneyEnabledForPrison: true,
    } as ActionsCardParams

    // When
    const content = nunjucks.render('_goalActions.njk', { params })
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=goal-actions]').length).toEqual(1)
    expect($('[data-qa=goal-actions] h3').length).toEqual(1)
    expect($('[data-qa=goals-action-items] li').length).toEqual(1)
    expect($('[data-qa=add-goal-button]').attr('href')).toEqual('/plan/A1234BC/goals/create')
  })

  it('should not render heading given feature toggle not enabled', () => {
    // Given
    const params: ActionsCardParams = {
      prisonerSummary: aValidPrisonerSummary(),
      hasEditAuthority: true,
      reviewJourneyEnabledForPrison: false,
    } as ActionsCardParams

    // When
    const content = nunjucks.render('_goalActions.njk', { params })
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=goal-actions]').length).toEqual(1)
    expect($('[data-qa=goal-actions] h3').length).toEqual(0)
    expect($('[data-qa=goals-action-items] li').length).toEqual(1)
  })

  it('should not render add goal link given does not have edit authority', () => {
    // Given
    const params: ActionsCardParams = {
      prisonerSummary: aValidPrisonerSummary(),
      hasEditAuthority: false,
      reviewJourneyEnabledForPrison: false,
    } as ActionsCardParams

    // When
    const content = nunjucks.render('_goalActions.njk', { params })
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=goal-actions]').length).toEqual(1)
    expect($('[data-qa=goal-actions] h3').length).toEqual(0)
    expect($('[data-qa=goals-action-items] li').length).toEqual(0)
  })
})
