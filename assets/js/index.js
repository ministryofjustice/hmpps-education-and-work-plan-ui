import * as govukFrontend from 'govuk-frontend'
import * as mojFrontend from '@ministryofjustice/frontend'
import initBackLinks from './backLink.mjs'
import initPrintLinks from './print.mjs'
import applicationInsights from './applicationinsights.mjs'

govukFrontend.initAll()
mojFrontend.initAll()
initBackLinks()
initPrintLinks()

window.initApplicationInsights = (connectionString, applicationInsightsRoleName, authenticatedUser) => {
  applicationInsights.init(connectionString, applicationInsightsRoleName, authenticatedUser)
}
