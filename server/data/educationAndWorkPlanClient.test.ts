import nock from 'nock'
import { isEqual, isMatch } from 'lodash'
import type { ArchiveGoalRequest, UnarchiveGoalRequest } from 'educationAndWorkPlanApiClient'
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

describe('educationAndWorkPlanClient', () => {
  const educationAndWorkPlanClient = new EducationAndWorkPlanClient()

  config.apis.educationAndWorkPlan.url = 'http://localhost:8200'
  let educationAndWorkPlanApi: nock.Scope

  const prisonId = 'BXI'
  const prisonNumber = 'A1234BC'
  const systemToken = 'a-system-token'

  beforeEach(() => {
    educationAndWorkPlanApi = nock(config.apis.educationAndWorkPlan.url)
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
        .reply(201, expectedResponseBody)

      // When
      const actual = await educationAndWorkPlanClient.createGoals(prisonNumber, createGoalsRequest, systemToken)

      // Then
      expect(nock.isDone()).toBe(true)
      expect(actual).toEqual(expectedResponseBody)
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
        .reply(500, expectedResponseBody)

      // When
      try {
        await educationAndWorkPlanClient.createGoals(prisonNumber, createGoalsRequest, systemToken)
      } catch (e) {
        // Then
        expect(nock.isDone()).toBe(true)
        expect(e.status).toEqual(500)
        expect(e.data).toEqual(expectedResponseBody)
      }
    })
  })

  describe('getActionPlan', () => {
    it('should get Action Plan', async () => {
      // Given
      const expectedActionPlanResponse = aValidActionPlanResponseWithOneGoal()
      educationAndWorkPlanApi.get(`/action-plans/${prisonNumber}`).reply(200, expectedActionPlanResponse)

      // When
      const actual = await educationAndWorkPlanClient.getActionPlan(prisonNumber, systemToken)

      // Then
      expect(nock.isDone()).toBe(true)
      expect(actual).toEqual(expectedActionPlanResponse)
    })

    it('should not get Action Plan given no Action Plan returned for specified prisoner', async () => {
      // Given
      const expectedResponseBody = {
        status: 404,
        userMessage: `Action Plan not found for prisoner [${prisonNumber}]`,
      }
      educationAndWorkPlanApi.get(`/action-plans/${prisonNumber}`).reply(404, expectedResponseBody)

      // When
      const actual = await educationAndWorkPlanClient.getActionPlan(prisonNumber, systemToken)

      // Then
      expect(nock.isDone()).toBe(true)
      expect(actual).toBeNull()
    })

    it('should not get Action Plan given API returns error response', async () => {
      // Given
      const expectedResponseBody = {
        status: 500,
        userMessage: 'An unexpected error occurred',
        developerMessage: 'An unexpected error occurred',
      }
      educationAndWorkPlanApi.get(`/action-plans/${prisonNumber}`).thrice().reply(500, expectedResponseBody)

      // When
      try {
        await educationAndWorkPlanClient.getActionPlan(prisonNumber, systemToken)
      } catch (e) {
        // Then
        expect(nock.isDone()).toBe(true)
        expect(e.status).toEqual(500)
        expect(e.data).toEqual(expectedResponseBody)
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
        .reply(200, expectedResponseBody)

      // When
      const actual = await educationAndWorkPlanClient.getGoalsByStatus(
        prisonNumber,
        GoalStatusValue.ACTIVE,
        systemToken,
      )

      // Then
      expect(nock.isDone()).toBe(true)
      expect(actual).toEqual(expectedResponseBody)
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
        .reply(404, expectedResponseBody)

      // When
      const actual = await educationAndWorkPlanClient.getGoalsByStatus(
        prisonNumber,
        GoalStatusValue.ACTIVE,
        systemToken,
      )

      // Then
      expect(nock.isDone()).toBe(true)
      expect(actual).toBeNull()
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
        .thrice()
        .reply(500, expectedResponseBody)

      // When
      try {
        await educationAndWorkPlanClient.getGoalsByStatus(prisonNumber, GoalStatusValue.ACTIVE, systemToken)
      } catch (e) {
        // Then
        expect(nock.isDone()).toBe(true)
        expect(e.status).toEqual(500)
        expect(e.data).toEqual(expectedResponseBody)
      }
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
        .reply(204)

      // When
      const actual = await educationAndWorkPlanClient.updateGoal(prisonNumber, updateGoalRequest, systemToken)

      // Then
      expect(nock.isDone()).toBe(true)
      expect(actual).toEqual(expectedResponseBody)
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
        .reply(500, expectedResponseBody)

      // When
      try {
        await educationAndWorkPlanClient.updateGoal(prisonNumber, updateGoalRequest, systemToken)
      } catch (e) {
        // Then
        expect(nock.isDone()).toBe(true)
        expect(e.status).toEqual(500)
        expect(e.data).toEqual(expectedResponseBody)
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
        .reply(200, expectedActionPlanSummaryListResponse)

      // When
      const actual = await educationAndWorkPlanClient.getActionPlans(prisonNumbers, systemToken)

      // Then
      expect(nock.isDone()).toBe(true)
      expect(actual).toEqual(expectedActionPlanSummaryListResponse)
    })

    it('should get zero Action Plans given none of the specified prisoners have Action Plans', async () => {
      // Given
      const prisonNumbers = ['A1234BC', 'B5544GD']

      const expectedActionPlanSummaryListResponse = aValidActionPlanSummaryListResponse({
        actionPlanSummaries: [],
      })
      educationAndWorkPlanApi
        .post('/action-plans', requestBody => isEqual(requestBody, { prisonNumbers }))
        .reply(200, expectedActionPlanSummaryListResponse)

      // When
      const actual = await educationAndWorkPlanClient.getActionPlans(prisonNumbers, systemToken)

      // Then
      expect(nock.isDone()).toBe(true)
      expect(actual).toEqual(expectedActionPlanSummaryListResponse)
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
        .reply(201, expectedResponseBody)

      // When
      const actual = await educationAndWorkPlanClient.createActionPlanReview(
        prisonNumber,
        createActionPlanReviewRequest,
        systemToken,
      )

      // Then
      expect(nock.isDone()).toBe(true)
      expect(actual).toEqual(expectedResponseBody)
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
        .reply(500, expectedResponseBody)

      // When
      try {
        await educationAndWorkPlanClient.createActionPlanReview(
          prisonNumber,
          createActionPlanReviewRequest,
          systemToken,
        )
      } catch (e) {
        // Then
        expect(nock.isDone()).toBe(true)
        expect(e.status).toEqual(500)
        expect(e.data).toEqual(expectedResponseBody)
      }
    })
  })

  describe('getActionPlanReviews', () => {
    it('should get Action Plan Reviews', async () => {
      // Given
      const expectedActionPlanReviews = aValidActionPlanReviewsResponse()
      educationAndWorkPlanApi.get(`/action-plans/${prisonNumber}/reviews`).reply(200, expectedActionPlanReviews)

      // When
      const actual = await educationAndWorkPlanClient.getActionPlanReviews(prisonNumber, systemToken)

      // Then
      expect(nock.isDone()).toBe(true)
      expect(actual).toEqual(expectedActionPlanReviews)
    })

    it('should not get Action Plan Reviews given API returns error response', async () => {
      // Given
      const expectedResponseBody = {
        status: 500,
        userMessage: 'An unexpected error occurred',
        developerMessage: 'An unexpected error occurred',
      }
      educationAndWorkPlanApi.get(`/action-plans/${prisonNumber}/reviews`).thrice().reply(500, expectedResponseBody)

      // When
      try {
        await educationAndWorkPlanClient.getActionPlanReviews(prisonNumber, systemToken)
      } catch (e) {
        // Then
        expect(nock.isDone()).toBe(true)
        expect(e.status).toEqual(500)
        expect(e.data).toEqual(expectedResponseBody)
      }
    })

    it('should not get Action Plan Reviews given specified prisoner does not have a review schedule', async () => {
      // Given
      const expectedResponseBody = {
        status: 404,
        userMessage: `Review Schedule not found for prisoner [${prisonNumber}]`,
      }
      educationAndWorkPlanApi.get(`/action-plans/${prisonNumber}/reviews`).reply(404, expectedResponseBody)

      // When
      const actual = await educationAndWorkPlanClient.getActionPlanReviews(prisonNumber, systemToken)

      // Then
      expect(actual).toBeNull()
      expect(nock.isDone()).toBe(true)
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
        .reply(204)

      // When
      const actual = await educationAndWorkPlanClient.updateActionPlanReviewScheduleStatus(
        prisonNumber,
        updateReviewScheduleStatusRequest,
        systemToken,
      )

      // Then
      expect(nock.isDone()).toBe(true)
      expect(actual).toEqual(expectedResponseBody)
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
        .reply(500, expectedResponseBody)

      // When
      try {
        await educationAndWorkPlanClient.updateActionPlanReviewScheduleStatus(
          prisonNumber,
          updateReviewScheduleStatusRequest,
          systemToken,
        )
      } catch (e) {
        // Then
        expect(nock.isDone()).toBe(true)
        expect(e.status).toEqual(500)
        expect(e.data).toEqual(expectedResponseBody)
      }
    })
  })

  describe('getTimeline', () => {
    it('should get Timeline given no filtering by event type', async () => {
      // Given
      const expectedTimelineResponse = aValidTimelineResponse()

      educationAndWorkPlanApi
        .get(`/timelines/${prisonNumber}?inductions=false&reviews=false&goals=false&prisonEvents=false`)
        .reply(200, expectedTimelineResponse)

      const timelineApiFilterOptions = new TimelineApiFilterOptions()

      // When
      const actual = await educationAndWorkPlanClient.getTimeline(prisonNumber, timelineApiFilterOptions, systemToken)

      // Then
      expect(nock.isDone()).toBe(true)
      expect(actual).toEqual(expectedTimelineResponse)
    })

    it('should get Timeline filtered by event type', async () => {
      // Given
      const timelineResponseFromApi = aValidTimelineResponse()
      educationAndWorkPlanApi
        .get(`/timelines/${prisonNumber}?inductions=false&reviews=false&goals=false&prisonEvents=false`)
        .reply(200, timelineResponseFromApi)

      const expectedTimelineResponse = {
        ...timelineResponseFromApi,
        events: [
          {
            reference: '3f0423e5-200b-48c9-8414-f04e336897ff',
            sourceReference: 'f190e844-3aa1-4f04-81d5-6be2bf9721cc',
            eventType: 'GOAL_CREATED',
            prisonId: 'MDI',
            actionedBy: 'RALPH_GEN',
            timestamp: '2023-09-23T15:47:38.565Z',
            correlationId: '0838330d-606f-480a-b55f-3228e1be122d',
            contextualInfo: {
              GOAL_TITLE: 'Learn French',
            },
            actionedByDisplayName: 'Ralph Gen',
          },
        ],
      }

      const timelineApiFilterOptions = new TimelineApiFilterOptions()

      // When
      const actual = await educationAndWorkPlanClient.getTimeline(prisonNumber, timelineApiFilterOptions, systemToken, [
        'GOAL_CREATED',
      ])

      // Then
      expect(nock.isDone()).toBe(true)
      expect(actual).toEqual(expectedTimelineResponse)
    })

    it('should not get Timeline given no timeline returned for specified prisoner', async () => {
      // Given
      const expectedResponseBody = {
        status: 404,
        userMessage: `Timeline not found for prisoner [${prisonNumber}]`,
      }
      educationAndWorkPlanApi
        .get(`/timelines/${prisonNumber}?inductions=false&reviews=false&goals=false&prisonEvents=false`)
        .reply(404, expectedResponseBody)

      const timelineApiFilterOptions = new TimelineApiFilterOptions()

      // When
      const actual = await educationAndWorkPlanClient.getTimeline(prisonNumber, timelineApiFilterOptions, systemToken)

      // Then
      expect(nock.isDone()).toBe(true)
      expect(actual).toBeNull()
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
        .thrice()
        .reply(500, expectedResponseBody)

      const timelineApiFilterOptions = new TimelineApiFilterOptions()

      // When
      try {
        await educationAndWorkPlanClient.getTimeline(prisonNumber, timelineApiFilterOptions, systemToken)
      } catch (e) {
        // Then
        expect(nock.isDone()).toBe(true)
        expect(e.status).toEqual(500)
        expect(e.data).toEqual(expectedResponseBody)
      }
    })
  })

  describe('getInduction', () => {
    it('should get Induction', async () => {
      // Given
      const expectedInduction = aValidInductionResponse()
      educationAndWorkPlanApi.get(`/inductions/${prisonNumber}`).reply(200, expectedInduction)

      // When
      const actual = await educationAndWorkPlanClient.getInduction(prisonNumber, systemToken)

      // Then
      expect(nock.isDone()).toBe(true)
      expect(actual).toEqual(expectedInduction)
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
        await educationAndWorkPlanClient.getInduction(prisonNumber, systemToken)
      } catch (e) {
        // Then
        expect(nock.isDone()).toBe(true)
        expect(e.status).toEqual(500)
        expect(e.data).toEqual(expectedResponseBody)
      }
    })

    it('should not get Induction given specified prisoner does not have an induction', async () => {
      // Given
      const expectedResponseBody = {
        status: 404,
        userMessage: `Induction not found for prisoner [${prisonNumber}]`,
      }
      educationAndWorkPlanApi.get(`/inductions/${prisonNumber}`).reply(404, expectedResponseBody)

      // When
      const actual = await educationAndWorkPlanClient.getInduction(prisonNumber, systemToken)

      // Then
      expect(nock.isDone()).toBe(true)
      expect(actual).toBeNull()
    })
  })

  describe('updateInduction', () => {
    it('should update Induction', async () => {
      // Given
      const updateInductionRequest = aValidUpdateInductionRequest()

      educationAndWorkPlanApi //
        .put(`/inductions/${prisonNumber}`, requestBody => isEqual(requestBody, updateInductionRequest))
        .reply(204)

      // When
      await educationAndWorkPlanClient.updateInduction(prisonNumber, updateInductionRequest, systemToken)

      // Then
      expect(nock.isDone()).toBe(true)
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
        .reply(500, expectedResponseBody)

      // When
      try {
        await educationAndWorkPlanClient.updateInduction(prisonNumber, updateInductionRequest, systemToken)
      } catch (e) {
        // Then
        expect(nock.isDone()).toBe(true)
        expect(e.status).toEqual(500)
        expect(e.data).toEqual(expectedResponseBody)
      }
    })
  })

  describe('createInduction', () => {
    it('should create Induction', async () => {
      // Given
      const createInductionRequest = aValidCreateInductionRequest()

      educationAndWorkPlanApi //
        .post(`/inductions/${prisonNumber}`, requestBody => isMatch(createInductionRequest, requestBody))
        .reply(201)

      // When
      await educationAndWorkPlanClient.createInduction(prisonNumber, createInductionRequest, systemToken)

      // Then
      expect(nock.isDone()).toBe(true)
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
        .reply(500, expectedResponseBody)

      // When
      try {
        await educationAndWorkPlanClient.createInduction(prisonNumber, createInductionRequest, systemToken)
      } catch (e) {
        // Then
        expect(nock.isDone()).toBe(true)
        expect(e.status).toEqual(500)
        expect(e.data).toEqual(expectedResponseBody)
      }
    })
  })

  describe('getInductionSchedule', () => {
    it('should get Induction Schedule', async () => {
      // Given
      const expectedInductionSchedule = aValidInductionScheduleResponse()
      educationAndWorkPlanApi
        .get(`/inductions/${prisonNumber}/induction-schedule`)
        .reply(200, expectedInductionSchedule)

      // When
      const actual = await educationAndWorkPlanClient.getInductionSchedule(prisonNumber, systemToken)

      // Then
      expect(nock.isDone()).toBe(true)
      expect(actual).toEqual(expectedInductionSchedule)
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
        .thrice()
        .reply(500, expectedResponseBody)

      // When
      try {
        await educationAndWorkPlanClient.getInductionSchedule(prisonNumber, systemToken)
      } catch (e) {
        // Then
        expect(nock.isDone()).toBe(true)
        expect(e.status).toEqual(500)
        expect(e.data).toEqual(expectedResponseBody)
      }
    })

    it('should return null Induction Schedule given specified prisoner does not have an induction schedule', async () => {
      // Given
      const expectedResponseBody = {
        status: 404,
        userMessage: `Induction schedule not found for prisoner [${prisonNumber}]`,
      }
      educationAndWorkPlanApi.get(`/inductions/${prisonNumber}/induction-schedule`).reply(404, expectedResponseBody)

      // When
      const actual = await educationAndWorkPlanClient.getInductionSchedule(prisonNumber, systemToken)

      // Then
      expect(actual).toBeNull()
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
        .reply(204)

      // When
      const actual = await educationAndWorkPlanClient.updateInductionScheduleStatus(
        prisonNumber,
        updateInductionScheduleStatusRequest,
        systemToken,
      )

      // Then
      expect(nock.isDone()).toBe(true)
      expect(actual).toEqual(expectedResponseBody)
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
        .reply(500, expectedResponseBody)

      // When
      try {
        await educationAndWorkPlanClient.updateInductionScheduleStatus(
          prisonNumber,
          updateInductionScheduleStatusRequest,
          systemToken,
        )
      } catch (e) {
        // Then
        expect(nock.isDone()).toBe(true)
        expect(e.status).toEqual(500)
        expect(e.data).toEqual(expectedResponseBody)
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
        .reply(204)

      // When
      const actual = await educationAndWorkPlanClient.archiveGoal(prisonNumber, archiveGoalRequest, systemToken)

      // Then
      expect(nock.isDone()).toBe(true)
      expect(actual).toEqual(expectedResponseBody)
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
        .reply(500, expectedResponseBody)

      // When
      try {
        await educationAndWorkPlanClient.archiveGoal(prisonNumber, archiveGoalRequest, systemToken)
      } catch (e) {
        // Then
        expect(nock.isDone()).toBe(true)
        expect(e.status).toEqual(500)
        expect(e.data).toEqual(expectedResponseBody)
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
        .reply(204)

      // When
      const actual = await educationAndWorkPlanClient.unarchiveGoal(prisonNumber, unarchiveGoalRequest, systemToken)

      // Then
      expect(nock.isDone()).toBe(true)
      expect(actual).toEqual(expectedResponseBody)
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
        .reply(500, expectedResponseBody)

      // When
      try {
        await educationAndWorkPlanClient.unarchiveGoal(prisonNumber, unarchiveGoalRequest, systemToken)
      } catch (e) {
        // Then
        expect(nock.isDone()).toBe(true)
        expect(e.status).toEqual(500)
        expect(e.data).toEqual(expectedResponseBody)
      }
    })
  })

  describe('getEducation', () => {
    it('should get Education', async () => {
      // Given
      const expectedEducationResponse = aValidEducationResponse()
      educationAndWorkPlanApi.get(`/person/${prisonNumber}/education`).reply(200, expectedEducationResponse)

      // When
      const actual = await educationAndWorkPlanClient.getEducation(prisonNumber, systemToken)

      // Then
      expect(nock.isDone()).toBe(true)
      expect(actual).toEqual(expectedEducationResponse)
    })

    it('should not get Education given API returns a 404', async () => {
      // Given
      const expectedResponseBody = {
        errorCode: 'VC4004',
        errorMessage: 'Not found',
        httpStatusCode: 404,
      }
      educationAndWorkPlanApi.get(`/person/${prisonNumber}/education`).reply(404, expectedResponseBody)

      // When
      const actual = await educationAndWorkPlanClient.getEducation(prisonNumber, systemToken)

      // Then
      expect(nock.isDone()).toBe(true)
      expect(actual).toBeNull()
    })

    it('should not get Education given API returns error response', async () => {
      // Given
      const expectedResponseBody = {
        status: 500,
        userMessage: 'An unexpected error occurred',
        developerMessage: 'An unexpected error occurred',
      }
      educationAndWorkPlanApi.get(`/person/${prisonNumber}/education`).thrice().reply(500, expectedResponseBody)

      // When
      try {
        await educationAndWorkPlanClient.getEducation(prisonNumber, systemToken)
      } catch (e) {
        // Then
        expect(nock.isDone()).toBe(true)
        expect(e.status).toEqual(500)
        expect(e.data).toEqual(expectedResponseBody)
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
        .reply(201, expectedResponseBody)

      // When
      const actual = await educationAndWorkPlanClient.createEducation(prisonNumber, createEducationRequest, systemToken)

      // Then
      expect(nock.isDone()).toBe(true)
      expect(actual).toEqual(expectedResponseBody)
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
        .reply(500, expectedResponseBody)

      // When
      try {
        await educationAndWorkPlanClient.createEducation(prisonNumber, createEducationRequest, systemToken)
      } catch (e) {
        // Then
        expect(nock.isDone()).toBe(true)
        expect(e.status).toEqual(500)
        expect(e.data).toEqual(expectedResponseBody)
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
        .reply(204)

      // When
      const actual = await educationAndWorkPlanClient.updateEducation(prisonNumber, updateEducationRequest, systemToken)

      // Then
      expect(nock.isDone()).toBe(true)
      expect(actual).toEqual(expectedResponseBody)
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
        .reply(500, expectedResponseBody)

      // When
      try {
        await educationAndWorkPlanClient.updateEducation(prisonNumber, updateEducationRequest, systemToken)
      } catch (e) {
        // Then
        expect(nock.isDone()).toBe(true)
        expect(e.status).toEqual(500)
        expect(e.data).toEqual(expectedResponseBody)
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
        .reply(201, expectedResponseBody)

      // When
      const actual = await educationAndWorkPlanClient.createActionPlan(
        prisonNumber,
        createActionPlanRequest,
        systemToken,
      )

      // Then
      expect(nock.isDone()).toBe(true)
      expect(actual).toEqual(expectedResponseBody)
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
        .reply(500, expectedResponseBody)

      // When
      try {
        await educationAndWorkPlanClient.createActionPlan(prisonNumber, createActionPlanRequest, systemToken)
      } catch (e) {
        // Then
        expect(nock.isDone()).toBe(true)
        expect(e.status).toEqual(500)
        expect(e.data).toEqual(expectedResponseBody)
      }
    })
  })

  describe('getSessionSummary', () => {
    it('should get Session Summary', async () => {
      // Given
      const expectedSessionSummaryResponse = aValidSessionSummaryResponse()
      educationAndWorkPlanApi.get(`/session/${prisonId}/summary`).reply(200, expectedSessionSummaryResponse)

      // When
      const actual = await educationAndWorkPlanClient.getSessionSummary(prisonId, systemToken)

      // Then
      expect(nock.isDone()).toBe(true)
      expect(actual).toEqual(expectedSessionSummaryResponse)
    })

    it('should not get Session Summary given API returns error response', async () => {
      // Given
      const expectedResponseBody = {
        status: 500,
        userMessage: 'An unexpected error occurred',
        developerMessage: 'An unexpected error occurred',
      }
      educationAndWorkPlanApi.get(`/session/${prisonId}/summary`).thrice().reply(500, expectedResponseBody)

      // When
      try {
        await educationAndWorkPlanClient.getSessionSummary(prisonId, systemToken)
      } catch (e) {
        // Then
        expect(nock.isDone()).toBe(true)
        expect(e.status).toEqual(500)
        expect(e.data).toEqual(expectedResponseBody)
      }
    })

    it('should not get Session Summary given API returns 404 response', async () => {
      // Given
      const apiErrorResponseBody = {
        status: 404,
        userMessage: 'Some error',
        developerMessage: 'Some error',
      }
      educationAndWorkPlanApi.get(`/session/${prisonId}/summary`).reply(404, apiErrorResponseBody)

      // When
      const actual = await educationAndWorkPlanClient.getSessionSummary(prisonId, systemToken)

      // Then
      expect(nock.isDone()).toBe(true)
      expect(actual).toBeNull()
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
          .reply(200, expectedSessionResponses)

        // When
        const actual = await educationAndWorkPlanClient.getSessions(prisonNumbers, systemToken, status)

        // Then
        expect(nock.isDone()).toBe(true)
        expect(actual).toEqual(expectedSessionResponses)
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
        .reply(200, expectedSessionResponses)

      // When
      const actual = await educationAndWorkPlanClient.getSessions(prisonNumbers, systemToken, SessionStatusValue.DUE)

      // Then
      expect(nock.isDone()).toBe(true)
      expect(actual).toEqual(expectedSessionResponses)
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
        .reply(500, expectedResponseBody)

      try {
        await educationAndWorkPlanClient.getSessions(prisonNumbers, systemToken, SessionStatusValue.DUE)
      } catch (e) {
        // Then
        expect(nock.isDone()).toBe(true)
        expect(e.status).toEqual(500)
        expect(e.data).toEqual(expectedResponseBody)
      }
    })
  })
})
