import nunjucks from 'nunjucks'
import * as cheerio from 'cheerio'
import { startOfDay } from 'date-fns'
import type { ActionsCardParams } from 'viewComponents'
import type { ActionPlanReviewScheduleView, InductionScheduleView } from '../../../routes/overview/overviewViewTypes'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import formatDateFilter from '../../../filters/formatDateFilter'
import formatReviewExemptionReasonFilter from '../../../filters/formatReviewExemptionReasonFilter'
import SessionTypeValue from '../../../enums/sessionTypeValue'
import formatReviewTypeScreenValueFilter from '../../../filters/formatReviewTypeFilter'

const njkEnv = nunjucks.configure([
  'node_modules/govuk-frontend/dist/',
  'node_modules/@ministryofjustice/frontend/',
  'server/views/',
  __dirname,
])

njkEnv
  .addFilter('formatDate', formatDateFilter)
  .addFilter('formatReviewExemptionReason', formatReviewExemptionReasonFilter)
  .addFilter('formatReviewTypeScreenValue', formatReviewTypeScreenValueFilter)

const userHasPermissionTo = jest.fn()
const templateParams: ActionsCardParams = {
  inductionSchedule: {
    problemRetrievingData: false,
    inductionStatus: 'NO_SCHEDULED_INDUCTION',
  },
  actionPlanReview: {
    problemRetrievingData: false,
    reviewStatus: 'NOT_DUE',
    reviewDueDate: startOfDay('2025-02-15'),
    reviewType: SessionTypeValue.REVIEW,
  },
  prisonerSummary: aValidPrisonerSummary(),
  userHasPermissionTo,
}

describe('Tests for actions card component', () => {
  beforeEach(() => {
    jest.resetAllMocks()
    userHasPermissionTo.mockReturnValue(true)
  })

  it('should render the actions card component given no schedule for either Induction or Reviews', () => {
    // Given
    const params = {
      ...templateParams,
      inductionSchedule: {
        problemRetrievingData: false,
        inductionStatus: 'NO_SCHEDULED_INDUCTION',
      },
      actionPlanReview: {
        problemRetrievingData: false,
        reviewStatus: 'NO_SCHEDULED_REVIEW',
      },
    }

    // When
    const content = nunjucks.render('actionCards.test.njk', params)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=induction-actions]').length).toEqual(1) // containing div exists, but nothing in it
    expect($('[data-qa=induction-actions] span').length).toEqual(0)
    expect($('[data-qa=induction-actions] ul li').length).toEqual(0)

    expect($('[data-qa=review-actions]').length).toEqual(1) // containing div exists ...
    expect($('[data-qa=review-actions] span').length).toEqual(1) // ... containing the status tag ...
    expect($('[data-qa=review-actions] ul li').length).toEqual(0) // ... but no action links

    expect($('[data-qa=goal-actions]').length).toEqual(1)
  })

  it('should render the actions card component problem retrieving data for both Induction and Review schedules', () => {
    // Given
    const params = {
      ...templateParams,
      inductionSchedule: {
        problemRetrievingData: true,
      },
      actionPlanReview: {
        problemRetrievingData: true,
      },
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
    const params = {
      ...templateParams,
      inductionSchedule: undefined as InductionScheduleView,
      actionPlanReview: undefined as ActionPlanReviewScheduleView,
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
    const params = {
      ...templateParams,
      inductionSchedule: {
        problemRetrievingData: false,
        inductionStatus: 'NO_SCHEDULED_INDUCTION',
      },
      actionPlanReview: {
        problemRetrievingData: false,
        reviewStatus: 'DUE',
        reviewDueDate: startOfDay('2025-02-15'),
        reviewType: SessionTypeValue.REVIEW,
      },
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
    const params = {
      ...templateParams,
      inductionSchedule: {
        problemRetrievingData: false,
        inductionStatus: 'INDUCTION_DUE',
        inductionDueDate: startOfDay('2025-02-15'),
      },
      actionPlanReview: {
        problemRetrievingData: false,
        reviewStatus: 'NO_SCHEDULED_REVIEW',
      },
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
