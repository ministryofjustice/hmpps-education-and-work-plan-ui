import * as fs from 'fs'
import path from 'node:path'
import webpackPreprocessor from '@cypress/webpack-batteries-included-preprocessor'
import { defineConfig } from 'cypress'
import { resetStubs } from './integration_tests/mockApis/wiremock'
import auth from './integration_tests/mockApis/auth'
import manageUsersApi from './integration_tests/mockApis/manageUsersApi'
import tokenVerification from './integration_tests/mockApis/tokenVerification'
import prisonerSearchApi from './integration_tests/mockApis/prisonerSearchApi'
import educationAndWorkPlanApi from './integration_tests/mockApis/educationAndWorkPlanApi'
import curiousApi from './integration_tests/mockApis/curiousApi'
import ciagInducationApi from './integration_tests/mockApis/ciagInducationApi'
import prisonerListApi from './integration_tests/mockApis/prisonerListApi'
import prisonRegisterApi from './integration_tests/mockApis/prisonRegisterApi'
import prisonerSearchSummaryMockDataGenerator from './integration_tests/mockData/prisonerSearchSummaryMockDataGenerator'
import sessionResponseMockDataGenerator from './integration_tests/mockData/sessionResponseMockDataGenerator'
import ciagInductionUi from './integration_tests/mockApis/ciagInductionUi'
import supportAdditionalNeedsApi from './integration_tests/mockApis/supportAdditionalNeedsApi'
import learnerRecordsApi from './integration_tests/mockApis/learnerRecordsApi'

function preprocessorOptions() {
  const replacementModulesPath = path.resolve(__dirname, './integration_tests/support/replacementModules')
  const options = webpackPreprocessor.defaultOptions
  options.typescript = require.resolve('typescript')
  options.webpackOptions.resolve.alias = {
    bunyan: path.join(replacementModulesPath, 'bunyan.ts'),
    'bunyan-format': path.join(replacementModulesPath, 'bunyan-format.ts'),
  }
  return options
}

export default defineConfig({
  chromeWebSecurity: false,
  fixturesFolder: 'integration_tests/fixtures',
  screenshotsFolder: 'integration_tests/screenshots',
  videosFolder: 'integration_tests/videos',
  video: true,
  reporter: 'cypress-multi-reporters',
  reporterOptions: {
    configFile: 'reporter-config.json',
  },
  taskTimeout: 60000,
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on) {
      on('file:preprocessor', webpackPreprocessor(preprocessorOptions()))
      on('task', {
        reset: resetStubs,
        ...auth,

        stubSignIn: ({ roles = [], name = 'john smith' }: { roles?: Array<string>; name?: string } = {}) =>
          auth.stubSignIn({ roles, name }),
        stubSignInAsReadOnlyUser: () => auth.stubSignIn({ roles: [] }),
        stubSignInAsUserWithManagerRole: () => auth.stubSignIn({ roles: ['ROLE_LWP_MANAGER'] }),
        stubSignInAsUserWithContributorRole: () => auth.stubSignIn({ roles: ['ROLE_LWP_CONTRIBUTOR'] }),
        stubSignInAsUserWithAllRoles: () => auth.stubSignIn({ roles: ['ROLE_LWP_MANAGER', 'ROLE_LWP_CONTRIBUTOR'] }),
        log(message) {
          // eslint-disable-next-line no-console
          console.log(message)
          return null
        },
        table(message) {
          // eslint-disable-next-line no-console
          console.table(message)
          return null
        },
        ...manageUsersApi,
        ...tokenVerification,
        ...prisonerSearchApi,
        ...educationAndWorkPlanApi,
        ...curiousApi,
        ...ciagInducationApi,
        ...prisonerListApi,
        ...prisonRegisterApi,
        ...supportAdditionalNeedsApi,
        ...prisonerSearchSummaryMockDataGenerator,
        ...sessionResponseMockDataGenerator,
        ...ciagInductionUi,
        ...learnerRecordsApi,
      })
      on('after:spec', (spec: Cypress.Spec, results: CypressCommandLine.RunResult) => {
        if (results && results.video) {
          // Do we have failures for any retry attempts?
          const failures = results.tests.some(test => test.attempts.some(attempt => attempt.state === 'failed'))
          if (!failures) {
            // delete the video if the spec passed and no tests retried
            fs.unlinkSync(results.video)
          }
        }
      })
    },
    experimentalInteractiveRunEvents: true,
    baseUrl: 'http://localhost:3007',
    excludeSpecPattern: '**/!(*.cy).ts',
    specPattern: 'integration_tests/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'integration_tests/support/index.ts',
  },
})
