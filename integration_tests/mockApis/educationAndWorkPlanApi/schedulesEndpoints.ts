import { format } from 'date-fns'
import { SuperAgentRequest } from 'superagent'
import { stubFor } from '../wiremock'
import InductionScheduleStatusValue from '../../../server/enums/inductionScheduleStatusValue'

const stubUpdateActionPlanReviewScheduleStatus = (): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'PUT',
      urlPattern: '/action-plans/.*/reviews/schedule-status',
    },
    response: {
      status: 204,
    },
  })

const stubUpdateActionPlanReviewScheduleStatus500Error = (): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'PUT',
      urlPattern: '/action-plans/.*/reviews/schedule-status',
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

const stubGetInductionSchedule = (options?: {
  prisonNumber?: string
  deadlineDate?: Date
  scheduleStatus?: InductionScheduleStatusValue
}): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/inductions/${options?.prisonNumber || 'G6115VJ'}/induction-schedule`,
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        reference: '814ade0a-a3b2-46a3-862f-79211ba13f7b',
        prisonNumber: options?.prisonNumber || 'G6115VJ',
        deadlineDate: options?.deadlineDate ? format(options.deadlineDate, 'yyyy-MM-dd') : '2025-02-20',
        scheduleCalculationRule: 'NEW_PRISON_ADMISSION',
        scheduleStatus: options?.scheduleStatus || 'COMPLETED',
        inductionPerformedBy: undefined,
        inductionPerformedAt: undefined,
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
  })

const stubGetInductionSchedule404Error = (prisonNumber = 'G6115VJ'): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/inductions/${prisonNumber}/induction-schedule`,
    },
    response: {
      status: 404,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        status: 404,
        errorCode: null,
        userMessage: `Induction Schedule not found for prisoner ${prisonNumber}`,
        developerMessage: `Induction Schedule not found for prisoner ${prisonNumber}`,
        moreInfo: null,
      },
    },
  })

const stubGetInductionSchedule500Error = (prisonNumber = 'G6115VJ'): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/inductions/${prisonNumber}/induction-schedule`,
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

const stubUpdateInductionScheduleStatus = (): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'PUT',
      urlPattern: '/inductions/.*/induction-schedule',
    },
    response: {
      status: 204,
    },
  })

const stubUpdateInductionScheduleStatus500Error = (): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'PUT',
      urlPattern: '/inductions/.*/induction-schedule',
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
  stubUpdateActionPlanReviewScheduleStatus,
  stubUpdateActionPlanReviewScheduleStatus500Error,

  stubGetInductionSchedule,
  stubGetInductionSchedule404Error,
  stubGetInductionSchedule500Error,
  stubUpdateInductionScheduleStatus,
  stubUpdateInductionScheduleStatus500Error,
}
