import nunjucks from 'nunjucks'
import * as cheerio from 'cheerio'
import { startOfDay } from 'date-fns'
import type { ActionsCardParams } from 'viewComponents'
import formatDateFilter from '../../../filters/formatDateFilter'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import InductionScheduleStatusValue from '../../../enums/inductionScheduleStatusValue'
import formatInductionExemptionReasonFilter from '../../../filters/formatInductionExemptionReasonFilter'

const njkEnv = nunjucks.configure([
  'node_modules/govuk-frontend/dist/',
  'node_modules/@ministryofjustice/frontend/',
  'server/views/',
  __dirname,
])

njkEnv.addFilter('formatDate', formatDateFilter)
njkEnv.addFilter('formatInductionExemptionReason', formatInductionExemptionReasonFilter)

const templateParams: ActionsCardParams = {
  inductionSchedule: {
    problemRetrievingData: false,
    inductionStatus: 'INDUCTION_DUE',
    inductionDueDate: startOfDay('2025-02-15'),
  },
  actionPlanReview: {
    problemRetrievingData: false,
    reviewStatus: 'NO_SCHEDULED_REVIEW',
  },
  reviewJourneyEnabledForPrison: true,
  prisonerSummary: aValidPrisonerSummary(),
  hasEditAuthority: true,
}

