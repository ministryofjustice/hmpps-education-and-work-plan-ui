import type { AddStepDto, CreateGoalDto } from 'dto'
import nock from 'nock'
import config from '../config'
import EducationAndWorkPlanClient from './educationAndWorkPlanClient'

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
    it('should create goal', async () => {
      // Given
      const prisonNumber = 'A1234BC'
      const systemToken = 'a-system-token'

      const addStepDto = {
        title: 'Book Spanish course',
        targetDateRange: 'ZERO_TO_THREE_MONTHS',
      } as AddStepDto
      const createGoalDto = {
        prisonNumber,
        title: 'Learn Spanish',
        steps: [addStepDto],
        note: 'Prisoner is not good at listening',
      } as CreateGoalDto
      educationAndWorkPlanApi.post(`/action-plans/${prisonNumber}/goals`).reply(200, createGoalDto)

      // When
      await educationAndWorkPlanClient.createGoal(createGoalDto, systemToken)

      // Then
      expect(nock.isDone()).toBe(true)
    })
  })
})
