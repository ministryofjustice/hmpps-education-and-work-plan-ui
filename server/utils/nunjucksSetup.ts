/* eslint-disable no-param-reassign */
import nunjucks, { Environment } from 'nunjucks'
import express from 'express'
import path from 'path'
import { initialiseName } from './utils'
import { ApplicationInfo } from '../applicationInfo'
import config from '../config'
import formatDateFilter from '../filters/formatDateFilter'
import findErrorFilter from '../filters/findErrorFilter'
import formatTargetDateRangeValue from '../filters/formatTargetDateRangeValue'
import formatFunctionalSkillType from '../filters/formatFunctionalSkillTypeFilter'
import formatStepStatusValue from '../filters/formatStepStatusValue'
import formatGoalStatusValue from '../filters/formatGoalStatusValue'
import formatYesNoFilter from '../filters/formatYesNoFilter'
import formatAbilityToWorkConstraintFilter from '../filters/formatAbilityToWorkConstraintFilter'
import formatJobTypeFilter from '../filters/formatJobTypeFilter'
import formatEducationLevelFilter from '../filters/formatEducationLevelFilter'
import formatAdditionalTrainingFilter from '../filters/formatAdditionalTrainingFilter'
import formatSkillFilter from '../filters/formatSkillFilter'
import formatPersonalInterestsFilter from '../filters/formatPersonalInterestsFilter'
import fallbackMessageFilter from '../filters/fallbackMessageFilter'

const production = process.env.NODE_ENV === 'production'

export default function nunjucksSetup(app: express.Express, applicationInfo: ApplicationInfo): void {
  app.set('view engine', 'njk')

  app.locals.asset_path = '/assets/'
  app.locals.applicationName = 'Digital Prison Services'

  // Cachebusting version string
  if (production) {
    // Version only changes with new commits
    app.locals.version = applicationInfo.gitShortHash
  } else {
    // Version changes every request
    app.use((req, res, next) => {
      res.locals.version = Date.now().toString()
      return next()
    })
  }

  registerNunjucks(app)
}

export function registerNunjucks(app?: express.Express): Environment {
  const njkEnv = nunjucks.configure(
    [
      path.join(__dirname, '../../server/views'),
      'node_modules/govuk-frontend/',
      'node_modules/govuk-frontend/components/',
      'node_modules/@ministryofjustice/frontend/',
      'node_modules/@ministryofjustice/frontend/moj/components/',
    ],
    {
      autoescape: true,
      express: app,
    },
  )

  njkEnv.addFilter('initialiseName', initialiseName)
  njkEnv.addFilter('findError', findErrorFilter)
  njkEnv.addFilter('formatDate', formatDateFilter)
  njkEnv.addFilter('formatTargetDateRangeValue', formatTargetDateRangeValue)
  njkEnv.addFilter('formatFunctionalSkillType', formatFunctionalSkillType)
  njkEnv.addFilter('formatStepStatusValue', formatStepStatusValue)
  njkEnv.addFilter('formatGoalStatusValue', formatGoalStatusValue)
  njkEnv.addFilter('formatYesNo', formatYesNoFilter)
  njkEnv.addFilter('formatAbilityToWorkConstraint', formatAbilityToWorkConstraintFilter)
  njkEnv.addFilter('formatJobType', formatJobTypeFilter)
  njkEnv.addFilter('formatEducationLevel', formatEducationLevelFilter)
  njkEnv.addFilter('formatAdditionalTraining', formatAdditionalTrainingFilter)
  njkEnv.addFilter('formatSkill', formatSkillFilter)
  njkEnv.addFilter('formatPersonalInterests', formatPersonalInterestsFilter)
  njkEnv.addFilter('fallbackMessage', fallbackMessageFilter)

  njkEnv.addGlobal('dpsUrl', config.dpsHomeUrl)
  njkEnv.addGlobal('ciagInductionUrl', config.ciagInductionUrl)
  njkEnv.addGlobal(
    'prisonerListUrl',
    !config.featureToggles.stubPrisonerListPageEnabled ? config.ciagInductionUrl : '/',
  )
  njkEnv.addGlobal('featureToggles', config.featureToggles)

  return njkEnv
}
