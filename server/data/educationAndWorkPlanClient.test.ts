import { AuthenticationClient } from '@ministryofjustice/hmpps-auth-clients'
import nock from 'nock'
import { isEqual, isMatch } from 'lodash'
import type { ArchiveGoalRequest, UnarchiveGoalRequest } from 'educationAndWorkPlanApiClient'
import { startOfDay } from 'date-fns'
import config from '../config'
import EducationAndWorkPlanClient from './educationAndWorkPlanClient'
import {
  aValidActionPlanResponseWithOneGoal,
  aValidGoalResponse,
} from '../testsupport/actionPlanResponseTestDataBuilder'
import { aValidUpdateGoalRequestWithOneUpdatedStep } from '../testsupport/updateGoalRequestTestDataBuilder'
import {
  aValidCreateGoalsRequestWithOneGoal,
  aValidCreateGoalsRequestWitMultipleGoals,
} from '../testsupport/createGoalsRequestTestDataBuilder'
import aValidActionPlanSummaryListResponse from '../testsupport/actionPlanSummaryListResponseTestDataBuilder'
import aValidActionPlanSummaryResponse from '../testsupport/actionPlanSummaryResponseTestDataBuilder'
import aValidTimelineResponse from '../testsupport/timelineResponseTestDataBuilder'
import aValidInductionResponse from '../testsupport/inductionResponseTestDataBuilder'
import aValidUpdateInductionRequest from '../testsupport/updateInductionRequestTestDataBuilder'
import aValidCreateInductionRequest from '../testsupport/createInductionRequestTestDataBuilder'
import ReasonToArchiveGoalValue from '../enums/ReasonToArchiveGoalValue'
import GoalStatusValue from '../enums/goalStatusValue'
import aValidEducationResponse from '../testsupport/educationResponseTestDataBuilder'
import aValidCreateEducationRequest from '../testsupport/createEducationRequestTestDataBuilder'
import aValidUpdateEducationRequest from '../testsupport/updateEducationRequestTestDataBuilder'
import aValidInductionScheduleResponse from '../testsupport/inductionScheduleResponseTestDataBuilder'
import aValidActionPlanReviewsResponse from '../testsupport/actionPlanReviewsResponseTestDataBuilder'
import aValidCreateActionPlanReviewRequest from '../testsupport/createActionPlanReviewRequestTestDataBuilder'
import aValidCreateActionPlanReviewResponse from '../testsupport/createActionPlanReviewResponseTestDataBuilder'
import aValidCreateActionPlanRequest from '../testsupport/createActionPlanRequestTestDataBuilder'
import aValidUpdateReviewScheduleStatusRequest from '../testsupport/updateReviewScheduleStatusRequestTestDataBuilder'
import aValidUpdateInductionScheduleStatusRequest from '../testsupport/updateInductionScheduleStatusRequestTestDataBuilder'
import aValidSessionSummaryResponse from '../testsupport/sessionSummaryResponseTestDataBuilder'
import { aValidSessionResponse, aValidSessionResponses } from '../testsupport/sessionResponseTestDataBuilder'
import SessionStatusValue from '../enums/sessionStatusValue'
import TimelineApiFilterOptions from './timelineApiFilterOptions'

jest.mock('@ministryofjustice/hmpps-auth-clients')

