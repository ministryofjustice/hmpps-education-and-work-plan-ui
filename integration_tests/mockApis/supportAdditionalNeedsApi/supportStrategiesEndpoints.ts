import { SuperAgentRequest } from 'superagent'
import type { SupportStrategyResponse } from 'supportAdditionalNeedsApiClient'
import { stubFor } from '../wiremock'

const stubGetSupportStrategies = (
  options: { prisonNumber: string; supportStrategies?: Array<SupportStrategyResponse> } = { prisonNumber: 'G6115VJ' },
): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/support-additional-needs-api/profile/${options.prisonNumber}/support-strategies`,
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        supportStrategies: options.supportStrategies ?? [
          {
            reference: 'c88a6c48-97e2-4c04-93b5-98619966447b',
            createdBy: 'asmith_gen',
            createdByDisplayName: 'Alex Smith',
            createdAt: '2023-06-19T09:39:44Z',
            createdAtPrison: 'MDI',
            updatedBy: 'asmith_gen',
            updatedByDisplayName: 'Alex Smith',
            updatedAt: '2023-06-19T09:39:44Z',
            updatedAtPrison: 'MDI',
            detail: 'The use of flash cards will help with retaining facts',
            supportStrategyType: {
              code: 'MEMORY',
              description: 'Memory',
              categoryCode: 'MEMORY',
              categoryDescription: 'Memory',
              areaCode: 'MEMORY',
              areaDescription: 'Memory',
              listSequence: 1,
              active: true,
            },
            active: true,
          },
        ],
      },
    },
  })

const stubGetSupportStrategies404Error = (prisonNumber = 'G6115VJ'): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/support-additional-needs-api/profile/${prisonNumber}/support-strategies`,
    },
    response: {
      status: 404,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        status: 404,
        developerMessage: `Support Strategies for ${prisonNumber} not found`,
      },
    },
  })

const stubGetSupportStrategies500Error = (prisonNumber = 'G6115VJ'): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/support-additional-needs-api/profile/${prisonNumber}/support-strategies`,
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
  stubGetSupportStrategies,
  stubGetSupportStrategies404Error,
  stubGetSupportStrategies500Error,
}
