import request from 'supertest'
import { appWithAllRoutes } from './testutils/appSetup'
import config from '../config'

afterEach(() => {
  config.featureToggles.stubPrisonerListPageEnabled = false
  config.ciagInductionUrl = 'http://localhost:3000'
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
    config.ciagInductionUrl = 'https://ciag-induction-dev.hmpps.service.justice.gov.uk'
    const app = appWithAllRoutes({})

    return request(app)
      .get('/')
      .expect(res => {
        expect(res.status).toEqual(302)
        expect(res.headers.location).toEqual('https://ciag-induction-dev.hmpps.service.justice.gov.uk')
      })
  })
})
