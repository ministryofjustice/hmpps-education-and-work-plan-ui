import nock from 'nock'
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
import { aShortQuestionSetInduction } from '../testsupport/inductionResponseTestDataBuilder'

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
      educationAndWorkPlanApi.get(`/action-plans/${prisonNumber}`).reply(500, expectedResponseBody)

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
    it('should get Timeline', async () => {
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

    it('should not get Timeline given API returns error response', async () => {
      // Given
      const prisonNumber = 'A1234BC'
      const systemToken = 'a-system-token'

      const expectedResponseBody = {
        status: 500,
        userMessage: 'An unexpected error occurred',
        developerMessage: 'An unexpected error occurred',
      }
      educationAndWorkPlanApi.get(`/timelines/${prisonNumber}`).reply(500, expectedResponseBody)

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

      const expectedInduction = aShortQuestionSetInduction()
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
      educationAndWorkPlanApi.get(`/inductions/${prisonNumber}`).reply(500, expectedResponseBody)

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
})
