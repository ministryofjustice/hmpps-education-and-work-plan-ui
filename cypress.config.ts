import * as fs from 'fs'
import { defineConfig } from 'cypress'
import { resetStubs } from './integration_tests/mockApis/wiremock'
import auth from './integration_tests/mockApis/auth'
import tokenVerification from './integration_tests/mockApis/tokenVerification'
import prisonerSearchApi from './integration_tests/mockApis/prisonerSearchApi'
import educationAndWorkPlanApi from './integration_tests/mockApis/educationAndWorkPlanApi'
import curiousApi from './integration_tests/mockApis/curiousApi'
import ciagInducationApi from './integration_tests/mockApis/ciagInducationApi'
import frontendComponentApi from './integration_tests/mockApis/frontendComponentApi'
import prisonerListApi from './integration_tests/mockApis/prisonerListApi'
import prisonerSearchSummaryMockDataGenerator from './integration_tests/mockData/prisonerSearchSummaryMockDataGenerator'

export default defineConfig({
  chromeWebSecurity: false,
  fixturesFolder: 'integration_tests/fixtures',
  screenshotsFolder: 'integration_tests/screenshots',
  videosFolder: 'integration_tests/videos',
  reporter: 'cypress-multi-reporters',
  reporterOptions: {
    configFile: 'reporter-config.json',
  },
  videoUploadOnPasses: false,
  taskTimeout: 60000,
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on) {
      on('task', {
        reset: resetStubs,
        ...auth,

        stubSignIn: () => auth.stubSignIn([]),
        stubSignInAsUserWithEditAuthority: () => auth.stubSignIn(['ROLE_EDUCATION_WORK_PLAN_EDITOR']),
        stubSignInAsUserWithViewAuthority: () => auth.stubSignIn(['ROLE_EDUCATION_WORK_PLAN_VIEWER']),

        ...tokenVerification,
        ...prisonerSearchApi,
        ...educationAndWorkPlanApi,
        ...curiousApi,
        ...ciagInducationApi,
        ...frontendComponentApi,
        ...prisonerListApi,
        ...prisonerSearchSummaryMockDataGenerator,
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
