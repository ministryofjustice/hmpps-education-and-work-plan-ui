import express from 'express'

import createError from 'http-errors'

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
import successMessageMiddleware from './middleware/successMessageMiddleware'
import errorMessageMiddleware from './middleware/errorMessageMiddleware'
import checkWhetherToShowServiceOnboardingBanner from './middleware/checkWhetherToShowServiceOnboardingBanner'

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
  app.use(checkWhetherToShowServiceOnboardingBanner)
  app.use(successMessageMiddleware)
  app.use(errorMessageMiddleware)

  app.get('*', async (req, res, next) => {
    const {
      user: { activeCaseLoadId },
    } = res.locals
    res.locals.reviewJourneyEnabledForPrison = config.featureToggles.reviewJourneyEnabledForPrison(activeCaseLoadId)
    next()
  })

  app.get('*', getFrontendComponents(services))

  app.get('/accessibility-statement', async (req, res, next) => {
    res.render('pages/accessibilityStatement/index')
  })

  app.use(auditMiddleware(services))

  app.use(routes(services))

  app.use((req, res, next) => next(createError(404, 'Not found')))
  app.use(errorHandler(services, config.production))

  return app
}
