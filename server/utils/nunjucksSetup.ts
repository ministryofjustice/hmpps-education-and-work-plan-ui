/* eslint-disable no-param-reassign */
import nunjucks, { Environment } from 'nunjucks'
import express from 'express'
import path from 'path'
import { addMonths, constructNow, startOfToday } from 'date-fns'
import { initialiseName } from './utils'
import { ApplicationInfo } from '../applicationInfo'
import config from '../config'
import formatDateFilter from '../filters/formatDateFilter'
import findErrorFilter from '../filters/findErrorFilter'
import formatFunctionalSkillTypeFilter from '../filters/formatFunctionalSkillTypeFilter'
import formatStepStatusValueFilter from '../filters/formatStepStatusValueFilter'
import formatGoalStatusValueFilter from '../filters/formatGoalStatusValueFilter'
import formatYesNoFilter from '../filters/formatYesNoFilter'
import formatHasWorkedBeforeFilter from '../filters/formatHasWorkedBeforeFilter'
import formatAbilityToWorkConstraintFilter from '../filters/formatAbilityToWorkConstraintFilter'
import formatJobTypeFilter from '../filters/formatJobTypeFilter'
import formatEducationLevelFilter from '../filters/formatEducationLevelFilter'
import formatAdditionalTrainingFilter from '../filters/formatAdditionalTrainingFilter'
import formatSkillFilter from '../filters/formatSkillFilter'
import formatPersonalInterestFilter from '../filters/formatPersonalInterestFilter'
import fallbackMessageFilter from '../filters/fallbackMessageFilter'
import formatIsAccreditedFilter from '../filters/formatIsAccreditedFilter'
import formatInPrisonWorkInterestFilter from '../filters/formatInPrisonWorkInterestFilter'
import formatInPrisonTrainingFilter from '../filters/formatInPrisonTrainingFilter'
import formatReasonNotToGetWorkFilter from '../filters/formatReasonNotToGetWorkFilter'
import formatQualificationLevelFilter from '../filters/formatQualificationLevelFilter'
import formatQualificationLevelHintFilter from '../filters/formatQualificationLevelHintFilter'
import formatCuriousCourseStatusFilter from '../filters/formatCuriousCourseStatusFilter'
import sortedAlphabeticallyWithOtherLastFilter from '../filters/sortedAlphabeticallyWithOtherLastFilter'
import objectsSortedAlphabeticallyWithOtherLastByFilter from '../filters/objectsSortedAlphabeticallyWithOtherLastByFilter'
import previousWorkExperienceObjectsSortedInScreenOrderFilter from '../filters/previousWorkExperienceObjectsSortedInScreenOrderFilter'
import achievedQualificationObjectsSortedInScreenOrderFilter from '../filters/achievedQualificationObjectsSortedInScreenOrderFilter'
import formatReasonToArchiveGoalFilter from '../filters/formatReasonToArchiveGoalFilter'
import formatReviewExemptionReasonValueFilter from '../filters/formatReviewExemptionReasonFilter'
import formatInductionExemptionReasonFilter from '../filters/formatInductionExemptionReasonFilter'
import assetMapFilter from '../filters/assetMapFilter'

export default function nunjucksSetup(app: express.Express, applicationInfo: ApplicationInfo): void {
  app.set('view engine', 'njk')

  app.locals.asset_path = '/assets/'
  app.locals.applicationName = 'Digital Prison Services'
  app.locals.environmentName = config.environmentName
  app.locals.environmentNameColour = config.environmentName === 'PRE-PRODUCTION' ? 'govuk-tag--green' : ''

  app.locals.applicationInsightsConnectionString = config.applicationInsights.connectionString
  app.locals.applicationInsightsRoleName = applicationInfo.applicationName

  // Cachebusting version string
  if (config.production) {
    // Version only changes with new commits
    app.locals.version = applicationInfo.gitShortHash
  } else {
    // Version changes every request
    app.use((req, res, next) => {
      res.locals.version = Date.now().toString()
      return next()
    })
  }

  // Add the current datetime (now) and the current date (today) to res.locals so the views can make use of them as necessary
  app.use((req, res, next) => {
    res.locals.now = constructNow(new Date())
    res.locals.today = startOfToday()
    next()
  })

  registerNunjucks(app)
}

