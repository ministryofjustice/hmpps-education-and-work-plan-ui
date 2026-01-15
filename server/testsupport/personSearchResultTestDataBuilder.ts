import type { PersonResponse, PersonSearchResult } from 'educationAndWorkPlanApiClient'
import aPersonResponse from './personResponseTestDataBuilder'

const aPersonSearchResult = (
  options: {
    totalElements?: number
    totalPages?: number
    page?: number
    last?: boolean
    first?: boolean
    pageSize?: number
    people?: Array<PersonResponse>
  } = {
    totalElements: 1,
    totalPages: 1,
    page: 1,
    last: true,
    first: true,
    pageSize: 50,
    people: [aPersonResponse()],
  },
): PersonSearchResult => ({
  pagination: {
    totalElements: options.totalElements,
    totalPages: options.totalPages,
    page: options.page,
    last: options.last,
    first: options.first,
    pageSize: options.pageSize,
  },
  people: options.people,
})

export default aPersonSearchResult
