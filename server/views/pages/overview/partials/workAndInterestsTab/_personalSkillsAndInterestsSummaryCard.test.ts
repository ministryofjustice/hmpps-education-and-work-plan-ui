import nunjucks from 'nunjucks'
import * as cheerio from 'cheerio'
import type { InductionDto } from 'inductionDto'
import { aValidInductionDto } from '../../../../../testsupport/inductionDtoTestDataBuilder'
import objectsSortedAlphabeticallyWithOtherLastByFilter from '../../../../../filters/objectsSortedAlphabeticallyWithOtherLastByFilter'
import formatSkillFilter from '../../../../../filters/formatSkillFilter'
import formatPersonalInterestFilter from '../../../../../filters/formatPersonalInterestFilter'
import formatDateFilter from '../../../../../filters/formatDateFilter'
import WorkAndInterestsView from '../../../../../routes/overview/workAndInterestsView'
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

describe('_personalSkillsAndInterestsSummaryCard', () => {
  it('should display Skills and Interests given induction with personal skills and interests', () => {
    // Given
    const inductionDto = aValidInductionDto()
    const pageViewModel = workAndInterestsView(inductionDto)

    // When
    const content = nunjucks.render('_personalSkillsAndInterestsSummaryCard.njk', pageViewModel)
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
  })

  it('should display Add link for Skills and Interests given personal skills and interests are undefined', () => {
    // Given
    const inductionDto = aValidInductionDto()
    inductionDto.personalSkillsAndInterests = undefined
    const pageViewModel = workAndInterestsView(inductionDto)

    // When
    const content = nunjucks.render('_personalSkillsAndInterestsSummaryCard.njk', pageViewModel)
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

  it('should display Add link for Skills given empty array of personal skills', () => {
    // Given
    const inductionDto = aValidInductionDto()
    inductionDto.personalSkillsAndInterests.skills = []
    const pageViewModel = workAndInterestsView(inductionDto)

    // When
    const content = nunjucks.render('_personalSkillsAndInterestsSummaryCard.njk', pageViewModel)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=skills]').length).toEqual(0)
    expect($('[data-qa=skills-not-recorded]')).not.toBeNull()
    expect($('[data-qa=skills-change-link]').text().trim()).toEqual('Add skills')
  })

  it('should display Add link for Interests given empty array of personal interests', () => {
    // Given
    const inductionDto = aValidInductionDto()
    inductionDto.personalSkillsAndInterests.interests = []
    const pageViewModel = workAndInterestsView(inductionDto)

    // When
    const content = nunjucks.render('_personalSkillsAndInterestsSummaryCard.njk', pageViewModel)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=personal-interests]').length).toEqual(0)
    expect($('[data-qa=personal-interests-not-recorded]')).not.toBeNull()
    expect($('[data-qa=personal-interests-change-link]').text().trim()).toEqual('Add personal interests')
  })
})

const workAndInterestsView = (inductionDto: InductionDto): WorkAndInterestsView =>
  new WorkAndInterestsView(aValidPrisonerSummary(), { problemRetrievingData: false, inductionDto })
