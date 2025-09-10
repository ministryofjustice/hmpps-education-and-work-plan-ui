// Wiremock Stubs for Curious V1 API, Learner Profile endpoints

import { SuperAgentRequest } from 'superagent'
import { stubFor } from '../wiremock'

const stubLearnerProfile = (prisonNumber = 'G6115VJ'): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/learnerProfile/${prisonNumber}`,
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: [
        {
          prn: prisonNumber,
          establishmentId: 'MDI',
          establishmentName: 'MOORLAND (HMP & YOI)',
          uln: '3627609222',
          lddHealthProblem: 'No information provided by the learner.',
          priorAttainment: null,
          qualifications: [
            {
              qualificationType: 'Maths',
              qualificationGrade: 'Entry Level 1',
              assessmentDate: '2021-07-01',
            },
            {
              qualificationType: 'Digital Literacy',
              qualificationGrade: 'Entry Level 3',
              assessmentDate: '2021-07-01',
            },
          ],
          languageStatus: null,
          plannedHours: null,
          rapidAssessmentDate: '2022-02-18',
          inDepthAssessmentDate: null,
          primaryLDDAndHealthProblem: 'Visual impairment',
          additionalLDDAndHealthProblems: [
            'Hearing impairment',
            'Mental health difficulty',
            'Social and emotional difficulties',
          ],
        },
      ],
    },
  })

const stubLearnerProfile401Error = (prisonNumber = 'G6115VJ'): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/learnerProfile/${prisonNumber}`,
    },
    response: {
      status: 401,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        errorCode: 'VC4001',
        errorMessage: 'Invalid token',
        httpStatusCode: 401,
      },
    },
  })

const stubLearnerProfile404Error = (prisonNumber = 'G6115VJ'): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/learnerProfile/${prisonNumber}`,
    },
    response: {
      status: 404,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        errorCode: 'VC4004',
        errorMessage: 'Resource not found',
        httpStatusCode: 404,
      },
    },
  })

const stubLearnerProfileConnectionTimeoutError = (prisonNumber = 'G6115VJ'): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/learnerProfile/${prisonNumber}`,
    },
    response: {
      status: 503,
      fixedDelayMilliseconds: 6000, // response will take 6 seconds, which is longer than the configured timeout for the API in `config.ts`
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    },
  })

export default {
  stubLearnerProfile,
  stubLearnerProfile401Error,
  stubLearnerProfile404Error,
  stubLearnerProfileConnectionTimeoutError,
}
