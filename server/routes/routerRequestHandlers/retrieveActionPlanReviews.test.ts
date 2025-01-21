import { Request, Response } from 'express'
import { parseISO, startOfDay } from 'date-fns'
import type { ActionPlanReviews } from 'viewModels'
import aValidPrisonerSummary from '../../testsupport/prisonerSummaryTestDataBuilder'
import ReviewService from '../../services/reviewService'
import retrieveActionPlanReviews from './retrieveActionPlanReviews'
import NoteTypeValue from '../../enums/noteTypeValue'
import ActionPlanReviewCalculationRuleValue from '../../enums/actionPlanReviewCalculationRuleValue'
import ActionPlanReviewStatusValue from '../../enums/actionPlanReviewStatusValue'

jest.mock('../../services/reviewService')

const reviewJourneyEnabledForPrison = jest.fn()
jest.mock('../../config', () => ({
  featureToggles: {
    reviewJourneyEnabledForPrison: (prisonId: string) => reviewJourneyEnabledForPrison(prisonId),
  },
}))

describe('retrieveActionPlanReviews', () => {
  const reviewService = new ReviewService(null, null, null) as jest.Mocked<ReviewService>
  const requestHandler = retrieveActionPlanReviews(reviewService)

  const prisonNumber = 'A1234GC'
  const username = 'a-dps-user'
  const prisonerSummary = aValidPrisonerSummary(prisonNumber)

  let req: Request
  let res: Response
  const next = jest.fn()

  beforeEach(() => {
    req = {
      session: { prisonerSummary },
      user: { username },
      params: { prisonNumber },
    } as unknown as Request
    res = {
      render: jest.fn(),
      locals: {
        user: { username, activeCaseLoadId: 'BXI' },
      },
    } as unknown as Response
    jest.resetAllMocks()
  })

  it('should retrieve action plan reviews and store on res.locals given prison is enabled for reviews', async () => {
    // Given
    reviewJourneyEnabledForPrison.mockReturnValue(true)

    const expectedActionPlanReviews: ActionPlanReviews = {
      completedReviews: [
        {
          reference: '814ade0a-a3b2-46a3-862f-79211ba13f7b',
          completedDate: startOfDay('2024-10-01'),
          conductedBy: undefined,
          conductedByRole: undefined,
          createdAt: parseISO('2023-06-19T09:39:44.000Z'),
          createdAtPrison: 'Moorland (HMP & YOI)',
          createdBy: 'asmith_gen',
          createdByDisplayName: 'Alex Smith',
          deadlineDate: startOfDay('2024-10-15'),
          note: {
            reference: '8092b80e-4d60-418f-983a-da457ff8df40',
            type: NoteTypeValue.REVIEW,
            content: 'Review went well and goals on target for completion',
            createdAt: parseISO('2023-01-16T09:34:12.453Z'),
            createdAtPrisonName: 'Brixton (HMP)',
            createdBy: 'asmith_gen',
            createdByDisplayName: 'Alex Smith',
            updatedAt: parseISO('2023-09-23T13:42:01.401Z'),
            updatedAtPrisonName: 'Brixton (HMP)',
            updatedBy: 'asmith_gen',
            updatedByDisplayName: 'Alex Smith',
          },
        },
      ],
      latestReviewSchedule: {
        reference: '814ade0a-a3b2-46a3-862f-79211ba13f7b',
        reviewDateFrom: startOfDay('2024-09-15'),
        reviewDateTo: startOfDay('2024-10-15'),
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
    reviewService.getActionPlanReviews.mockResolvedValue(expectedActionPlanReviews)

    // When
    await requestHandler(req, res, next)

    // Then
    expect(res.locals.actionPlanReviews).toEqual(expectedActionPlanReviews)
    expect(reviewService.getActionPlanReviews).toHaveBeenCalledWith(prisonNumber, username)
    expect(next).toHaveBeenCalled()
    expect(reviewJourneyEnabledForPrison).toHaveBeenCalledWith('BXI')
  })

  it('should not retrieve action plan reviews given prison is not enabled for reviews', async () => {
    // Given
    reviewJourneyEnabledForPrison.mockReturnValue(false)

    // When
    await requestHandler(req, res, next)

    // Then
    expect(res.locals.actionPlanReviews).toEqual(undefined)
    expect(reviewService.getActionPlanReviews).not.toHaveBeenCalled()
    expect(next).toHaveBeenCalled()
    expect(reviewJourneyEnabledForPrison).toHaveBeenCalledWith('BXI')
  })
})
