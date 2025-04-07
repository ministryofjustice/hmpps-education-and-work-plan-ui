import nunjucks from 'nunjucks'
import * as cheerio from 'cheerio'
import type { ActionsCardParams } from 'viewComponents'
import { startOfDay } from 'date-fns'
import formatDateFilter from '../../../filters/formatDateFilter'
import formatReviewExemptionReasonFilter from '../../../filters/formatReviewExemptionReasonFilter'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import ActionPlanReviewStatusValue from '../../../enums/actionPlanReviewStatusValue'

const njkEnv = nunjucks.configure([
  'node_modules/govuk-frontend/dist/',
  'node_modules/@ministryofjustice/frontend/',
  'server/views/',
  __dirname,
])

njkEnv.addFilter('formatDate', formatDateFilter)
njkEnv.addFilter('formatReviewExemptionReason', formatReviewExemptionReasonFilter)

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
  },
  prisonerSummary: aValidPrisonerSummary(),
  userHasPermissionTo,
}

describe('_reviewActions', () => {
  beforeEach(() => {
    jest.resetAllMocks()
    userHasPermissionTo.mockReturnValue(true)
  })

  it('should render review actions given review not due', () => {
    // Given
    const params = {
      ...templateParams,
      actionPlanReview: {
        problemRetrievingData: false,
        reviewStatus: 'NOT_DUE',
        reviewDueDate: startOfDay('2025-02-15'),
      },
    }

    // When
    const content = nunjucks.render('_reviewActions.njk', { params })
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=review-actions]').length).toEqual(1)
    expect($('[data-qa=review-not-due]').text().trim()).toEqual('Review due by 15 Feb 2025')
    expect($('[data-qa=review-due]').length).toEqual(0)
    expect($('[data-qa=review-overdue]').length).toEqual(0)
    expect($('[data-qa=review-on-hold]').length).toEqual(0)
    expect($('[data-qa=reason-on-hold]').length).toEqual(0)
    expect($('[data-qa=no-reviews-due]').length).toEqual(0)
    expect($('[data-qa=release-on]').length).toEqual(0)

    expect($('[data-qa=reviews-action-items] li').length).toEqual(2)
    expect($('[data-qa=mark-review-complete-button]').length).toEqual(1)
    expect($('[data-qa=record-exemption-button]').length).toEqual(1)
  })

  it('should render review actions given review due', () => {
    // Given
    const params = {
      ...templateParams,
      actionPlanReview: {
        problemRetrievingData: false,
        reviewStatus: 'DUE',
        reviewDueDate: startOfDay('2025-02-15'),
      },
    }

    // When
    const content = nunjucks.render('_reviewActions.njk', { params })
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=review-actions]').length).toEqual(1)
    expect($('[data-qa=review-not-due]').length).toEqual(0)
    expect($('[data-qa=review-due]').text().trim()).toEqual('Review due by 15 Feb 2025')
    expect($('[data-qa=review-overdue]').length).toEqual(0)
    expect($('[data-qa=review-on-hold]').length).toEqual(0)
    expect($('[data-qa=reason-on-hold]').length).toEqual(0)
    expect($('[data-qa=no-reviews-due]').length).toEqual(0)
    expect($('[data-qa=release-on]').length).toEqual(0)

    expect($('[data-qa=reviews-action-items] li').length).toEqual(2)
    expect($('[data-qa=mark-review-complete-button]').length).toEqual(1)
    expect($('[data-qa=record-exemption-button]').length).toEqual(1)
  })

  it('should render review actions given review overdue', () => {
    // Given
    const params = {
      ...templateParams,
      actionPlanReview: {
        problemRetrievingData: false,
        reviewStatus: 'OVERDUE',
        reviewDueDate: startOfDay('2025-02-15'),
      },
    }

    // When
    const content = nunjucks.render('_reviewActions.njk', { params })
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=review-actions]').length).toEqual(1)
    expect($('[data-qa=review-not-due]').length).toEqual(0)
    expect($('[data-qa=review-due]').length).toEqual(0)
    expect($('[data-qa=review-overdue]').text().trim()).toEqual('Review was due by 15 Feb 2025')
    expect($('[data-qa=review-on-hold]').length).toEqual(0)
    expect($('[data-qa=reason-on-hold]').length).toEqual(0)
    expect($('[data-qa=no-reviews-due]').length).toEqual(0)
    expect($('[data-qa=release-on]').length).toEqual(0)

    expect($('[data-qa=reviews-action-items] li').length).toEqual(2)
    expect($('[data-qa=mark-review-complete-button]').length).toEqual(1)
    expect($('[data-qa=record-exemption-button]').length).toEqual(1)
  })

  it('should render review actions given review has been exempted', () => {
    // Given
    const params = {
      ...templateParams,
      actionPlanReview: {
        problemRetrievingData: false,
        reviewStatus: 'ON_HOLD',
        exemptionReason: ActionPlanReviewStatusValue.EXEMPT_PRISONER_FAILED_TO_ENGAGE,
        reviewDueDate: startOfDay('2025-02-15'),
      },
    }

    // When
    const content = nunjucks.render('_reviewActions.njk', { params })
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=review-actions]').length).toEqual(1)
    expect($('[data-qa=review-not-due]').length).toEqual(0)
    expect($('[data-qa=review-due]').length).toEqual(0)
    expect($('[data-qa=review-overdue]').length).toEqual(0)
    expect($('[data-qa=review-on-hold]').text().trim()).toEqual('Review on hold')
    expect($('[data-qa=reason-on-hold]').text().trim()).toEqual(
      `Reason: Has failed to engage or cooperate for a reason outside contractor's control`,
    )
    expect($('[data-qa=no-reviews-due]').length).toEqual(0)
    expect($('[data-qa=release-on]').length).toEqual(0)

    expect($('[data-qa=reviews-action-items] li').length).toEqual(1)
    expect($('[data-qa=remove-exemption-button]').length).toEqual(1)
  })

  it('should render review actions given prisoner has had their last review', () => {
    // Given
    const params = {
      ...templateParams,
      actionPlanReview: {
        problemRetrievingData: false,
        reviewStatus: 'HAS_HAD_LAST_REVIEW',
      },
    }

    // When
    const content = nunjucks.render('_reviewActions.njk', { params })
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=review-actions]').length).toEqual(1)
    expect($('[data-qa=review-not-due]').length).toEqual(0)
    expect($('[data-qa=review-due]').length).toEqual(0)
    expect($('[data-qa=review-overdue]').length).toEqual(0)
    expect($('[data-qa=review-on-hold]').length).toEqual(0)
    expect($('[data-qa=reason-on-hold]').length).toEqual(0)
    expect($('[data-qa=no-reviews-due]').text().trim()).toEqual('No reviews due')
    expect($('[data-qa=release-on]').text().trim()).toEqual('release on 31 Dec 2025')

    expect($('[data-qa=reviews-action-items] li').length).toEqual(2)
    expect($('[data-qa=mark-review-complete-button]').length).toEqual(1)
    expect($('[data-qa=record-exemption-button]').length).toEqual(1)
  })

  it('should render review actions given prisoner has no scheduled review', () => {
    // Given
    const params = {
      ...templateParams,
      actionPlanReview: {
        problemRetrievingData: false,
        reviewStatus: 'NO_SCHEDULED_REVIEW',
      },
    }

    // When
    const content = nunjucks.render('_reviewActions.njk', { params })
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=review-actions]').length).toEqual(1)
    expect($('[data-qa=review-not-due]').length).toEqual(0)
    expect($('[data-qa=review-due]').length).toEqual(0)
    expect($('[data-qa=review-overdue]').length).toEqual(0)
    expect($('[data-qa=review-on-hold]').length).toEqual(0)
    expect($('[data-qa=reason-on-hold]').length).toEqual(0)
    expect($('[data-qa=no-reviews-due]').text().trim()).toEqual('No reviews due')
    expect($('[data-qa=release-on]').text().trim()).toEqual('release on 31 Dec 2025')

    expect($('[data-qa=reviews-action-items] li').length).toEqual(2)
    expect($('[data-qa=mark-review-complete-button]').length).toEqual(1)
    expect($('[data-qa=record-exemption-button]').length).toEqual(1)
  })

  it('should render empty review actions given prisoner has their induction scheduled', () => {
    // Given
    const params = {
      ...templateParams,
      actionPlanReview: {
        problemRetrievingData: false,
        reviewStatus: 'NO_SCHEDULED_REVIEW',
      },
      inductionSchedule: {
        problemRetrievingData: false,
        inductionStatus: 'INDUCTION_DUE',
        inductionDueDate: startOfDay('2025-02-15'),
      },
    }

    // When
    const content = nunjucks.render('_reviewActions.njk', { params })
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=review-actions]').length).toEqual(1)
    expect($('[data-qa=review-actions] span').length).toEqual(0)
    expect($('[data-qa=reviews-action-items] li').length).toEqual(0)
  })

  it('should render empty review actions given there was a problem retrieving the action plan reviews data', () => {
    // Given
    const params = {
      ...templateParams,
      actionPlanReview: {
        problemRetrievingData: true,
      },
    }

    // When
    const content = nunjucks.render('_reviewActions.njk', { params })
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=review-actions]').length).toEqual(1)
    expect($('[data-qa=review-actions] span').length).toEqual(0)
    expect($('[data-qa=reviews-action-items] li').length).toEqual(0)
  })
})
