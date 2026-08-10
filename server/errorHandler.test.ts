import type { Express } from 'express'
import request from 'supertest'
import { appWithAllRoutes } from './routes/testutils/appSetup'
import PrisonService from './services/prisonService'
import AuditService from './services/auditService'

jest.mock('./services/auditService')
jest.mock('./services/prisonService')

let app: Express
const auditService = new AuditService(null) as jest.Mocked<AuditService>
const prisonService = new PrisonService(null, null) as jest.Mocked<PrisonService>

beforeEach(() => {
  jest.resetAllMocks()

  prisonService.getAllPrisonNamesById.mockResolvedValue({ BXI: 'Brixton (HMP)' })

  app = appWithAllRoutes({ services: { auditService, prisonService } })
})

describe('GET 404', () => {
  it('should render a 404 page with a link to the homepage when page is not found', () => {
    return request(app)
      .get('/unknown')
      .expect(404)
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('Page not found')
        expect(res.text).toContain('href="/"')
      })
  })
})
