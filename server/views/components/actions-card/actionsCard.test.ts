import nunjucks from 'nunjucks'
import * as cheerio from 'cheerio'
import { startOfDay } from 'date-fns'
import type { ActionsCardParams } from 'viewComponents'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import formatDateFilter from '../../../filters/formatDateFilter'
import formatReviewExemptionReasonFilter from '../../../filters/formatReviewExemptionReasonFilter'

const njkEnv = nunjucks.configure([
  'node_modules/govuk-frontend/dist/',
  'node_modules/@ministryofjustice/frontend/',
  'server/views/',
  __dirname,
])

njkEnv.addFilter('formatDate', formatDateFilter)
njkEnv.addFilter('formatReviewExemptionReason', formatReviewExemptionReasonFilter)

describe('Tests for actions card component', () => {
  it('should render the actions card component given no schedule for either Induction or Reviews', () => {
    // Given
    const params: ActionsCardParams = {
      prisonerSummary: aValidPrisonerSummary(),
      inductionSchedule: {
        problemRetrievingData: false,
        inductionStatus: 'NO_SCHEDULED_INDUCTION',
      },
      actionPlanReview: {
        problemRetrievingData: false,
        reviewStatus: 'NO_SCHEDULED_REVIEW',
      },
      hasEditAuthority: true,
      reviewJourneyEnabledForPrison: true,
    }

    // When
    const content = nunjucks.render('actionCards.test.njk', params)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=induction-actions]').length).toEqual(1) // containing div exists, but nothing in it
    expect($('[data-qa=induction-actions] span').length).toEqual(0)
    expect($('[data-qa=induction-actions] ul li').length).toEqual(0)

    expect($('[data-qa=review-actions]').length).toEqual(1) // containing div exists, but nothing in it
    expect($('[data-qa=review-actions] span').length).toEqual(0)
    expect($('[data-qa=review-actions] ul li').length).toEqual(0)

    expect($('[data-qa=goal-actions]').length).toEqual(1)
  })

  it('should render the actions card component problem retrieving data for both Induction and Review schedules', () => {
    // Given
    const params: ActionsCardParams = {
      prisonerSummary: aValidPrisonerSummary(),
      inductionSchedule: {
        problemRetrievingData: true,
      },
      actionPlanReview: {
        problemRetrievingData: true,
      },
      hasEditAuthority: true,
      reviewJourneyEnabledForPrison: true,
    }

    // When
    const content = nunjucks.render('actionCards.test.njk', params)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=induction-actions]').length).toEqual(1) // containing div exists, but nothing in it
    expect($('[data-qa=induction-actions] span').length).toEqual(0)
    expect($('[data-qa=induction-actions] ul li').length).toEqual(0)

    expect($('[data-qa=review-actions]').length).toEqual(1) // containing div exists, but nothing in it
    expect($('[data-qa=review-actions] span').length).toEqual(0)
    expect($('[data-qa=review-actions] ul li').length).toEqual(0)

    expect($('[data-qa=goal-actions]').length).toEqual(1)
  })

  it('should render the actions card component problem neither Induction nor Review schedules data present at all', () => {
    // Given
    const params: ActionsCardParams = {
      prisonerSummary: aValidPrisonerSummary(),
      inductionSchedule: undefined,
      actionPlanReview: undefined,
      hasEditAuthority: true,
      reviewJourneyEnabledForPrison: true,
    }

    // When
    const content = nunjucks.render('actionCards.test.njk', params)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=induction-actions]').length).toEqual(1) // containing div exists, but nothing in it
    expect($('[data-qa=induction-actions] span').length).toEqual(0)
    expect($('[data-qa=induction-actions] ul li').length).toEqual(0)

    expect($('[data-qa=review-actions]').length).toEqual(1) // containing div exists, but nothing in it
    expect($('[data-qa=review-actions] span').length).toEqual(0)
    expect($('[data-qa=review-actions] ul li').length).toEqual(0)

    expect($('[data-qa=goal-actions]').length).toEqual(1)
  })

  it('should render the actions card component given schedule for Reviews but not for Induction', () => {
    // Given
    const params: ActionsCardParams = {
      prisonerSummary: aValidPrisonerSummary(),
      inductionSchedule: {
        problemRetrievingData: false,
        inductionStatus: 'NO_SCHEDULED_INDUCTION',
      },
      actionPlanReview: {
        problemRetrievingData: false,
        reviewStatus: 'DUE',
        reviewDueDate: startOfDay('2025-02-15'),
      },
      hasEditAuthority: true,
      reviewJourneyEnabledForPrison: true,
    }

    // When
    const content = nunjucks.render('actionCards.test.njk', params)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=induction-actions]').length).toEqual(1) // containing div exists, but nothing in it
    expect($('[data-qa=induction-actions] span').length).toEqual(0)
    expect($('[data-qa=induction-actions] ul li').length).toEqual(0)

    expect($('[data-qa=review-actions]').length).toEqual(1) // containing div exists, with a span and li items within it
    expect($('[data-qa=review-actions] span').length).toEqual(1)
    expect($('[data-qa=review-actions] ul li').length).toEqual(2)

    expect($('[data-qa=goal-actions]').length).toEqual(1)
  })

  it('should render the actions card component given scheduled for Induction but not for Reviews', () => {
    // Given
    const params: ActionsCardParams = {
      prisonerSummary: aValidPrisonerSummary(),
      inductionSchedule: {
        problemRetrievingData: false,
        inductionStatus: 'INDUCTION_DUE',
        inductionDueDate: startOfDay('2025-02-15'),
      },
      actionPlanReview: {
        problemRetrievingData: false,
        reviewStatus: 'NO_SCHEDULED_REVIEW',
      },
      hasEditAuthority: true,
      reviewJourneyEnabledForPrison: true,
    }

    // When
    const content = nunjucks.render('actionCards.test.njk', params)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=induction-actions]').length).toEqual(1) // containing div exists, with a span and li items within it
    expect($('[data-qa=induction-actions] span').length).toEqual(1)
    expect($('[data-qa=induction-actions] ul li').length).toEqual(2)

    expect($('[data-qa=review-actions]').length).toEqual(1) // containing div exists, but nothing in it
    expect($('[data-qa=review-actions] span').length).toEqual(0)
    expect($('[data-qa=review-actions] ul li').length).toEqual(0)

    expect($('[data-qa=goal-actions]').length).toEqual(1)
  })
})
