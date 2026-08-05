# HMPPS Education and Work Plan UI

[![repo standards badge](https://img.shields.io/badge/dynamic/json?color=blue&style=flat&logo=github&label=MoJ%20Compliant&query=%24.result&url=https%3A%2F%2Foperations-engineering-reports.cloud-platform.service.justice.gov.uk%2Fapi%2Fv1%2Fcompliant_public_repositories%2Fhmpps-education-and-work-plan-ui)](https://operations-engineering-reports.cloud-platform.service.justice.gov.uk/public-github-repositories.html#hmpps-education-and-work-plan-ui "Link to report")
[![pipeline](https://github.com/ministryofjustice/hmpps-education-and-work-plan-ui/actions/workflows/pipeline.yml/badge.svg)](https://github.com/ministryofjustice/hmpps-education-and-work-plan-ui)
[![JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

UI application, based on the HMPPS Typescript project template, that provides the browser based UI for "Learning and
work progress".

| :exclamation:  Service name note                                                                                                                                           |
|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| The service name "Learning and work progress" is the current name for this service, but it has been previously known by, and continues to be known by, the following names |
| * Personal learning plans (PLP)                                                                                                                                            |
| * Education and work plan                                                                                                                                                  |

The service allows users to create and update a prisoner's "Learning and work progress" plan. The plan consists of an
Induction, and 1 or more Goals.

## Induction

[The Learning and work progress Induction is documented here](./docs/induction.md).

## Goals

[The Learning and work progress Goals are documented here](./docs/goals.md).

## Development and maintenance

### Dependencies

The app requires:

* hmpps-auth - for authentication
* redis - session store and token caching

### Environment variables

Create an environment file by copying `.env.example` -> `.env`.

For the app to run, environment variables will need populating in `.env`.

### Running the app locally

The easiest way to run the app is to use Docker Compose to create the service and all dependencies.

`docker-compose pull`

`docker-compose up`

See `http://localhost:3000/health` to check the app is running.

### Running the app for development

Install [nvm](https://github.com/nvm-sh/nvm) and run `nvm install --latest-npm` within the repository folder to use the co∂rrect version of Node, and the latest version of NPM. This matches the `engines` config in `package.json` and the GitHub Actions build config.

Install dependencies using `npm run setup`.

To start the main services excluding the UI app run `docker-compose up --scale app=0`

Create a `.env` which should override environment variables required to run locally. Copy `.env.local` and populate the secrets from Kubernetes.

And then, to build the assets and start the app with nodemon:

`npm run start:dev`

To run against a local copy of [hmpps-education-and-work-plan-api](https://github.com/ministryofjustice/hmpps-education-and-work-plan-api), make sure the API is running locally, and update the `API_URL` environment variable in `.env` to point to `localhost:8080`.

### Run linter

`npm run lint`

### Run tests

`npm run test`

### Running integration tests

For local running, start a test DB, Redis, and WireMock instances by running `docker-compose -f docker-compose-test.yml up`.

Then, run the server in test mode by running `npm run start-feature` (or `npm run start-feature:dev` to run with nodemon).

And then either:

* run tests in headless mode with `npm run int-test`
* or run tests with the Cypress UI `npm run int-test-ui`

## Imported types

Some types are imported from the OpenAPI docs for hmpps-education-and-work-plan-api, prisoner-search-api, prison-register, curious-api, hmpps-support-for-additional-needs-api, and hmpps-learner-records-api.

### Updating the types

NOTE: Do not re-import the specs lightly! Reformatting the generated code with prettier is no small task, especially with large specs such as Prisoner Search.

You will need to install the node module `openapi-typescript` globally with the following command:

`npm install -g openapi-typescript`

To update the types from the Open API docs run the following commands:

`npx openapi-typescript https://learningandworkprogress-api-dev.hmpps.service.justice.gov.uk/v3/api-docs -o server/@types/educationAndWorkPlanApi/index.d.ts`

`npx openapi-typescript https://prisoner-search-dev.prison.service.justice.gov.uk/v3/api-docs -o server/@types/prisonerSearchApi/index.d.ts`

`npx openapi-typescript https://prison-register-dev.hmpps.service.justice.gov.uk/v3/api-docs -o server/@types/prisonRegisterApi/index.d.ts`

`npx openapi-typescript https://testservices.sequation.net/sequation-virtual-campus2-api/v3/api-docs -o server/@types/curiousApi/index.d.ts`

`npx openapi-typescript https://support-for-additional-needs-api-dev.hmpps.service.justice.gov.uk/v3/api-docs -o server/@types/supportAdditionalNeedsApi/index.d.ts`

`npx openapi-typescript https://learner-records-api-dev.hmpps.service.justice.gov.uk/v3/api-docs -o server/@types/learnerRecordsApi/index.d.ts`

Note that you will need to run prettier over the generated files and possibly handle other errors before compiling.

The types are inherited for use in `server/@types/educationAndWorkPlanApi/index.d.ts`, `server/@types/prisonerSearchApi/index.d.ts`,
`server/@types/prisonRegisterApi/index.d.ts`, `server/@types/curiousApi/index.d.ts`, `server/@types/supportAdditionalNeedsApi/index.d.ts`
and `server/@types/learnerRecordsApi/index.d.ts` which may also need tweaking for use.

## Changelog

A changelog for the service is [available](./CHANGELOG.md)

## Dependency Checks

The template project has implemented some scheduled checks to ensure that key dependencies are kept up to date.
If these are not desired in the cloned project, remove references to `check_outdated` job from `.circleci/config.yml`

## Client Roles

To run the app a system client is required (`SYSTEM_CLIENT_ID` and `SYSTEM_CLIENT_SECRET` env vars). The system client requires the following roles:

* `ROLE_EDUCATION_AND_WORK_PLAN__ACTIONPLANS__RW` - to be able to call the Education and Work Plan API, action-plans endpoint
* `ROLE_EDUCATION_AND_WORK_PLAN__TIMELINE__RO` - to be able to call the Education and Work Plan API, timeline endpoint
* `ROLE_EDUCATION_AND_WORK_PLAN__EDUCATION__RW` - to be able to call the Education and Work Plan API, education endpoint
* `ROLE_EDUCATION_AND_WORK_PLAN__GOALS__RW` - to be able to call the Education and Work Plan API, goals endpoint
* `ROLE_EDUCATION_AND_WORK_PLAN__CONVERSATIONS__RW` - to be able to call the Education and Work Plan API, conversations endpoint
* `ROLE_EDUCATION_AND_WORK_PLAN__INDUCTIONS__RW` - to be able to call the Education and Work Plan API, inductions endpoint
* `ROLE_PRISONER_SEARCH` - to be able to call the Prisoner Search API
* `ROLE_CURIOUS_API` - to be able to call the Curious API

## User Roles

Once the UI is running users will need to authenticate with `hmpps-auth` using a valid DPS user. The DPS roles that the user
has determines the functionality they will be able to access:

* `ROLE_LWP_CONTRIBUTOR` - Prisoner List landing page. Can view all data. Can update Inductions; but cannot create Inductions, create or update Goals, or record or exempt Reviews.
* `ROLE_LWP_MANAGER` - Session Summary landing page. Can view all data, and can perform all functions (create and update Inductions, create and update Goals, record and exempt Reviews)

## OAuth Clients

This UI uses the standard HMPPS Digital configuration which makes use of two oauth clients. The oauth clients are setup
and managed by the HAAR team (slack channel #hmpps-auth-audit-registers).

* `API_CLIENT_ID` - auth flow client used as part of the hmpps-auth authentication process.
* `SYSTEM_CLIENT_ID` - system client containing the roles `ROLE_PRISONER_SEARCH` and `ROLE_CURIOUS_API`. This is the client that is used in API requests that use the 'system token'.

## API external dependencies

This UI consumes, and is therefore dependent on, data from the following APIs:

* `hmpps-auth` - Standard HMPPS Digital configuration; used for authentication and retrieved the user profile. Uses the user token.
* `application-insights` - Standard HMPPS Digital configuration; used for telemetry and event tracing.
* `frontend-componenents` - Standard HMPPS Digital configuration; used to retrieve the html and css for the DPS header and footer. Uses the system token.
* `prisoner-search` - Used to return the list of prisoners in the user's active prison (active caseload ID) and to return individual prisoner records. Uses the system token.
* `prison-register` - Used to return prison information in order to render prison names in the UI. Uses the system token.
* `curious-api` - Used to retrieve the prisoner's initial functional skill assessments, neurodiversity support needs, and in-prison qualifications and achievements. Uses the system token.
* `education-and-work-plan-api` - Used to record and retrieve prisoner action plan and goals, and retrieve timeline events. Uses the user token.
* `ciag-inducation-api` - Used to return the prisoner's CIAG Induction record. Uses the user token.
* `hmpps-audit` - HMPPS Audit Service; used to send user action events to HMPPS Audit via the AWS SQS queue specified by the environment variable `AUDIT_SQS_QUEUE_URL`

## HMPPS Audit

This UI service sends events to HMPP Audit for the following user actions:

* All page view attempts
* All successful page views
* All requests resulting in an error page
* Creating prisoner goals
* Updating prisoner goals
* Archiving prisoner goals
* Reactivating (un-archiving) prisoner goals

## Feature Toggles

Features can be toggled by setting the relevant environment variable.

| Name                      | Default Value | Type     | Description                                                              |
|---------------------------|---------------|----------|--------------------------------------------------------------------------|
| SOME_TOGGLE_ENABLED       | false         | Boolean  | Example feature toggle, for demonstration purposes.                      |
| LRS_INTEGRATION_ENABLED   | false         | Boolean  | Set to true to show qualifications from LRS                              |
| CIAG_KPI_PROCESSING_RULE  | PEF           | String   | Set to PEF or PES. Setting to PES enables features that are PES specific |
