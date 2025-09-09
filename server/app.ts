import express from 'express'

import createError from 'http-errors'
import { getFrontendComponents } from '@ministryofjustice/hmpps-connect-dps-components'

import nunjucksSetup from './utils/nunjucksSetup'
import errorHandler from './errorHandler'
import { appInsightsMiddleware } from './utils/azureAppInsights'
import authorisationMiddleware from './middleware/authorisationMiddleware'
import { metricsMiddleware } from './monitoring/metricsApp'

import setUpAuthentication from './middleware/setUpAuthentication'
import setUpCsrf from './middleware/setUpCsrf'
import setUpCurrentUser from './middleware/setUpCurrentUser'
import setUpHealthChecks from './middleware/setUpHealthChecks'
import setUpStaticResources from './middleware/setUpStaticResources'
import setUpWebRequestParsing from './middleware/setupRequestParsing'
import setUpWebSecurity from './middleware/setUpWebSecurity'
import setUpWebSession from './middleware/setUpWebSession'

import config from './config'
import logger from '../logger'
import routes from './routes'
import type { Services } from './services'
import auditMiddleware from './middleware/auditMiddleware'
import successMessageMiddleware from './middleware/successMessageMiddleware'
import errorMessageMiddleware from './middleware/errorMessageMiddleware'
import apiErrorMiddleware from './middleware/apiErrorMiddleware'

export default function createApp(services: Services): express.Application {
  const app = express()

  app.set('json spaces', 2)
  app.set('trust proxy', true)
  app.set('port', process.env.PORT || 3000)

  app.use(appInsightsMiddleware())
  app.use(metricsMiddleware)
  app.use(setUpHealthChecks(services.applicationInfo))
  app.use(setUpWebSecurity())
  app.use(setUpWebSession())
  app.use(setUpWebRequestParsing())
  app.use(setUpStaticResources())

  nunjucksSetup(app, services.applicationInfo)
  app.use(setUpAuthentication())
  app.use(authorisationMiddleware())
  app.use(setUpCsrf())
  app.use(setUpCurrentUser(services))
  app.use(apiErrorMiddleware())
  app.use(successMessageMiddleware)
  app.use(errorMessageMiddleware)

  app.get(
    /(.*)/,
    getFrontendComponents({
      authenticationClient: services.hmppsAuthenticationClient,
      componentApiConfig: config.apis.componentApi,
      dpsUrl: config.newDpsUrl,
      logger,
      requestOptions: { useFallbacksByDefault: true },
    }),
  )

  app.get('/accessibility-statement', async (req, res, next) => {
    res.render('pages/accessibilityStatement/index')
  })

  app.use(auditMiddleware(services))

  app.use(routes(services))

  app.use((req, res, next) => next(createError(404, 'Not found')))
  app.use(errorHandler(services, config.production))

  return app
}
