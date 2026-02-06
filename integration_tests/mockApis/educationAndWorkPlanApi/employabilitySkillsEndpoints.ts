import { SuperAgentRequest } from 'superagent'
import type { GetEmployabilitySkillsResponse } from 'educationAndWorkPlanApiClient'
import { stubFor } from '../wiremock'

const stubGetEmployabilitySkills = (options?: {
  prisonNumber?: string
  employabilitySkills?: Array<GetEmployabilitySkillsResponse>
}): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/action-plans/${options?.prisonNumber || 'G6115VJ'}/employability-skills`,
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        employabilitySkills: options?.employabilitySkills || [
          {
            employabilitySkillType: 'ORGANISATION',
            employabilitySkillRating: 'QUITE_CONFIDENT',
            activityName: 'E Wing Servery',
            evidence: 'Supervisor has reported this',
            conversationDate: '2026-01-26',
            createdAt: '2026-01-26T09:39:44.000Z',
            createdAtPrison: 'MDI',
            createdBy: 'asmith_gen',
            createdByDisplayName: 'Alex Smith',
            updatedAt: '2026-01-26T09:39:44.000Z',
            updatedAtPrison: 'MDI',
            updatedBy: 'asmith_gen',
            updatedByDisplayName: 'Alex Smith',
          },
          {
            employabilitySkillType: 'ORGANISATION',
            employabilitySkillRating: 'NOT_CONFIDENT',
            activityName: 'E Wing Servery',
            evidence: 'Prisoners own self assessment',
            conversationDate: '2025-12-01',
            createdAt: '2025-12-01T09:39:44.000Z',
            createdAtPrison: 'MDI',
            createdBy: 'asmith_gen',
            createdByDisplayName: 'Alex Smith',
            updatedAt: '2025-12-01T09:39:44.000Z',
            updatedAtPrison: 'MDI',
            updatedBy: 'asmith_gen',
            updatedByDisplayName: 'Alex Smith',
          },
          {
            employabilitySkillType: 'PROBLEM_SOLVING',
            employabilitySkillRating: 'VERY_CONFIDENT',
            activityName: 'Woodwork AM',
            evidence: 'Prisoner clearly able to solve complex problems',
            createdAt: '2025-02-02T09:39:44.000Z',
            createdAtPrison: 'MDI',
            createdBy: 'asmith_gen',
            createdByDisplayName: 'Alex Smith',
            updatedAt: '2025-02-02T09:39:44.000Z',
            updatedAtPrison: 'MDI',
            updatedBy: 'asmith_gen',
            updatedByDisplayName: 'Alex Smith',
          },
        ],
      },
    },
  })

const stubGetEmployabilitySkills404Error = (prisonNumber = 'G6115VJ'): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/action-plans/${prisonNumber}/employability-skills`,
    },
    response: {
      status: 404,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        status: 404,
        errorCode: null,
        userMessage: `Employability Skills not found for prisoner ${prisonNumber}`,
        developerMessage: `Employability Skills not found for prisoner ${prisonNumber}`,
        moreInfo: null,
      },
    },
  })

const stubGetEmployabilitySkills500Error = (prisonNumber = 'G6115VJ'): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/action-plans/${prisonNumber}/employability-skills`,
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

const stubCreateEmployabilitySkillRatings = (prisonNumber = 'G6115VJ'): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'POST',
      urlPattern: `/action-plans/${prisonNumber}/employability-skills`,
    },
    response: {
      status: 201,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    },
  })

const stubCreateEmployabilitySkillRatings500Error = (prisonNumber = 'G6115VJ'): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'POST',
      urlPattern: `/action-plans/${prisonNumber}/employability-skills`,
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
  stubGetEmployabilitySkills,
  stubGetEmployabilitySkills404Error,
  stubGetEmployabilitySkills500Error,
  stubCreateEmployabilitySkillRatings,
  stubCreateEmployabilitySkillRatings500Error,
}
