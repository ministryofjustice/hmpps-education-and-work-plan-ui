import request from 'supertest'
import { appWithAllRoutes } from './testutils/appSetup'
import config from '../config'

afterEach(() => {
  config.featureToggles.stubPrisonerListPageEnabled = false
})

describe('GET /', () => {
  it('should serve stub prisoner list page given feature toggle is enabled', () => {
    config.featureToggles.stubPrisonerListPageEnabled = true
    const app = appWithAllRoutes({})

    return request(app)
      .get('/')
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.status).toEqual(200)
        expect(res.text).toContain('Manage learning and work progress')
      })
  })

  it('should not serve stub prisoner list page given feature toggle is disabled', () => {
    config.featureToggles.stubPrisonerListPageEnabled = false
    const app = appWithAllRoutes({})

    return request(app)
      .get('/')
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.status).toEqual(404)
      })
  })
})
