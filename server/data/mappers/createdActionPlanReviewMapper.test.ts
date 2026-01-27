import { parseISO, startOfDay } from 'date-fns'
import type { CreatedActionPlanReview } from 'viewModels'
import toCreatedActionPlan from './createdActionPlanReviewMapper'
import aValidCreateActionPlanReviewResponse from '../../testsupport/createActionPlanReviewResponseTestDataBuilder'
import aValidScheduledActionPlanReviewResponse from '../../testsupport/scheduledActionPlanReviewResponseTestDataBuilder'
import ActionPlanReviewCalculationRuleValue from '../../enums/actionPlanReviewCalculationRuleValue'
import ActionPlanReviewStatusValue from '../../enums/actionPlanReviewStatusValue'
import SessionTypeValue from '../../enums/sessionTypeValue'

describe('createdActionPlanReviewMapper', () => {
  const examplePrisonNamesById = {
    BXI: 'Brixton (HMP)',
    MDI: 'Moorland (HMP & YOI)',
  }

  it('should map a CreateActionPlanReviewResponse to a CreatedActionPlan view model object', () => {
    // Given
    const createActionPlanReviewResponse = aValidCreateActionPlanReviewResponse({
      wasLastReviewBeforeRelease: true,
      latestReviewSchedule: aValidScheduledActionPlanReviewResponse(),
    })

    const expected: CreatedActionPlanReview = {
      wasLastReviewBeforeRelease: true,
      latestReviewSchedule: {
        reference: '814ade0a-a3b2-46a3-862f-79211ba13f7b',
        reviewDateFrom: startOfDay(parseISO('2024-09-15')),
        reviewDateTo: startOfDay(parseISO('2024-10-15')),
        calculationRule: ActionPlanReviewCalculationRuleValue.BETWEEN_6_AND_12_MONTHS_TO_SERVE,
        status: ActionPlanReviewStatusValue.SCHEDULED,
        reviewType: SessionTypeValue.REVIEW,
        createdAt: parseISO('2023-06-19T09:39:44.000Z'),
        createdAtPrison: 'Moorland (HMP & YOI)',
        createdBy: 'asmith_gen',
        createdByDisplayName: 'Alex Smith',
        updatedAt: parseISO('2023-06-19T09:39:44.000Z'),
        updatedAtPrison: 'Moorland (HMP & YOI)',
        updatedBy: 'asmith_gen',
        updatedByDisplayName: 'Alex Smith',
      },
    }

    // When
    const actual = toCreatedActionPlan(createActionPlanReviewResponse, examplePrisonNamesById)

    // Then
    expect(actual).toEqual(expected)
  })
})
