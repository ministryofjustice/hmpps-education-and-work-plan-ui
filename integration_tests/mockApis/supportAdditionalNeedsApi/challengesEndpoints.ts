import { SuperAgentRequest } from 'superagent'
import type { ChallengeResponse } from 'supportAdditionalNeedsApiClient'
import { stubFor } from '../wiremock'

const stubGetChallenges = (
  options: { prisonNumber: string; challenges?: Array<ChallengeResponse> } = { prisonNumber: 'G6115VJ' },
): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/support-additional-needs-api/profile/${options.prisonNumber}/challenges`,
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        challenges: options.challenges ?? [
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
            symptoms: 'John is not good at long division',
            howIdentified: ['EDUCATION_SKILLS_WORK'],
            challengeType: {
              code: 'NUMERACY_SKILLS_DEFAULT',
              description: 'Numeracy Skills',
              categoryCode: 'NUMERACY_SKILLS',
              categoryDescription: 'Numeracy Skills',
              areaCode: 'COGNITION_LEARNING',
              areaDescription: 'Cognition & Learning',
              listSequence: 0,
              active: true,
            },
            fromALNScreener: false,
            active: true,
          },
        ],
      },
    },
  })

const stubGetChallenges404Error = (prisonNumber = 'G6115VJ'): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/support-additional-needs-api/profile/${prisonNumber}/challenges`,
    },
    response: {
      status: 404,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        status: 404,
        developerMessage: `Challenges for ${prisonNumber} not found`,
      },
    },
  })

const stubGetChallenges500Error = (prisonNumber = 'G6115VJ'): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/support-additional-needs-api/profile/${prisonNumber}/challenges`,
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
  stubGetChallenges,
  stubGetChallenges404Error,
  stubGetChallenges500Error,
}
