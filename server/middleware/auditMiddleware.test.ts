import type { Express } from 'express'
import request from 'supertest'
import { appWithAllRoutes } from '../routes/testutils/appSetup'
import AuditService, { Page } from '../services/auditService'
import PrisonerListService from '../services/prisonerListService'
import PrisonerSearchService from '../services/prisonerSearchService'
import aValidPrisoner from '../testsupport/prisonerTestDataBuilder'

jest.mock('../services/auditService')
jest.mock('../services/prisonerSearchService')
jest.mock('../services/prisonerListService')

let app: Express
const auditService = new AuditService(null) as jest.Mocked<AuditService>
const prisonerSearchService = new PrisonerSearchService(null, null) as jest.Mocked<PrisonerSearchService>
const prisonerListService = new PrisonerListService(null, null, null, null) as jest.Mocked<PrisonerListService>

beforeEach(() => {
  app = appWithAllRoutes({
    services: {
      auditService,
      prisonerSearchService,
      prisonerListService,
    },
  })

  jest.resetAllMocks()
})

describe('auditMiddleware', () => {
  it('should raise page view audit events', async () => {
    // Given
    prisonerListService.getPrisonerSearchSummariesForPrisonId.mockResolvedValue([])

    // When
    const response = await request(app).get('/')

    // Then
    expect(response.statusCode).toBe(200)
    expect(auditService.logPageViewAttempt).toHaveBeenCalledWith(Page.PRISONER_LIST, {
      who: 'user1',
      correlationId: expect.any(String),
      details: {
        params: {},
        query: {},
      },
    })
    expect(auditService.logPageView).toHaveBeenCalledWith(Page.PRISONER_LIST, {
      who: 'user1',
      correlationId: expect.any(String),
      details: {
        params: {},
        query: {},
      },
    })
  })

  it('should raise just the page view audit attempt event if request not successful', async () => {
    // Given
    prisonerListService.getPrisonerSearchSummariesForPrisonId.mockRejectedValue(null)

    // When
    const response = await request(app).get('/')

    // Then
    expect(response.statusCode).toBe(500)
    expect(auditService.logPageViewAttempt).toHaveBeenCalledWith(Page.PRISONER_LIST, {
      who: 'user1',
      correlationId: expect.any(String),
      details: {
        params: {},
        query: {},
      },
    })
    expect(auditService.logPageView).not.toHaveBeenCalledWith(Page.PRISONER_LIST, {
      who: 'user1',
      correlationId: expect.any(String),
      details: {
        params: {},
        query: {},
      },
    })
  })

  it('should raise a page view audit event for the error page when a request is not successful', async () => {
    // Given
    prisonerListService.getPrisonerSearchSummariesForPrisonId.mockRejectedValue(null)

    // When
    const response = await request(app).get('/')

    // Then
    expect(response.statusCode).toBe(500)
    expect(auditService.logPageView).toHaveBeenCalledWith(Page.ERROR, {
      who: 'user1',
      correlationId: expect.any(String),
      details: {
        params: {},
        query: {},
      },
    })
  })

  it('should raise a page view audit event for the not found page when a route is not found', async () => {
    // Given
    prisonerListService.getPrisonerSearchSummariesForPrisonId.mockRejectedValue(null)

    // When
    const response = await request(app).get('/unknown')

    // Then
    expect(response.statusCode).toBe(404)
    expect(auditService.logPageView).toHaveBeenCalledWith(Page.NOT_FOUND, {
      who: 'user1',
      correlationId: expect.any(String),
      details: {
        params: {},
        query: {},
      },
    })
  })

  it('should raise page view audit events with query parameters', async () => {
    // Given
    prisonerListService.getPrisonerSearchSummariesForPrisonId.mockResolvedValue([])

    // When
    const response = await request(app).get('/').query({ searchTerm: 'search term', statusFilter: 'NEEDS_PLAN' })

    // Then
    expect(response.statusCode).toBe(200)
    expect(auditService.logPageViewAttempt).toHaveBeenCalledWith(Page.PRISONER_LIST, {
      who: 'user1',
      correlationId: expect.any(String),
      details: {
        params: {},
        query: {
          searchTerm: 'search term',
          statusFilter: 'NEEDS_PLAN',
        },
      },
    })
    expect(auditService.logPageView).toHaveBeenCalledWith(Page.PRISONER_LIST, {
      who: 'user1',
      correlationId: expect.any(String),
      details: {
        params: {},
        query: {
          searchTerm: 'search term',
          statusFilter: 'NEEDS_PLAN',
        },
      },
    })
  })

  it('should raise page view audit events with the user subject and path params', async () => {
    // Given
    const prisonNumber = 'A1234AA'
    const goalIndex = '1'
    prisonerSearchService.getPrisonerByPrisonNumber.mockResolvedValue(aValidPrisoner({ prisonNumber }))

    // When
    const response = await request(app).get(`/plan/${prisonNumber}/goals/${goalIndex}/create`)

    // Then
    expect(response.statusCode).toBe(200)
    expect(auditService.logPageViewAttempt).toHaveBeenCalledWith(Page.CREATE_GOAL, {
      who: 'user1',
      subjectType: 'PRISONER_ID',
      subjectId: prisonNumber,
      correlationId: expect.any(String),
      details: {
        params: {
          prisonNumber,
          goalIndex,
        },
        query: {},
      },
    })
    expect(auditService.logPageView).toHaveBeenCalledWith(Page.CREATE_GOAL, {
      who: 'user1',
      subjectType: 'PRISONER_ID',
      subjectId: prisonNumber,
      correlationId: expect.any(String),
      details: {
        params: {
          prisonNumber,
          goalIndex,
        },
        query: {},
      },
    })
  })
})
