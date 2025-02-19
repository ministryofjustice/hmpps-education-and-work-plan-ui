import { parseISO, startOfDay } from 'date-fns'
import type { ActionPlanReviews } from 'viewModels'
import type { UpdateReviewScheduleStatusRequest } from 'educationAndWorkPlanApiClient'
import EducationAndWorkPlanClient from '../data/educationAndWorkPlanClient'
import PrisonService from './prisonService'
import HmppsAuthClient from '../data/hmppsAuthClient'
import ReviewService from './reviewService'
import aValidActionPlanReviewsResponse from '../testsupport/actionPlanReviewsResponseTestDataBuilder'
import ActionPlanReviewCalculationRuleValue from '../enums/actionPlanReviewCalculationRuleValue'
import ActionPlanReviewStatusValue from '../enums/actionPlanReviewStatusValue'
import NoteTypeValue from '../enums/noteTypeValue'
import aValidReviewPlanDto from '../testsupport/reviewPlanDtoTestDataBuilder'
import aValidCreateActionPlanReviewRequest from '../testsupport/createActionPlanReviewRequestTestDataBuilder'
import aValidCreateActionPlanReviewResponse from '../testsupport/createActionPlanReviewResponseTestDataBuilder'
import aValidCreatedActionPlanReview from '../testsupport/createdActionPlanReviewTestDataBuilder'
import aValidReviewExemptionDto from '../testsupport/reviewExemptionDtoTestDataBuilder'
import ReviewScheduleStatusValue from '../enums/reviewScheduleStatusValue'

jest.mock('../data/educationAndWorkPlanClient')
jest.mock('./prisonService')
jest.mock('../data/hmppsAuthClient')

