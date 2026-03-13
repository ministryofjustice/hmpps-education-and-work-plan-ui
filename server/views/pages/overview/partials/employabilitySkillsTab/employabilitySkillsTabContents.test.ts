import nunjucks from 'nunjucks'
import * as cheerio from 'cheerio'
import { startOfDay } from 'date-fns'
import formatPrisonerNameFilter, { NameFormat } from '../../../../../filters/formatPrisonerNameFilter'
import filterArrayOnPropertyFilter from '../../../../../filters/filterArrayOnPropertyFilter'
import { formatEmployabilitySkillsFilter } from '../../../../../filters/formatEmployabilitySkillsFilter'
import formatEmployabilitySkillRatingFilter from '../../../../../filters/formatEmployabilitySkillRatingFilter'
import aValidPrisonerSummary from '../../../../../testsupport/prisonerSummaryTestDataBuilder'
import { Result } from '../../../../../utils/result/result'
import {
  anEmployabilitySkillResponseDto,
  anEmployabilitySkillsList,
} from '../../../../../testsupport/employabilitySkillResponseDtoTestDataBuilder'
import EmployabilitySkillsValue from '../../../../../enums/employabilitySkillsValue'
import EmployabilitySkillRatingValue from '../../../../../enums/employabilitySkillRatingValue'
import groupArrayByPropertyFilter from '../../../../../filters/groupArrayByPropertyFilter'
import { aValidInductionDto } from '../../../../../testsupport/inductionDtoTestDataBuilder'

const njkEnv = nunjucks.configure([
  'node_modules/govuk-frontend/dist/',
  'node_modules/@ministryofjustice/frontend/',
  'server/views/',
  __dirname,
])

njkEnv //
  .addFilter('formatFirst_name_Last_name', formatPrisonerNameFilter(NameFormat.First_name_Last_name))
  .addFilter('filterArrayOnProperty', filterArrayOnPropertyFilter)
  .addFilter('formatEmployabilitySkill', formatEmployabilitySkillsFilter)
  .addFilter('formatEmployabilitySkillRating', formatEmployabilitySkillRatingFilter)
  .addFilter('groupArrayByProperty', groupArrayByPropertyFilter)

const template = './employabilitySkillsTabContents.njk'

const prisonerSummary = aValidPrisonerSummary()
const employabilitySkills = Result.fulfilled(anEmployabilitySkillsList())
const induction = Result.fulfilled(aValidInductionDto())
const inductionStatus = Result.fulfilled('DUE')

const userHasPermissionTo = jest.fn()
const templateParams = {
  prisonerSummary,
  userHasPermissionTo,
  employabilitySkills,
  induction,
  inductionStatus,
}

