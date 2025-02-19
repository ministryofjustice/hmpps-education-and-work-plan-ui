import nunjucks from 'nunjucks'
import * as cheerio from 'cheerio'
import { startOfDay } from 'date-fns'
import type { ActionsCardParams } from 'viewComponents'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'

nunjucks.configure([
  'node_modules/govuk-frontend/dist/',
  'node_modules/@ministryofjustice/frontend/',
  'server/views/',
  __dirname,
])

const userHasPermissionTo = jest.fn()
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
  reviewsFeatureEnabled: true,
  prisonerSummary: aValidPrisonerSummary(),
  userHasPermissionTo,
}

describe('_goalActions', () => {
  beforeEach(() => {
    jest.resetAllMocks()
    userHasPermissionTo.mockReturnValue(true)
  })

  it('should render heading and add goal link', () => {
    // Given
    const params = { ...templateParams }

    // When
    const content = nunjucks.render('_goalActions.njk', { params })
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=goal-actions]').length).toEqual(1)
    expect($('[data-qa=goal-actions] h3').length).toEqual(1)
    expect($('[data-qa=goals-action-items] li').length).toEqual(1)
    expect($('[data-qa=add-goal-button]').attr('href')).toEqual('/plan/A1234BC/goals/create')
    expect(userHasPermissionTo).toHaveBeenCalledWith('CREATE_GOALS')
  })

  it('should not render heading given feature toggle not enabled', () => {
    // Given
    const params = {
      ...templateParams,
      reviewsFeatureEnabled: false,
    }

    // When
    const content = nunjucks.render('_goalActions.njk', { params })
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=goal-actions]').length).toEqual(1)
    expect($('[data-qa=goal-actions] h3').length).toEqual(0)
  })

  it('should not render add goal link given does not have permission to create goals', () => {
    // Given
    userHasPermissionTo.mockReturnValue(false)
    const params = {
      ...templateParams,
    }

    // When
    const content = nunjucks.render('_goalActions.njk', { params })
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=goal-actions]').length).toEqual(1)
    expect($('[data-qa=goals-action-items] li').length).toEqual(0)
    expect(userHasPermissionTo).toHaveBeenCalledWith('CREATE_GOALS')
  })

  describe('do not render add goal link because it would be displayed in the Induction Actions panel in all these scenarios', () => {
    it('should not render add goal link given induction schedule goals are due', () => {
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
      const content = nunjucks.render('_goalActions.njk', { params })
      const $ = cheerio.load(content)

      // Then
      expect($('[data-qa=goal-actions]').length).toEqual(1)
      expect($('[data-qa=goals-action-items] li').length).toEqual(0)
      expect(userHasPermissionTo).not.toHaveBeenCalled()
    })

    it('should not render add goal link given induction schedule is on hold', () => {
      // Given
      const params = {
        ...templateParams,
        inductionSchedule: {
          problemRetrievingData: false,
          inductionStatus: 'ON_HOLD',
          inductionDueDate: startOfDay('2025-02-15'),
        },
      }

      // When
      const content = nunjucks.render('_goalActions.njk', { params })
      const $ = cheerio.load(content)

      // Then
      expect($('[data-qa=goal-actions]').length).toEqual(1)
      expect($('[data-qa=goals-action-items] li').length).toEqual(0)
      expect(userHasPermissionTo).not.toHaveBeenCalled()
    })

    it('should not render add goal link given induction schedule goals are not due', () => {
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
      const content = nunjucks.render('_goalActions.njk', { params })
      const $ = cheerio.load(content)

      // Then
      expect($('[data-qa=goal-actions]').length).toEqual(1)
      expect($('[data-qa=goals-action-items] li').length).toEqual(0)
      expect(userHasPermissionTo).not.toHaveBeenCalled()
    })

    it('should not render add goal link given induction schedule goals are overdue', () => {
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
      const content = nunjucks.render('_goalActions.njk', { params })
      const $ = cheerio.load(content)

      // Then
      expect($('[data-qa=goal-actions]').length).toEqual(1)
      expect($('[data-qa=goals-action-items] li').length).toEqual(0)
      expect(userHasPermissionTo).not.toHaveBeenCalled()
    })
  })

  it('should not render add goal link given problem retrieving induction schedule data', () => {
    // Given
    const params = {
      ...templateParams,
      inductionSchedule: {
        problemRetrievingData: true,
      },
    }

    // When
    const content = nunjucks.render('_goalActions.njk', { params })
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=goal-actions]').length).toEqual(1)
    expect($('[data-qa=goals-action-items] li').length).toEqual(0)
    expect(userHasPermissionTo).not.toHaveBeenCalled()
  })
})
