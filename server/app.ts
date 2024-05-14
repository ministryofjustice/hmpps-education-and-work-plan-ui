import express from 'express'

import createError from 'http-errors'
import flash from 'connect-flash'

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
import getFrontendComponents from './middleware/fetchFrontendComponentMiddleware'

import config from './config'
import routes from './routes'
import type { Services } from './services'
import auditMiddleware from './middleware/auditMiddleware'
import successMiddleware from './middleware/successMiddleware'

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

  app.locals.environmentName = config.environmentName
  app.locals.environmentNameColour = config.environmentName === 'PRE-PRODUCTION' ? 'govuk-tag--green' : ''

  app.use(flash())
  app.use(successMiddleware)

  nunjucksSetup(app, services.applicationInfo)
  app.use(setUpAuthentication())
  app.use(authorisationMiddleware())
  app.use(setUpCsrf())
  app.use(setUpCurrentUser(services))

  app.get('*', getFrontendComponents(services))

  app.get('/accessibility-statement', async (req, res, next) => {
    res.render('pages/accessibilityStatement/index')
  })

  app.use(auditMiddleware(services))

  app.use(routes(services))

  app.use((req, res, next) => next(createError(404, 'Not found')))
  app.use(errorHandler(process.env.NODE_ENV === 'production'))

  return app
}
