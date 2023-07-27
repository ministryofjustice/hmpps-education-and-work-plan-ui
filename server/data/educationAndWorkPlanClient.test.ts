import nock from 'nock'
import config from '../config'
import EducationAndWorkPlanClient from './educationAndWorkPlanClient'
import { aValidActionPlanResponseWithOneGoal } from '../testsupport/actionPlanResponseTestDataBuilder'
import { aValidCreateGoalRequestWithOneStep } from '../testsupport/createGoalRequestTestDataBuilder'

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

  describe('createGoal', () => {
    it('should create Goal', async () => {
      // Given
      const prisonNumber = 'A1234BC'
      const systemToken = 'a-system-token'
      const createGoalRequest = aValidCreateGoalRequestWithOneStep()
      educationAndWorkPlanApi.post(`/action-plans/${prisonNumber}/goals`).reply(200, createGoalRequest)

      // When
      await educationAndWorkPlanClient.createGoal(createGoalRequest, systemToken)

      // Then
      expect(nock.isDone()).toBe(true)
    })
  })

  describe('getActionPlan', () => {
    it('should get Action Plan', async () => {
      // Given
      const prisonNumber = 'A1234BC'
      const systemToken = 'a-system-token'
      const actionPlanResponse = aValidActionPlanResponseWithOneGoal()
      educationAndWorkPlanApi.get(`/action-plans/${prisonNumber}`).reply(200, actionPlanResponse)

      // When
      const actual = await educationAndWorkPlanClient.getActionPlan(prisonNumber, systemToken)

      // Then
      expect(nock.isDone()).toBe(true)
      expect(actual).toEqual(actionPlanResponse)
    })
  })
})
