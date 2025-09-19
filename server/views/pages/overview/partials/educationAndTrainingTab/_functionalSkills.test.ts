import nunjucks from 'nunjucks'
import * as cheerio from 'cheerio'
import { startOfDay } from 'date-fns'
import validFunctionalSkills from '../../../../../testsupport/functionalSkillsTestDataBuilder'
import formatDate from '../../../../../filters/formatDateFilter'
import formatFunctionalSkillTypeFilter from '../../../../../filters/formatFunctionalSkillTypeFilter'
import filterArrayOnPropertyFilter from '../../../../../filters/filterArrayOnPropertyFilter'
import {
  aValidCurious1Assessment,
  aValidCurious2Assessment,
} from '../../../../../testsupport/assessmentTestDataBuilder'
import { Result } from '../../../../../utils/result/result'
import AssessmentTypeValue from '../../../../../enums/assessmentTypeValue'

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

  it('should render Functional Skill assessments given prisoner only has 1 Curious1 assessment in Curious', () => {
    const params = {
      ...templateParams,
      prisonerFunctionalSkills: Result.fulfilled(
        validFunctionalSkills({
          assessments: [
            aValidCurious1Assessment({
              type: AssessmentTypeValue.ENGLISH,
              assessmentDate: startOfDay('2012-02-16'),
              level: 'Level 1',
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
    expect(functionalSkillsRows.eq(0).find('td').eq(2).text().trim()).toEqual('16 Feb 2012')
    expect(functionalSkillsRows.eq(0).find('td').eq(3).text().trim()).toEqual('Level 1')
    expect(functionalSkillsRows.eq(0).find('td').eq(4).text().trim()).toEqual('N/A')
    expect(functionalSkillsRows.eq(0).find('td').eq(5).text().trim()).toEqual('N/A')
    expect($('[data-qa=no-functional-skills-in-curious-message]').length).toEqual(0)
  })

  it('should render Functional Skill assessments given prisoner only has 1 Curious2 assessment in Curious', () => {
    const params = {
      ...templateParams,
      prisonerFunctionalSkills: Result.fulfilled(
        validFunctionalSkills({
          assessments: [
            aValidCurious2Assessment({
              type: AssessmentTypeValue.MATHS,
              assessmentDate: startOfDay('2025-10-02'),
              level: 'Entry Level 3',
              levelBanding: '3.5',
              nextStep: 'Progress to course at lower level due to individual circumstances',
              referral: 'Substance Misuse Team',
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
    expect(functionalSkillsRows.eq(0).find('td').eq(0).text().trim()).toEqual('Maths skills')
    expect(functionalSkillsRows.eq(0).find('td').eq(1).text().trim()).toEqual('Moorland (HMP & YOI)')
    expect(functionalSkillsRows.eq(0).find('td').eq(2).text().trim()).toEqual('2 Oct 2025')
    expect(functionalSkillsRows.eq(0).find('td').eq(3).text().trim()).toEqual('Entry Level 3 (3.5)')
    expect(functionalSkillsRows.eq(0).find('td').eq(4).text().trim()).toEqual(
      'Progress to course at lower level due to individual circumstances',
    )
    expect(functionalSkillsRows.eq(0).find('td').eq(5).text().trim()).toEqual('Substance Misuse Team')
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

  it('should render Functional Skill assessments given prisoner has several Curious 1 and Curious 2 assessments', () => {
    const params = {
      ...templateParams,
      prisonerFunctionalSkills: Result.fulfilled(
        validFunctionalSkills({
          assessments: [
            aValidCurious2Assessment({
              type: AssessmentTypeValue.READING,
              assessmentDate: startOfDay('2025-10-02'),
              level: 'consolidating reader',
              levelBanding: null,
              nextStep: 'Reading support not required at this time.',
              referral: 'Education Specialist',
              prisonId: 'BXI',
            }),
            aValidCurious1Assessment({
              type: AssessmentTypeValue.DIGITAL_LITERACY,
              assessmentDate: startOfDay('2012-02-16'),
              level: 'Level 1',
              prisonId: 'BXI',
            }),
            aValidCurious1Assessment({
              type: AssessmentTypeValue.DIGITAL_LITERACY,
              assessmentDate: startOfDay('2024-08-02'),
              level: 'Level 2',
              prisonId: 'BXI',
            }),
            aValidCurious2Assessment({
              type: AssessmentTypeValue.ESOL,
              assessmentDate: startOfDay('2025-10-02'),
              level: 'ESOL Pathway',
              levelBanding: null,
              nextStep: 'English Language Support Level 2',
              referral: 'Healthcare',
              prisonId: 'MDI',
            }),
            aValidCurious1Assessment({
              type: AssessmentTypeValue.MATHS,
              assessmentDate: startOfDay('2024-08-02'),
              level: 'Level 1',
              prisonId: 'BXI',
            }),
            aValidCurious1Assessment({
              type: AssessmentTypeValue.ENGLISH,
              assessmentDate: startOfDay('2024-04-18'),
              level: 'Level 1',
              prisonId: 'BXI',
            }),
            aValidCurious1Assessment({
              type: AssessmentTypeValue.ENGLISH,
              assessmentDate: startOfDay('2024-09-22'),
              level: 'Level 2',
              prisonId: 'BXI',
            }),
            aValidCurious2Assessment({
              type: AssessmentTypeValue.ENGLISH,
              assessmentDate: startOfDay('2025-10-22'),
              level: 'Level 2',
              levelBanding: '2.4',
              nextStep: 'Progress to course at lower level due to individual circumstances',
              referral: 'Education Specialist',
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
    expect(functionalSkillsRows.length).toEqual(5) // Expect 1 row for the most recent of each type
    expect(functionalSkillsRows.eq(0).find('td').eq(0).text().trim()).toEqual('English skills')
    expect(functionalSkillsRows.eq(0).find('td').eq(1).text().trim()).toEqual('Brixton (HMP)')
    expect(functionalSkillsRows.eq(0).find('td').eq(2).text().trim()).toEqual('22 Oct 2025')
    expect(functionalSkillsRows.eq(0).find('td').eq(3).text().trim()).toEqual('Level 2 (2.4)')
    expect(functionalSkillsRows.eq(0).find('td').eq(4).text().trim()).toEqual(
      'Progress to course at lower level due to individual circumstances',
    )
    expect(functionalSkillsRows.eq(0).find('td').eq(5).text().trim()).toEqual('Education Specialist')

    expect(functionalSkillsRows.eq(1).find('td').eq(0).text().trim()).toEqual('Maths skills')
    expect(functionalSkillsRows.eq(1).find('td').eq(1).text().trim()).toEqual('Brixton (HMP)')
    expect(functionalSkillsRows.eq(1).find('td').eq(2).text().trim()).toEqual('2 Aug 2024')
    expect(functionalSkillsRows.eq(1).find('td').eq(3).text().trim()).toEqual('Level 1')
    expect(functionalSkillsRows.eq(1).find('td').eq(4).text().trim()).toEqual('N/A')
    expect(functionalSkillsRows.eq(1).find('td').eq(5).text().trim()).toEqual('N/A')

    expect(functionalSkillsRows.eq(2).find('td').eq(0).text().trim()).toEqual('Digital skills')
    expect(functionalSkillsRows.eq(2).find('td').eq(1).text().trim()).toEqual('Brixton (HMP)')
    expect(functionalSkillsRows.eq(2).find('td').eq(2).text().trim()).toEqual('2 Aug 2024')
    expect(functionalSkillsRows.eq(2).find('td').eq(3).text().trim()).toEqual('Level 2')
    expect(functionalSkillsRows.eq(2).find('td').eq(4).text().trim()).toEqual('N/A')
    expect(functionalSkillsRows.eq(2).find('td').eq(5).text().trim()).toEqual('N/A')

    expect(functionalSkillsRows.eq(3).find('td').eq(0).text().trim()).toEqual('Reading')
    expect(functionalSkillsRows.eq(3).find('td').eq(1).text().trim()).toEqual('Brixton (HMP)')
    expect(functionalSkillsRows.eq(3).find('td').eq(2).text().trim()).toEqual('2 Oct 2025')
    expect(functionalSkillsRows.eq(3).find('td').eq(3).text().trim()).toEqual('consolidating reader')
    expect(functionalSkillsRows.eq(3).find('td').eq(4).text().trim()).toEqual(
      'Reading support not required at this time.',
    )
    expect(functionalSkillsRows.eq(3).find('td').eq(5).text().trim()).toEqual('Education Specialist')

    expect(functionalSkillsRows.eq(4).find('td').eq(0).text().trim()).toEqual('ESOL')
    expect(functionalSkillsRows.eq(4).find('td').eq(1).text().trim()).toEqual('Moorland (HMP & YOI)')
    expect(functionalSkillsRows.eq(4).find('td').eq(2).text().trim()).toEqual('2 Oct 2025')
    expect(functionalSkillsRows.eq(4).find('td').eq(3).text().trim()).toEqual('ESOL Pathway')
    expect(functionalSkillsRows.eq(4).find('td').eq(4).text().trim()).toEqual('English Language Support Level 2')
    expect(functionalSkillsRows.eq(4).find('td').eq(5).text().trim()).toEqual('Healthcare')

    expect($('[data-qa=no-functional-skills-in-curious-message]').length).toEqual(0)
  })
})
