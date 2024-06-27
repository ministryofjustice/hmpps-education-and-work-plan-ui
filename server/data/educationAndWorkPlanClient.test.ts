import nock from 'nock'
import type { ArchiveGoalRequest } from 'educationAndWorkPlanApiClient'
import config from '../config'
import EducationAndWorkPlanClient from './educationAndWorkPlanClient'
import { aValidActionPlanResponseWithOneGoal } from '../testsupport/actionPlanResponseTestDataBuilder'
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

describe('educationAndWorkPlanClient', () => {
  const educationAndWorkPlanClient = new EducationAndWorkPlanClient()

  config.apis.educationAndWorkPlan.url = 'http://localhost:8200'
  let educationAndWorkPlanApi: nock.Scope

  beforeEach(() => {
    educationAndWorkPlanApi = nock(config.apis.educationAndWorkPlan.url)
  })

  afterEach(() => {
    nock.cleanAll()
  })

  describe('createGoals', () => {
    it('should create Goals', async () => {
      // Given
      const prisonNumber = 'A1234BC'
      const systemToken = 'a-system-token'

      const createGoalsRequest = aValidCreateGoalsRequestWitMultipleGoals(prisonNumber)
      const expectedResponseBody = {}
      educationAndWorkPlanApi
        .post(`/action-plans/${prisonNumber}/goals`, createGoalsRequest)
        .reply(201, expectedResponseBody)

      // When
      const actual = await educationAndWorkPlanClient.createGoals(createGoalsRequest, systemToken)

      // Then
      expect(nock.isDone()).toBe(true)
      expect(actual).toEqual(expectedResponseBody)
    })

    it('should not create Goals given API returns an error response', async () => {
      // Given
      const prisonNumber = 'A1234BC'
      const systemToken = 'a-system-token'

      const createGoalsRequest = aValidCreateGoalsRequestWithOneGoal(prisonNumber)
      const expectedResponseBody = {
        status: 500,
        userMessage: 'An unexpected error occurred',
        developerMessage: 'An unexpected error occurred',
      }
      educationAndWorkPlanApi
        .post(`/action-plans/${prisonNumber}/goals`, createGoalsRequest)
        .reply(500, expectedResponseBody)

      // When
      try {
        await educationAndWorkPlanClient.createGoals(createGoalsRequest, systemToken)
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
      const prisonNumber = 'A1234BC'
      const systemToken = 'a-system-token'

      const expectedActionPlanResponse = aValidActionPlanResponseWithOneGoal()
      educationAndWorkPlanApi.get(`/action-plans/${prisonNumber}`).reply(200, expectedActionPlanResponse)

      // When
      const actual = await educationAndWorkPlanClient.getActionPlan(prisonNumber, systemToken)

      // Then
      expect(nock.isDone()).toBe(true)
      expect(actual).toEqual(expectedActionPlanResponse)
    })

    it('should not get Action Plan given API returns error response', async () => {
      // Given
      const prisonNumber = 'A1234BC'
      const systemToken = 'a-system-token'

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

  describe('updateGoal', () => {
    it('should update Goal', async () => {
      // Given
      const prisonNumber = 'A1234BC'
      const systemToken = 'a-system-token'
      const goalReference = 'c77cd2fb-40e0-4354-982a-5c8017e92b26'

      const updateGoalRequest = aValidUpdateGoalRequestWithOneUpdatedStep(goalReference)
      const expectedResponseBody = {}
      educationAndWorkPlanApi
        .put(`/action-plans/${prisonNumber}/goals/${goalReference}`, updateGoalRequest)
        .reply(204, expectedResponseBody)

      // When
      const actual = await educationAndWorkPlanClient.updateGoal(prisonNumber, updateGoalRequest, systemToken)

      // Then
      expect(nock.isDone()).toBe(true)
      expect(actual).toEqual(expectedResponseBody)
    })

    it('should not update Goal given API returns an error response', async () => {
      // Given
      const prisonNumber = 'A1234BC'
      const systemToken = 'a-system-token'
      const goalReference = 'c77cd2fb-40e0-4354-982a-5c8017e92b26'

      const updateGoalRequest = aValidUpdateGoalRequestWithOneUpdatedStep(goalReference)
      const expectedResponseBody = {
        status: 500,
        userMessage: 'An unexpected error occurred',
        developerMessage: 'An unexpected error occurred',
      }
      educationAndWorkPlanApi
        .put(`/action-plans/${prisonNumber}/goals/${goalReference}`, updateGoalRequest)
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
      const systemToken = 'a-system-token'

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
      educationAndWorkPlanApi.post('/action-plans', { prisonNumbers }).reply(200, expectedActionPlanSummaryListResponse)

      // When
      const actual = await educationAndWorkPlanClient.getActionPlans(prisonNumbers, systemToken)

      // Then
      expect(nock.isDone()).toBe(true)
      expect(actual).toEqual(expectedActionPlanSummaryListResponse)
    })

    it('should get zero Action Plans given none of the specified prisoners have Action Plans', async () => {
      // Given
      const prisonNumbers = ['A1234BC', 'B5544GD']
      const systemToken = 'a-system-token'

      const expectedActionPlanSummaryListResponse = aValidActionPlanSummaryListResponse({
        actionPlanSummaries: [],
      })
      educationAndWorkPlanApi.post('/action-plans', { prisonNumbers }).reply(200, expectedActionPlanSummaryListResponse)

      // When
      const actual = await educationAndWorkPlanClient.getActionPlans(prisonNumbers, systemToken)

      // Then
      expect(nock.isDone()).toBe(true)
      expect(actual).toEqual(expectedActionPlanSummaryListResponse)
    })
  })

  describe('getTimeline', () => {
    it('should get Timeline given no filtering by event type', async () => {
      // Given
      const prisonNumber = 'A1234BC'
      const systemToken = 'a-system-token'

      const expectedTimelineResponse = aValidTimelineResponse()

      educationAndWorkPlanApi.get(`/timelines/${prisonNumber}`).reply(200, expectedTimelineResponse)

      // When
      const actual = await educationAndWorkPlanClient.getTimeline(prisonNumber, systemToken)

      // Then
      expect(nock.isDone()).toBe(true)
      expect(actual).toEqual(expectedTimelineResponse)
    })

    it('should get Timeline filtered by event type', async () => {
      // Given
      const prisonNumber = 'A1234BC'
      const systemToken = 'a-system-token'

      const timelineResponseFromApi = aValidTimelineResponse()
      educationAndWorkPlanApi.get(`/timelines/${prisonNumber}`).reply(200, timelineResponseFromApi)

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

      // When
      const actual = await educationAndWorkPlanClient.getTimeline(prisonNumber, systemToken, ['GOAL_CREATED'])

      // Then
      expect(nock.isDone()).toBe(true)
      expect(actual).toEqual(expectedTimelineResponse)
    })

    it('should not get Timeline given API returns error response', async () => {
      // Given
      const prisonNumber = 'A1234BC'
      const systemToken = 'a-system-token'

      const expectedResponseBody = {
        status: 500,
        userMessage: 'An unexpected error occurred',
        developerMessage: 'An unexpected error occurred',
      }
      educationAndWorkPlanApi.get(`/timelines/${prisonNumber}`).thrice().reply(500, expectedResponseBody)

      // When
      try {
        await educationAndWorkPlanClient.getTimeline(prisonNumber, systemToken)
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
      const prisonNumber = 'A1234BC'
      const systemToken = 'a-system-token'

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
      const prisonNumber = 'A1234BC'
      const systemToken = 'a-system-token'

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
      const prisonNumber = 'A1234BC'
      const systemToken = 'a-system-token'

      const expectedResponseBody = {
        status: 404,
        userMessage: `Induction not found for prisoner [${prisonNumber}]`,
      }
      educationAndWorkPlanApi.get(`/inductions/${prisonNumber}`).reply(404, expectedResponseBody)

      // When
      try {
        await educationAndWorkPlanClient.getInduction(prisonNumber, systemToken)
      } catch (e) {
        // Then
        expect(nock.isDone()).toBe(true)
        expect(e.status).toEqual(404)
        expect(e.data).toEqual(expectedResponseBody)
      }
    })
  })

  describe('updateInduction', () => {
    it('should update Induction', async () => {
      // Given
      const prisonNumber = 'A1234BC'
      const systemToken = 'a-system-token'
      const updateInductionRequest = aValidUpdateInductionRequest()

      educationAndWorkPlanApi //
        .put(`/inductions/${prisonNumber}`, updateInductionRequest)
        .reply(204)

      // When
      await educationAndWorkPlanClient.updateInduction(prisonNumber, updateInductionRequest, systemToken)

      // Then
      expect(nock.isDone()).toBe(true)
    })

    it('should not update Induction given API returns error response', async () => {
      // Given
      const prisonNumber = 'A1234BC'
      const systemToken = 'a-system-token'
      const updateInductionRequest = aValidUpdateInductionRequest()

      const expectedResponseBody = {
        status: 500,
        userMessage: 'An unexpected error occurred',
        developerMessage: 'An unexpected error occurred',
      }
      educationAndWorkPlanApi
        .put(`/inductions/${prisonNumber}`, updateInductionRequest)
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
      const prisonNumber = 'A1234BC'
      const systemToken = 'a-system-token'
      const createInductionRequest = aValidCreateInductionRequest()

      educationAndWorkPlanApi //
        .post(`/inductions/${prisonNumber}`, createInductionRequest)
        .reply(201)

      // When
      await educationAndWorkPlanClient.createInduction(prisonNumber, createInductionRequest, systemToken)

      // Then
      expect(nock.isDone()).toBe(true)
    })

    it('should not create Induction given API returns error response', async () => {
      // Given
      const prisonNumber = 'A1234BC'
      const systemToken = 'a-system-token'
      const createInductionRequest = aValidCreateInductionRequest()

      const expectedResponseBody = {
        status: 500,
        userMessage: 'An unexpected error occurred',
        developerMessage: 'An unexpected error occurred',
      }
      educationAndWorkPlanApi
        .post(`/inductions/${prisonNumber}`, createInductionRequest)
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
  describe('archiveGoal', () => {
    const prisonNumber = 'A1234BC'
    const systemToken = 'a-system-token'
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
        .reply(204, expectedResponseBody)

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
})
