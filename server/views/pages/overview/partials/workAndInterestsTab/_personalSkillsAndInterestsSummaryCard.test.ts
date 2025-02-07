import nunjucks from 'nunjucks'
import * as cheerio from 'cheerio'
import { startOfDay } from 'date-fns'
import { aValidInductionDto } from '../../../../../testsupport/inductionDtoTestDataBuilder'
import objectsSortedAlphabeticallyWithOtherLastByFilter from '../../../../../filters/objectsSortedAlphabeticallyWithOtherLastByFilter'
import formatSkillFilter from '../../../../../filters/formatSkillFilter'
import formatPersonalInterestFilter from '../../../../../filters/formatPersonalInterestFilter'
import formatDateFilter from '../../../../../filters/formatDateFilter'
import aValidPrisonerSummary from '../../../../../testsupport/prisonerSummaryTestDataBuilder'

const njkEnv = nunjucks.configure([
  'node_modules/govuk-frontend/dist/',
  'node_modules/@ministryofjustice/frontend/',
  'server/views/',
  __dirname,
])
njkEnv
  .addFilter('objectsSortedAlphabeticallyWithOtherLastBy', objectsSortedAlphabeticallyWithOtherLastByFilter)
  .addFilter('formatDate', formatDateFilter)
  .addFilter('formatSkill', formatSkillFilter)
  .addFilter('formatPersonalInterest', formatPersonalInterestFilter)

const userHasPermissionTo = jest.fn()
const templateParams = {
  prisonerSummary: aValidPrisonerSummary(),
  userHasPermissionTo,
  induction: {
    problemRetrievingData: false,
    inductionDto: aValidInductionDto(),
  },
  inductionSchedule: {
    problemRetrievingData: false,
    inductionStatus: 'COMPLETE',
    inductionDueDate: startOfDay('2025-02-15'),
  },
}

describe('_personalSkillsAndInterestsSummaryCard', () => {
  beforeEach(() => {
    jest.resetAllMocks()
    userHasPermissionTo.mockReturnValue(true)
  })

  it('should display Skills and Interests given induction with personal skills and interests', () => {
    // Given
    const inductionDto = aValidInductionDto()
    const params = {
      ...templateParams,
      induction: {
        problemRetrievingData: false,
        inductionDto,
      },
    }

    // When
    const content = nunjucks.render('_personalSkillsAndInterestsSummaryCard.njk', params)
    const $ = cheerio.load(content)

    // Then
    const skills = $('[data-qa=skills]')
      .find('li')
      .toArray()
      .map(el => $(el).text().trim())
    expect(skills).toEqual(['Teamwork', 'Willingness to learn', 'Other - Tenacity'])
    expect($('[data-qa=skills-not-recorded]').length).toEqual(0)
    expect($('[data-qa=skills-change-link]').text().trim()).toEqual('Change skills')

    const personalInterests = $('[data-qa=personal-interests]')
      .find('li')
      .toArray()
      .map(el => $(el).text().trim())
    expect(personalInterests).toEqual(['Creative', 'Digital', 'Other - Renewable energy'])
    expect($('[data-qa=personal-interests-not-recorded]').length).toEqual(0)
    expect($('[data-qa=personal-interests-change-link]').text().trim()).toEqual('Change personal interests')
    expect($('[data-qa=last-updated]').text().trim()).toEqual('Last updated: 19 June 2023 by Alex Smith')
    expect(userHasPermissionTo).toHaveBeenCalledWith('UPDATE_INDUCTION')
  })

  it('should display Add link for Skills and Interests given personal skills and interests are undefined', () => {
    // Given
    const inductionDto = aValidInductionDto()
    inductionDto.personalSkillsAndInterests = undefined
    const params = {
      ...templateParams,
      induction: {
        problemRetrievingData: false,
        inductionDto,
      },
    }

    // When
    const content = nunjucks.render('_personalSkillsAndInterestsSummaryCard.njk', params)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=skills]').length).toEqual(0)
    expect($('[data-qa=skills-not-recorded]').length).toEqual(1)
    expect($('[data-qa=skills-change-link]').text().trim()).toEqual('Add skills')

    expect($('[data-qa=personal-interests]').length).toEqual(0)
    expect($('[data-qa=personal-interests-not-recorded]').length).toEqual(1)
    expect($('[data-qa=personal-interests-change-link]').text().trim()).toEqual('Add personal interests')
    expect($('[data-qa=last-updated]').length).toEqual(0)
  })

  it('should not display change link for Skills and Interests given user does not have permission to update inductions', () => {
    // Given
    userHasPermissionTo.mockReturnValue(false)
    const inductionDto = aValidInductionDto()
    inductionDto.personalSkillsAndInterests = undefined
    const params = {
      ...templateParams,
      induction: {
        problemRetrievingData: false,
        inductionDto,
      },
    }

    // When
    const content = nunjucks.render('_personalSkillsAndInterestsSummaryCard.njk', params)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=skills-change-link]').length).toEqual(0)
    expect($('[data-qa=personal-interests-change-link]').length).toEqual(0)
    expect(userHasPermissionTo).toHaveBeenCalledWith('UPDATE_INDUCTION')
  })

  it('should display Add link for Skills given empty array of personal skills', () => {
    // Given
    const inductionDto = aValidInductionDto()
    inductionDto.personalSkillsAndInterests.skills = []
    const params = {
      ...templateParams,
      induction: {
        problemRetrievingData: false,
        inductionDto,
      },
    }

    // When
    const content = nunjucks.render('_personalSkillsAndInterestsSummaryCard.njk', params)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=skills]').length).toEqual(0)
    expect($('[data-qa=skills-not-recorded]')).not.toBeNull()
    expect($('[data-qa=skills-change-link]').text().trim()).toEqual('Add skills')
    expect(userHasPermissionTo).toHaveBeenCalledWith('UPDATE_INDUCTION')
  })

  it('should display Add link for Interests given empty array of personal interests', () => {
    // Given
    const inductionDto = aValidInductionDto()
    inductionDto.personalSkillsAndInterests.interests = []
    const params = {
      ...templateParams,
      induction: {
        problemRetrievingData: false,
        inductionDto,
      },
    }

    // When
    const content = nunjucks.render('_personalSkillsAndInterestsSummaryCard.njk', params)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=personal-interests]').length).toEqual(0)
    expect($('[data-qa=personal-interests-not-recorded]')).not.toBeNull()
    expect($('[data-qa=personal-interests-change-link]').text().trim()).toEqual('Add personal interests')
    expect(userHasPermissionTo).toHaveBeenCalledWith('UPDATE_INDUCTION')
  })
})
