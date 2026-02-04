import nunjucks from 'nunjucks'
import * as cheerio from 'cheerio'
import type { ActionsCardParams } from 'viewComponents'
import { startOfDay } from 'date-fns'
import formatDateFilter from '../../../filters/formatDateFilter'
import formatReviewExemptionReasonFilter from '../../../filters/formatReviewExemptionReasonFilter'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import ActionPlanReviewStatusValue from '../../../enums/actionPlanReviewStatusValue'
import formatReviewTypeScreenValueFilter from '../../../filters/formatReviewTypeFilter'
import SessionTypeValue from '../../../enums/sessionTypeValue'
import config from '../../../config'

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
  .addGlobal('featureToggles', { ...config.featureToggles, newSessionApiEnabled: true })

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
        reviewType: SessionTypeValue.REVIEW,
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

  it.each([
    { reviewType: SessionTypeValue.REVIEW, expectedDueReviewLabel: 'Review due by 15 Feb 2025' },
    {
      reviewType: SessionTypeValue.TRANSFER_REVIEW,
      expectedDueReviewLabel: 'Review due to transfer due by 15 Feb 2025',
    },
    {
      reviewType: SessionTypeValue.PRE_RELEASE_REVIEW,
      expectedDueReviewLabel: 'Pre-release review due by 15 Feb 2025',
    },
  ])('should render review actions given review of type %reviewType due', ({ reviewType, expectedDueReviewLabel }) => {
    // Given
    const params = {
      ...templateParams,
      actionPlanReview: {
        problemRetrievingData: false,
        reviewStatus: 'DUE',
        reviewDueDate: startOfDay('2025-02-15'),
        reviewType,
      },
    }

    // When
    const content = nunjucks.render('_reviewActions.njk', { params })
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=review-actions]').length).toEqual(1)
    expect($('[data-qa=review-not-due]').length).toEqual(0)
    expect($('[data-qa=review-due]').text().trim()).toEqual(expectedDueReviewLabel)
    expect($('[data-qa=review-overdue]').length).toEqual(0)
    expect($('[data-qa=review-on-hold]').length).toEqual(0)
    expect($('[data-qa=reason-on-hold]').length).toEqual(0)
    expect($('[data-qa=no-reviews-due]').length).toEqual(0)
    expect($('[data-qa=release-on]').length).toEqual(0)

    expect($('[data-qa=reviews-action-items] li').length).toEqual(2)
    expect($('[data-qa=mark-review-complete-button]').length).toEqual(1)
    expect($('[data-qa=record-exemption-button]').length).toEqual(1)
  })

  it.each([
    { reviewType: SessionTypeValue.REVIEW, expectedOverdueReviewLabel: 'Review was due by 15 Feb 2025' },
    {
      reviewType: SessionTypeValue.TRANSFER_REVIEW,
      expectedOverdueReviewLabel: 'Review due to transfer was due by 15 Feb 2025',
    },
    {
      reviewType: SessionTypeValue.PRE_RELEASE_REVIEW,
      expectedOverdueReviewLabel: 'Pre-release review was due by 15 Feb 2025',
    },
  ])(
    'should render review actions given review of type %reviewType overdue',
    ({ reviewType, expectedOverdueReviewLabel }) => {
      // Given
      const params = {
        ...templateParams,
        actionPlanReview: {
          problemRetrievingData: false,
          reviewStatus: 'OVERDUE',
          reviewDueDate: startOfDay('2025-02-15'),
          reviewType,
        },
      }

      // When
      const content = nunjucks.render('_reviewActions.njk', { params })
      const $ = cheerio.load(content)

      // Then
      expect($('[data-qa=review-actions]').length).toEqual(1)
      expect($('[data-qa=review-not-due]').length).toEqual(0)
      expect($('[data-qa=review-due]').length).toEqual(0)
      expect($('[data-qa=review-overdue]').text().trim()).toEqual(expectedOverdueReviewLabel)
      expect($('[data-qa=review-on-hold]').length).toEqual(0)
      expect($('[data-qa=reason-on-hold]').length).toEqual(0)
      expect($('[data-qa=no-reviews-due]').length).toEqual(0)
      expect($('[data-qa=release-on]').length).toEqual(0)

      expect($('[data-qa=reviews-action-items] li').length).toEqual(2)
      expect($('[data-qa=mark-review-complete-button]').length).toEqual(1)
      expect($('[data-qa=record-exemption-button]').length).toEqual(1)
    },
  )

  it.each([
    { reviewType: SessionTypeValue.REVIEW, expectedOnHoldReviewLabel: 'Review on hold' },
    {
      reviewType: SessionTypeValue.TRANSFER_REVIEW,
      expectedOnHoldReviewLabel: 'Review due to transfer on hold',
    },
    {
      reviewType: SessionTypeValue.PRE_RELEASE_REVIEW,
      expectedOnHoldReviewLabel: 'Pre-release review on hold',
    },
  ])(
    'should render review actions given review of type %reviewType has been exempted',
    ({ reviewType, expectedOnHoldReviewLabel }) => {
      // Given
      const params = {
        ...templateParams,
        actionPlanReview: {
          problemRetrievingData: false,
          reviewStatus: 'ON_HOLD',
          exemptionReason: ActionPlanReviewStatusValue.EXEMPT_PRISONER_FAILED_TO_ENGAGE,
          reviewDueDate: startOfDay('2025-02-15'),
          reviewType,
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
      expect($('[data-qa=review-on-hold]').text().trim()).toEqual(expectedOnHoldReviewLabel)
      expect($('[data-qa=reason-on-hold]').text().trim()).toEqual(
        `Reason: Has failed to engage or cooperate for a reason outside contractor's control`,
      )
      expect($('[data-qa=no-reviews-due]').length).toEqual(0)
      expect($('[data-qa=release-on]').length).toEqual(0)

      expect($('[data-qa=reviews-action-items] li').length).toEqual(1)
      expect($('[data-qa=remove-exemption-button]').length).toEqual(1)
    },
  )

  it('should render review actions given prisoner has had their last review', () => {
    // Given
    const params = {
      ...templateParams,
      actionPlanReview: {
        problemRetrievingData: false,
        reviewStatus: 'HAS_HAD_LAST_REVIEW',
        reviewType: SessionTypeValue.REVIEW,
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

    // If the prisoner has had their last review then we do not support completing or exempting the review, and therefore we expect no action links
    expect($('[data-qa=reviews-action-items] li').length).toEqual(0)
  })

  it('should render review actions given prisoner has no scheduled review', () => {
    // Given
    const params = {
      ...templateParams,
      actionPlanReview: {
        problemRetrievingData: false,
        reviewStatus: 'NO_SCHEDULED_REVIEW',
        reviewType: SessionTypeValue.REVIEW,
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

    // If the prisoner has no scheduled review at all then we do not support completing or exempting the review, and therefore we expect no action links
    expect($('[data-qa=reviews-action-items] li').length).toEqual(0)
  })

  it('should render empty review actions given prisoner has their induction scheduled', () => {
    // Given
    const params = {
      ...templateParams,
      actionPlanReview: {
        problemRetrievingData: false,
        reviewStatus: 'NO_SCHEDULED_REVIEW',
        reviewType: SessionTypeValue.REVIEW,
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
