import * as fs from 'fs'
import cheerio from 'cheerio'
import moment from 'moment'
import nunjucks, { Template } from 'nunjucks'
import { registerNunjucks } from '../../../../../utils/nunjucksSetup'
import aValidPrisonerSummary from '../../../../../testsupport/prisonerSummaryTestDataBuilder'

describe('Education and Training tab view - Functional Skills', () => {
  const template = fs.readFileSync('server/views/pages/overview/partials/educationAndTrainingTab/_functionalSkills.njk')
  const prisonerSummary = aValidPrisonerSummary()

  let compiledTemplate: Template
  let viewContext: Record<string, unknown>

  const njkEnv = registerNunjucks()

  beforeEach(() => {
    compiledTemplate = nunjucks.compile(template.toString(), njkEnv)
  })

  it('should render content', () => {
    // Given
    viewContext = {
      prisonerSummary,
      tab: 'education-and-training',
      functionalSkills: {
        problemRetrievingData: false,
        assessments: [
          {
            assessmentDate: moment('2012-02-16').toDate(),
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
    expect($('#latest-functional-skills-table')).not.toBeUndefined()
    expect($('#latest-functional-skills-table .govuk-table__body .govuk-table__row').length).toEqual(1)
  })

  it('should render content saying curious is unavailable given problem retrieving data is true', () => {
    // Given
    viewContext = {
      prisonerSummary,
      tab: 'education-and-training',
      functionalSkills: {
        problemRetrievingData: true,
      },
    }

    // When
    const $ = cheerio.load(compiledTemplate.render(viewContext))

    // Then
    expect($('[data-qa="curious-unavailable-message"]').text()).toContain(
      'We cannot show these details from Curious right now',
    )
  })

  it('should render Functional Skill assessment date and grade if both are present for a Functional Skill assessment', () => {
    viewContext = {
      prisonerSummary,
      tab: 'education-and-training',
      functionalSkills: {
        problemRetrievingData: false,
        assessments: [
          {
            assessmentDate: moment('2012-02-16').toDate(),
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
    expect($('#latest-functional-skills-table tbody tr').length).toBe(1)
    expect($('#latest-functional-skills-table tbody tr td').length).toBe(5)
    expect($('#latest-functional-skills-table tbody tr td:nth-child(1)').text()).toEqual('English skills')
    expect($('#latest-functional-skills-table tbody tr td:nth-child(2)').text()).toEqual('16 February 2012')
    expect($('#latest-functional-skills-table tbody tr td:nth-child(3)').text()).toEqual('Level 1')
    expect($('#latest-functional-skills-table tbody tr td:nth-child(4)').text()).toEqual('Induction')
    expect($('#latest-functional-skills-table tbody tr td:nth-child(5)').text()).toEqual('Curious')
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
    expect($('#latest-functional-skills-table tbody tr').length).toBe(1)
    expect($('#latest-functional-skills-table tbody tr td').length).toBe(2)
    expect($('#latest-functional-skills-table tbody tr td:nth-child(1)').text()).toEqual('English skills')
    expect($('#latest-functional-skills-table tbody tr td:nth-child(2)').text()).toEqual(
      'No functional skill assessment scores recorded in Curious',
    )
  })
})
