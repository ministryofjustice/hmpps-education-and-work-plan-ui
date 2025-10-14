import { SuperAgentRequest } from 'superagent'
import type { ConditionResponse } from 'supportAdditionalNeedsApiClient'
import { stubFor } from '../wiremock'

const stubGetConditions = (
  options: { prisonNumber: string; conditions?: Array<ConditionResponse> } = { prisonNumber: 'G6115VJ' },
): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/support-additional-needs-api/profile/${options.prisonNumber}/conditions`,
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        conditions: options.conditions ?? [
          {
            createdBy: 'asmith_gen',
            createdByDisplayName: 'Alex Smith',
            createdAt: '2023-06-19T09:39:44Z',
            createdAtPrison: 'BXI',
            updatedBy: 'asmith_gen',
            updatedByDisplayName: 'Alex Smith',
            updatedAt: '2023-06-19T09:39:44Z',
            updatedAtPrison: 'BXI',
            reference: 'c88a6c48-97e2-4c04-93b5-98619966447b',
            source: 'SELF_DECLARED',
            conditionType: {
              code: 'ABI',
              description: 'Acquired Brain Injury',
              categoryCode: 'LONG_TERM_MEDICAL_CONDITION',
              categoryDescription: 'Long term Medical Condition',
              areaCode: null,
              areaDescription: null,
              listSequence: 16,
              active: true,
            },
            conditionName: null,
            conditionDetails: 'Discussed with healthcare, occurred 5 years ago',
            active: true,
          },
        ],
      },
    },
  })

const stubGetConditions404Error = (prisonNumber = 'G6115VJ'): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/support-additional-needs-api/profile/${prisonNumber}/conditions`,
    },
    response: {
      status: 404,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        status: 404,
        developerMessage: `Conditions for ${prisonNumber} not found`,
      },
    },
  })

const stubGetConditions500Error = (prisonNumber = 'G6115VJ'): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/support-additional-needs-api/profile/${prisonNumber}/conditions`,
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
  stubGetConditions,
  stubGetConditions404Error,
  stubGetConditions500Error,
}
