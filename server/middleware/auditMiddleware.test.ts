import type { Express } from 'express'
import request from 'supertest'
import { v4 as uuidV4 } from 'uuid'
import { appWithAllRoutes } from '../routes/testutils/appSetup'
import AuditService, { Page } from '../services/auditService'
import PrisonerListService from '../services/prisonerListService'
import PrisonerService from '../services/prisonerService'
import PrisonService from '../services/prisonService'
import JourneyDataService from '../services/journeyDataService'
import aValidPrisoner from '../testsupport/prisonerTestDataBuilder'

jest.mock('../services/auditService')
jest.mock('../services/prisonerService')
jest.mock('../services/prisonerListService')
jest.mock('../services/prisonService')
jest.mock('../services/journeyDataService')

let app: Express
const auditService = new AuditService(null) as jest.Mocked<AuditService>
const prisonerService = new PrisonerService(null, null) as jest.Mocked<PrisonerService>
const prisonerListService = new PrisonerListService(null, null, null) as jest.Mocked<PrisonerListService>
const prisonService = new PrisonService(null, null) as jest.Mocked<PrisonService>
const journeyDataService = new JourneyDataService(null) as jest.Mocked<JourneyDataService>

beforeEach(() => {
  app = appWithAllRoutes({
    services: {
      auditService,
      prisonerService,
      prisonerListService,
      prisonService,
      journeyDataService,
    },
  })

  jest.resetAllMocks()

  prisonService.getAllPrisonNamesById.mockResolvedValue({ BXI: 'Brixton (HMP)' })
})

describe('auditMiddleware', () => {
  it('should raise page view audit events', async () => {
    // Given
    prisonerListService.getPrisonerSearchSummariesForPrisonId.mockResolvedValue([])

    // When
    const response = await request(app).get('/search')

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
    const response = await request(app).get('/search')

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
    const response = await request(app).get('/search')

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
    const response = await request(app).get('/search').query({ searchTerm: 'search term', statusFilter: 'NEEDS_PLAN' })

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
    const journeyId = uuidV4()
    const prisonNumber = 'A1234AA'
    prisonerService.getPrisonerByPrisonNumber.mockResolvedValue(aValidPrisoner({ prisonNumber }))

    // When
    const response = await request(app).get(`/plan/${prisonNumber}/goals/${journeyId}/create`)

    // Then
    expect(response.statusCode).toBe(200)
    expect(auditService.logPageViewAttempt).toHaveBeenCalledWith(Page.CREATE_GOALS, {
      who: 'user1',
      subjectType: 'PRISONER_ID',
      subjectId: prisonNumber,
      correlationId: expect.any(String),
      details: {
        params: {
          prisonNumber,
          journeyId,
        },
        query: {},
      },
    })
    expect(auditService.logPageView).toHaveBeenCalledWith(Page.CREATE_GOALS, {
      who: 'user1',
      subjectType: 'PRISONER_ID',
      subjectId: prisonNumber,
      correlationId: expect.any(String),
      details: {
        params: {
          prisonNumber,
          journeyId,
        },
        query: {},
      },
    })
  })
})
