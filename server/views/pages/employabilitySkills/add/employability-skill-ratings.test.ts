import nunjucks from 'nunjucks'
import * as cheerio from 'cheerio'
import { startOfDay } from 'date-fns'
import { Result } from '../../../../utils/result/result'
import aValidPrisonerSummary from '../../../../testsupport/prisonerSummaryTestDataBuilder'
import {
  anEmployabilitySkillResponseDto,
  anEmployabilitySkillsList,
} from '../../../../testsupport/employabilitySkillResponseDtoTestDataBuilder'
import formatPrisonerNameFilter, { NameFormat } from '../../../../filters/formatPrisonerNameFilter'
import {
  formatEmployabilitySkillQuestionTextFilter,
  formatEmployabilitySkillsFilter,
} from '../../../../filters/formatEmployabilitySkillsFilter'
import formatEmployabilitySkillRatingFilter from '../../../../filters/formatEmployabilitySkillRatingFilter'
import EmployabilitySkillsValue from '../../../../enums/employabilitySkillsValue'
import EmployabilitySkillRatingValue from '../../../../enums/employabilitySkillRatingValue'
import groupArrayByPropertyFilter from '../../../../filters/groupArrayByPropertyFilter'
import findErrorFilter from '../../../../filters/findErrorFilter'

const njkEnv = nunjucks.configure([
  'node_modules/govuk-frontend/dist/',
  'node_modules/@ministryofjustice/frontend/',
  'server/views/',
  __dirname,
])

njkEnv //
  .addFilter('assetMap', () => '')
  .addFilter('findError', findErrorFilter)
  .addFilter('formatFirst_name_Last_name', formatPrisonerNameFilter(NameFormat.First_name_Last_name))
  .addFilter('groupArrayByProperty', groupArrayByPropertyFilter)
  .addFilter('formatEmployabilitySkill', formatEmployabilitySkillsFilter)
  .addFilter('formatEmployabilitySkillQuestionText', formatEmployabilitySkillQuestionTextFilter)
  .addFilter('formatEmployabilitySkillRating', formatEmployabilitySkillRatingFilter)

const template = './employability-skill-ratings.njk'

const prisonerSummary = aValidPrisonerSummary()
const prisonNamesById = Result.fulfilled({ BXI: 'Brixton (HMP)', MDI: 'Moorland (HMP & YOI)' })
const employabilitySkills = Result.fulfilled(anEmployabilitySkillsList())
const skillType = EmployabilitySkillsValue.RELIABILITY

const templateParams = {
  prisonerSummary,
  prisonNamesById,
  employabilitySkills,
  skillType,
}

describe('Add Employability Skill Rating Page tests', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should render the page given a previous skill rating for the skill type', () => {
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
    const skillsRatingForm = $('[data-qa=RELIABILITY-employability-skill-ratings-form]')
    expect(skillsRatingForm.length).toEqual(1)
    const notConfidentRadio = skillsRatingForm.find('input[type=radio][value=NOT_CONFIDENT]')
    expect(notConfidentRadio.attr('checked')).toBeFalsy()
    expect($(notConfidentRadio.siblings().get(0)).text().trim()).toEqual('1 - not confident')
    const littleConfidenceRadio = skillsRatingForm.find('input[type=radio][value=LITTLE_CONFIDENCE]')
    expect(littleConfidenceRadio.attr('checked')).toBeFalsy()
    expect($(littleConfidenceRadio.siblings().get(0)).text().trim()).toEqual('2 - a little confident')
    const quiteConfidentRadio = skillsRatingForm.find('input[type=radio][value=QUITE_CONFIDENT]')
    expect(quiteConfidentRadio.attr('checked')).toBeFalsy()
    expect($(quiteConfidentRadio.siblings().get(0)).text().trim()).toEqual('3 - quite confident')
    const veryConfidentRadio = skillsRatingForm.find('input[type=radio][value=VERY_CONFIDENT]')
    expect(veryConfidentRadio.attr('checked')).toBeTruthy()
    expect($(veryConfidentRadio.siblings().get(0)).text().trim()).toEqual('4 - very confident (Current rating)')

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
    const skillsRatingForm = $('[data-qa=RELIABILITY-employability-skill-ratings-form]')
    expect(skillsRatingForm.length).toEqual(1)
    const notConfidentRadio = skillsRatingForm.find('input[type=radio][value=NOT_CONFIDENT]')
    expect(notConfidentRadio.attr('checked')).toBeFalsy()
    expect($(notConfidentRadio.siblings().get(0)).text().trim()).toEqual('1 - not confident')
    const littleConfidenceRadio = skillsRatingForm.find('input[type=radio][value=LITTLE_CONFIDENCE]')
    expect(littleConfidenceRadio.attr('checked')).toBeFalsy()
    expect($(littleConfidenceRadio.siblings().get(0)).text().trim()).toEqual('2 - a little confident')
    const quiteConfidentRadio = skillsRatingForm.find('input[type=radio][value=QUITE_CONFIDENT]')
    expect(quiteConfidentRadio.attr('checked')).toBeFalsy()
    expect($(quiteConfidentRadio.siblings().get(0)).text().trim()).toEqual('3 - quite confident')
    const veryConfidentRadio = skillsRatingForm.find('input[type=radio][value=VERY_CONFIDENT]')
    expect(veryConfidentRadio.attr('checked')).toBeFalsy()
    expect($(veryConfidentRadio.siblings().get(0)).text().trim()).toEqual('4 - very confident')

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
    const skillsRatingForm = $('[data-qa=RELIABILITY-employability-skill-ratings-form]')
    expect(skillsRatingForm.length).toEqual(1)
    const notConfidentRadio = skillsRatingForm.find('input[type=radio][value=NOT_CONFIDENT]')
    expect(notConfidentRadio.attr('checked')).toBeFalsy()
    expect($(notConfidentRadio.siblings().get(0)).text().trim()).toEqual('1 - not confident')
    const littleConfidenceRadio = skillsRatingForm.find('input[type=radio][value=LITTLE_CONFIDENCE]')
    expect(littleConfidenceRadio.attr('checked')).toBeFalsy()
    expect($(littleConfidenceRadio.siblings().get(0)).text().trim()).toEqual('2 - a little confident')
    const quiteConfidentRadio = skillsRatingForm.find('input[type=radio][value=QUITE_CONFIDENT]')
    expect(quiteConfidentRadio.attr('checked')).toBeFalsy()
    expect($(quiteConfidentRadio.siblings().get(0)).text().trim()).toEqual('3 - quite confident')
    const veryConfidentRadio = skillsRatingForm.find('input[type=radio][value=VERY_CONFIDENT]')
    expect(veryConfidentRadio.attr('checked')).toBeFalsy()
    expect($(veryConfidentRadio.siblings().get(0)).text().trim()).toEqual('4 - very confident')

    expect($('[data-qa=employability-skills-unavailable-message]').length).toEqual(0)
  })

  it('should not render the form given the Employability Skills service API promise is not resolved', () => {
    // Given
    const params = {
      ...templateParams,
      employabilitySkills: Result.rejected(new Error('Failed to get Employability Skills')),
      skillType: EmployabilitySkillsValue.RELIABILITY,
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=RELIABILITY-employability-skill-ratings-form]').length).toEqual(0)
    expect($('[data-qa=employability-skills-unavailable-message]').length).toEqual(1)
  })
})
