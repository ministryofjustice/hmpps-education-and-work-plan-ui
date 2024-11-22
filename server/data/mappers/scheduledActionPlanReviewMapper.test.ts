import type { ScheduledActionPlanReview } from 'viewModels'
import { parseISO, startOfDay } from 'date-fns'
import aValidScheduledActionPlanReviewResponse from '../../testsupport/scheduledActionPlanReviewResponseTestDataBuilder'
import toScheduledActionPlanReview from './scheduledActionPlanReviewMapper'
import ActionPlanReviewStatusValue from '../../enums/actionPlanReviewStatusValue'
import ActionPlanReviewCalculationRuleValue from '../../enums/actionPlanReviewCalculationRuleValue'

describe('scheduledActionPlanReviewMapper', () => {
  const examplePrisonNamesById = new Map([
    ['BXI', 'Brixton (HMP)'],
    ['MDI', 'Moorland (HMP & YOI)'],
  ])

  it('should map a ScheduledActionPlanReviewResponse to a ScheduledActionPlanReview view model object', () => {
    // Given
    const scheduledActionPlanReviewResponse = aValidScheduledActionPlanReviewResponse()

    const expected: ScheduledActionPlanReview = {
      reference: '814ade0a-a3b2-46a3-862f-79211ba13f7b',
      reviewDateFrom: startOfDay(parseISO('2024-09-15')),
      reviewDateTo: startOfDay(parseISO('2024-10-15')),
      calculationRule: ActionPlanReviewCalculationRuleValue.BETWEEN_6_AND_12_MONTHS_TO_SERVE,
      status: ActionPlanReviewStatusValue.SCHEDULED,
      createdAt: parseISO('2023-06-19T09:39:44.000Z'),
      createdAtPrison: 'Moorland (HMP & YOI)',
      createdBy: 'asmith_gen',
      createdByDisplayName: 'Alex Smith',
      updatedAt: parseISO('2023-06-19T09:39:44.000Z'),
      updatedAtPrison: 'Moorland (HMP & YOI)',
      updatedBy: 'asmith_gen',
      updatedByDisplayName: 'Alex Smith',
    }

    // When
    const actual = toScheduledActionPlanReview(scheduledActionPlanReviewResponse, examplePrisonNamesById)

    // Then
    expect(actual).toEqual(expected)
  })
})