describe('_inductionActions', () => {
  it('should render induction actions given induction not due', () => {
    // Given
    const params = {
      ...templateParams,
      inductionSchedule: {
        problemRetrievingData: false,
        inductionStatus: 'INDUCTION_NOT_DUE',
        inductionDueDate: startOfDay('2025-02-15'),
      },
    }

    // When
    const content = nunjucks.render('_inductionActions.njk', { params })
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=induction-actions]').length).toEqual(1)
    expect($('[data-qa=induction-not-due]').text().trim()).toEqual('Induction due by 15 Feb 2025')
    expect($('[data-qa=goals-not-due]').length).toEqual(0)
    expect($('[data-qa=induction-due]').length).toEqual(0)
    expect($('[data-qa=goals-due]').length).toEqual(0)
    expect($('[data-qa=induction-overdue]').length).toEqual(0)
    expect($('[data-qa=goals-overdue]').length).toEqual(0)
    expect($('[data-qa=induction-on-hold]').length).toEqual(0)
    expect($('[data-qa=reason-on-hold]').length).toEqual(0)

    expect($('[data-qa=induction-action-items] li').length).toEqual(2)
    expect($('[data-qa=make-progress-plan-button]').length).toEqual(1)
    expect($('[data-qa=record-exemption-button]').length).toEqual(1)
  })

  it('should render induction actions given goals not due', () => {
    // Given
    const params = {
      ...templateParams,
      inductionSchedule: {
        problemRetrievingData: false,
        inductionStatus: 'GOALS_NOT_DUE',
        inductionDueDate: startOfDay('2025-02-15'),
      },
    }

    // When
    const content = nunjucks.render('_inductionActions.njk', { params })
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=induction-actions]').length).toEqual(1)
    expect($('[data-qa=induction-not-due]').length).toEqual(0)
    expect($('[data-qa=goals-not-due]').text().trim()).toEqual('Add goals by 15 Feb 2025')
    expect($('[data-qa=induction-due]').length).toEqual(0)
    expect($('[data-qa=goals-due]').length).toEqual(0)
    expect($('[data-qa=induction-overdue]').length).toEqual(0)
    expect($('[data-qa=goals-overdue]').length).toEqual(0)
    expect($('[data-qa=induction-on-hold]').length).toEqual(0)
    expect($('[data-qa=reason-on-hold]').length).toEqual(0)

    expect($('[data-qa=induction-action-items] li').length).toEqual(2)
    expect($('[data-qa=add-goals-button]').length).toEqual(1)
    expect($('[data-qa=record-exemption-button]').length).toEqual(1)
  })

  it('should render induction actions given induction due', () => {
    // Given
    const params = {
      ...templateParams,
      inductionSchedule: {
        problemRetrievingData: false,
        inductionStatus: 'INDUCTION_DUE',
        inductionDueDate: startOfDay('2025-02-15'),
      },
    }

    // When
    const content = nunjucks.render('_inductionActions.njk', { params })
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=induction-actions]').length).toEqual(1)
    expect($('[data-qa=induction-not-due]').length).toEqual(0)
    expect($('[data-qa=goals-not-due]').length).toEqual(0)
    expect($('[data-qa=induction-due]').text().trim()).toEqual('Induction due by 15 Feb 2025')
    expect($('[data-qa=goals-due]').length).toEqual(0)
    expect($('[data-qa=induction-overdue]').length).toEqual(0)
    expect($('[data-qa=goals-overdue]').length).toEqual(0)
    expect($('[data-qa=induction-on-hold]').length).toEqual(0)
    expect($('[data-qa=reason-on-hold]').length).toEqual(0)

    expect($('[data-qa=induction-action-items] li').length).toEqual(2)
    expect($('[data-qa=make-progress-plan-button]').length).toEqual(1)
    expect($('[data-qa=record-exemption-button]').length).toEqual(1)
  })

  it('should render induction actions given goals due', () => {
    // Given
    const params = {
      ...templateParams,
      inductionSchedule: {
        problemRetrievingData: false,
        inductionStatus: 'GOALS_DUE',
        inductionDueDate: startOfDay('2025-02-15'),
      },
    }

    // When
    const content = nunjucks.render('_inductionActions.njk', { params })
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=induction-actions]').length).toEqual(1)
    expect($('[data-qa=induction-not-due]').length).toEqual(0)
    expect($('[data-qa=goals-not-due]').length).toEqual(0)
    expect($('[data-qa=induction-due]').length).toEqual(0)
    expect($('[data-qa=goals-due]').text().trim()).toEqual('Add goals by 15 Feb 2025')
    expect($('[data-qa=induction-overdue]').length).toEqual(0)
    expect($('[data-qa=goals-overdue]').length).toEqual(0)
    expect($('[data-qa=induction-on-hold]').length).toEqual(0)
    expect($('[data-qa=reason-on-hold]').length).toEqual(0)

    expect($('[data-qa=induction-action-items] li').length).toEqual(2)
    expect($('[data-qa=add-goals-button]').length).toEqual(1)
    expect($('[data-qa=record-exemption-button]').length).toEqual(1)
  })

  it('should render induction actions given induction overdue', () => {
    // Given
    const params = {
      ...templateParams,
      inductionSchedule: {
        problemRetrievingData: false,
        inductionStatus: 'INDUCTION_OVERDUE',
        inductionDueDate: startOfDay('2025-02-15'),
      },
    }

    // When
    const content = nunjucks.render('_inductionActions.njk', { params })
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=induction-actions]').length).toEqual(1)
    expect($('[data-qa=induction-not-due]').length).toEqual(0)
    expect($('[data-qa=goals-not-due]').length).toEqual(0)
    expect($('[data-qa=induction-due]').length).toEqual(0)
    expect($('[data-qa=goals-due]').length).toEqual(0)
    expect($('[data-qa=induction-overdue]').text().trim()).toEqual('Induction due by 15 Feb 2025')
    expect($('[data-qa=goals-overdue]').length).toEqual(0)
    expect($('[data-qa=induction-on-hold]').length).toEqual(0)
    expect($('[data-qa=reason-on-hold]').length).toEqual(0)

    expect($('[data-qa=induction-action-items] li').length).toEqual(2)
    expect($('[data-qa=make-progress-plan-button]').length).toEqual(1)
    expect($('[data-qa=record-exemption-button]').length).toEqual(1)
  })

  it('should render induction actions given goals overdue', () => {
    // Given
    const params = {
      ...templateParams,
      inductionSchedule: {
        problemRetrievingData: false,
        inductionStatus: 'GOALS_OVERDUE',
        inductionDueDate: startOfDay('2025-02-15'),
      },
    }

    // When
    const content = nunjucks.render('_inductionActions.njk', { params })
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=induction-actions]').length).toEqual(1)
    expect($('[data-qa=induction-not-due]').length).toEqual(0)
    expect($('[data-qa=goals-not-due]').length).toEqual(0)
    expect($('[data-qa=induction-due]').length).toEqual(0)
    expect($('[data-qa=goals-due]').length).toEqual(0)
    expect($('[data-qa=induction-overdue]').length).toEqual(0)
    expect($('[data-qa=goals-overdue]').text().trim()).toEqual('Add goals by 15 Feb 2025')
    expect($('[data-qa=induction-on-hold]').length).toEqual(0)
    expect($('[data-qa=reason-on-hold]').length).toEqual(0)

    expect($('[data-qa=induction-action-items] li').length).toEqual(2)
    expect($('[data-qa=add-goals-button]').length).toEqual(1)
    expect($('[data-qa=record-exemption-button]').length).toEqual(1)
  })

  it('should render induction actions given induction has been exempted', () => {
    // Given
    const params = {
      ...templateParams,
      inductionSchedule: {
        problemRetrievingData: false,
        inductionStatus: 'ON_HOLD',
        inductionDueDate: startOfDay('2025-02-15'),
        exemptionReason: InductionScheduleStatusValue.EXEMPT_PRISONER_OTHER_HEALTH_ISSUES,
      },
    }

    // When
    const content = nunjucks.render('_inductionActions.njk', { params })
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=induction-actions]').length).toEqual(1)
    expect($('[data-qa=induction-not-due]').length).toEqual(0)
    expect($('[data-qa=goals-not-due]').length).toEqual(0)
    expect($('[data-qa=induction-due]').length).toEqual(0)
    expect($('[data-qa=goals-due]').length).toEqual(0)
    expect($('[data-qa=induction-overdue]').length).toEqual(0)
    expect($('[data-qa=goals-overdue]').length).toEqual(0)
    expect($('[data-qa=induction-on-hold]').text().trim()).toEqual('Induction on hold')
    expect($('[data-qa=reason-on-hold]').text().trim()).toEqual(
      `Reason: Has a health concern and is in assessment or treatment`,
    )

    expect($('[data-qa=induction-action-items] li').length).toEqual(1)
    expect($('[data-qa=remove-exemption-button]').length).toEqual(1)
  })

  it('should render empty induction actions given prisoner has no scheduled induction', () => {
    // Given
    const params = {
      ...templateParams,
      inductionSchedule: {
        problemRetrievingData: false,
        inductionStatus: 'NO_SCHEDULED_INDUCTION',
      },
    }

    // When
    const content = nunjucks.render('_inductionActions.njk', { params })
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=induction-actions]').length).toEqual(1)
    expect($('[data-qa=induction-actions] span').length).toEqual(0)
    expect($('[data-qa=induction-action-items] li').length).toEqual(0)
  })

  it('should render empty induction actions given there was a problem retrieving the induction schedule data', () => {
    // Given
    const params = {
      ...templateParams,
      inductionSchedule: {
        problemRetrievingData: true,
      },
    }

    // When
    const content = nunjucks.render('_inductionActions.njk', { params })
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=induction-actions]').length).toEqual(1)
    expect($('[data-qa=induction-actions] span').length).toEqual(0)
    expect($('[data-qa=induction-action-items] li').length).toEqual(0)
  })
})
