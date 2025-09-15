// Wiremock Stubs for Curious V2 API, Learner Assessments endpoints

import { SuperAgentRequest } from 'superagent'
import { stubFor } from '../wiremock'

const stubLearnerAssessments = (prisonNumber = 'G6115VJ'): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/learnerAssessments/v2/${prisonNumber}`,
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        v1: [
          {
            prn: prisonNumber,
            ldd: [
              {
                establishmentId: 'MDI',
                establishmentName: 'MOORLAND (HMP & YOI)',
                rapidAssessmentDate: '2022-02-18',
                inDepthAssessmentDate: null,
                lddPrimaryName: 'Visual impairment',
                lddSecondaryNames: [
                  'Hearing impairment',
                  'Mental health difficulty',
                  'Social and emotional difficulties',
                ],
              },
            ],
            qualifications: [
              {
                establishmentId: 'MDI',
                establishmentName: 'MOORLAND (HMP & YOI)',
                qualification: {
                  qualificationType: 'Maths',
                  qualificationGrade: 'Entry Level 1',
                  assessmentDate: '2021-07-01',
                },
              },
              {
                establishmentId: 'MDI',
                establishmentName: 'MOORLAND (HMP & YOI)',
                qualification: {
                  qualificationType: 'Digital Literacy',
                  qualificationGrade: 'Entry Level 3',
                  assessmentDate: '2021-07-01',
                },
              },
            ],
          },
        ],
        v2: {
          prn: prisonNumber,
          assessments: [],
        },
      },
    },
  })

const stubLearnerAssessments500Error = (prisonNumber = 'G6115VJ'): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/learnerAssessments/v2/${prisonNumber}`,
    },
    response: {
      status: 500,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        errorCode: 'VC5001',
        errorMessage: 'Unexpected error',
        httpStatusCode: 500,
      },
    },
  })

const stubLearnerAssessments404Error = (prisonNumber = 'G6115VJ'): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/learnerAssessments/v2/${prisonNumber}`,
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

const stubLearnerAssessmentsConnectionTimeoutError = (prisonNumber = 'G6115VJ'): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/learnerAssessments/v2/${prisonNumber}`,
    },
    response: {
      status: 503,
      fixedDelayMilliseconds: 6000, // response will take 6 seconds, which is longer than the configured timeout for the API in `config.ts`
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    },
  })

export default {
  stubLearnerAssessments,
  stubLearnerAssessments500Error,
  stubLearnerAssessments404Error,
  stubLearnerAssessmentsConnectionTimeoutError,
}
