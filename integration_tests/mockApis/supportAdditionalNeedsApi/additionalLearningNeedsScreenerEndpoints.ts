import { SuperAgentRequest } from 'superagent'
import type { ALNScreenerResponse } from 'supportAdditionalNeedsApiClient'
import { stubFor } from '../wiremock'

const stubGetAlnScreeners = (
  options: { prisonNumber: string; screeners?: Array<ALNScreenerResponse> } = { prisonNumber: 'G6115VJ' },
): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/support-additional-needs-api/profile/${options.prisonNumber}/aln-screener`,
    },
    response: {
      status: 201,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        screeners: options.screeners ?? [
          {
            screenerDate: '2023-06-19',
            strengths: [
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
                symptoms: null,
                howIdentified: null,
                strengthType: {
                  code: 'NUMERACY_SKILLS_DEFAULT',
                  description: 'Numeracy Skills',
                  categoryCode: 'NUMERACY_SKILLS',
                  categoryDescription: 'Numeracy Skills',
                  areaCode: 'COGNITION_LEARNING',
                  areaDescription: 'Cognition & Learning',
                  listSequence: 0,
                  active: true,
                },
                fromALNScreener: true,
                active: true,
              },
            ],
            challenges: [
              {
                reference: 'c260e2b7-a845-4440-96bf-f42e87b4cb59',
                createdBy: 'asmith_gen',
                createdByDisplayName: 'Alex Smith',
                createdAt: '2023-06-19T09:39:44Z',
                createdAtPrison: 'MDI',
                updatedBy: 'asmith_gen',
                updatedByDisplayName: 'Alex Smith',
                updatedAt: '2023-06-19T09:39:44Z',
                updatedAtPrison: 'MDI',
                symptoms: null,
                howIdentified: null,
                challengeType: {
                  code: 'LITERACY_SKILLS_DEFAULT',
                  description: 'Literacy Skills',
                  categoryCode: 'LITERACY_SKILLS',
                  categoryDescription: 'Literacy Skills',
                  areaCode: 'COGNITION_LEARNING',
                  areaDescription: 'Cognition & Learning',
                  listSequence: 0,
                  active: true,
                },
                fromALNScreener: true,
                active: true,
              },
            ],
            reference: '107feab2-8fe5-458c-9114-0312e65f5ef7',
            createdBy: 'asmith_gen',
            createdByDisplayName: 'Alex Smith',
            createdAt: '2023-06-19T09:39:44Z',
            createdAtPrison: 'MDI',
            updatedBy: 'asmith_gen',
            updatedByDisplayName: 'Alex Smith',
            updatedAt: '2023-06-19T09:39:44Z',
            updatedAtPrison: 'MDI',
          },
        ],
      },
    },
  })

const stubGetAlnScreeners404Error = (prisonNumber = 'G6115VJ'): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/support-additional-needs-api/profile/${prisonNumber}/aln-screener`,
    },
    response: {
      status: 404,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        status: 404,
        developerMessage: `ALN Screeners for ${prisonNumber} not found`,
      },
    },
  })

const stubGetAlnScreeners500Error = (prisonNumber = 'G6115VJ'): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/support-additional-needs-api/profile/${prisonNumber}/aln-screener`,
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
  stubGetAlnScreeners,
  stubGetAlnScreeners404Error,
  stubGetAlnScreeners500Error,
}