describe('employabilitySkillsTabContents', () => {
  beforeEach(() => {
    jest.resetAllMocks()
    userHasPermissionTo.mockReturnValue(true)
  })

  it('should render the page given the prisoner has employability skills', () => {
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
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    const skillsRatingTable = $('[data-qa=employability-skills-ratings-table]')
    expect(skillsRatingTable.length).toEqual(1)
    expect(skillsRatingTable.find('tbody tr').length).toEqual(10) // expect 10 rows, one for each skill type
    expect(skillsRatingTable.find('tbody tr').eq(0).find('th').eq(0).text().trim()).toEqual('Adaptability')
    expect(skillsRatingTable.find('tbody tr').eq(0).find('td').eq(0).text().trim()).toEqual('Not assessed')
    expect(skillsRatingTable.find('tbody tr').eq(0).find('td').eq(1).text().trim()).toEqual('N/A')
    expect(skillsRatingTable.find('tbody tr').eq(1).find('th').eq(0).text().trim()).toEqual('Communication')
    expect(skillsRatingTable.find('tbody tr').eq(1).find('td').eq(0).text().trim()).toEqual('Not assessed')
    expect(skillsRatingTable.find('tbody tr').eq(1).find('td').eq(1).text().trim()).toEqual('N/A')
    expect(skillsRatingTable.find('tbody tr').eq(2).find('th').eq(0).text().trim()).toEqual('Creativity')
    expect(skillsRatingTable.find('tbody tr').eq(2).find('td').eq(0).text().trim()).toEqual('Not assessed')
    expect(skillsRatingTable.find('tbody tr').eq(2).find('td').eq(1).text().trim()).toEqual('N/A')
    expect(skillsRatingTable.find('tbody tr').eq(3).find('th').eq(0).text().trim()).toEqual('Initiative')
    expect(skillsRatingTable.find('tbody tr').eq(3).find('td').eq(0).text().trim()).toEqual('Not assessed')
    expect(skillsRatingTable.find('tbody tr').eq(3).find('td').eq(1).text().trim()).toEqual('N/A')
    expect(skillsRatingTable.find('tbody tr').eq(4).find('th').eq(0).text().trim()).toEqual('Organisation')
    expect(skillsRatingTable.find('tbody tr').eq(4).find('td').eq(0).text().trim()).toEqual('3 - quite confident')
    expect(skillsRatingTable.find('tbody tr').eq(4).find('td').eq(1).text().trim()).toEqual('N/A')
    expect(skillsRatingTable.find('tbody tr').eq(5).find('th').eq(0).text().trim()).toEqual('Planning')
    expect(skillsRatingTable.find('tbody tr').eq(5).find('td').eq(0).text().trim()).toEqual('Not assessed')
    expect(skillsRatingTable.find('tbody tr').eq(5).find('td').eq(1).text().trim()).toEqual('N/A')
    expect(skillsRatingTable.find('tbody tr').eq(6).find('th').eq(0).text().trim()).toEqual('Problem solving')
    expect(skillsRatingTable.find('tbody tr').eq(6).find('td').eq(0).text().trim()).toEqual('3 - quite confident')
    expect(skillsRatingTable.find('tbody tr').eq(6).find('td').eq(1).text().trim()).toEqual('N/A')
    expect(skillsRatingTable.find('tbody tr').eq(7).find('th').eq(0).text().trim()).toEqual('Reliability')
    expect(skillsRatingTable.find('tbody tr').eq(7).find('td').eq(0).text().trim()).toEqual('4 - very confident')
    expect(skillsRatingTable.find('tbody tr').eq(7).find('td').eq(1).text().trim()).toEqual('2 - a little confident')
    expect(skillsRatingTable.find('tbody tr').eq(8).find('th').eq(0).text().trim()).toEqual('Teamwork')
    expect(skillsRatingTable.find('tbody tr').eq(8).find('td').eq(0).text().trim()).toEqual('Not assessed')
    expect(skillsRatingTable.find('tbody tr').eq(8).find('td').eq(1).text().trim()).toEqual('N/A')
    expect(skillsRatingTable.find('tbody tr').eq(9).find('th').eq(0).text().trim()).toEqual('Timekeeping')
    expect(skillsRatingTable.find('tbody tr').eq(9).find('td').eq(0).text().trim()).toEqual('Not assessed')
    expect(skillsRatingTable.find('tbody tr').eq(9).find('td').eq(1).text().trim()).toEqual('N/A')

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
    expect($('[data-qa=employability-skills-ratings-table]').length).toEqual(0)
    expect($('[data-qa=employability-skills-unavailable-message]').length).toEqual(1)
  })

  it('should render the page given the Induction promise is not resolved', () => {
    // Given
    const params = {
      ...templateParams,
      induction: Result.rejected(new Error('Failed to get Induction')),
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=employability-skills-ratings-table]').length).toEqual(0)
    expect($('[data-qa=employability-skills-unavailable-message]').length).toEqual(1)
  })

  it('should not render link to create induction given prisoner has no induction and user does not have permission to create inductions', () => {
    // Given
    userHasPermissionTo.mockReturnValue(false)
    const params = {
      ...templateParams,
      induction: Result.fulfilled(null),
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('#employability-skills-summary-card').length).toEqual(0)

    expect($('[data-qa=induction-not-created-yet]').length).toEqual(1)
    expect($('[data-qa=link-to-create-induction]').length).toEqual(0)

    expect($('[data-qa=employability-skills-unavailable-message]').length).toEqual(0)

    expect(userHasPermissionTo).toHaveBeenCalledWith('RECORD_INDUCTION')
  })

  it('should render link to create induction given prisoner has no induction and user does have permission to create inductions', () => {
    // Given
    userHasPermissionTo.mockReturnValue(true)
    const params = {
      ...templateParams,
      induction: Result.fulfilled(null),
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('#employability-skills-summary-card').length).toEqual(0)

    expect($('[data-qa=induction-not-created-yet]').length).toEqual(1)
    expect($('[data-qa=link-to-create-induction]').length).toEqual(1)

    expect($('[data-qa=employability-skills-unavailable-message]').length).toEqual(0)

    expect(userHasPermissionTo).toHaveBeenCalledWith('RECORD_INDUCTION')
  })

  it('should not render link to create induction given prisoner has no induction and user does have permission to create inductions but induction status is on hold', () => {
    // Given
    userHasPermissionTo.mockReturnValue(true)
    const params = {
      ...templateParams,
      induction: Result.fulfilled(null),
      inductionStatus: Result.fulfilled('ON_HOLD'),
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=work-and-interests-question-set]').length).toEqual(0)
    expect($('#in-prison-work-interests-summary-card').length).toEqual(0)
    expect($('#skills-and-interests-summary-card').length).toEqual(0)

    expect($('[data-qa=induction-not-created-yet]').length).toEqual(1)
    expect($('[data-qa=link-to-create-induction]').length).toEqual(0)

    expect($('[data-qa=induction-unavailable-message]').length).toEqual(0)

    expect(userHasPermissionTo).toHaveBeenCalledWith('RECORD_INDUCTION')
  })

  it('should not render link to create induction given prisoner has no induction and user does have permission to create inductions but there was a problem retrieving the inductions status', () => {
    // Given
    userHasPermissionTo.mockReturnValue(true)
    const params = {
      ...templateParams,
      induction: Result.fulfilled(null),
      inductionStatus: Result.rejected('some error'),
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=work-and-interests-question-set]').length).toEqual(0)
    expect($('#in-prison-work-interests-summary-card').length).toEqual(0)
    expect($('#skills-and-interests-summary-card').length).toEqual(0)

    expect($('[data-qa=induction-not-created-yet]').length).toEqual(1)
    expect($('[data-qa=link-to-create-induction]').length).toEqual(0)

    expect($('[data-qa=induction-unavailable-message]').length).toEqual(0)

    expect(userHasPermissionTo).toHaveBeenCalledWith('RECORD_INDUCTION')
  })
})
