import type { PrisonerSearchSummary } from 'viewModels'
import moment from 'moment'
import { randomUUID } from 'crypto'
import { SuperAgentRequest } from 'superagent'
import { getMatchingRequests, stubFor } from './wiremock'
import actionPlans from '../mockData/actionPlanByPrisonNumberData'
import timelinesKeyedByPrisonNumber from '../mockData/timelineData'

const createGoals = (): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'POST',
      urlPattern: '/action-plans/.*/goals',
    },
    response: {
      status: 201,
    },
  })

const getActionPlan = (id = 'G6115VJ'): SuperAgentRequest => stubFor(actionPlans[id])

const updateGoal = (
  prisonNumber = 'G6115VJ',
  goalReference = '10efc562-be8f-4675-9283-9ede0c19dade',
): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'PUT',
      urlPattern: `/action-plans/${prisonNumber}/goals/${goalReference}`,
    },
    response: {
      status: 204,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    },
  })

const updateGoal500Error = (
  prisonNumber = 'G6115VJ',
  goalReference = '10efc562-be8f-4675-9283-9ede0c19dade',
): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'PUT',
      urlPattern: `/action-plans/${prisonNumber}/goals/${goalReference}`,
    },
    response: {
      status: 500,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        status: 500,
        errorCode: null,
        userMessage: 'An unexpected error occurred',
        developerMessage: 'An unexpected error occurred',
        moreInfo: null,
      },
    },
  })

const getUpdateGoalRequestBody = (
  prisonNumber = 'G6115VJ',
  goalReference = '10efc562-be8f-4675-9283-9ede0c19dade',
): Promise<UpdateGoalRequest> =>
  getMatchingRequests({
    method: 'PUT',
    urlPattern: `/action-plans/${prisonNumber}/goals/${goalReference}`,
  }).then(data => {
    const { requests } = JSON.parse(data.text)
    return JSON.parse(requests[0].body)
  })

const getActionPlanForPrisonerWithNoGoals = (prisonNumber = 'G6115VJ'): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/action-plans/${prisonNumber}`,
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        prisonerNumber: `${prisonNumber}`,
        goals: [],
      },
    },
  })

const getActionPlan500Error = (prisonNumber = 'G6115VJ'): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/action-plans/${prisonNumber}`,
    },
    response: {
      status: 500,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        status: 500,
        errorCode: null,
        userMessage: 'An unexpected error occurred',
        developerMessage: 'An unexpected error occurred',
        moreInfo: null,
      },
    },
  })

const stubActionPlansList = (): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'POST',
      urlPattern: '/action-plans',
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        actionPlanSummaries: [
          {
            reference: '814ade0a-a3b2-46a3-862f-79211ba13f7b',
            prisonNumber: 'A1234BC',
            reviewDate: '2024-12-19',
          },
        ],
      },
    },
  })

const stubActionPlansListFromPrisonerSearchSummaries = (
  prisonerSearchSummaries: Array<PrisonerSearchSummary>,
): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'POST',
      urlPattern: '/action-plans',
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        actionPlanSummaries: prisonerSearchSummaries
          .filter(prisonerSearchSummary => prisonerSearchSummary.hasCiagInduction)
          .map(prisonerSearchSummary => {
            return {
              reference: randomUUID(),
              prisonNumber: prisonerSearchSummary.prisonNumber,
              reviewDate: randomReviewDate(),
            }
          }),
      },
    },
  })

const stubActionPlansList500error = (): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'POST',
      urlPattern: `/action-plans`,
    },
    response: {
      status: 500,
      body: 'Unexpected error',
    },
  })

const stubGetTimeline = (prisonNumber = 'G6115VJ'): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/timelines/${prisonNumber}`,
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: timelinesKeyedByPrisonNumber[prisonNumber],
    },
  })

const stubGetTimeline404Error = (prisonNumber = 'G6115VJ'): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/timelines/${prisonNumber}`,
    },
    response: {
      status: 404,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        status: 404,
        errorCode: null,
        userMessage: `Timeline not found for prisoner ${prisonNumber}`,
        developerMessage: `Timeline not found for prisoner ${prisonNumber}`,
        moreInfo: null,
      },
    },
  })

const stubGetTimeline500Error = (prisonNumber = 'G6115VJ'): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/timelines/${prisonNumber}`,
    },
    response: {
      status: 500,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        status: 500,
        errorCode: null,
        userMessage: 'An unexpected error occurred',
        developerMessage: 'An unexpected error occurred',
        moreInfo: null,
      },
    },
  })

export default {
  createGoals,
  getActionPlan,
  updateGoal,
  updateGoal500Error,
  getUpdateGoalRequestBody,
  getActionPlanForPrisonerWithNoGoals,
  getActionPlan500Error,
  stubActionPlansList,
  stubActionPlansListFromPrisonerSearchSummaries,
  stubActionPlansList500error,

  stubGetTimeline,
  stubGetTimeline404Error,
  stubGetTimeline500Error,
}

export interface UpdateGoalRequest {
  goalReference: string
  title: string
  status: string
  steps: [
    {
      stepReference?: string
      title: string
      status: string
      sequenceNumber: number
    },
  ]
  targetCompletionDate?: string
  notes?: string
}

/**
 * Returns a random date sometime between 30 days and 365 days years after today; or undefined.
 * Approximately 5% will return undefined, meaning the action plan has no review date.
 */
const randomReviewDate = (): string | undefined =>
  randomNumber(1, 100) > 5 ? moment().add(randomNumber(30, 5475), 'days').format('YYYY-MM-DD') : undefined

const randomNumber = (min: number, max: number): number => Math.floor(Math.random() * (max - min) + min)
