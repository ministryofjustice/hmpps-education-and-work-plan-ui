import nunjucks from 'nunjucks'
import * as cheerio from 'cheerio'
import { parseISO } from 'date-fns'
import formatDateFilter from '../../../../filters/formatDateFilter'
import filterArrayOnPropertyFilter from '../../../../filters/filterArrayOnPropertyFilter'
import { Result } from '../../../../utils/result/result'
import validFunctionalSkills from '../../../../testsupport/functionalSkillsTestDataBuilder'
import { aValidCurious1Assessment, aValidCurious2Assessment } from '../../../../testsupport/assessmentTestDataBuilder'
import AssessmentTypeValue from '../../../../enums/assessmentTypeValue'
import formatFunctionalSkillTypeFilter from '../../../../filters/formatFunctionalSkillTypeFilter'
import formatAlnAssessmentReferralScreenValueFilter from '../../../../filters/formatAlnAssessmentReferralFilter'

const njkEnv = nunjucks.configure([
  'node_modules/govuk-frontend/dist/',
  'node_modules/@ministryofjustice/frontend/',
  'server/views/',
  __dirname,
])

njkEnv //
  .addFilter('formatDate', formatDateFilter)
  .addFilter('filterArrayOnProperty', filterArrayOnPropertyFilter)
  .addFilter('formatFunctionalSkillType', formatFunctionalSkillTypeFilter)
  .addFilter('formatAlnAssessmentReferralScreenValue', formatAlnAssessmentReferralScreenValueFilter)

const template = './_functionalSkillsAssessments.njk'

const prisonNamesById = { BXI: 'Brixton (HMP)', MDI: 'Moorland (HMP & YOI)' }
const prisonerFunctionalSkills = Result.fulfilled(validFunctionalSkills())
const templateParams = {
  prisonerFunctionalSkills,
  prisonNamesById,
}

describe('_functionalSkillsAssessments', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should render given prisoner has some functional skills', () => {
    // Given
    const params = {
      ...templateParams,
      prisonerFunctionalSkills: Result.fulfilled(
        validFunctionalSkills({
          assessments: [
            aValidCurious1Assessment({ type: 'ENGLISH' }),
            aValidCurious1Assessment({ type: 'MATHS', assessmentDate: parseISO('2024-12-13') }),
            aValidCurious2Assessment({ type: AssessmentTypeValue.MATHS, assessmentDate: parseISO('2026-01-25') }),
            aValidCurious2Assessment({ type: AssessmentTypeValue.DIGITAL_LITERACY }),
            aValidCurious2Assessment({ type: AssessmentTypeValue.ESOL }),
            aValidCurious2Assessment({ type: AssessmentTypeValue.READING }),
          ],
        }),
      ),
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    const prisonerFunctionalSkillsTable = $('[data-qa=functional-skills-table]')
    expect(prisonerFunctionalSkillsTable.length).toEqual(1)
    expect(prisonerFunctionalSkillsTable.find('tbody tr').length).toEqual(5)
    expect(prisonerFunctionalSkillsTable.find('tbody tr').eq(0).find('td').eq(0).text().trim()).toEqual(
      'English skills',
    )
    expect(prisonerFunctionalSkillsTable.find('tbody tr').eq(1).find('td').eq(0).text().trim()).toEqual('Maths skills')
    expect(prisonerFunctionalSkillsTable.find('tbody tr').eq(2).find('td').eq(0).text().trim()).toEqual(
      'Digital skills',
    )
    expect(prisonerFunctionalSkillsTable.find('tbody tr').eq(3).find('td').eq(0).text().trim()).toEqual('Reading')
    expect(prisonerFunctionalSkillsTable.find('tbody tr').eq(4).find('td').eq(0).text().trim()).toEqual('ESOL')
    expect($('[data-qa=no-functional-skills]').length).toEqual(0)
    expect($('[data-qa=functional-skills-curious-unavailable-message]').length).toEqual(0)
  })

  it('should render given prisoner has no functional skills', () => {
    // Given
    const params = {
      ...templateParams,
      prisonerFunctionalSkills: Result.fulfilled(
        validFunctionalSkills({
          assessments: [],
        }),
      ),
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=functional-skills-table]').length).toEqual(0)
    expect($('[data-qa=no-functional-skills]').length).toEqual(1)
    expect($('[data-qa=functional-skills-curious-unavailable-message]').length).toEqual(0)
  })

  it('should render Curious unavailable message given Curious API has failed to retrieve functional skills', () => {
    // Given
    const params = {
      ...templateParams,
      prisonerFunctionalSkills: Result.rejected(new Error('Failed to get Curious Functional Skills')),
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=functional-skills-table]').length).toEqual(0)
    expect($('[data-qa=no-functional-skills]').length).toEqual(0)
    expect($('[data-qa=functional-skills-curious-unavailable-message]').length).toEqual(1)
  })
})
