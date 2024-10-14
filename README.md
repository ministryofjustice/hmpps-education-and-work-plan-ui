# hmpps-education-and-work-plan-ui
[![repo standards badge](https://img.shields.io/badge/dynamic/json?color=blue&style=flat&logo=github&label=MoJ%20Compliant&query=%24.result&url=https%3A%2F%2Foperations-engineering-reports.cloud-platform.service.justice.gov.uk%2Fapi%2Fv1%2Fcompliant_public_repositories%2Fhmpps-education-and-work-plan-ui)](https://operations-engineering-reports.cloud-platform.service.justice.gov.uk/public-github-repositories.html#hmpps-education-and-work-plan-ui "Link to report")
[![CircleCI](https://circleci.com/gh/ministryofjustice/hmpps-education-and-work-plan-ui/tree/main.svg?style=svg)](https://circleci.com/gh/ministryofjustice/hmpps-education-and-work-plan-ui)

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

# Development and maintenance

## Ensuring slack notifications are raised correctly

To ensure notifications are routed to the correct slack channels, update the `alerts-slack-channel` and `releases-slack-channel` parameters in `.circle/config.yml` to an appropriate channel.

## Imported Types
Some types are imported from the Open API docs for hmpps-education-and-work-plan-api, prisoner-search-api, curious-api and ciag-induction-api.  
You will need to install the node module `openapi-typescript` globally with the following command:

`npm install -g openapi-typescript`

To update the types from the Open API docs run the following commands:

`npx openapi-typescript https://learningandworkprogress-api-dev.hmpps.service.justice.gov.uk/v3/api-docs -o server/@types/educationAndWorkPlanApi/index.d.ts`

`npx openapi-typescript https://prisoner-search-dev.prison.service.justice.gov.uk/v3/api-docs -o server/@types/prisonerSearchApi/index.d.ts`

`npx openapi-typescript https://prison-register-dev.hmpps.service.justice.gov.uk/v3/api-docs -o server/@types/prisonRegisterApi/index.d.ts`

`npx openapi-typescript https://activities-api-dev.prison.service.justice.gov.uk/v3/api-docs -o server/@types/activitiesApi/index.d.ts`

`npx openapi-typescript https://testservices.sequation.net/sequation-virtual-campus2-api/v3/api-docs -o server/@types/curiousApi/index.d.ts`

Note that you will need to run prettier over the generated files and possibly handle other errors before compiling.

The types are inherited for use in `server/@types/educationAndWorkPlanApi/index.d.ts`, `server/@types/prisonerSearchApi/index.d.ts`, 
`server/@types/prisonRegisterApi/index.d.ts` and `server/@types/curiousApi/index.d.ts` which may also need tweaking for use.

Do not re-import the specs lightly! Reformatting the generated code with prettier is no small task, especially with large specs such as Prisoner Search.

## Running the app
The easiest way to run the app is to use docker compose to create the service and all dependencies. 

`docker-compose pull`

`docker-compose up`

Note that this will require running up the API first. See the [API Readme](https://github.com/ministryofjustice/hmpps-education-and-work-plan-api#running-the-app).

See `http://localhost:3000/health` to check the app is running.

### Dependencies
The app requires: 
* hmpps-auth - for authentication
* redis - session store and token caching

### Running the app for development

To start the main services excluding the example typescript template app: 

`docker-compose up --scale=app=0`

Install dependencies using `npm install`, ensuring you are using `node v18.x` and `npm v9.x`

Note: Using `nvm` (or [fnm](https://github.com/Schniz/fnm)), run `nvm install --latest-npm` within the repository folder to use the correct version of node, and the latest version of npm. This matches the `engines` config in `package.json` and the CircleCI build config.

Create a `.env` which should override environment variables required to run locally:
```properties
HMPPS_AUTH_URL=http://localhost:9090/auth
MANAGE_USERS_API_URL=http://localhost:9091/manage-users-api
TOKEN_VERIFICATION_API_URL=https://token-verification-api-dev.prison.service.justice.gov.uk
TOKEN_VERIFICATION_ENABLED=false
EDUCATION_AND_WORK_PLAN_API_URL=http://localhost:8080
PRISONER_SEARCH_API_URL=http://localhost:8080
ACTIVITIES_API_URL=http://localhost:8080
REDIS_ENABLED=true
NODE_ENV=development
SESSION_SECRET=anything
PORT=3000
API_CLIENT_ID=<YOUR_CLIENT_ID>
API_CLIENT_SECRET="<YOUR_CLIENT_SECRET>"
SYSTEM_CLIENT_ID=<YOUR_CLIENT_ID>
SYSTEM_CLIENT_SECRET="<YOUR_CLIENT_SECRET>"

```

And then, to build the assets and start the app with nodemon:

`npm run start:dev`

### Client Roles
To run the app a system client is required (`SYSTEM_CLIENT_ID` and `SYSTEM_CLIENT_SECRET` env vars). The system client requires the following roles:

* `ROLE_EDUCATION_AND_WORK_PLAN__ACTIONPLANS__RW` - to be able to call the Education and Work Plan API, action-plans endpoint
* `ROLE_EDUCATION_AND_WORK_PLAN__TIMELINE__RO` - to be able to call the Education and Work Plan API, timeline endpoint
* `ROLE_EDUCATION_AND_WORK_PLAN__EDUCATION__RW` - to be able to call the Education and Work Plan API, education endpoint
* `ROLE_EDUCATION_AND_WORK_PLAN__GOALS__RW` - to be able to call the Education and Work Plan API, goals endpoint
* `ROLE_EDUCATION_AND_WORK_PLAN__CONVERSATIONS__RW` - to be able to call the Education and Work Plan API, conversations endpoint
* `ROLE_EDUCATION_AND_WORK_PLAN__INDUCTIONS__RW` - to be able to call the Education and Work Plan API, inductions endpoint
* `ROLE_PRISONER_SEARCH` - to be able to call the Prisoner Search API
* `ROLE_CURIOUS_API` - to be able to call the Curious API

### User Roles
One the UI is running users will need to authenticate with `hmpps-auth` using a valid DPS username. The DPS user needs to have the followings roles
dependent on the access/functionality required:

* `ROLE_EDUCATION_WORK_PLAN_VIEWER` - required to be able to perform read only actions
* `ROLE_EDUCATION_WORK_PLAN_EDITOR` - required to be able to perform actions that edit/create data

### Run linter

`npm run lint`

### Run tests

`npm run test`

### Running integration tests

For local running, start a test db, redis, and wiremock instance by:

`docker-compose -f docker-compose-test.yml up`

Then run the server in test mode by:

`npm run start-feature` (or `npm run start-feature:dev` to run with nodemon)

And then either, run tests in headless mode with:

`npm run int-test`
 
Or run tests with the cypress UI:

`npm run int-test-ui`

## Change log

A changelog for the service is available [here](./CHANGELOG.md)


## Dependency Checks

The template project has implemented some scheduled checks to ensure that key dependencies are kept up to date.
If these are not desired in the cloned project, remove references to `check_outdated` job from `.circleci/config.yml`

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

| Name                      | Default Value | Type     | Description                                                                       |
|---------------------------|---------------|----------|-----------------------------------------------------------------------------------|
| SOME_TOGGLE_ENABLED       | false         | Boolean  | Example feature toggle, for demonstration purposes.                               |
| NEW_OVERVIEW_PAGE_ENABLED | false         | Boolean  | Enable new overview and goals page layouts.                                       |
| REVIEWS_PRISONS_ENABLED   |               | String   | Comma delimited list of prison IDs where the PLP Review process has been enabled. | 