export function registerNunjucks(app?: express.Express): Environment {
  const njkEnv = nunjucks.configure(
    [
      path.join(__dirname, '../../server/views'),
      'node_modules/govuk-frontend/dist',
      'node_modules/govuk-frontend/dist/components/',
      'node_modules/@ministryofjustice/frontend/',
      'node_modules/@ministryofjustice/frontend/moj/components/',
      'node_modules/@ministryofjustice/hmpps-connect-dps-components/dist/assets/',
    ],
    {
      autoescape: true,
      express: app,
    },
  )

  njkEnv.addFilter('initialiseName', initialiseName)
  njkEnv.addFilter('assetMap', assetMapFilter)

  njkEnv.addFilter('findError', findErrorFilter)
  njkEnv.addFilter('formatDate', formatDateFilter)
  njkEnv.addFilter('formatFunctionalSkillType', formatFunctionalSkillTypeFilter)
  njkEnv.addFilter('formatStepStatusValue', formatStepStatusValueFilter)
  njkEnv.addFilter('formatGoalStatusValue', formatGoalStatusValueFilter)
  njkEnv.addFilter('formatYesNo', formatYesNoFilter)
  njkEnv.addFilter('formatAbilityToWorkConstraint', formatAbilityToWorkConstraintFilter)
  njkEnv.addFilter('formatJobType', formatJobTypeFilter)
  njkEnv.addFilter('formatEducationLevel', formatEducationLevelFilter)
  njkEnv.addFilter('formatAdditionalTraining', formatAdditionalTrainingFilter)
  njkEnv.addFilter('formatSkill', formatSkillFilter)
  njkEnv.addFilter('formatPersonalInterest', formatPersonalInterestFilter)
  njkEnv.addFilter('formatIsAccredited', formatIsAccreditedFilter)
  njkEnv.addFilter('formatInPrisonWorkInterest', formatInPrisonWorkInterestFilter)
  njkEnv.addFilter('formatInPrisonTraining', formatInPrisonTrainingFilter)
  njkEnv.addFilter('formatReasonNotToGetWork', formatReasonNotToGetWorkFilter)
  njkEnv.addFilter('formatQualificationLevel', formatQualificationLevelFilter)
  njkEnv.addFilter('formatQualificationLevelHint', formatQualificationLevelHintFilter)
  njkEnv.addFilter('formatCuriousCourseStatus', formatCuriousCourseStatusFilter)
  njkEnv.addFilter('formatHasWorkedBefore', formatHasWorkedBeforeFilter)
  njkEnv.addFilter('fallbackMessage', fallbackMessageFilter)
  njkEnv.addFilter('sortedAlphabeticallyWithOtherLast', sortedAlphabeticallyWithOtherLastFilter)
  njkEnv.addFilter('objectsSortedAlphabeticallyWithOtherLastBy', objectsSortedAlphabeticallyWithOtherLastByFilter)
  njkEnv.addFilter(
    'previousWorkExperienceObjectsSortedInScreenOrder',
    previousWorkExperienceObjectsSortedInScreenOrderFilter,
  )
  njkEnv.addFilter(
    'achievedQualificationObjectsSortedInScreenOrder',
    achievedQualificationObjectsSortedInScreenOrderFilter,
  )
  njkEnv.addFilter('formatReasonToArchiveGoal', formatReasonToArchiveGoalFilter)
  njkEnv.addFilter('formatReviewExemptionReason', formatReviewExemptionReasonValueFilter)
  njkEnv.addFilter('formatInductionExemptionReason', formatInductionExemptionReasonFilter)

  njkEnv.addFilter('addMonths', addMonths)

  njkEnv.addGlobal('dpsUrl', config.dpsHomeUrl)
  njkEnv.addGlobal('feedbackUrl', config.feedbackUrl)
  njkEnv.addGlobal('prisonerListUrl', '/')
  njkEnv.addGlobal('featureToggles', config.featureToggles)

  return njkEnv
}
