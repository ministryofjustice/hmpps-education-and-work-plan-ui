import nunjucks from 'nunjucks'
import * as cheerio from 'cheerio'
import { startOfDay } from 'date-fns'
import validFunctionalSkills from '../../../../../testsupport/functionalSkillsTestDataBuilder'
import formatDate from '../../../../../filters/formatDateFilter'
import formatFunctionalSkillTypeFilter from '../../../../../filters/formatFunctionalSkillTypeFilter'
import filterArrayOnPropertyFilter from '../../../../../filters/filterArrayOnPropertyFilter'
import aValidAssessment from '../../../../../testsupport/assessmentTestDataBuilder'
import { Result } from '../../../../../utils/result/result'

const njkEnv = nunjucks.configure([
  'node_modules/govuk-frontend/govuk/',
  'node_modules/govuk-frontend/govuk/components/',
  'node_modules/govuk-frontend/govuk/template/',
  'node_modules/govuk-frontend/dist/',
  'node_modules/@ministryofjustice/frontend/',
  'server/views/',
  __dirname,
])

njkEnv //
  .addFilter('formatDate', formatDate)
  .addFilter('formatFunctionalSkillType', formatFunctionalSkillTypeFilter)
  .addFilter('filterArrayOnProperty', filterArrayOnPropertyFilter)

const prisonNamesById = { BXI: 'Brixton (HMP)', MDI: 'Moorland (HMP & YOI)' }
const prisonerFunctionalSkills = Result.fulfilled(validFunctionalSkills())

const template = '_functionalSkills.njk'

const templateParams = {
  prisonerFunctionalSkills,
  prisonNamesById,
}

describe('Education and Training tab view - Functional Skills', () => {
  it('should render content saying curious is unavailable given Functional Skills promise is not resolved', () => {
    // Given
    const params = {
      ...templateParams,
      prisonerFunctionalSkills: Result.rejected(new Error('Failed to retrieve functional skills')),
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa="curious-unavailable-message"]').length).toEqual(1)
  })

  it('should render Functional Skill assessments given prisoner only has 1 assessment in Curious', () => {
    const params = {
      ...templateParams,
      prisonerFunctionalSkills: Result.fulfilled(
        validFunctionalSkills({
          assessments: [
            aValidAssessment({
              type: 'ENGLISH',
              assessmentDate: startOfDay('2012-02-16'),
              grade: 'Level 1',
              prisonId: 'MDI',
            }),
          ],
        }),
      ),
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    const functionalSkillsRows = $('#latest-functional-skills-table tbody tr')
    expect(functionalSkillsRows.length).toEqual(1)
    expect(functionalSkillsRows.eq(0).find('td').eq(0).text().trim()).toEqual('English skills')
    expect(functionalSkillsRows.eq(0).find('td').eq(1).text().trim()).toEqual('Moorland (HMP & YOI)')
    expect(functionalSkillsRows.eq(0).find('td').eq(2).text().trim()).toEqual('16 February 2012')
    expect(functionalSkillsRows.eq(0).find('td').eq(3).text().trim()).toEqual('Level 1')
    expect($('[data-qa=no-functional-skills-in-curious-message]').length).toEqual(0)
  })

  it('should render Functional Skill assessments given prisoner has no assessments in Curious', () => {
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
    expect($('[data-qa=no-functional-skills-in-curious-message]').length).toEqual(1)
    expect($('#latest-functional-skills-table').length).toEqual(0)
  })

  it('should render Functional Skill assessments given prisoner has several assessments in Curious', () => {
    const params = {
      ...templateParams,
      prisonerFunctionalSkills: Result.fulfilled(
        validFunctionalSkills({
          assessments: [
            aValidAssessment({
              type: 'DIGITAL_LITERACY',
              assessmentDate: startOfDay('2012-02-16'),
              grade: 'Level 1',
              prisonId: 'BXI',
            }),
            aValidAssessment({
              type: 'DIGITAL_LITERACY',
              assessmentDate: startOfDay('2024-08-02'),
              grade: 'Level 2',
              prisonId: 'BXI',
            }),
            aValidAssessment({
              type: 'MATHS',
              assessmentDate: startOfDay('2024-08-02'),
              grade: 'Level 1',
              prisonId: 'BXI',
            }),
            aValidAssessment({
              type: 'ENGLISH',
              assessmentDate: startOfDay('2024-04-18'),
              grade: 'Level 1',
              prisonId: 'BXI',
            }),
            aValidAssessment({
              type: 'ENGLISH',
              assessmentDate: startOfDay('2024-09-22'),
              grade: 'Level 2',
              prisonId: 'BXI',
            }),
          ],
        }),
      ),
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    const functionalSkillsRows = $('#latest-functional-skills-table tbody tr')
    expect(functionalSkillsRows.length).toEqual(3) // Expect 1 row for the most recent of each type
    expect(functionalSkillsRows.eq(0).find('td').eq(0).text().trim()).toEqual('English skills')
    expect(functionalSkillsRows.eq(0).find('td').eq(1).text().trim()).toEqual('Brixton (HMP)')
    expect(functionalSkillsRows.eq(0).find('td').eq(2).text().trim()).toEqual('22 September 2024')
    expect(functionalSkillsRows.eq(0).find('td').eq(3).text().trim()).toEqual('Level 2')

    expect(functionalSkillsRows.eq(1).find('td').eq(0).text().trim()).toEqual('Maths skills')
    expect(functionalSkillsRows.eq(1).find('td').eq(1).text().trim()).toEqual('Brixton (HMP)')
    expect(functionalSkillsRows.eq(1).find('td').eq(2).text().trim()).toEqual('2 August 2024')
    expect(functionalSkillsRows.eq(1).find('td').eq(3).text().trim()).toEqual('Level 1')

    expect(functionalSkillsRows.eq(2).find('td').eq(0).text().trim()).toEqual('Digital skills')
    expect(functionalSkillsRows.eq(2).find('td').eq(1).text().trim()).toEqual('Brixton (HMP)')
    expect(functionalSkillsRows.eq(2).find('td').eq(2).text().trim()).toEqual('2 August 2024')
    expect(functionalSkillsRows.eq(2).find('td').eq(3).text().trim()).toEqual('Level 2')

    expect($('[data-qa=no-functional-skills-in-curious-message]').length).toEqual(0)
  })
})
