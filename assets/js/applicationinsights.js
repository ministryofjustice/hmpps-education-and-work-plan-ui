/* global Microsoft */
window.applicationInsights = (function () {
  let appInsights

  return {
    init: (connectionString, applicationInsightsRoleName, authenticatedUser) => {
      if (!appInsights && connectionString) {
        const clickPluginInstance = new Microsoft.ApplicationInsights.ClickAnalyticsPlugin()
        const clickPluginConfig = {
          autoCapture: true,
          callback: {
            contentName: function (element) {
              // If there is a id, use this as the content name
              if (element.dataset.id) return element.dataset.id

              // If this element is in the header or footer it could contain
              // personal data so we use a default value instead
              if (!element.closest('main')) return 'Unknown'
            },
          },
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
