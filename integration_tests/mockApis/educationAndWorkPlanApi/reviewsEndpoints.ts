import { SuperAgentRequest } from 'superagent'
import { stubFor } from '../wiremock'

const stubGetActionPlanReviews = (prisonNumber = 'G6115VJ'): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/action-plans/${prisonNumber}/reviews`,
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        completedReviews: [
          {
            reference: '814ade0a-a3b2-46a3-862f-79211ba13f7b',
            deadlineDate: '2024-10-15',
            completedDate: '2024-10-01',
            note: {
              reference: '8092b80e-4d60-418f-983a-da457ff8df40',
              content: 'Review went well and goals on target for completion',
              type: 'REVIEW',
              createdAt: '2023-01-16T09:34:12.453Z',
              createdBy: 'asmith_gen',
              createdByDisplayName: 'Alex Smith',
              createdAtPrisonName: 'BXI',
              updatedAt: '2023-09-23T13:42:01.401Z',
              updatedBy: 'asmith_gen',
              updatedByDisplayName: 'Alex Smith',
              updatedAtPrisonName: 'BXI',
            },
            createdAt: '2023-06-19T09:39:44.000Z',
            createdAtPrison: 'MDI',
            createdBy: 'asmith_gen',
            createdByDisplayName: 'Alex Smith',
          },
        ],
        latestReviewSchedule: {
          reference: '814ade0a-a3b2-46a3-862f-79211ba13f7b',
          reviewDateFrom: '2024-09-15',
          reviewDateTo: '2024-10-15',
          calculationRule: 'BETWEEN_6_AND_12_MONTHS_TO_SERVE',
          status: 'SCHEDULED',
          reviewType: 'REVIEW',
          createdAt: '2023-06-19T09:39:44.000Z',
          createdAtPrison: 'MDI',
          createdBy: 'asmith_gen',
          createdByDisplayName: 'Alex Smith',
          updatedAt: '2023-06-19T09:39:44.000Z',
          updatedAtPrison: 'MDI',
          updatedBy: 'asmith_gen',
          updatedByDisplayName: 'Alex Smith',
        },
      },
    },
  })

const stubGetActionPlanReviews404Error = (prisonNumber = 'G6115VJ'): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/action-plans/${prisonNumber}/reviews`,
    },
    response: {
      status: 404,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        status: 404,
        errorCode: null,
        userMessage: `Review Schedule not found for prisoner ${prisonNumber}`,
        developerMessage: `Review Schedule not found for prisoner ${prisonNumber}`,
        moreInfo: null,
      },
    },
  })

const stubGetActionPlanReviews500Error = (prisonNumber = 'G6115VJ'): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/action-plans/${prisonNumber}/reviews`,
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

const stubCreateActionPlanReview = (): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'POST',
      urlPattern: '/action-plans/.*/reviews',
    },
    response: {
      status: 201,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        wasLastReviewBeforeRelease: false,
        latestReviewSchedule: {
          reference: '449b3d22-9a54-44f8-8883-1dfc0a5f35cb',
          reviewDateFrom: '2025-03-14',
          reviewDateTo: '2025-04-14',
          status: 'SCHEDULED',
          reviewType: 'REVIEW',
          calculationRule: 'BETWEEN_6_AND_12_MONTHS_TO_SERVE',
          createdBy: 'A_USER_GEN',
          createdByDisplayName: 'Alex Smith',
          createdAt: '2023-08-29T11:29:22.8793',
          createdAtPrison: 'MDI',
          updatedBy: 'A_USER_GEN',
          updatedByDisplayName: 'Alex Smith',
          updatedAt: '2023-08-29T10:29:22.457',
          updatedAtPrison: 'MDI',
        },
      },
    },
  })

const stubCreateActionPlanReview500Error = (): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'POST',
      urlPattern: '/action-plans/.*/reviews',
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
  stubGetActionPlanReviews,
  stubGetActionPlanReviews404Error,
  stubGetActionPlanReviews500Error,
  stubCreateActionPlanReview,
  stubCreateActionPlanReview500Error,
}