describe('reviewService', () => {
  const educationAndWorkPlanClient =
    new EducationAndWorkPlanClient() as unknown as jest.Mocked<EducationAndWorkPlanClient>
  const prisonService = new PrisonService(null, null, null) as unknown as jest.Mocked<PrisonService>
  const hmppsAuthClient = new HmppsAuthClient(null) as jest.Mocked<HmppsAuthClient>

  const reviewService = new ReviewService(educationAndWorkPlanClient, prisonService, hmppsAuthClient)

  const systemToken = 'a-system-token'
  const username = 'a-dps-user'
  const prisonNumber = 'A1234BC'
  const prisonNamesById = new Map([
    ['BXI', 'Brixton (HMP)'],
    ['MDI', 'Moorland (HMP & YOI)'],
  ])

  beforeEach(() => {
    jest.resetAllMocks()
    hmppsAuthClient.getSystemClientToken.mockResolvedValue(systemToken)
    prisonService.getAllPrisonNamesById.mockResolvedValue(prisonNamesById)
  })

  describe('getActionPlanReviews', () => {
    it('should get Action Plan Reviews', async () => {
      // Given
      const actionPlanReviewsResponse = aValidActionPlanReviewsResponse()
      educationAndWorkPlanClient.getActionPlanReviews.mockResolvedValue(actionPlanReviewsResponse)

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

      // When
      const actual = await reviewService.getActionPlanReviews(prisonNumber, username)

      // Then
      expect(actual).toEqual(expectedActionPlanReviews)
      expect(hmppsAuthClient.getSystemClientToken).toHaveBeenCalledWith(username)
      expect(prisonService.getAllPrisonNamesById).toHaveBeenCalledWith(username)
      expect(educationAndWorkPlanClient.getActionPlanReviews).toHaveBeenCalledWith(prisonNumber, systemToken)
    })

    it('should get Action Plan Reviews anyway given prisonService returns an error getting prison names', async () => {
      // Given
      const actionPlanReviewsResponse = aValidActionPlanReviewsResponse()
      educationAndWorkPlanClient.getActionPlanReviews.mockResolvedValue(actionPlanReviewsResponse)
      prisonService.getAllPrisonNamesById.mockRejectedValue(Error('Service Unavailable'))

      const expectedActionPlanReviews: ActionPlanReviews = {
        completedReviews: [
          {
            reference: '814ade0a-a3b2-46a3-862f-79211ba13f7b',
            completedDate: startOfDay('2024-10-01'),
            conductedBy: undefined,
            conductedByRole: undefined,
            createdAt: parseISO('2023-06-19T09:39:44.000Z'),
            createdAtPrison: 'MDI',
            createdBy: 'asmith_gen',
            createdByDisplayName: 'Alex Smith',
            deadlineDate: startOfDay('2024-10-15'),
            note: {
              reference: '8092b80e-4d60-418f-983a-da457ff8df40',
              type: NoteTypeValue.REVIEW,
              content: 'Review went well and goals on target for completion',
              createdAt: parseISO('2023-01-16T09:34:12.453Z'),
              createdAtPrisonName: 'BXI',
              createdBy: 'asmith_gen',
              createdByDisplayName: 'Alex Smith',
              updatedAt: parseISO('2023-09-23T13:42:01.401Z'),
              updatedAtPrisonName: 'BXI',
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
          createdAtPrison: 'MDI',
          createdBy: 'asmith_gen',
          createdByDisplayName: 'Alex Smith',
          updatedAt: parseISO('2023-06-19T09:39:44.000Z'),
          updatedAtPrison: 'MDI',
          updatedBy: 'asmith_gen',
          updatedByDisplayName: 'Alex Smith',
        },
        problemRetrievingData: false,
      }

      // When
      const actual = await reviewService.getActionPlanReviews(prisonNumber, username)

      // Then
      expect(actual).toEqual(expectedActionPlanReviews)
      expect(hmppsAuthClient.getSystemClientToken).toHaveBeenCalledWith(username)
      expect(prisonService.getAllPrisonNamesById).toHaveBeenCalledWith(username)
      expect(educationAndWorkPlanClient.getActionPlanReviews).toHaveBeenCalledWith(prisonNumber, systemToken)
    })

    it('should get Action Plan Reviews given educationAndWorkPlanClient returns null indicating not found error for the Action Plan Reviews', async () => {
      // Given
      educationAndWorkPlanClient.getActionPlanReviews.mockResolvedValue(null)

      const expectedActionPlanReviews: ActionPlanReviews = {
        completedReviews: [],
        latestReviewSchedule: undefined,
        problemRetrievingData: false,
      }

      // When
      const actual = await reviewService.getActionPlanReviews(prisonNumber, username)

      // Then
      expect(actual).toEqual(expectedActionPlanReviews)
      expect(hmppsAuthClient.getSystemClientToken).toHaveBeenCalledWith(username)
      expect(educationAndWorkPlanClient.getActionPlanReviews).toHaveBeenCalledWith(prisonNumber, systemToken)
    })

    it('should not get Action Plan Reviews given educationAndWorkPlanClient returns an error', async () => {
      // Given
      educationAndWorkPlanClient.getActionPlanReviews.mockRejectedValue(Error('Service Unavailable'))

      const expectedActionPlanReviews: ActionPlanReviews = {
        completedReviews: undefined,
        latestReviewSchedule: undefined,
        problemRetrievingData: true,
      }

      // When
      const actual = await reviewService.getActionPlanReviews(prisonNumber, username)

      // Then
      expect(actual).toEqual(expectedActionPlanReviews)
      expect(hmppsAuthClient.getSystemClientToken).toHaveBeenCalledWith(username)
      expect(educationAndWorkPlanClient.getActionPlanReviews).toHaveBeenCalledWith(prisonNumber, systemToken)
    })
  })

  describe('createActionPlanReview', () => {
    it('should create Action Plan Review', async () => {
      // Given
      const reviewPlanDto = aValidReviewPlanDto()

      const expectedCreateActionPlanReviewRequest = aValidCreateActionPlanReviewRequest({
        conductedBy: undefined,
        conductedByRole: undefined,
        note: 'Chris is making good progress on his goals',
      })
      const createActionPlanReviewResponse = aValidCreateActionPlanReviewResponse()
      educationAndWorkPlanClient.createActionPlanReview.mockResolvedValue(createActionPlanReviewResponse)

      const expectedCreatedActionPlan = aValidCreatedActionPlanReview()

      // When
      const actual = await reviewService.createActionPlanReview(reviewPlanDto, username)

      // Then
      expect(actual).toEqual(expectedCreatedActionPlan)
      expect(educationAndWorkPlanClient.createActionPlanReview).toHaveBeenCalledWith(
        prisonNumber,
        expectedCreateActionPlanReviewRequest,
        systemToken,
      )
    })

    it('should not create Action Plan Review given Education and Work Plan API returns an error', async () => {
      // Given
      const reviewPlanDto = aValidReviewPlanDto()

      const expectedCreateActionPlanReviewRequest = aValidCreateActionPlanReviewRequest({
        conductedBy: undefined,
        conductedByRole: undefined,
        note: 'Chris is making good progress on his goals',
      })

      const eductionAndWorkPlanApiError = {
        status: 500,
        data: {
          status: 500,
          userMessage: `Error creating Action Plan Review for prisoner [${prisonNumber}]`,
          developerMessage: `Error creating Action Plan Review for prisoner [${prisonNumber}]`,
        },
      }
      educationAndWorkPlanClient.createActionPlanReview.mockRejectedValue(eductionAndWorkPlanApiError)

      // When
      const actual = await reviewService.createActionPlanReview(reviewPlanDto, username).catch(error => {
        return error
      })

      // Then
      expect(actual).toEqual(eductionAndWorkPlanApiError)
      expect(educationAndWorkPlanClient.createActionPlanReview).toHaveBeenCalledWith(
        prisonNumber,
        expectedCreateActionPlanReviewRequest,
        systemToken,
      )
    })
  })

  describe('updateActionPlanReviewScheduleStatus', () => {
    it('should update Action Plan Review Schedule status', async () => {
      // Given
      const reviewExemptionDto = aValidReviewExemptionDto({
        prisonId: 'WDI',
        exemptionReason: ReviewScheduleStatusValue.EXEMPT_PRISON_OPERATION_OR_SECURITY_ISSUE,
        exemptionReasonDetails: undefined,
      })

      const expectedUpdateReviewScheduleStatusRequest: UpdateReviewScheduleStatusRequest = {
        prisonId: 'WDI',
        status: 'EXEMPT_PRISON_OPERATION_OR_SECURITY_ISSUE',
        exemptionReason: undefined,
      }
      educationAndWorkPlanClient.updateActionPlanReviewScheduleStatus.mockResolvedValue(undefined)

      // When
      const actual = await reviewService.updateActionPlanReviewScheduleStatus(reviewExemptionDto, username)

      // Then
      expect(actual).toBeUndefined()
      expect(educationAndWorkPlanClient.updateActionPlanReviewScheduleStatus).toHaveBeenCalledWith(
        prisonNumber,
        expectedUpdateReviewScheduleStatusRequest,
        systemToken,
      )
    })

    it('should not update Action Plan Review Schedule status given Education and Work Plan API returns an error', async () => {
      // Given
      const reviewExemptionDto = aValidReviewExemptionDto({
        prisonId: 'WDI',
        exemptionReason: ReviewScheduleStatusValue.EXEMPT_PRISON_OPERATION_OR_SECURITY_ISSUE,
        exemptionReasonDetails: undefined,
      })

      const expectedUpdateReviewScheduleStatusRequest: UpdateReviewScheduleStatusRequest = {
        prisonId: 'WDI',
        status: 'EXEMPT_PRISON_OPERATION_OR_SECURITY_ISSUE',
        exemptionReason: undefined,
      }

      const eductionAndWorkPlanApiError = {
        status: 500,
        data: {
          status: 500,
          userMessage: `Error updating Action Plan Review Schedule Status for prisoner [${prisonNumber}]`,
          developerMessage: `Error updating Action Plan Review Schedule Status for prisoner [${prisonNumber}]`,
        },
      }
      educationAndWorkPlanClient.updateActionPlanReviewScheduleStatus.mockRejectedValue(eductionAndWorkPlanApiError)

      // When
      const actual = await reviewService
        .updateActionPlanReviewScheduleStatus(reviewExemptionDto, username)
        .catch(error => {
          return error
        })

      // Then
      expect(actual).toEqual(eductionAndWorkPlanApiError)
      expect(educationAndWorkPlanClient.updateActionPlanReviewScheduleStatus).toHaveBeenCalledWith(
        prisonNumber,
        expectedUpdateReviewScheduleStatusRequest,
        systemToken,
      )
    })
  })
})
