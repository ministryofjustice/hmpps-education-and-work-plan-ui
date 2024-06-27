import nunjucks from 'nunjucks'
import * as cheerio from 'cheerio'
import ArchiveGoalView from '../../../../routes/archiveGoal/archiveGoalView'
import aValidPrisonerSummary from '../../../../testsupport/prisonerSummaryTestDataBuilder'
import formatReasonToArchiveGoalFilter from '../../../../filters/formatReasonToArchiveGoalFilter'
import ReasonToArchiveGoalValue from '../../../../enums/ReasonToArchiveGoalValue'
import findErrorFilter from '../../../../filters/findErrorFilter'

const njkEnv = nunjucks.configure([
  'node_modules/govuk-frontend/dist/',
  'node_modules/@ministryofjustice/frontend/',
  'server/views/',
  __dirname,
])
njkEnv.addFilter('formatReasonToArchiveGoal', formatReasonToArchiveGoalFilter)
njkEnv.addFilter('findError', findErrorFilter)

describe('archive reason template', () => {
  it('should keep key fields in the form', () => {
    const prisonerSummary = aValidPrisonerSummary()
    const form = {
      reference: '95b18362-fe56-4234-9ad2-11ef98b974a3',
      title: 'Build a new feature to archive goals',
    }
    const model = new ArchiveGoalView(prisonerSummary, form)

    const content = nunjucks.render('reason.njk', model.renderArgs)

    const $ = cheerio.load(content)
    expect($('[data-qa=goal-reference]').first().val()).toStrictEqual(form.reference)
    expect($('[data-qa=goal-title]').first().val()).toStrictEqual(form.title)
  })
  it('Should display the goal being archived', () => {
    const prisonerSummary = aValidPrisonerSummary()
    const form = {
      reference: '95b18362-fe56-4234-9ad2-11ef98b974a3',
      title: 'Build a new feature to archive goals',
    }
    const model = new ArchiveGoalView(prisonerSummary, form)

    const content = nunjucks.render('reason.njk', model.renderArgs)

    const $ = cheerio.load(content)
    expect($('[data-qa=goal-to-be-archived-summary]').first().text()).toStrictEqual(form.title)
  })
  it.each([
    ReasonToArchiveGoalValue.PRISONER_NO_LONGER_WANTS_TO_WORK_TOWARDS_GOAL,
    ReasonToArchiveGoalValue.SUITABLE_ACTIVITIES_NOT_AVAILABLE_IN_THIS_PRISON,
    ReasonToArchiveGoalValue.PRISONER_NO_LONGER_WANTS_TO_WORK_WITH_CIAG,
  ])('should display options for all reasons without other text box', (reason: ReasonToArchiveGoalValue) => {
    const prisonerSummary = aValidPrisonerSummary()
    const form = {
      reference: '95b18362-fe56-4234-9ad2-11ef98b974a3',
      title: 'Build a new feature to archive goals',
    }
    const model = new ArchiveGoalView(prisonerSummary, form)

    const content = nunjucks.render('reason.njk', model.renderArgs)

    const $ = cheerio.load(content)
    expect($(`.govuk-radios__input[value='${reason}']`).val()).toStrictEqual(reason)
    expect($(`#conditional-reason-4`).first().hasClass('govuk-radios__conditional--hidden')).toBeTruthy()
  })
  it('should display other reason text box when selected', () => {
    const prisonerSummary = aValidPrisonerSummary()
    const form = {
      reference: '95b18362-fe56-4234-9ad2-11ef98b974a3',
      title: 'Build a new feature to archive goals',
      reason: ReasonToArchiveGoalValue.OTHER,
    }
    const model = new ArchiveGoalView(prisonerSummary, form)

    const content = nunjucks.render('reason.njk', model.renderArgs)

    const $ = cheerio.load(content)
    expect($(`.govuk-radios__input[value='OTHER']`).val()).toStrictEqual('OTHER')
    expect($(`#conditional-reason-4`).first().hasClass('govuk-radios__conditional--hidden')).toBeFalsy()
  })
  it('should display errors with reason', () => {
    const prisonerSummary = aValidPrisonerSummary()
    const form = {
      reference: '95b18362-fe56-4234-9ad2-11ef98b974a3',
      title: 'Build a new feature to archive goals',
    }
    const model = new ArchiveGoalView(prisonerSummary, form)
    const errors = [
      {
        href: '#reason',
        text: 'Boom!',
      },
    ]

    const content = nunjucks.render('reason.njk', { ...model.renderArgs, errors })

    const $ = cheerio.load(content)
    expect($('#reason-error').first().text()).toContain('Boom!')
  })
  it('should display errors with reasonOther', () => {
    const prisonerSummary = aValidPrisonerSummary()
    const form = {
      reference: '95b18362-fe56-4234-9ad2-11ef98b974a3',
      title: 'Build a new feature to archive goals',
    }
    const model = new ArchiveGoalView(prisonerSummary, form)
    const errors = [
      {
        href: '#reasonOther',
        text: 'Boom!',
      },
    ]

    const content = nunjucks.render('reason.njk', { ...model.renderArgs, errors })

    const $ = cheerio.load(content)
    expect($('#reasonOther-error').first().text()).toContain('Boom!')
  })
})
