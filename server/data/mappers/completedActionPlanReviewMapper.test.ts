import type { CompletedActionPlanReview } from 'viewModels'
import { parseISO } from 'date-fns'
import toCompletedActionPlanReview from './completedActionPlanReviewMapper'
import aValidCompletedActionPlanReviewResponse from '../../testsupport/completedActionPlanReviewResponseTestDataBuilder'

describe('completedActionPlanReviewMapper', () => {
  const examplePrisonNamesById = new Map([
    ['BXI', 'Brixton (HMP)'],
    ['MDI', 'Moorland (HMP & YOI)'],
  ])

  it('should map a CompletedActionPlanReviewResponse to a CompletedActionPlanReview view model object', () => {
    // Given
    const completedActionPlanReviewResponse = aValidCompletedActionPlanReviewResponse({
      conductedBy: 'Bobby Button',
      conductedByRole: 'Peer mentor',
      createdAtPrison: 'BXI',
    })

    const expected: CompletedActionPlanReview = {
      reference: '814ade0a-a3b2-46a3-862f-79211ba13f7b',
      deadlineDate: parseISO('2024-10-15'),
      completedDate: parseISO('2024-10-01'),
      conductedBy: 'Bobby Button',
      conductedByRole: 'Peer mentor',
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
      createdAtPrison: 'Brixton (HMP)',
      createdBy: 'asmith_gen',
      createdByDisplayName: 'Alex Smith',
    }

    // When
    const actual = toCompletedActionPlanReview(completedActionPlanReviewResponse, examplePrisonNamesById)

    // Then
    expect(actual).toEqual(expected)
  })
})
