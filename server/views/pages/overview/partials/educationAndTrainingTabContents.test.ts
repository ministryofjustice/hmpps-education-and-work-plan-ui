import fs from 'fs'
import cheerio from 'cheerio'
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
    expect($('h2').text()).toEqual('Sorry, Functional Skills data from Curious is unavailable')
  })
})
