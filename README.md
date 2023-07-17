# hmpps-education-and-work-plan-ui
[![repo standards badge](https://img.shields.io/badge/dynamic/json?color=blue&style=flat&logo=github&label=MoJ%20Compliant&query=%24.result&url=https%3A%2F%2Foperations-engineering-reports.cloud-platform.service.justice.gov.uk%2Fapi%2Fv1%2Fcompliant_public_repositories%2Fhmpps-education-and-work-plan-ui)](https://operations-engineering-reports.cloud-platform.service.justice.gov.uk/public-github-repositories.html#hmpps-education-and-work-plan-ui "Link to report")
[![CircleCI](https://circleci.com/gh/ministryofjustice/hmpps-education-and-work-plan-ui/tree/main.svg?style=svg)](https://circleci.com/gh/ministryofjustice/hmpps-education-and-work-plan-ui)

Template github repo used for new Typescript based projects.

# Instructions

If this is a HMPPS project then the project will be created as part of bootstrapping - 
see https://github.com/ministryofjustice/dps-project-bootstrap.

This bootstrap is community managed by the mojdt `#typescript` slack channel. 
Please raise any questions or queries there. Contributions welcome!

Our security policy is located [here](https://github.com/ministryofjustice/hmpps-education-and-work-plan-ui/security/policy). 

More information about the template project including features can be found [here](https://dsdmoj.atlassian.net/wiki/spaces/NDSS/pages/3488677932/Typescript+template+project).

## Creating a CloudPlatform namespace

When deploying to a new namespace, you may wish to use this template typescript project namespace as the basis for your new namespace:

<https://github.com/ministryofjustice/cloud-platform-environments/tree/main/namespaces/live.cloud-platform.service.justice.gov.uk/hmpps-education-and-work-plan-ui>

This template namespace includes an AWS elasticache setup - which is required by this template project.

Copy this folder, update all the existing namespace references, and submit a PR to the CloudPlatform team. Further instructions from the CloudPlatform team can be found here: <https://user-guide.cloud-platform.service.justice.gov.uk/#cloud-platform-user-guide>

## Renaming from HMPPS Template Typescript - github Actions

Once the new repository is deployed. Navigate to the repository in github, and select the `Actions` tab.
Click the link to `Enable Actions on this repository`.

Find the Action workflow named: `rename-project-create-pr` and click `Run workflow`.  This workflow will
execute the `rename-project.bash` and create Pull Request for you to review.  Review the PR and merge.

Note: ideally this workflow would run automatically however due to a recent change github Actions are not
enabled by default on newly created repos. There is no way to enable Actions other then to click the button in the UI.
If this situation changes we will update this project so that the workflow is triggered during the bootstrap project.
Further reading: <https://github.community/t/workflow-isnt-enabled-in-repos-generated-from-template/136421>

## Manually branding from template app
Run the `rename-project.bash` and create a PR.

The rename-project.bash script takes a single argument - the name of the project and calculates from it the project description
It then performs a search and replace and directory renames so the project is ready to be used.

## Ensuring slack notifications are raised correctly

To ensure notifications are routed to the correct slack channels, update the `alerts-slack-channel` and `releases-slack-channel` parameters in `.circle/config.yml` to an appropriate channel.

## Imported Types
Some types are imported from the Open API docs for hmpps-education-and-work-plan-api, prisoner-search-api and curious-api.  
You will need to install the node module `openapi-typescript` globally with the following command:

`npm install -g openapi-typescript`

To update the types from the Open API docs run the following commands:

`npx openapi-typescript https://learningandworkprogress-api-dev.hmpps.service.justice.gov.uk/v3/api-docs -o server/@types/educationAndWorkPlanApi/index.d.ts`

`npx openapi-typescript https://prisoner-offender-search-dev.prison.service.justice.gov.uk/v3/api-docs -o server/@types/prisonerSearchApi/index.d.ts`

`npx openapi-typescript https://raw.githubusercontent.com/ministryofjustice/curious-API/main/curious-api-specification.yaml -o server/@types/curiousApi/index.d.ts`

Note that you will need to run prettier over the generated files and possibly handle other errors before compiling.

The types are inherited for use in `server/@types/educationAndWorkPlanApi/index.d.ts`, `server/@types/prisonerSearchApi/index.d.ts` 
and `server/@types/curiousApi/index.d.ts` which may also need tweaking for use.

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
TOKEN_VERIFICATION_API_URL=https://token-verification-api-dev.prison.service.justice.gov.uk
TOKEN_VERIFICATION_ENABLED=false
EDUCATION_AND_WORK_PLAN_API_URL=http://localhost:8080
PRISONER_SEARCH_API_URL=http://localhost:8080
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
