import * as fs from 'fs'
import cheerio from 'cheerio'
import moment from 'moment'
import nunjucks, { Template } from 'nunjucks'
import { registerNunjucks } from '../../../../../utils/nunjucksSetup'
import aValidPrisonerSummary from '../../../../../testsupport/prisonerSummaryTestDataBuilder'

describe('Functional skills sidebar view', () => {
  const prisonerSummary = aValidPrisonerSummary()

  let compiledTemplate: Template
  let viewContext: Record<string, unknown>

  const njkEnv = registerNunjucks()

  describe('overviewSideFunctionalSkills', () => {
    const template = fs.readFileSync('server/views/pages/overview/partials/overviewTab/functionalSkillsSidebar.njk')

    beforeEach(() => {
      compiledTemplate = nunjucks.compile(template.toString(), njkEnv)
    })

    it('should render content', () => {
      // Given
      viewContext = {
        prisonerSummary,
        tab: 'overview',
        functionalSkills: {
          problemRetrievingData: false,
          assessments: [
            {
              assessmentDate: moment('2021-05-03').toDate(),
              grade: 'Level 1',
              prisonId: 'MDI',
              prisonName: 'MOORLAND (HMP & YOI)',
              type: 'ENGLISH',
            },
            {
              assessmentDate: moment('2021-07-01').toDate(),
              grade: 'Entry Level 1',
              prisonId: 'MDI',
              prisonName: 'MOORLAND (HMP & YOI)',
              type: 'MATHS',
            },
          ],
        },
      }

      // When
      const $ = cheerio.load(compiledTemplate.render(viewContext))

      // Then
      expect($('#functional-skills-sidebar-table')).not.toBeUndefined()
      expect($('#functional-skills-sidebar-table .govuk-table__body .govuk-table__row').length).toEqual(2)
    })

    it('should render content saying curious is unavailable given problem retrieving data is true', () => {
      // Given
      viewContext = {
        prisonerSummary,
        tab: 'overview',
        functionalSkills: {
          problemRetrievingData: true,
        },
      }

      // When
      const $ = cheerio.load(compiledTemplate.render(viewContext))

      // Then
      expect($('[data-qa=functional-skills-sidebar-error-heading]').text()).toEqual(
        'We cannot show these details from Curious right now',
      )
    })

    it('should render Functional Skill assessment date and grade if both are present for a Functional Skill assessment', () => {
      viewContext = {
        prisonerSummary,
        tab: 'overview',
        functionalSkills: {
          problemRetrievingData: false,
          assessments: [
            {
              assessmentDate: moment('2021-05-03').toDate(),
              grade: 'Level 1',
              prisonId: 'MDI',
              prisonName: 'MOORLAND (HMP & YOI)',
              type: 'ENGLISH',
            },
          ],
        },
      }

      // When
      const $ = cheerio.load(compiledTemplate.render(viewContext))

      // Then
      expect($('#functional-skills-sidebar-table tbody tr').length).toBe(1)
      expect($('#functional-skills-sidebar-table tbody tr th').text().trim()).toContain('English skills')
      expect($('#functional-skills-sidebar-table tbody tr th span').text().trim()).toEqual('Assessed on 3 May 2021')
      expect($('#functional-skills-sidebar-table tbody tr td').text().trim()).toEqual('Level 1')
    })

    it('should render Functional Skill not recorded if both assessment date and grade are not present for a Functional Skill assessment', () => {
      viewContext = {
        prisonerSummary,
        tab: 'education-and-training',
        functionalSkills: {
          problemRetrievingData: false,
          assessments: [
            {
              type: 'ENGLISH',
            },
          ],
        },
      }

      // When
      const $ = cheerio.load(compiledTemplate.render(viewContext))

      // Then
      expect($('#functional-skills-sidebar-table tbody tr').length).toBe(1)
      expect($('#functional-skills-sidebar-table tbody tr th').text().trim()).toEqual('English skills')
      expect($('#functional-skills-sidebar-table tbody tr td').text().trim()).toEqual(
        'No functional skills recorded in Curious',
      )
    })
  })
})