describe('educationAndWorkPlanClient', () => {
  const mockAuthenticationClient = new AuthenticationClient(null, null, null) as jest.Mocked<AuthenticationClient>
  const educationAndWorkPlanClient = new EducationAndWorkPlanClient(mockAuthenticationClient)

  const educationAndWorkPlanApi = nock(config.apis.educationAndWorkPlan.url)

  const prisonId = 'BXI'
  const prisonNumber = 'A1234BC'
  const username = 'A-DPS-USER'
  const systemToken = 'a-system-token'

  beforeEach(() => {
    jest.resetAllMocks()
    mockAuthenticationClient.getToken.mockResolvedValue(systemToken)
  })

  afterEach(() => {
    nock.cleanAll()
  })

  describe('createGoals', () => {
    it('should create Goals', async () => {
      // Given
      const createGoalsRequest = aValidCreateGoalsRequestWitMultipleGoals()
      const expectedResponseBody = {}
      educationAndWorkPlanApi
        .post(`/action-plans/${prisonNumber}/goals`, requestBody => isEqual(requestBody, createGoalsRequest))
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .reply(201, expectedResponseBody)

      // When
      const actual = await educationAndWorkPlanClient.createGoals(prisonNumber, createGoalsRequest, username)

      // Then
      expect(nock.isDone()).toBe(true)
      expect(actual).toEqual(expectedResponseBody)
      expect(mockAuthenticationClient.getToken).toHaveBeenCalledWith(username)
    })

    it('should not create Goals given API returns an error response', async () => {
      // Given
      const createGoalsRequest = aValidCreateGoalsRequestWithOneGoal()
      const expectedResponseBody = {
        status: 500,
        userMessage: 'An unexpected error occurred',
        developerMessage: 'An unexpected error occurred',
      }
      educationAndWorkPlanApi
        .post(`/action-plans/${prisonNumber}/goals`, requestBody => isEqual(requestBody, createGoalsRequest))
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .reply(500, expectedResponseBody)

      // When
      try {
        await educationAndWorkPlanClient.createGoals(prisonNumber, createGoalsRequest, username)
      } catch (e) {
        // Then
        expect(nock.isDone()).toBe(true)
        expect(e.responseStatus).toEqual(500)
        expect(e.data).toEqual(expectedResponseBody)
        expect(mockAuthenticationClient.getToken).toHaveBeenCalledWith(username)
      }
    })
  })

  describe('getActionPlan', () => {
    it('should get Action Plan', async () => {
      // Given
      const expectedActionPlanResponse = aValidActionPlanResponseWithOneGoal()
      educationAndWorkPlanApi
        .get(`/action-plans/${prisonNumber}`)
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .reply(200, expectedActionPlanResponse)

      // When
      const actual = await educationAndWorkPlanClient.getActionPlan(prisonNumber, username)

      // Then
      expect(nock.isDone()).toBe(true)
      expect(actual).toEqual(expectedActionPlanResponse)
      expect(mockAuthenticationClient.getToken).toHaveBeenCalledWith(username)
    })

    it('should not get Action Plan given no Action Plan returned for specified prisoner', async () => {
      // Given
      const expectedResponseBody = {
        status: 404,
        userMessage: `Action Plan not found for prisoner [${prisonNumber}]`,
      }
      educationAndWorkPlanApi
        .get(`/action-plans/${prisonNumber}`)
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .reply(404, expectedResponseBody)

      // When
      const actual = await educationAndWorkPlanClient.getActionPlan(prisonNumber, username)

      // Then
      expect(nock.isDone()).toBe(true)
      expect(actual).toBeNull()
      expect(mockAuthenticationClient.getToken).toHaveBeenCalledWith(username)
    })

    it('should not get Action Plan given API returns error response', async () => {
      // Given
      const expectedResponseBody = {
        status: 500,
        userMessage: 'An unexpected error occurred',
        developerMessage: 'An unexpected error occurred',
      }
      educationAndWorkPlanApi
        .get(`/action-plans/${prisonNumber}`)
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .thrice()
        .reply(500, expectedResponseBody)

      // When
      try {
        await educationAndWorkPlanClient.getActionPlan(prisonNumber, username)
      } catch (e) {
        // Then
        expect(nock.isDone()).toBe(true)
        expect(e.responseStatus).toEqual(500)
        expect(e.data).toEqual(expectedResponseBody)
        expect(mockAuthenticationClient.getToken).toHaveBeenCalledWith(username)
      }
    })
  })

  describe('getGoalsByStatus', () => {
    it('should get Goals', async () => {
      // Given
      const expectedResponseBody = {
        goals: [aValidGoalResponse()],
      }
      educationAndWorkPlanApi //
        .get(`/action-plans/${prisonNumber}/goals?status=ACTIVE`)
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .reply(200, expectedResponseBody)

      // When
      const actual = await educationAndWorkPlanClient.getGoalsByStatus(prisonNumber, GoalStatusValue.ACTIVE, username)

      // Then
      expect(nock.isDone()).toBe(true)
      expect(actual).toEqual(expectedResponseBody)
      expect(mockAuthenticationClient.getToken).toHaveBeenCalledWith(username)
    })

    it('should not get Goals given the API returns a 404', async () => {
      // Given
      const expectedResponseBody = {
        status: 404,
        errorCode: null as string,
        userMessage: `No goals have been created for prisoner [${prisonNumber}] yet`,
        developerMessage: null as string,
        moreInfo: null as string,
      }
      educationAndWorkPlanApi //
        .get(`/action-plans/${prisonNumber}/goals?status=ACTIVE`)
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .reply(404, expectedResponseBody)

      // When
      const actual = await educationAndWorkPlanClient.getGoalsByStatus(prisonNumber, GoalStatusValue.ACTIVE, username)

      // Then
      expect(nock.isDone()).toBe(true)
      expect(actual).toBeNull()
      expect(mockAuthenticationClient.getToken).toHaveBeenCalledWith(username)
    })

    it('should not get Goals given API returns an error response', async () => {
      // Given
      const expectedResponseBody = {
        status: 500,
        userMessage: 'An unexpected error occurred',
        developerMessage: 'An unexpected error occurred',
      }
      educationAndWorkPlanApi
        .get(`/action-plans/${prisonNumber}/goals?status=ACTIVE`)
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .thrice()
        .reply(500, expectedResponseBody)

      // When
      try {
        await educationAndWorkPlanClient.getGoalsByStatus(prisonNumber, GoalStatusValue.ACTIVE, username)
      } catch (e) {
        // Then
        expect(nock.isDone()).toBe(true)
        expect(e.responseStatus).toEqual(500)
        expect(e.data).toEqual(expectedResponseBody)
        expect(mockAuthenticationClient.getToken).toHaveBeenCalledWith(username)
      }
    })
  })

  describe('getGoal', () => {
    const goalReference = 'c77cd2fb-40e0-4354-982a-5c8017e92b26'

    it('should get Goal', async () => {
      // Given
      const expectedResponseBody = aValidGoalResponse({ goalReference })
      educationAndWorkPlanApi //
        .get(`/action-plans/${prisonNumber}/goals/${goalReference}`)
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .reply(200, expectedResponseBody)

      // When
      const actual = await educationAndWorkPlanClient.getGoal(prisonNumber, goalReference, username)

      // Then
      expect(nock.isDone()).toBe(true)
      expect(actual).toEqual(expectedResponseBody)
      expect(mockAuthenticationClient.getToken).toHaveBeenCalledWith(username)
    })

    it('should not get Goal given the API returns a 404', async () => {
      // Given
      const expectedResponseBody = {
        status: 404,
        errorCode: null as string,
        userMessage: 'Goal not found',
        developerMessage: null as string,
        moreInfo: null as string,
      }
      educationAndWorkPlanApi //
        .get(`/action-plans/${prisonNumber}/goals/${goalReference}`)
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .reply(404, expectedResponseBody)

      // When
      const actual = await educationAndWorkPlanClient.getGoal(prisonNumber, goalReference, username)

      // Then
      expect(nock.isDone()).toBe(true)
      expect(actual).toBeNull()
      expect(mockAuthenticationClient.getToken).toHaveBeenCalledWith(username)
    })

    it('should not get Goal given API returns an error response', async () => {
      // Given
      const expectedResponseBody = {
        status: 500,
        userMessage: 'An unexpected error occurred',
        developerMessage: 'An unexpected error occurred',
      }
      educationAndWorkPlanApi
        .get(`/action-plans/${prisonNumber}/goals/${goalReference}`)
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .thrice()
        .reply(500, expectedResponseBody)

      const expectedError = new Error('Internal Server Error')

      // When
      const actual = await educationAndWorkPlanClient.getGoal(prisonNumber, goalReference, username).catch(e => e)

      // Then
      expect(actual).toEqual(expectedError)
      expect(mockAuthenticationClient.getToken).toHaveBeenCalledWith(username)
      expect(nock.isDone()).toBe(true)
    })
  })

  describe('updateGoal', () => {
    it('should update Goal', async () => {
      // Given
      const goalReference = 'c77cd2fb-40e0-4354-982a-5c8017e92b26'

      const updateGoalRequest = aValidUpdateGoalRequestWithOneUpdatedStep(goalReference)
      const expectedResponseBody = {}
      educationAndWorkPlanApi
        .put(`/action-plans/${prisonNumber}/goals/${goalReference}`, requestBody =>
          isEqual(requestBody, updateGoalRequest),
        )
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .reply(204)

      // When
      const actual = await educationAndWorkPlanClient.updateGoal(prisonNumber, updateGoalRequest, username)

      // Then
      expect(nock.isDone()).toBe(true)
      expect(actual).toEqual(expectedResponseBody)
      expect(mockAuthenticationClient.getToken).toHaveBeenCalledWith(username)
    })

    it('should not update Goal given API returns an error response', async () => {
      // Given
      const goalReference = 'c77cd2fb-40e0-4354-982a-5c8017e92b26'

      const updateGoalRequest = aValidUpdateGoalRequestWithOneUpdatedStep(goalReference)
      const expectedResponseBody = {
        status: 500,
        userMessage: 'An unexpected error occurred',
        developerMessage: 'An unexpected error occurred',
      }
      educationAndWorkPlanApi
        .put(`/action-plans/${prisonNumber}/goals/${goalReference}`, requestBody =>
          isEqual(requestBody, updateGoalRequest),
        )
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .reply(500, expectedResponseBody)

      // When
      try {
        await educationAndWorkPlanClient.updateGoal(prisonNumber, updateGoalRequest, username)
      } catch (e) {
        // Then
        expect(nock.isDone()).toBe(true)
        expect(e.responseStatus).toEqual(500)
        expect(e.data).toEqual(expectedResponseBody)
        expect(mockAuthenticationClient.getToken).toHaveBeenCalledWith(username)
      }
    })
  })

  describe('getActionPlans', () => {
    it('should get Action Plans', async () => {
      // Given
      const prisonNumbers = ['A1234BC', 'B5544GD']

      const expectedActionPlanSummaryListResponse = aValidActionPlanSummaryListResponse({
        actionPlanSummaries: [
          aValidActionPlanSummaryResponse({
            reference: '6add2455-30f1-4b3e-a23e-1baf2d761e8f',
            prisonNumber: 'A1234BC',
          }),
          aValidActionPlanSummaryResponse({
            reference: 'b134fb41-426d-4494-bb66-75dafd9dc084',
            prisonNumber: 'B5544GD',
          }),
        ],
      })
      educationAndWorkPlanApi
        .post('/action-plans', requestBody => isEqual(requestBody, { prisonNumbers }))
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .reply(200, expectedActionPlanSummaryListResponse)

      // When
      const actual = await educationAndWorkPlanClient.getActionPlans(prisonNumbers, username)

      // Then
      expect(nock.isDone()).toBe(true)
      expect(actual).toEqual(expectedActionPlanSummaryListResponse)
      expect(mockAuthenticationClient.getToken).toHaveBeenCalledWith(username)
    })

    it('should get zero Action Plans given none of the specified prisoners have Action Plans', async () => {
      // Given
      const prisonNumbers = ['A1234BC', 'B5544GD']

      const expectedActionPlanSummaryListResponse = aValidActionPlanSummaryListResponse({
        actionPlanSummaries: [],
      })
      educationAndWorkPlanApi
        .post('/action-plans', requestBody => isEqual(requestBody, { prisonNumbers }))
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .reply(200, expectedActionPlanSummaryListResponse)

      // When
      const actual = await educationAndWorkPlanClient.getActionPlans(prisonNumbers, username)

      // Then
      expect(nock.isDone()).toBe(true)
      expect(actual).toEqual(expectedActionPlanSummaryListResponse)
      expect(mockAuthenticationClient.getToken).toHaveBeenCalledWith(username)
    })
  })

  describe('createActionPlanReview', () => {
    it('should create Action Plan Review', async () => {
      // Given
      const createActionPlanReviewRequest = aValidCreateActionPlanReviewRequest()
      const expectedResponseBody = aValidCreateActionPlanReviewResponse()
      educationAndWorkPlanApi
        .post(`/action-plans/${prisonNumber}/reviews`, requestBody =>
          isEqual(requestBody, createActionPlanReviewRequest),
        )
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .reply(201, expectedResponseBody)

      // When
      const actual = await educationAndWorkPlanClient.createActionPlanReview(
        prisonNumber,
        createActionPlanReviewRequest,
        username,
      )

      // Then
      expect(nock.isDone()).toBe(true)
      expect(actual).toEqual(expectedResponseBody)
      expect(mockAuthenticationClient.getToken).toHaveBeenCalledWith(username)
    })

    it('should not create Action Plan Review given API returns an error response', async () => {
      // Given
      const createActionPlanReviewRequest = aValidCreateActionPlanReviewRequest()
      const expectedResponseBody = {
        status: 500,
        userMessage: 'An unexpected error occurred',
        developerMessage: 'An unexpected error occurred',
      }
      educationAndWorkPlanApi
        .post(`/action-plans/${prisonNumber}/reviews`, requestBody =>
          isEqual(requestBody, createActionPlanReviewRequest),
        )
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .reply(500, expectedResponseBody)

      // When
      try {
        await educationAndWorkPlanClient.createActionPlanReview(prisonNumber, createActionPlanReviewRequest, username)
      } catch (e) {
        // Then
        expect(nock.isDone()).toBe(true)
        expect(e.responseStatus).toEqual(500)
        expect(e.data).toEqual(expectedResponseBody)
        expect(mockAuthenticationClient.getToken).toHaveBeenCalledWith(username)
      }
    })
  })

  describe('getActionPlanReviews', () => {
    it('should get Action Plan Reviews', async () => {
      // Given
      const expectedActionPlanReviews = aValidActionPlanReviewsResponse()
      educationAndWorkPlanApi
        .get(`/action-plans/${prisonNumber}/reviews`)
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .reply(200, expectedActionPlanReviews)

      // When
      const actual = await educationAndWorkPlanClient.getActionPlanReviews(prisonNumber, username)

      // Then
      expect(nock.isDone()).toBe(true)
      expect(actual).toEqual(expectedActionPlanReviews)
      expect(mockAuthenticationClient.getToken).toHaveBeenCalledWith(username)
    })

    it('should not get Action Plan Reviews given API returns error response', async () => {
      // Given
      const expectedResponseBody = {
        status: 500,
        userMessage: 'An unexpected error occurred',
        developerMessage: 'An unexpected error occurred',
      }
      educationAndWorkPlanApi
        .get(`/action-plans/${prisonNumber}/reviews`)
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .thrice()
        .reply(500, expectedResponseBody)

      // When
      try {
        await educationAndWorkPlanClient.getActionPlanReviews(prisonNumber, username)
      } catch (e) {
        // Then
        expect(nock.isDone()).toBe(true)
        expect(e.responseStatus).toEqual(500)
        expect(e.data).toEqual(expectedResponseBody)
        expect(mockAuthenticationClient.getToken).toHaveBeenCalledWith(username)
      }
    })

    it('should not get Action Plan Reviews given specified prisoner does not have a review schedule', async () => {
      // Given
      const expectedResponseBody = {
        status: 404,
        userMessage: `Review Schedule not found for prisoner [${prisonNumber}]`,
      }
      educationAndWorkPlanApi
        .get(`/action-plans/${prisonNumber}/reviews`)
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .reply(404, expectedResponseBody)

      // When
      const actual = await educationAndWorkPlanClient.getActionPlanReviews(prisonNumber, username)

      // Then
      expect(actual).toBeNull()
      expect(nock.isDone()).toBe(true)
      expect(mockAuthenticationClient.getToken).toHaveBeenCalledWith(username)
    })
  })

  describe('updateActionPlanReviewScheduleStatus', () => {
    it('should update Action Plan Review Schedule Status', async () => {
      // Given
      const updateReviewScheduleStatusRequest = aValidUpdateReviewScheduleStatusRequest()

      const expectedResponseBody = {}
      educationAndWorkPlanApi
        .put(`/action-plans/${prisonNumber}/reviews/schedule-status`, requestBody =>
          isMatch(updateReviewScheduleStatusRequest, requestBody),
        )
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .reply(204)

      // When
      const actual = await educationAndWorkPlanClient.updateActionPlanReviewScheduleStatus(
        prisonNumber,
        updateReviewScheduleStatusRequest,
        username,
      )

      // Then
      expect(nock.isDone()).toBe(true)
      expect(actual).toEqual(expectedResponseBody)
      expect(mockAuthenticationClient.getToken).toHaveBeenCalledWith(username)
    })

    it('should not update Action Plan Review Schedule Status given API returns error response', async () => {
      // Given
      const updateReviewScheduleStatusRequest = aValidUpdateReviewScheduleStatusRequest()

      const expectedResponseBody = {
        status: 500,
        userMessage: 'An unexpected error occurred',
        developerMessage: 'An unexpected error occurred',
      }
      educationAndWorkPlanApi
        .put(`/action-plans/${prisonNumber}/reviews/schedule-status`, requestBody =>
          isMatch(updateReviewScheduleStatusRequest, requestBody),
        )
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .reply(500, expectedResponseBody)

      // When
      try {
        await educationAndWorkPlanClient.updateActionPlanReviewScheduleStatus(
          prisonNumber,
          updateReviewScheduleStatusRequest,
          username,
        )
      } catch (e) {
        // Then
        expect(nock.isDone()).toBe(true)
        expect(e.responseStatus).toEqual(500)
        expect(e.data).toEqual(expectedResponseBody)
        expect(mockAuthenticationClient.getToken).toHaveBeenCalledWith(username)
      }
    })
  })

  describe('getTimeline', () => {
    it('should get Timeline given no filtering by event type', async () => {
      // Given
      const expectedTimelineResponse = aValidTimelineResponse()

      educationAndWorkPlanApi
        .get(`/timelines/${prisonNumber}?inductions=false&reviews=false&goals=false&prisonEvents=false`)
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .reply(200, expectedTimelineResponse)

      const timelineApiFilterOptions = new TimelineApiFilterOptions()

      // When
      const actual = await educationAndWorkPlanClient.getTimeline(prisonNumber, timelineApiFilterOptions, username)

      // Then
      expect(nock.isDone()).toBe(true)
      expect(actual).toEqual(expectedTimelineResponse)
      expect(mockAuthenticationClient.getToken).toHaveBeenCalledWith(username)
    })

    it('should get Timeline filtered by induction events', async () => {
      // Given
      const timelineResponseFromApi = aValidTimelineResponse()

      educationAndWorkPlanApi
        .get(`/timelines/${prisonNumber}?inductions=true&reviews=false&goals=false&prisonEvents=false`)
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .reply(200, timelineResponseFromApi)

      const timelineApiFilterOptions = new TimelineApiFilterOptions({
        inductions: true,
      })

      // When
      const actual = await educationAndWorkPlanClient.getTimeline(prisonNumber, timelineApiFilterOptions, username)

      // Then
      expect(nock.isDone()).toBe(true)
      expect(actual).toEqual(timelineResponseFromApi)
      expect(mockAuthenticationClient.getToken).toHaveBeenCalledWith(username)
    })

    it('should get Timeline filtered by review events', async () => {
      // Given
      const timelineResponseFromApi = aValidTimelineResponse()

      educationAndWorkPlanApi
        .get(`/timelines/${prisonNumber}?inductions=false&reviews=true&goals=false&prisonEvents=false`)
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .reply(200, timelineResponseFromApi)

      const timelineApiFilterOptions = new TimelineApiFilterOptions({
        reviews: true,
      })

      // When
      const actual = await educationAndWorkPlanClient.getTimeline(prisonNumber, timelineApiFilterOptions, username)

      // Then
      expect(nock.isDone()).toBe(true)
      expect(actual).toEqual(timelineResponseFromApi)
      expect(mockAuthenticationClient.getToken).toHaveBeenCalledWith(username)
    })

    it('should get Timeline filtered by goal events', async () => {
      // Given
      const timelineResponseFromApi = aValidTimelineResponse()

      educationAndWorkPlanApi
        .get(`/timelines/${prisonNumber}?inductions=false&reviews=false&goals=true&prisonEvents=false`)
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .reply(200, timelineResponseFromApi)

      const timelineApiFilterOptions = new TimelineApiFilterOptions({
        goals: true,
      })

      // When
      const actual = await educationAndWorkPlanClient.getTimeline(prisonNumber, timelineApiFilterOptions, username)

      // Then
      expect(nock.isDone()).toBe(true)
      expect(actual).toEqual(timelineResponseFromApi)
      expect(mockAuthenticationClient.getToken).toHaveBeenCalledWith(username)
    })

    it('should get Timeline filtered by prison events', async () => {
      // Given
      const timelineResponseFromApi = aValidTimelineResponse()

      educationAndWorkPlanApi
        .get(`/timelines/${prisonNumber}?inductions=false&reviews=false&goals=false&prisonEvents=true`)
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .reply(200, timelineResponseFromApi)

      const timelineApiFilterOptions = new TimelineApiFilterOptions({
        prisonEvents: true,
      })

      // When
      const actual = await educationAndWorkPlanClient.getTimeline(prisonNumber, timelineApiFilterOptions, username)

      // Then
      expect(nock.isDone()).toBe(true)
      expect(actual).toEqual(timelineResponseFromApi)
      expect(mockAuthenticationClient.getToken).toHaveBeenCalledWith(username)
    })

    it('should get Timeline filtered by prison id', async () => {
      // Given
      const timelineResponseFromApi = aValidTimelineResponse()

      educationAndWorkPlanApi
        .get(`/timelines/${prisonNumber}?inductions=false&reviews=false&goals=false&prisonEvents=false&prisonId=BXI`)
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .reply(200, timelineResponseFromApi)

      const timelineApiFilterOptions = new TimelineApiFilterOptions({
        prisonId: 'BXI',
      })

      // When
      const actual = await educationAndWorkPlanClient.getTimeline(prisonNumber, timelineApiFilterOptions, username)

      // Then
      expect(nock.isDone()).toBe(true)
      expect(actual).toEqual(timelineResponseFromApi)
      expect(mockAuthenticationClient.getToken).toHaveBeenCalledWith(username)
    })

    it('should get Timeline filtered by events since', async () => {
      // Given
      const timelineResponseFromApi = aValidTimelineResponse()

      educationAndWorkPlanApi
        .get(
          `/timelines/${prisonNumber}?inductions=false&reviews=false&goals=false&prisonEvents=false&eventsSince=2025-02-20`,
        )
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .reply(200, timelineResponseFromApi)

      const timelineApiFilterOptions = new TimelineApiFilterOptions({
        eventsSince: startOfDay('2025-02-20'),
      })

      // When
      const actual = await educationAndWorkPlanClient.getTimeline(prisonNumber, timelineApiFilterOptions, username)

      // Then
      expect(nock.isDone()).toBe(true)
      expect(actual).toEqual(timelineResponseFromApi)
      expect(mockAuthenticationClient.getToken).toHaveBeenCalledWith(username)
    })

    it('should get Timeline filtered by all options', async () => {
      // Given
      const timelineResponseFromApi = aValidTimelineResponse()

      educationAndWorkPlanApi
        .get(
          `/timelines/${prisonNumber}?inductions=true&reviews=true&goals=true&prisonEvents=true&prisonId=BXI&eventsSince=2025-02-20`,
        )
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .reply(200, timelineResponseFromApi)

      const timelineApiFilterOptions = new TimelineApiFilterOptions({
        inductions: true,
        reviews: true,
        goals: true,
        prisonEvents: true,
        prisonId: 'BXI',
        eventsSince: startOfDay('2025-02-20'),
      })

      // When
      const actual = await educationAndWorkPlanClient.getTimeline(prisonNumber, timelineApiFilterOptions, username)

      // Then
      expect(nock.isDone()).toBe(true)
      expect(actual).toEqual(timelineResponseFromApi)
      expect(mockAuthenticationClient.getToken).toHaveBeenCalledWith(username)
    })

    it('should not get Timeline given no timeline returned for specified prisoner', async () => {
      // Given
      const expectedResponseBody = {
        status: 404,
        userMessage: `Timeline not found for prisoner [${prisonNumber}]`,
      }
      educationAndWorkPlanApi
        .get(`/timelines/${prisonNumber}?inductions=false&reviews=false&goals=false&prisonEvents=false`)
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .reply(404, expectedResponseBody)

      const timelineApiFilterOptions = new TimelineApiFilterOptions()

      // When
      const actual = await educationAndWorkPlanClient.getTimeline(prisonNumber, timelineApiFilterOptions, username)

      // Then
      expect(nock.isDone()).toBe(true)
      expect(actual).toBeNull()
      expect(mockAuthenticationClient.getToken).toHaveBeenCalledWith(username)
    })

    it('should not get Timeline given API returns error response', async () => {
      // Given
      const expectedResponseBody = {
        status: 500,
        userMessage: 'An unexpected error occurred',
        developerMessage: 'An unexpected error occurred',
      }
      educationAndWorkPlanApi
        .get(`/timelines/${prisonNumber}?inductions=false&reviews=false&goals=false&prisonEvents=false`)
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .thrice()
        .reply(500, expectedResponseBody)

      const timelineApiFilterOptions = new TimelineApiFilterOptions()

      // When
      try {
        await educationAndWorkPlanClient.getTimeline(prisonNumber, timelineApiFilterOptions, username)
      } catch (e) {
        // Then
        expect(nock.isDone()).toBe(true)
        expect(e.responseStatus).toEqual(500)
        expect(e.data).toEqual(expectedResponseBody)
        expect(mockAuthenticationClient.getToken).toHaveBeenCalledWith(username)
      }
    })
  })

  describe('getInduction', () => {
    it('should get Induction', async () => {
      // Given
      const expectedInduction = aValidInductionResponse()
      educationAndWorkPlanApi
        .get(`/inductions/${prisonNumber}`)
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .reply(200, expectedInduction)

      // When
      const actual = await educationAndWorkPlanClient.getInduction(prisonNumber, username)

      // Then
      expect(nock.isDone()).toBe(true)
      expect(actual).toEqual(expectedInduction)
      expect(mockAuthenticationClient.getToken).toHaveBeenCalledWith(username)
    })

    it('should not get Induction given API returns error response', async () => {
      // Given
      const expectedResponseBody = {
        status: 500,
        userMessage: 'An unexpected error occurred',
        developerMessage: 'An unexpected error occurred',
      }
      educationAndWorkPlanApi.get(`/inductions/${prisonNumber}`).thrice().reply(500, expectedResponseBody)

      // When
      try {
        await educationAndWorkPlanClient.getInduction(prisonNumber, username)
      } catch (e) {
        // Then
        expect(nock.isDone()).toBe(true)
        expect(e.responseStatus).toEqual(500)
        expect(e.data).toEqual(expectedResponseBody)
        expect(mockAuthenticationClient.getToken).toHaveBeenCalledWith(username)
      }
    })

    it('should not get Induction given specified prisoner does not have an induction', async () => {
      // Given
      const expectedResponseBody = {
        status: 404,
        userMessage: `Induction not found for prisoner [${prisonNumber}]`,
      }
      educationAndWorkPlanApi
        .get(`/inductions/${prisonNumber}`)
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .reply(404, expectedResponseBody)

      // When
      const actual = await educationAndWorkPlanClient.getInduction(prisonNumber, username)

      // Then
      expect(nock.isDone()).toBe(true)
      expect(actual).toBeNull()
      expect(mockAuthenticationClient.getToken).toHaveBeenCalledWith(username)
    })
  })

  describe('updateInduction', () => {
    it('should update Induction', async () => {
      // Given
      const updateInductionRequest = aValidUpdateInductionRequest()

      educationAndWorkPlanApi //
        .put(`/inductions/${prisonNumber}`, requestBody => isEqual(requestBody, updateInductionRequest))
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .reply(204)

      // When
      await educationAndWorkPlanClient.updateInduction(prisonNumber, updateInductionRequest, username)

      // Then
      expect(nock.isDone()).toBe(true)
      expect(mockAuthenticationClient.getToken).toHaveBeenCalledWith(username)
    })

    it('should not update Induction given API returns error response', async () => {
      // Given
      const updateInductionRequest = aValidUpdateInductionRequest()

      const expectedResponseBody = {
        status: 500,
        userMessage: 'An unexpected error occurred',
        developerMessage: 'An unexpected error occurred',
      }
      educationAndWorkPlanApi
        .put(`/inductions/${prisonNumber}`, requestBody => isEqual(requestBody, updateInductionRequest))
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .reply(500, expectedResponseBody)

      // When
      try {
        await educationAndWorkPlanClient.updateInduction(prisonNumber, updateInductionRequest, username)
      } catch (e) {
        // Then
        expect(nock.isDone()).toBe(true)
        expect(e.responseStatus).toEqual(500)
        expect(e.data).toEqual(expectedResponseBody)
        expect(mockAuthenticationClient.getToken).toHaveBeenCalledWith(username)
      }
    })
  })

  describe('createInduction', () => {
    it('should create Induction', async () => {
      // Given
      const createInductionRequest = aValidCreateInductionRequest()

      educationAndWorkPlanApi //
        .post(`/inductions/${prisonNumber}`, requestBody => isMatch(createInductionRequest, requestBody))
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .reply(201)

      // When
      await educationAndWorkPlanClient.createInduction(prisonNumber, createInductionRequest, username)

      // Then
      expect(nock.isDone()).toBe(true)
      expect(mockAuthenticationClient.getToken).toHaveBeenCalledWith(username)
    })

    it('should not create Induction given API returns error response', async () => {
      // Given
      const createInductionRequest = aValidCreateInductionRequest()

      const expectedResponseBody = {
        status: 500,
        userMessage: 'An unexpected error occurred',
        developerMessage: 'An unexpected error occurred',
      }
      educationAndWorkPlanApi
        .post(`/inductions/${prisonNumber}`, requestBody => isMatch(createInductionRequest, requestBody))
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .reply(500, expectedResponseBody)

      // When
      try {
        await educationAndWorkPlanClient.createInduction(prisonNumber, createInductionRequest, username)
      } catch (e) {
        // Then
        expect(nock.isDone()).toBe(true)
        expect(e.responseStatus).toEqual(500)
        expect(e.data).toEqual(expectedResponseBody)
        expect(mockAuthenticationClient.getToken).toHaveBeenCalledWith(username)
      }
    })
  })

  describe('getInductionSchedule', () => {
    it('should get Induction Schedule', async () => {
      // Given
      const expectedInductionSchedule = aValidInductionScheduleResponse()
      educationAndWorkPlanApi
        .get(`/inductions/${prisonNumber}/induction-schedule`)
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .reply(200, expectedInductionSchedule)

      // When
      const actual = await educationAndWorkPlanClient.getInductionSchedule(prisonNumber, username)

      // Then
      expect(nock.isDone()).toBe(true)
      expect(actual).toEqual(expectedInductionSchedule)
      expect(mockAuthenticationClient.getToken).toHaveBeenCalledWith(username)
    })

    it('should not get Induction Schedule given API returns error response', async () => {
      // Given
      const expectedResponseBody = {
        status: 500,
        userMessage: 'An unexpected error occurred',
        developerMessage: 'An unexpected error occurred',
      }
      educationAndWorkPlanApi
        .get(`/inductions/${prisonNumber}/induction-schedule`)
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .thrice()
        .reply(500, expectedResponseBody)

      // When
      try {
        await educationAndWorkPlanClient.getInductionSchedule(prisonNumber, username)
      } catch (e) {
        // Then
        expect(nock.isDone()).toBe(true)
        expect(e.responseStatus).toEqual(500)
        expect(e.data).toEqual(expectedResponseBody)
        expect(mockAuthenticationClient.getToken).toHaveBeenCalledWith(username)
      }
    })

    it('should return null Induction Schedule given specified prisoner does not have an induction schedule', async () => {
      // Given
      const expectedResponseBody = {
        status: 404,
        userMessage: `Induction schedule not found for prisoner [${prisonNumber}]`,
      }
      educationAndWorkPlanApi
        .get(`/inductions/${prisonNumber}/induction-schedule`)
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .reply(404, expectedResponseBody)

      // When
      const actual = await educationAndWorkPlanClient.getInductionSchedule(prisonNumber, username)

      // Then
      expect(actual).toBeNull()
      expect(mockAuthenticationClient.getToken).toHaveBeenCalledWith(username)
    })
  })

  describe('updateInductionScheduleStatus', () => {
    it('should update Induction Schedule Status', async () => {
      // Given
      const updateInductionScheduleStatusRequest = aValidUpdateInductionScheduleStatusRequest()

      const expectedResponseBody = {}
      educationAndWorkPlanApi
        .put(`/inductions/${prisonNumber}/induction-schedule`, requestBody =>
          isMatch(updateInductionScheduleStatusRequest, requestBody),
        )
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .reply(204)

      // When
      const actual = await educationAndWorkPlanClient.updateInductionScheduleStatus(
        prisonNumber,
        updateInductionScheduleStatusRequest,
        username,
      )

      // Then
      expect(nock.isDone()).toBe(true)
      expect(actual).toEqual(expectedResponseBody)
      expect(mockAuthenticationClient.getToken).toHaveBeenCalledWith(username)
    })

    it('should not get Induction Schedule Status given API returns error response', async () => {
      // Given
      const updateInductionScheduleStatusRequest = aValidUpdateInductionScheduleStatusRequest()

      const expectedResponseBody = {
        status: 500,
        userMessage: 'An unexpected error occurred',
        developerMessage: 'An unexpected error occurred',
      }
      educationAndWorkPlanApi
        .put(`/inductions/${prisonNumber}/induction-schedule`, requestBody =>
          isMatch(updateInductionScheduleStatusRequest, requestBody),
        )
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .reply(500, expectedResponseBody)

      // When
      try {
        await educationAndWorkPlanClient.updateInductionScheduleStatus(
          prisonNumber,
          updateInductionScheduleStatusRequest,
          username,
        )
      } catch (e) {
        // Then
        expect(nock.isDone()).toBe(true)
        expect(e.responseStatus).toEqual(500)
        expect(e.data).toEqual(expectedResponseBody)
        expect(mockAuthenticationClient.getToken).toHaveBeenCalledWith(username)
      }
    })
  })

  describe('archiveGoal', () => {
    const goalReference = 'c77cd2fb-40e0-4354-982a-5c8017e92b26'
    const reason = ReasonToArchiveGoalValue.PRISONER_NO_LONGER_WANTS_TO_WORK_TOWARDS_GOAL
    const archiveGoalRequest: ArchiveGoalRequest = {
      goalReference,
      reason,
    }

    it('should archive Goal', async () => {
      // Given
      const expectedResponseBody = {}
      educationAndWorkPlanApi
        .put(`/action-plans/${prisonNumber}/goals/${goalReference}/archive`, archiveGoalRequest)
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .reply(204)

      // When
      const actual = await educationAndWorkPlanClient.archiveGoal(prisonNumber, archiveGoalRequest, username)

      // Then
      expect(nock.isDone()).toBe(true)
      expect(actual).toEqual(expectedResponseBody)
      expect(mockAuthenticationClient.getToken).toHaveBeenCalledWith(username)
    })

    it('should not archive Goal given API returns an error response', async () => {
      // Given
      const expectedResponseBody = {
        status: 500,
        userMessage: 'An unexpected error occurred',
        developerMessage: 'An unexpected error occurred',
      }
      educationAndWorkPlanApi
        .put(`/action-plans/${prisonNumber}/goals/${goalReference}/archive`, archiveGoalRequest)
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .reply(500, expectedResponseBody)

      // When
      try {
        await educationAndWorkPlanClient.archiveGoal(prisonNumber, archiveGoalRequest, username)
      } catch (e) {
        // Then
        expect(nock.isDone()).toBe(true)
        expect(e.responseStatus).toEqual(500)
        expect(e.data).toEqual(expectedResponseBody)
        expect(mockAuthenticationClient.getToken).toHaveBeenCalledWith(username)
      }
    })
  })

  describe('unarchiveGoal', () => {
    const goalReference = 'c77cd2fb-40e0-4354-982a-5c8017e92b26'
    const unarchiveGoalRequest: UnarchiveGoalRequest = { goalReference }

    it('should unarchive Goal', async () => {
      // Given
      const expectedResponseBody = {}
      educationAndWorkPlanApi
        .put(`/action-plans/${prisonNumber}/goals/${goalReference}/unarchive`, unarchiveGoalRequest)
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .reply(204)

      // When
      const actual = await educationAndWorkPlanClient.unarchiveGoal(prisonNumber, unarchiveGoalRequest, username)

      // Then
      expect(nock.isDone()).toBe(true)
      expect(actual).toEqual(expectedResponseBody)
      expect(mockAuthenticationClient.getToken).toHaveBeenCalledWith(username)
    })

    it('should not unarchive Goal given API returns an error response', async () => {
      // Given
      const expectedResponseBody = {
        status: 500,
        userMessage: 'An unexpected error occurred',
        developerMessage: 'An unexpected error occurred',
      }
      educationAndWorkPlanApi
        .put(`/action-plans/${prisonNumber}/goals/${goalReference}/unarchive`, unarchiveGoalRequest)
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .reply(500, expectedResponseBody)

      // When
      try {
        await educationAndWorkPlanClient.unarchiveGoal(prisonNumber, unarchiveGoalRequest, username)
      } catch (e) {
        // Then
        expect(nock.isDone()).toBe(true)
        expect(e.responseStatus).toEqual(500)
        expect(e.data).toEqual(expectedResponseBody)
        expect(mockAuthenticationClient.getToken).toHaveBeenCalledWith(username)
      }
    })
  })

  describe('getEducation', () => {
    it('should get Education', async () => {
      // Given
      const expectedEducationResponse = aValidEducationResponse()
      educationAndWorkPlanApi
        .get(`/person/${prisonNumber}/education`)
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .reply(200, expectedEducationResponse)

      // When
      const actual = await educationAndWorkPlanClient.getEducation(prisonNumber, username)

      // Then
      expect(nock.isDone()).toBe(true)
      expect(actual).toEqual(expectedEducationResponse)
      expect(mockAuthenticationClient.getToken).toHaveBeenCalledWith(username)
    })

    it('should not get Education given API returns a 404', async () => {
      // Given
      const expectedResponseBody = {
        errorCode: 'VC4004',
        errorMessage: 'Not found',
        httpStatusCode: 404,
      }
      educationAndWorkPlanApi
        .get(`/person/${prisonNumber}/education`)
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .reply(404, expectedResponseBody)

      // When
      const actual = await educationAndWorkPlanClient.getEducation(prisonNumber, username)

      // Then
      expect(nock.isDone()).toBe(true)
      expect(actual).toBeNull()
      expect(mockAuthenticationClient.getToken).toHaveBeenCalledWith(username)
    })

    it('should not get Education given API returns error response', async () => {
      // Given
      const expectedResponseBody = {
        status: 500,
        userMessage: 'An unexpected error occurred',
        developerMessage: 'An unexpected error occurred',
      }
      educationAndWorkPlanApi
        .get(`/person/${prisonNumber}/education`)
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .thrice()
        .reply(500, expectedResponseBody)

      // When
      try {
        await educationAndWorkPlanClient.getEducation(prisonNumber, username)
      } catch (e) {
        // Then
        expect(nock.isDone()).toBe(true)
        expect(e.responseStatus).toEqual(500)
        expect(e.data).toEqual(expectedResponseBody)
        expect(mockAuthenticationClient.getToken).toHaveBeenCalledWith(username)
      }
    })
  })

  describe('createEducation', () => {
    it('should create Education', async () => {
      // Given
      const createEducationRequest = aValidCreateEducationRequest()
      const expectedResponseBody = {}
      educationAndWorkPlanApi
        .post(`/person/${prisonNumber}/education`, requestBody => isEqual(requestBody, createEducationRequest))
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .reply(201, expectedResponseBody)

      // When
      const actual = await educationAndWorkPlanClient.createEducation(prisonNumber, createEducationRequest, username)

      // Then
      expect(nock.isDone()).toBe(true)
      expect(actual).toEqual(expectedResponseBody)
      expect(mockAuthenticationClient.getToken).toHaveBeenCalledWith(username)
    })

    it('should not create Education given API returns error response', async () => {
      // Given
      const createEducationRequest = aValidCreateEducationRequest()
      const expectedResponseBody = {
        status: 500,
        userMessage: 'An unexpected error occurred',
        developerMessage: 'An unexpected error occurred',
      }
      educationAndWorkPlanApi
        .post(`/person/${prisonNumber}/education`, requestBody => isEqual(requestBody, createEducationRequest))
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .reply(500, expectedResponseBody)

      // When
      try {
        await educationAndWorkPlanClient.createEducation(prisonNumber, createEducationRequest, username)
      } catch (e) {
        // Then
        expect(nock.isDone()).toBe(true)
        expect(e.responseStatus).toEqual(500)
        expect(e.data).toEqual(expectedResponseBody)
        expect(mockAuthenticationClient.getToken).toHaveBeenCalledWith(username)
      }
    })
  })

  describe('updateEducation', () => {
    it('should update Education', async () => {
      // Given
      const updateEducationRequest = aValidUpdateEducationRequest()
      const expectedResponseBody = {}
      educationAndWorkPlanApi
        .put(`/person/${prisonNumber}/education`, requestBody => isEqual(requestBody, updateEducationRequest))
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .reply(204)

      // When
      const actual = await educationAndWorkPlanClient.updateEducation(prisonNumber, updateEducationRequest, username)

      // Then
      expect(nock.isDone()).toBe(true)
      expect(actual).toEqual(expectedResponseBody)
      expect(mockAuthenticationClient.getToken).toHaveBeenCalledWith(username)
    })

    it('should not update Education given API returns error response', async () => {
      // Given
      const updateEducationRequest = aValidUpdateEducationRequest()
      const expectedResponseBody = {
        status: 500,
        userMessage: 'An unexpected error occurred',
        developerMessage: 'An unexpected error occurred',
      }
      educationAndWorkPlanApi
        .put(`/person/${prisonNumber}/education`, requestBody => isEqual(requestBody, updateEducationRequest))
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .reply(500, expectedResponseBody)

      // When
      try {
        await educationAndWorkPlanClient.updateEducation(prisonNumber, updateEducationRequest, username)
      } catch (e) {
        // Then
        expect(nock.isDone()).toBe(true)
        expect(e.responseStatus).toEqual(500)
        expect(e.data).toEqual(expectedResponseBody)
        expect(mockAuthenticationClient.getToken).toHaveBeenCalledWith(username)
      }
    })
  })

  describe('createActionPlan', () => {
    it('should create action plan', async () => {
      // Given
      const createActionPlanRequest = aValidCreateActionPlanRequest()
      const expectedResponseBody = {}
      educationAndWorkPlanApi
        .post(`/action-plans/${prisonNumber}`, requestBody => isEqual(requestBody, createActionPlanRequest))
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .reply(201, expectedResponseBody)

      // When
      const actual = await educationAndWorkPlanClient.createActionPlan(prisonNumber, createActionPlanRequest, username)

      // Then
      expect(nock.isDone()).toBe(true)
      expect(actual).toEqual(expectedResponseBody)
      expect(mockAuthenticationClient.getToken).toHaveBeenCalledWith(username)
    })

    it('should not create action plan given API returns an error response', async () => {
      // Given
      const createActionPlanRequest = aValidCreateActionPlanRequest()
      const expectedResponseBody = {
        status: 500,
        userMessage: 'An unexpected error occurred',
        developerMessage: 'An unexpected error occurred',
      }
      educationAndWorkPlanApi
        .post(`/action-plans/${prisonNumber}`, requestBody => isEqual(requestBody, createActionPlanRequest))
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .reply(500, expectedResponseBody)

      // When
      try {
        await educationAndWorkPlanClient.createActionPlan(prisonNumber, createActionPlanRequest, username)
      } catch (e) {
        // Then
        expect(nock.isDone()).toBe(true)
        expect(e.responseStatus).toEqual(500)
        expect(e.data).toEqual(expectedResponseBody)
        expect(mockAuthenticationClient.getToken).toHaveBeenCalledWith(username)
      }
    })
  })

  describe('getSessionSummary', () => {
    it('should get Session Summary', async () => {
      // Given
      const expectedSessionSummaryResponse = aValidSessionSummaryResponse()
      educationAndWorkPlanApi
        .get(`/session/${prisonId}/summary`)
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .reply(200, expectedSessionSummaryResponse)

      // When
      const actual = await educationAndWorkPlanClient.getSessionSummary(prisonId, username)

      // Then
      expect(nock.isDone()).toBe(true)
      expect(actual).toEqual(expectedSessionSummaryResponse)
      expect(mockAuthenticationClient.getToken).toHaveBeenCalledWith(username)
    })

    it('should not get Session Summary given API returns error response', async () => {
      // Given
      const expectedResponseBody = {
        status: 500,
        userMessage: 'An unexpected error occurred',
        developerMessage: 'An unexpected error occurred',
      }
      educationAndWorkPlanApi
        .get(`/session/${prisonId}/summary`)
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .thrice()
        .reply(500, expectedResponseBody)

      // When
      try {
        await educationAndWorkPlanClient.getSessionSummary(prisonId, username)
      } catch (e) {
        // Then
        expect(nock.isDone()).toBe(true)
        expect(e.responseStatus).toEqual(500)
        expect(e.data).toEqual(expectedResponseBody)
        expect(mockAuthenticationClient.getToken).toHaveBeenCalledWith(username)
      }
    })

    it('should not get Session Summary given API returns 404 response', async () => {
      // Given
      const apiErrorResponseBody = {
        status: 404,
        userMessage: 'Some error',
        developerMessage: 'Some error',
      }
      educationAndWorkPlanApi
        .get(`/session/${prisonId}/summary`)
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .reply(404, apiErrorResponseBody)

      // When
      const actual = await educationAndWorkPlanClient.getSessionSummary(prisonId, username)

      // Then
      expect(nock.isDone()).toBe(true)
      expect(actual).toBeNull()
      expect(mockAuthenticationClient.getToken).toHaveBeenCalledWith(username)
    })
  })

  describe('getSessions', () => {
    it.each([SessionStatusValue.DUE, SessionStatusValue.OVERDUE, SessionStatusValue.ON_HOLD])(
      'should get Sessions given session status filtering',
      async status => {
        // Given
        const prisonNumbers = ['A1234BC', 'B5544GD']

        const expectedSessionResponses = aValidSessionResponses({
          sessions: [
            aValidSessionResponse({ prisonNumber: 'A1234BC' }),
            aValidSessionResponse({ prisonNumber: 'B5544GD' }),
          ],
        })
        educationAndWorkPlanApi
          .post(`/session/summary?status=${status}`, requestBody => isEqual(requestBody, { prisonNumbers }))
          .matchHeader('authorization', `Bearer ${systemToken}`)
          .reply(200, expectedSessionResponses)

        // When
        const actual = await educationAndWorkPlanClient.getSessions(prisonNumbers, username, status)

        // Then
        expect(nock.isDone()).toBe(true)
        expect(actual).toEqual(expectedSessionResponses)
        expect(mockAuthenticationClient.getToken).toHaveBeenCalledWith(username)
      },
    )

    it('should get zero Sessions given none of the specified prisoners have Sessions', async () => {
      // Given
      const prisonNumbers = ['A1234BC', 'B5544GD']

      const expectedSessionResponses = aValidSessionResponses({
        sessions: [],
      })
      educationAndWorkPlanApi
        .post('/session/summary?status=DUE', requestBody => isEqual(requestBody, { prisonNumbers }))
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .reply(200, expectedSessionResponses)

      // When
      const actual = await educationAndWorkPlanClient.getSessions(prisonNumbers, username, SessionStatusValue.DUE)

      // Then
      expect(nock.isDone()).toBe(true)
      expect(actual).toEqual(expectedSessionResponses)
      expect(mockAuthenticationClient.getToken).toHaveBeenCalledWith(username)
    })

    it('should not get Sessions given API returns an error response', async () => {
      // Given
      const prisonNumbers = ['A1234BC', 'B5544GD']

      const expectedResponseBody = {
        status: 500,
        userMessage: 'An unexpected error occurred',
        developerMessage: 'An unexpected error occurred',
      }
      educationAndWorkPlanApi
        .post('/session/summary?status=DUE', requestBody => isEqual(requestBody, { prisonNumbers }))
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .reply(500, expectedResponseBody)

      try {
        await educationAndWorkPlanClient.getSessions(prisonNumbers, username, SessionStatusValue.DUE)
      } catch (e) {
        // Then
        expect(nock.isDone()).toBe(true)
        expect(e.responseStatus).toEqual(500)
        expect(e.data).toEqual(expectedResponseBody)
        expect(mockAuthenticationClient.getToken).toHaveBeenCalledWith(username)
      }
    })
  })
})
