import { parseISO, startOfDay } from 'date-fns'
import type { ActionPlanReviews } from 'viewModels'
import toActionPlanReviews from './actionPlanReviewsMapper'
import aValidActionPlanReviewsResponse from '../../testsupport/actionPlanReviewsResponseTestDataBuilder'
import ActionPlanReviewCalculationRuleValue from '../../enums/actionPlanReviewCalculationRuleValue'
import ActionPlanReviewStatusValue from '../../enums/actionPlanReviewStatusValue'

describe('actionPlanReviewsMapper', () => {
  const examplePrisonNamesById = new Map([
    ['BXI', 'Brixton (HMP)'],
    ['MDI', 'Moorland (HMP & YOI)'],
  ])

  it('should map an ActionPlanReviewsResponse to an ActionPlanReviews view model object', () => {
    // Given
    const actionPlanReviewsResponse = aValidActionPlanReviewsResponse()

    const expected: ActionPlanReviews = {
      completedReviews: [
        {
          reference: '814ade0a-a3b2-46a3-862f-79211ba13f7b',
          deadlineDate: parseISO('2024-10-15'),
          completedDate: parseISO('2024-10-01'),
          conductedBy: undefined,
          conductedByRole: undefined,
          note: {
            reference: '8092b80e-4d60-418f-983a-da457ff8df40',
            content: 'Review went well and goals on target for completion',
            type: 'REVIEW',
            createdAt: parseISO('2023-01-16T09:34:12.453Z'),
            createdBy: 'asmith_gen',
            createdByDisplayName: 'Alex Smith',
            createdAtPrisonName: 'Brixton (HMP)',
            updatedAt: parseISO('2023-09-23T13:42:01.401Z'),
            updatedBy: 'asmith_gen',
            updatedByDisplayName: 'Alex Smith',
            updatedAtPrisonName: 'Brixton (HMP)',
          },
          createdAt: parseISO('2023-06-19T09:39:44.000Z'),
          createdAtPrison: 'Moorland (HMP & YOI)',
          createdBy: 'asmith_gen',
          createdByDisplayName: 'Alex Smith',
        },
      ],
      latestReviewSchedule: {
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
      },
      problemRetrievingData: false,
    }

    // When
    const actual = toActionPlanReviews(actionPlanReviewsResponse, examplePrisonNamesById)

    // Then
    expect(actual).toEqual(expected)
  })
})
