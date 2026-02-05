import nunjucks from 'nunjucks'
import * as cheerio from 'cheerio'
import { startOfDay } from 'date-fns'
import filterArrayOnPropertyFilter from '../../../../filters/filterArrayOnPropertyFilter'
import { Result } from '../../../../utils/result/result'
import aValidPrisonerSummary from '../../../../testsupport/prisonerSummaryTestDataBuilder'
import {
  anEmployabilitySkillResponseDto,
  anEmployabilitySkillsList,
} from '../../../../testsupport/employabilitySkillResponseDtoTestDataBuilder'
import formatPrisonerNameFilter, { NameFormat } from '../../../../filters/formatPrisonerNameFilter'
import { formatEmployabilitySkillsFilter } from '../../../../filters/formatEmployabilitySkillsFilter'
import formatEmployabilitySkillRatingFilter from '../../../../filters/formatEmployabilitySkillRatingFilter'
import EmployabilitySkillsValue from '../../../../enums/employabilitySkillsValue'
import EmployabilitySkillRatingValue from '../../../../enums/employabilitySkillRatingValue'

const njkEnv = nunjucks.configure([
  'node_modules/govuk-frontend/dist/',
  'node_modules/@ministryofjustice/frontend/',
  'server/views/',
  __dirname,
])

njkEnv //
  .addFilter('assetMap', () => '')
  .addFilter('formatFirst_name_Last_name', formatPrisonerNameFilter(NameFormat.First_name_Last_name))
  .addFilter('filterArrayOnProperty', filterArrayOnPropertyFilter)
  .addFilter('formatEmployabilitySkill', formatEmployabilitySkillsFilter)
  .addFilter('formatEmployabilitySkillRating', formatEmployabilitySkillRatingFilter)

const template = './employability-skill-ratings.njk'

const prisonerSummary = aValidPrisonerSummary()
const prisonNamesById = Result.fulfilled({ BXI: 'Brixton (HMP)', MDI: 'Moorland (HMP & YOI)' })
const employabilitySkills = Result.fulfilled(anEmployabilitySkillsList())
const skillType = EmployabilitySkillsValue.RELIABILITY
const userHasPermissionTo = jest.fn()
const templateParams = {
  prisonerSummary,
  userHasPermissionTo,
  prisonNamesById,
  employabilitySkills,
  skillType,
}

describe('View Employability Skill Ratings Page tests', () => {
  beforeEach(() => {
    jest.resetAllMocks()
    userHasPermissionTo.mockReturnValue(true)
  })

  it('should render the page', () => {
    // Given
    const params = {
      ...templateParams,
      employabilitySkills: Result.fulfilled(
        anEmployabilitySkillsList({
          employabilitySkills: [
            anEmployabilitySkillResponseDto({
              employabilitySkillType: EmployabilitySkillsValue.RELIABILITY,
              employabilitySkillRating: EmployabilitySkillRatingValue.VERY_CONFIDENT,
              updatedAt: startOfDay('2026-02-01'),
            }),
            anEmployabilitySkillResponseDto({ employabilitySkillType: EmployabilitySkillsValue.PROBLEM_SOLVING }),
            anEmployabilitySkillResponseDto({
              employabilitySkillType: EmployabilitySkillsValue.RELIABILITY,
              employabilitySkillRating: EmployabilitySkillRatingValue.NOT_CONFIDENT,
              updatedAt: startOfDay('2025-10-21'),
            }),
            anEmployabilitySkillResponseDto({ employabilitySkillType: EmployabilitySkillsValue.ORGANISATION }),
            anEmployabilitySkillResponseDto({
              employabilitySkillType: EmployabilitySkillsValue.RELIABILITY,
              employabilitySkillRating: EmployabilitySkillRatingValue.LITTLE_CONFIDENCE,
              updatedAt: startOfDay('2025-12-10'),
            }),
          ],
        }),
      ),
      skillType: EmployabilitySkillsValue.RELIABILITY,
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    const skillsRatingTable = $('[data-qa=RELIABILITY-employability-skill-ratings-table]')
    expect(skillsRatingTable.length).toEqual(1)
    expect(skillsRatingTable.find('tbody tr').length).toEqual(3) // expect 3 rows, one for each rating
    expect(skillsRatingTable.find('tbody tr').eq(0).find('td').eq(0).text().trim()).toEqual('4 - very confident')
    expect(skillsRatingTable.find('tbody tr').eq(1).find('td').eq(0).text().trim()).toEqual('2 - a little confident')
    expect(skillsRatingTable.find('tbody tr').eq(2).find('td').eq(0).text().trim()).toEqual('1 - not confident')
    expect($('[data-qa=no-employability-skill-ratings-recorded]').length).toEqual(0)
    expect($('[data-qa=employability-skills-unavailable-message]').length).toEqual(0)
  })

  it('should render the page given there are no ratings for the Employability Skills type', () => {
    // Given
    const params = {
      ...templateParams,
      employabilitySkills: Result.fulfilled(
        anEmployabilitySkillsList({
          employabilitySkills: [
            anEmployabilitySkillResponseDto({ employabilitySkillType: EmployabilitySkillsValue.PROBLEM_SOLVING }),
            anEmployabilitySkillResponseDto({ employabilitySkillType: EmployabilitySkillsValue.ORGANISATION }),
          ],
        }),
      ),
      skillType: EmployabilitySkillsValue.RELIABILITY, // Page view is for Reliability, but prisoner only has ratings for Problem Solving and Organisation
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=RELIABILITY-employability-skill-ratings-table]').length).toEqual(0)
    expect($('[data-qa=no-employability-skill-ratings-recorded]').length).toEqual(1)
    expect($('[data-qa=employability-skills-unavailable-message]').length).toEqual(0)
  })

  it('should render the page given there are no ratings of any Employability Skills type', () => {
    // Given
    const params = {
      ...templateParams,
      employabilitySkills: Result.fulfilled(
        anEmployabilitySkillsList({
          employabilitySkills: [],
        }),
      ),
      skillType: EmployabilitySkillsValue.RELIABILITY, // Page view is for Reliability, but prisoner only has no ratings at all
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=RELIABILITY-employability-skill-ratings-table]').length).toEqual(0)
    expect($('[data-qa=no-employability-skill-ratings-recorded]').length).toEqual(1)
    expect($('[data-qa=employability-skills-unavailable-message]').length).toEqual(0)
  })

  it('should render the page given the Employability Skills service API promise is not resolved', () => {
    // Given
    const params = {
      ...templateParams,
      employabilitySkills: Result.rejected(new Error('Failed to get Employability Skills')),
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=no-employability-skill-ratings-recorded]').length).toEqual(0)
    expect($('[data-qa=employability-skills-unavailable-message]').length).toEqual(1)
  })
})
