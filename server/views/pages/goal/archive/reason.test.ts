import nunjucks from 'nunjucks'
import * as cheerio from 'cheerio'
import aValidPrisonerSummary from '../../../../testsupport/prisonerSummaryTestDataBuilder'
import formatReasonToArchiveGoalFilter from '../../../../filters/formatReasonToArchiveGoalFilter'
import ReasonToArchiveGoalValue from '../../../../enums/ReasonToArchiveGoalValue'
import findErrorFilter from '../../../../filters/findErrorFilter'
import assetMapFilter from '../../../../filters/assetMapFilter'
import { Result } from '../../../../utils/result/result'
import { aValidGoal } from '../../../../testsupport/actionPlanTestDataBuilder'

const njkEnv = nunjucks.configure([
  'node_modules/govuk-frontend/dist/',
  'node_modules/@ministryofjustice/frontend/',
  'server/views/',
  __dirname,
])

njkEnv //
  .addFilter('formatReasonToArchiveGoal', formatReasonToArchiveGoalFilter)
  .addFilter('findError', findErrorFilter)
  .addFilter('assetMap', assetMapFilter)

const prisonerSummary = aValidPrisonerSummary()
const goalReference = '1a2eae63-8102-4155-97cb-43d8fb739caf'
const goalTitle = 'Build a new feature to archive goals'
const goal = Result.fulfilled(aValidGoal({ goalReference, title: goalTitle }))

const templateParams = {
  prisonerSummary,
  goal,
  form: {},
}

describe('archive reason template', () => {
  it('should keep key fields in the form', () => {
    // Given
    const model = { ...templateParams }

    // When
    const content = nunjucks.render('reason.njk', model)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=goal-reference]').first().val()).toStrictEqual(goalReference)
    expect($('[data-qa=goal-title]').first().val()).toStrictEqual(goalTitle)
    expect($('[data-qa=goal-to-be-archived-summary]').first().text()).toStrictEqual(goalTitle)
  })

  it.each([
    ReasonToArchiveGoalValue.PRISONER_NO_LONGER_WANTS_TO_WORK_TOWARDS_GOAL,
    ReasonToArchiveGoalValue.SUITABLE_ACTIVITIES_NOT_AVAILABLE_IN_THIS_PRISON,
    ReasonToArchiveGoalValue.PRISONER_NO_LONGER_WANTS_TO_WORK_WITH_CIAG,
  ])('should display options for all reasons without other text box', (reason: ReasonToArchiveGoalValue) => {
    // Given
    const model = { ...templateParams }

    // When
    const content = nunjucks.render('reason.njk', model)
    const $ = cheerio.load(content)

    // Then
    expect($(`.govuk-radios__input[value='${reason}']`).val()).toStrictEqual(reason)
    expect($(`#conditional-reason-4`).first().hasClass('govuk-radios__conditional--hidden')).toBeTruthy()
  })

  it('should display other reason text box when selected', () => {
    // Given
    const form = {
      reference: goalReference,
      title: goalTitle,
      reason: ReasonToArchiveGoalValue.OTHER,
    }
    const model = { ...templateParams, form }

    // When
    const content = nunjucks.render('reason.njk', model)
    const $ = cheerio.load(content)

    // Then
    expect($(`.govuk-radios__input[value='OTHER']`).val()).toStrictEqual('OTHER')
    expect($(`#conditional-reason-4`).first().hasClass('govuk-radios__conditional--hidden')).toBeFalsy()
  })

  it('should display errors with reason', () => {
    // Given
    const errors = [
      {
        href: '#reason',
        text: 'Boom!',
      },
    ]
    const model = { ...templateParams, errors }

    // When
    const content = nunjucks.render('reason.njk', model)
    const $ = cheerio.load(content)

    // Then
    expect($('#reason-error').first().text()).toContain('Boom!')
  })

  it('should display errors with reasonOther', () => {
    // Given
    const errors = [
      {
        href: '#reasonOther',
        text: 'Boom!',
      },
    ]
    const model = { ...templateParams, errors }

    // When
    const content = nunjucks.render('reason.njk', { ...model, errors })
    const $ = cheerio.load(content)

    // Then
    expect($('#reasonOther-error').first().text()).toContain('Boom!')
  })
})
