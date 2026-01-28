import type { ActionPlanReviews, InductionSchedule } from 'viewModels'
import { addDays, addMonths, startOfToday, subDays, subMonths } from 'date-fns'
import { toActionPlanReviewScheduleView, toInductionScheduleView } from './overviewViewFunctions'
import aValidInductionSchedule from '../../testsupport/inductionScheduleTestDataBuilder'
import { aValidInductionDto } from '../../testsupport/inductionDtoTestDataBuilder'
import InductionScheduleStatusValue from '../../enums/inductionScheduleStatusValue'
import { ActionPlanReviewScheduleView, InductionScheduleView } from './overviewViewTypes'
import aValidActionPlanReviews from '../../testsupport/actionPlanReviewsTestDataBuilder'
import aValidScheduledActionPlanReview from '../../testsupport/scheduledActionPlanReviewTestDataBuilder'
import ActionPlanReviewStatusValue from '../../enums/actionPlanReviewStatusValue'
import SessionTypeValue from '../../enums/sessionTypeValue'

describe('overviewViewFunctions', () => {
  const today = startOfToday()
  const yesterday = subDays(today, 1)
  const tomorrow = addDays(today, 1)
  const twoMonthsAndOneDayAway = addDays(addMonths(today, 2), 1)
  const aMonthAgo = subMonths(today, 1)

  describe('toInductionScheduleView', () => {
    it('should build InductionScheduleView given induction is complete', () => {
      // Given
      const inductionSchedule = aValidInductionSchedule({
        deadlineDate: yesterday,
        scheduleStatus: InductionScheduleStatusValue.COMPLETED,
      })
      const inductionDto = aValidInductionDto()

      const expected: InductionScheduleView = {
        problemRetrievingData: false,
        inductionStatus: 'COMPLETE',
        exemptionReason: undefined,
        inductionDueDate: yesterday,
      }

      // When
      const actual = toInductionScheduleView(inductionSchedule, inductionDto)

      // Then
      expect(actual).toEqual(expected)
    })

    it.each([
      InductionScheduleStatusValue.EXEMPT_PRISONER_DRUG_OR_ALCOHOL_DEPENDENCY,
      InductionScheduleStatusValue.EXEMPT_PRISONER_OTHER_HEALTH_ISSUES,
      InductionScheduleStatusValue.EXEMPT_PRISONER_FAILED_TO_ENGAGE,
      InductionScheduleStatusValue.EXEMPT_PRISONER_ESCAPED_OR_ABSCONDED,
      InductionScheduleStatusValue.EXEMPT_PRISONER_SAFETY_ISSUES,
      InductionScheduleStatusValue.EXEMPT_PRISON_REGIME_CIRCUMSTANCES,
      InductionScheduleStatusValue.EXEMPT_PRISON_STAFF_REDEPLOYMENT,
      InductionScheduleStatusValue.EXEMPT_PRISON_OPERATION_OR_SECURITY_ISSUE,
      InductionScheduleStatusValue.EXEMPT_SECURITY_ISSUE_RISK_TO_STAFF,
      InductionScheduleStatusValue.EXEMPT_SYSTEM_TECHNICAL_ISSUE,
      InductionScheduleStatusValue.EXEMPT_SCREENING_AND_ASSESSMENT_IN_PROGRESS,
      InductionScheduleStatusValue.EXEMPT_SCREENING_AND_ASSESSMENT_INCOMPLETE,
    ])(
      'should build InductionScheduleView given induction schedule has been exempted - %s',
      (scheduleStatus: InductionScheduleStatusValue) => {
        // Given
        const inductionSchedule = aValidInductionSchedule({
          deadlineDate: yesterday,
          scheduleStatus,
        })

        const expected: InductionScheduleView = {
          problemRetrievingData: false,
          inductionStatus: 'ON_HOLD',
          exemptionReason: scheduleStatus,
          inductionDueDate: yesterday,
        }

        // When
        const actual = toInductionScheduleView(inductionSchedule, null)

        // Then
        expect(actual).toEqual(expected)
      },
    )

    it('should build InductionScheduleView given induction schedule is overdue', () => {
      // Given
      const inductionSchedule = aValidInductionSchedule({
        scheduleStatus: InductionScheduleStatusValue.SCHEDULED,
        deadlineDate: yesterday,
      })

      const expected: InductionScheduleView = {
        problemRetrievingData: false,
        inductionStatus: 'INDUCTION_OVERDUE',
        exemptionReason: undefined,
        inductionDueDate: yesterday,
      }

      // When
      const actual = toInductionScheduleView(inductionSchedule, null)

      // Then
      expect(actual).toEqual(expected)
    })

    it('should build InductionScheduleView given induction schedule is overdue, but the induction exists', () => {
      // Given
      const inductionSchedule = aValidInductionSchedule({
        scheduleStatus: InductionScheduleStatusValue.SCHEDULED,
        deadlineDate: yesterday,
      })

      const expected: InductionScheduleView = {
        problemRetrievingData: false,
        inductionStatus: 'GOALS_OVERDUE',
        exemptionReason: undefined,
        inductionDueDate: yesterday,
      }

      // When
      const actual = toInductionScheduleView(inductionSchedule, aValidInductionDto())

      // Then
      expect(actual).toEqual(expected)
    })

    it('should build InductionScheduleView given induction schedule is due', () => {
      // Given
      const inductionSchedule = aValidInductionSchedule({
        scheduleStatus: InductionScheduleStatusValue.SCHEDULED,
        deadlineDate: tomorrow,
      })

      const expected: InductionScheduleView = {
        problemRetrievingData: false,
        inductionStatus: 'INDUCTION_DUE',
        exemptionReason: undefined,
        inductionDueDate: tomorrow,
      }

      // When
      const actual = toInductionScheduleView(inductionSchedule, null)

      // Then
      expect(actual).toEqual(expected)
    })

    it('should build InductionScheduleView given induction schedule is due, but the induction exists', () => {
      // Given
      const inductionSchedule = aValidInductionSchedule({
        scheduleStatus: InductionScheduleStatusValue.SCHEDULED,
        deadlineDate: tomorrow,
      })

      const expected: InductionScheduleView = {
        problemRetrievingData: false,
        inductionStatus: 'GOALS_DUE',
        exemptionReason: undefined,
        inductionDueDate: tomorrow,
      }

      // When
      const actual = toInductionScheduleView(inductionSchedule, aValidInductionDto())

      // Then
      expect(actual).toEqual(expected)
    })

    it('should build InductionScheduleView given induction schedule is not due', () => {
      // Given
      const inductionSchedule = aValidInductionSchedule({
        scheduleStatus: InductionScheduleStatusValue.SCHEDULED,
        deadlineDate: twoMonthsAndOneDayAway,
      })

      const expected: InductionScheduleView = {
        problemRetrievingData: false,
        inductionStatus: 'INDUCTION_NOT_DUE',
        exemptionReason: undefined,
        inductionDueDate: twoMonthsAndOneDayAway,
      }

      // When
      const actual = toInductionScheduleView(inductionSchedule, null)

      // Then
      expect(actual).toEqual(expected)
    })

    it('should build InductionScheduleView given induction schedule is not due, but the induction exists', () => {
      // Given
      const inductionSchedule = aValidInductionSchedule({
        scheduleStatus: InductionScheduleStatusValue.SCHEDULED,
        deadlineDate: twoMonthsAndOneDayAway,
      })

      const expected: InductionScheduleView = {
        problemRetrievingData: false,
        inductionStatus: 'GOALS_NOT_DUE',
        exemptionReason: undefined,
        inductionDueDate: twoMonthsAndOneDayAway,
      }

      // When
      const actual = toInductionScheduleView(inductionSchedule, aValidInductionDto())

      // Then
      expect(actual).toEqual(expected)
    })

    it('should build InductionScheduleView given no screenings & assessments are pending', () => {
      // Given
      const inductionSchedule = {
        problemRetrievingData: false,
        scheduleStatus: InductionScheduleStatusValue.PENDING_INITIAL_SCREENING_AND_ASSESSMENTS_FROM_CURIOUS,
      } as InductionSchedule

      const expected: InductionScheduleView = {
        problemRetrievingData: false,
        inductionStatus: 'NO_SCHEDULED_INDUCTION',
        exemptionReason: undefined,
        inductionDueDate: undefined,
      }

      // When
      const actual = toInductionScheduleView(inductionSchedule, null)

      // Then
      expect(actual).toEqual(expected)
    })

    it('should build InductionScheduleView given no induction is scheduled', () => {
      // Given
      const inductionSchedule = { problemRetrievingData: false } as InductionSchedule

      const expected: InductionScheduleView = {
        problemRetrievingData: false,
        inductionStatus: 'NO_SCHEDULED_INDUCTION',
        exemptionReason: undefined,
        inductionDueDate: undefined,
      }

      // When
      const actual = toInductionScheduleView(inductionSchedule, aValidInductionDto())

      // Then
      expect(actual).toEqual(expected)
    })

    it('should build InductionScheduleView given no induction schedule was retrieved at all', () => {
      // Given
      const inductionSchedule = null as InductionSchedule

      const expected: InductionScheduleView = {
        problemRetrievingData: false,
        inductionStatus: 'NO_SCHEDULED_INDUCTION',
        exemptionReason: undefined,
        inductionDueDate: undefined,
      }

      // When
      const actual = toInductionScheduleView(inductionSchedule, null)

      // Then
      expect(actual).toEqual(expected)
    })

    it('should build InductionScheduleView given there is a problem retrieving the induction schedule', () => {
      // Given
      const inductionSchedule = { problemRetrievingData: true } as InductionSchedule

      const expected: InductionScheduleView = {
        problemRetrievingData: true,
        inductionStatus: undefined,
        exemptionReason: undefined,
        inductionDueDate: undefined,
      }

      // When
      const actual = toInductionScheduleView(inductionSchedule, aValidInductionDto())

      // Then
      expect(actual).toEqual(expected)
    })
  })

  describe('toActionPlanReviewScheduleView', () => {
    it('should build ActionPlanReviewScheduleView given has had last review', () => {
      // Given
      const actionPlanReviews = aValidActionPlanReviews({
        latestReviewSchedule: aValidScheduledActionPlanReview({
          status: ActionPlanReviewStatusValue.COMPLETED,
          reviewDateTo: yesterday,
          reviewType: SessionTypeValue.REVIEW,
        }),
      })

      const expected: ActionPlanReviewScheduleView = {
        problemRetrievingData: false,
        reviewStatus: 'HAS_HAD_LAST_REVIEW',
        exemptionReason: undefined,
        reviewDueDate: yesterday,
        reviewType: SessionTypeValue.REVIEW,
      }

      // When
      const actual = toActionPlanReviewScheduleView(actionPlanReviews)

      // Then
      expect(actual).toEqual(expected)
    })

    it.each([
      ActionPlanReviewStatusValue.EXEMPT_PRISONER_DRUG_OR_ALCOHOL_DEPENDENCY,
      ActionPlanReviewStatusValue.EXEMPT_PRISONER_OTHER_HEALTH_ISSUES,
      ActionPlanReviewStatusValue.EXEMPT_PRISONER_FAILED_TO_ENGAGE,
      ActionPlanReviewStatusValue.EXEMPT_PRISONER_ESCAPED_OR_ABSCONDED,
      ActionPlanReviewStatusValue.EXEMPT_PRISONER_SAFETY_ISSUES,
      ActionPlanReviewStatusValue.EXEMPT_PRISON_REGIME_CIRCUMSTANCES,
      ActionPlanReviewStatusValue.EXEMPT_PRISON_STAFF_REDEPLOYMENT,
      ActionPlanReviewStatusValue.EXEMPT_PRISON_OPERATION_OR_SECURITY_ISSUE,
      ActionPlanReviewStatusValue.EXEMPT_SECURITY_ISSUE_RISK_TO_STAFF,
      ActionPlanReviewStatusValue.EXEMPT_SYSTEM_TECHNICAL_ISSUE,
    ])(
      'should build ActionPlanReviewScheduleView given review schedule has been exempted - %s',
      (scheduleStatus: ActionPlanReviewStatusValue) => {
        // Given
        const actionPlanReviews = aValidActionPlanReviews({
          latestReviewSchedule: aValidScheduledActionPlanReview({
            status: scheduleStatus,
            reviewDateTo: yesterday,
            reviewType: SessionTypeValue.REVIEW,
          }),
        })

        const expected: ActionPlanReviewScheduleView = {
          problemRetrievingData: false,
          reviewStatus: 'ON_HOLD',
          exemptionReason: scheduleStatus,
          reviewDueDate: yesterday,
          reviewType: SessionTypeValue.REVIEW,
        }

        // When
        const actual = toActionPlanReviewScheduleView(actionPlanReviews)

        // Then
        expect(actual).toEqual(expected)
      },
    )

    it('should build ActionPlanReviewScheduleView given review schedule is overdue', () => {
      // Given
      const actionPlanReviews = aValidActionPlanReviews({
        latestReviewSchedule: aValidScheduledActionPlanReview({
          status: ActionPlanReviewStatusValue.SCHEDULED,
          reviewDateFrom: aMonthAgo,
          reviewDateTo: yesterday,
          reviewType: SessionTypeValue.REVIEW,
        }),
      })

      const expected: ActionPlanReviewScheduleView = {
        problemRetrievingData: false,
        reviewStatus: 'OVERDUE',
        exemptionReason: undefined,
        reviewDueDate: yesterday,
        reviewType: SessionTypeValue.REVIEW,
      }

      // When
      const actual = toActionPlanReviewScheduleView(actionPlanReviews)

      // Then
      expect(actual).toEqual(expected)
    })

    it('should build ActionPlanReviewScheduleView given review schedule is due', () => {
      // Given
      const actionPlanReviews = aValidActionPlanReviews({
        latestReviewSchedule: aValidScheduledActionPlanReview({
          status: ActionPlanReviewStatusValue.SCHEDULED,
          reviewDateFrom: aMonthAgo,
          reviewDateTo: tomorrow,
          reviewType: SessionTypeValue.REVIEW,
        }),
      })

      const expected: ActionPlanReviewScheduleView = {
        problemRetrievingData: false,
        reviewStatus: 'DUE',
        exemptionReason: undefined,
        reviewDueDate: tomorrow,
        reviewType: SessionTypeValue.REVIEW,
      }

      // When
      const actual = toActionPlanReviewScheduleView(actionPlanReviews)

      // Then
      expect(actual).toEqual(expected)
    })

    it('should build ActionPlanReviewScheduleView given review schedule is not due', () => {
      // Given
      const actionPlanReviews = aValidActionPlanReviews({
        latestReviewSchedule: aValidScheduledActionPlanReview({
          status: ActionPlanReviewStatusValue.SCHEDULED,
          reviewDateFrom: tomorrow,
          reviewDateTo: twoMonthsAndOneDayAway,
          reviewType: SessionTypeValue.REVIEW,
        }),
      })

      const expected: ActionPlanReviewScheduleView = {
        problemRetrievingData: false,
        reviewStatus: 'NOT_DUE',
        exemptionReason: undefined,
        reviewDueDate: twoMonthsAndOneDayAway,
        reviewType: SessionTypeValue.REVIEW,
      }

      // When
      const actual = toActionPlanReviewScheduleView(actionPlanReviews)

      // Then
      expect(actual).toEqual(expected)
    })

    it('should build ActionPlanReviewScheduleView given there is no latest review schedule', () => {
      // Given
      const actionPlanReviews = { problemRetrievingData: false } as ActionPlanReviews

      const expected: ActionPlanReviewScheduleView = {
        problemRetrievingData: false,
        reviewStatus: 'NO_SCHEDULED_REVIEW',
        exemptionReason: undefined,
        reviewDueDate: undefined,
        reviewType: undefined,
      }

      // When
      const actual = toActionPlanReviewScheduleView(actionPlanReviews)

      // Then
      expect(actual).toEqual(expected)
    })

    it('should build ActionPlanReviewScheduleView given no action plan reviews was retrieved at all', () => {
      // Given
      const actionPlanReviews = null as ActionPlanReviews

      const expected: ActionPlanReviewScheduleView = {
        problemRetrievingData: false,
        reviewStatus: 'NO_SCHEDULED_REVIEW',
        exemptionReason: undefined,
        reviewDueDate: undefined,
        reviewType: undefined,
      }

      // When
      const actual = toActionPlanReviewScheduleView(actionPlanReviews)

      // Then
      expect(actual).toEqual(expected)
    })

    it('should build ActionPlanReviewScheduleView given there is a problem the review schedule', () => {
      // Given
      const actionPlanReviews = { problemRetrievingData: true } as ActionPlanReviews

      const expected: ActionPlanReviewScheduleView = {
        problemRetrievingData: true,
        reviewStatus: undefined,
        exemptionReason: undefined,
        reviewDueDate: undefined,
        reviewType: undefined,
      }

      // When
      const actual = toActionPlanReviewScheduleView(actionPlanReviews)

      // Then
      expect(actual).toEqual(expected)
    })
  })
})
