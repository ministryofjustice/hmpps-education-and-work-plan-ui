/* global Microsoft */
window.applicationInsights = (function () {
  let appInsights

  return {
    init: (connectionString, applicationInsightsRoleName, authenticatedUser) => {
      if (!appInsights && connectionString) {
        const clickPluginInstance = new Microsoft.ApplicationInsights.ClickAnalyticsPlugin()
        const clickPluginConfig = {
          autoCapture: true,
          dataTags: {
            useDefaultContentNameOrId: true,
          },
        }

        appInsights = new Microsoft.ApplicationInsights.ApplicationInsights({
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
          envelope.tags['ai.cloud.role'] = applicationInsightsRoleName
        })
        appInsights.setAuthenticatedUserContext(authenticatedUser)
        appInsights.loadAppInsights()
        appInsights.trackPageView()
      }
    },
  }
})()
