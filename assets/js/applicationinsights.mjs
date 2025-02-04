import { ApplicationInsights } from '@microsoft/applicationinsights-web'
import { ClickAnalyticsPlugin } from '@microsoft/applicationinsights-clickanalytics-js'

const applicationInsights = (() => {
  let appInsights

  return {
    init: (connectionString, applicationInsightsRoleName, authenticatedUser) => {
      if (!appInsights && connectionString) {
        const clickPluginInstance = new ClickAnalyticsPlugin()
        const clickPluginConfig = {
          autoCapture: true,
          callback: {
            contentName: element => {
              // If there is an id, use this as the content name, else return 'Unknown'
              return element.dataset.id ? element.dataset.id : 'Unknown'
            },
          },
          dataTags: {
            useDefaultContentNameOrId: true,
          },
        }

        appInsights = new ApplicationInsights({
          config: {
            connectionString,
            autoTrackPageVisitTime: true,
            extensions: [clickPluginInstance],
            extensionConfig: {
              [clickPluginInstance.identifier]: clickPluginConfig,
            },
          },
        })
        appInsights.addTelemetryInitializer(envelope => {
          // eslint-disable-next-line no-param-reassign
          envelope.tags['ai.cloud.role'] = applicationInsightsRoleName
        })
        appInsights.setAuthenticatedUserContext(authenticatedUser)
        appInsights.loadAppInsights()
        appInsights.trackPageView()
      }
    },
  }
})()

export default applicationInsights
