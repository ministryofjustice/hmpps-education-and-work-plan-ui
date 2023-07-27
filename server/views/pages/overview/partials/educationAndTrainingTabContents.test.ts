import fs from 'fs'
import cheerio from 'cheerio'
import moment from 'moment'
import nunjucks, { Template } from 'nunjucks'
import { registerNunjucks } from '../../../../utils/nunjucksSetup'

describe('Education and Training tab view', () => {
  const template = fs.readFileSync('server/views/pages/overview/partials/educationAndTrainingTabContents.njk')
  const prisonerSummary = {
    prisonNumber: 'A1234BC',
    releaseDate: '2025-12-31',
    location: 'C-01-04',
    firstName: 'Jimmy',
    lastName: 'Lightfingers',
  }

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
    expect($('#functional-skills-table')).not.toBeUndefined()
    expect($('#functional-skills-table .govuk-table__body .govuk-table__row').length).toEqual(1)
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
    expect($('h2').text()).toEqual('Sorry, the Curious service is currently unavailable.')
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
    expect($('#functional-skills-table tbody tr').length).toBe(1)
    expect($('#functional-skills-table tbody tr td').length).toBe(4)
    expect($('#functional-skills-table tbody tr td:nth-child(1)').text()).toEqual('English skills')
    expect($('#functional-skills-table tbody tr td:nth-child(2)').text()).toEqual('16 February 2012')
    expect($('#functional-skills-table tbody tr td:nth-child(3)').text()).toEqual('Level 1')
    expect($('#functional-skills-table tbody tr td:nth-child(4)').text()).toEqual('Induction')
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
    expect($('#functional-skills-table tbody tr').length).toBe(1)
    expect($('#functional-skills-table tbody tr td').length).toBe(2)
    expect($('#functional-skills-table tbody tr td:nth-child(1)').text()).toEqual('English skills')
    expect($('#functional-skills-table tbody tr td:nth-child(2)').text()).toEqual(
      'No functional skills assessment recorded',
    )
  })
})
