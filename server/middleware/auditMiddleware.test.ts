import type { Express } from 'express'
import request from 'supertest'
import { PrisonerBasePermission } from '@ministryofjustice/hmpps-prison-permissions-lib'
import { v4 as uuidV4 } from 'uuid'
import { appWithAllRoutes } from '../routes/testutils/appSetup'
import AuditService, { Page } from '../services/auditService'
import SearchService from '../services/searchService'
import PrisonerService from '../services/prisonerService'
import PrisonService from '../services/prisonService'
import JourneyDataService from '../services/journeyDataService'
import aValidPrisoner from '../testsupport/prisonerTestDataBuilder'
import { mockPrisonerPermissionsGuard } from '../testutils/mockPermissions'

jest.mock('@ministryofjustice/hmpps-prison-permissions-lib')
jest.mock('../services/auditService')
jest.mock('../services/searchService')
jest.mock('../services/prisonerService')
jest.mock('../services/prisonService')
jest.mock('../services/journeyDataService')

let app: Express
const auditService = new AuditService(null) as jest.Mocked<AuditService>
const searchService = new SearchService(null) as jest.Mocked<SearchService>
const prisonerService = new PrisonerService(null, null) as jest.Mocked<PrisonerService>
const prisonService = new PrisonService(null, null) as jest.Mocked<PrisonService>
const journeyDataService = new JourneyDataService(null) as jest.Mocked<JourneyDataService>

beforeEach(() => {
  jest.resetAllMocks()

  prisonService.getAllPrisonNamesById.mockResolvedValue({ BXI: 'Brixton (HMP)' })
  mockPrisonerPermissionsGuard([PrisonerBasePermission.read])

  app = appWithAllRoutes({
    services: {
      auditService,
      searchService,
      prisonerService,
      prisonService,
      journeyDataService,
    },
  })
})

describe('auditMiddleware', () => {
  it('should raise page view audit events', async () => {
    // Given
    searchService.searchPrisonersInPrison.mockResolvedValue(null)

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

  it('should raise page view audit events even when search service returns an error', async () => {
    // Given
    searchService.searchPrisonersInPrison.mockRejectedValue(new Error('Search service unavailable'))

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

  it('should raise a page view audit event for the not found page when a route is not found', async () => {
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
    searchService.searchPrisonersInPrison.mockResolvedValue(null)

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
