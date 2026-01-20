import { addDays, format, startOfToday } from 'date-fns'
import { randomUUID } from 'crypto'
import type { PrisonerSearchSummary } from 'viewModels'
import { SuperAgentRequest } from 'superagent'
import { stubFor } from '../wiremock'
import actionPlans from '../../mockData/actionPlanByPrisonNumberData'

const createActionPlan = (): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'POST',
      urlPattern: '/action-plans/.*',
    },
    response: {
      status: 201,
    },
  })

const getActionPlan = (prisonNumber = 'G6115VJ'): SuperAgentRequest => stubFor(actionPlans[prisonNumber])

const getActionPlan404Error = (prisonNumber = 'G6115VJ'): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/action-plans/${prisonNumber}`,
    },
    response: {
      status: 404,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        status: 404,
        errorCode: null,
        userMessage: `Unable to find ActionPlan for prisoner [${prisonNumber}]`,
        developerMessage: `Unable to find ActionPlan for prisoner [${prisonNumber}]`,
        moreInfo: null,
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

export default {
  createActionPlan,
  getActionPlan,
  getActionPlan404Error,
  getActionPlan500Error,

  stubActionPlansList,
  stubActionPlansListFromPrisonerSearchSummaries,
  stubActionPlansList500error,
}

/**
 * Returns a random date sometime between 30 days and 365 days years after today; or undefined.
 * Approximately 5% will return undefined, meaning the action plan has no review date.
 */
const randomReviewDate = (): string | undefined =>
  randomNumber(1, 100) > 5 ? format(addDays(startOfToday(), randomNumber(30, 5475)), 'yyyy-MM-dd') : undefined

const randomNumber = (min: number, max: number): number => Math.floor(Math.random() * (max - min) + min)
