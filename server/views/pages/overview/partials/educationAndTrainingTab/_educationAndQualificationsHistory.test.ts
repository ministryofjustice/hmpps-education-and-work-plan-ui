import nunjucks from 'nunjucks'
import * as cheerio from 'cheerio'
import { parseISO } from 'date-fns'
import type { EducationDto } from 'dto'
import type { InductionDto } from 'inductionDto'
import formatDateFilter from '../../../../../filters/formatDateFilter'
import aValidEducationDto from '../../../../../testsupport/educationDtoTestDataBuilder'
import { aValidInductionDto } from '../../../../../testsupport/inductionDtoTestDataBuilder'
import aValidPrisonerSummary from '../../../../../testsupport/prisonerSummaryTestDataBuilder'
import achievedQualificationObjectsSortedInScreenOrderFilter from '../../../../../filters/achievedQualificationObjectsSortedInScreenOrderFilter'
import formatQualificationLevel from '../../../../../filters/formatQualificationLevelFilter'
import formatEducationLevel from '../../../../../filters/formatEducationLevelFilter'
import sortedAlphabeticallyWithOtherLastFilter from '../../../../../filters/sortedAlphabeticallyWithOtherLastFilter'
import formatAdditionalTrainingFilter from '../../../../../filters/formatAdditionalTrainingFilter'

const njkEnv = nunjucks.configure([
  'node_modules/govuk-frontend/dist/',
  'node_modules/@ministryofjustice/frontend/',
  'server/views/',
  __dirname,
])
njkEnv
  .addFilter('achievedQualificationObjectsSortedInScreenOrder', achievedQualificationObjectsSortedInScreenOrderFilter)
  .addFilter('sortedAlphabeticallyWithOtherLast', sortedAlphabeticallyWithOtherLastFilter)
  .addFilter('formatQualificationLevel', formatQualificationLevel)
  .addFilter('formatEducationLevel', formatEducationLevel)
  .addFilter('formatDate', formatDateFilter)
  .addFilter('formatAdditionalTraining', formatAdditionalTrainingFilter)

const prisonerSummary = aValidPrisonerSummary()

describe('_educationAndQualificationsHistory', () => {
  it('should show qualifications including highest level of education and prompt to create induction given prisoner has education data but no induction', () => {
    // Given
    const educationDto = aValidEducationDto()
    const inductionDto: InductionDto = undefined
    const pageViewModel = {
      induction: {
        problemRetrievingData: false,
        inductionDto,
      },
      education: {
        problemRetrievingData: false,
        educationDto,
      },
      prisonerSummary,
      hasEditAuthority: true,
    }

    // When
    const content = nunjucks.render('_educationAndQualificationsHistory.njk', pageViewModel)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=educational-qualifications-table]').length).toEqual(1)
    expect($('[data-qa=educational-qualifications-change-link]').length).toEqual(1)
    expect($('[data-qa=highest-level-of-education]').length).toEqual(1)
    expect($('[data-qa=highest-level-of-education-change-link]').length).toEqual(1)
    expect($('[data-qa=link-to-create-induction]').length).toEqual(1)
    expect($('[data-qa=education-or-induction-unavailable-message]').length).toEqual(0)
    expect($('[data-qa=last-updated]').length).toEqual(1)
  })

  it('should not show add/change links or prompt to create induction given user does not have an induction and does not have edit authority', () => {
    // Given
    const educationDto = aValidEducationDto()
    const inductionDto: InductionDto = undefined
    const pageViewModel = {
      induction: {
        problemRetrievingData: false,
        inductionDto,
      },
      education: {
        problemRetrievingData: false,
        educationDto,
      },
      prisonerSummary,
      hasEditAuthority: false,
    }

    // When
    const content = nunjucks.render('_educationAndQualificationsHistory.njk', pageViewModel)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=educational-qualifications-change-link]').length).toEqual(0)
    expect($('[data-qa=additional-training-change-link]').length).toEqual(0)
    expect($('[data-qa=link-to-add-educational-qualifications]').length).toEqual(0)
    expect($('[data-qa=highest-level-of-education-change-link]').length).toEqual(0)
    expect($('[data-qa=link-to-create-induction]').length).toEqual(0)
    expect($('[data-qa=education-or-induction-unavailable-message]').length).toEqual(0)
  })

  it('should show qualifications including highest level of education and additional training given prisoner has education data and an induction', () => {
    // Given
    const educationDto = aValidEducationDto()
    const inductionDto = aValidInductionDto()
    const pageViewModel = {
      induction: {
        problemRetrievingData: false,
        inductionDto,
      },
      education: {
        problemRetrievingData: false,
        educationDto,
      },
      prisonerSummary,
      hasEditAuthority: true,
    }

    // When
    const content = nunjucks.render('_educationAndQualificationsHistory.njk', pageViewModel)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=educational-qualifications-table]').length).toEqual(1)
    expect($('[data-qa=educational-qualifications-change-link]').length).toEqual(1)
    expect($('[data-qa=highest-level-of-education]').length).toEqual(1)
    expect($('[data-qa=highest-level-of-education-change-link]').length).toEqual(1)
    expect($('[data-qa=additional-training]').length).toEqual(1)
    expect($('[data-qa=additional-training-change-link]').length).toEqual(1)
    expect($('[data-qa=link-to-add-educational-qualifications]').length).toEqual(0)
    expect($('[data-qa=link-to-create-induction]').length).toEqual(0)
    expect($('[data-qa=education-or-induction-unavailable-message]').length).toEqual(0)
    expect($('[data-qa=last-updated]').length).toEqual(1)
  })

  it('should show the last updated fields from the education given that the education was updated more recently than the induction', () => {
    // Given
    const educationDto = aValidEducationDto()
    educationDto.updatedByDisplayName = 'Albert Smith'
    educationDto.updatedAt = parseISO('2023-06-19T09:39:44.123Z')
    const inductionDto = aValidInductionDto()
    inductionDto.updatedByDisplayName = 'Barry Jones'
    inductionDto.updatedAt = parseISO('2023-05-03T12:02:35.012Z')
    const pageViewModel = {
      induction: {
        problemRetrievingData: false,
        inductionDto,
      },
      education: {
        problemRetrievingData: false,
        educationDto,
      },
      prisonerSummary,
      hasEditAuthority: true,
    }

    // When
    const content = nunjucks.render('_educationAndQualificationsHistory.njk', pageViewModel)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=last-updated]').text().trim()).toEqual('Last updated: 19 June 2023 by Albert Smith')
  })

  it('should show the last updated fields from the induction given that the induction was updated more recently than the education', () => {
    // Given
    const educationDto = aValidEducationDto()
    educationDto.updatedByDisplayName = 'Albert Smith'
    educationDto.updatedAt = parseISO('2023-06-19T09:39:44.123Z')
    const inductionDto = aValidInductionDto()
    inductionDto.updatedByDisplayName = 'Barry Jones'
    inductionDto.updatedAt = parseISO('2023-06-23T10:23:21.591Z')
    const pageViewModel = {
      induction: {
        problemRetrievingData: false,
        inductionDto,
      },
      education: {
        problemRetrievingData: false,
        educationDto,
      },
      prisonerSummary,
      hasEditAuthority: true,
    }

    // When
    const content = nunjucks.render('_educationAndQualificationsHistory.njk', pageViewModel)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=last-updated]').text().trim()).toEqual('Last updated: 23 June 2023 by Barry Jones')
  })

  it('should show prompts to create education and create induction given prisoner has no education data', () => {
    // Given
    const educationDto: EducationDto = undefined
    const inductionDto: InductionDto = undefined // a prisoner with no EductionDto will also have no InductionDto. It is not possible to have an Induction but with no Education
    const pageViewModel = {
      induction: {
        problemRetrievingData: false,
        inductionDto,
      },
      education: {
        problemRetrievingData: false,
        educationDto,
      },
      prisonerSummary,
      hasEditAuthority: true,
    }

    // When
    const content = nunjucks.render('_educationAndQualificationsHistory.njk', pageViewModel)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=link-to-add-educational-qualifications]').length).toEqual(1)
    expect($('[data-qa=link-to-create-induction]').length).toEqual(1)
    expect($('[data-qa=educational-qualifications-table]').length).toEqual(0)
    expect($('[data-qa=educational-qualifications-change-link]').length).toEqual(0)
    expect($('[data-qa=highest-level-of-education]').length).toEqual(0)
    expect($('[data-qa=highest-level-of-education-change-link]').length).toEqual(0)
    expect($('[data-qa=additional-training]').length).toEqual(0)
    expect($('[data-qa=additional-training-change-link]').length).toEqual(0)
    expect($('[data-qa=education-or-induction-unavailable-message]').length).toEqual(0)
    expect($('[data-qa=last-updated]').length).toEqual(0)
  })

  it('should show unavailable message given problem retrieving induction data', () => {
    // Given
    const inductionDto: InductionDto = undefined
    const educationDto = aValidEducationDto()
    const pageViewModel = {
      induction: {
        problemRetrievingData: true,
        inductionDto,
      },
      education: {
        problemRetrievingData: false,
        educationDto,
      },
      prisonerSummary,
      hasEditAuthority: true,
    }

    // When
    const content = nunjucks.render('_educationAndQualificationsHistory.njk', pageViewModel)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=education-or-induction-unavailable-message]').length).toEqual(1)
    expect($('[data-qa=link-to-add-educational-qualifications]').length).toEqual(0)
    expect($('[data-qa=link-to-create-induction]').length).toEqual(0)
    expect($('[data-qa=educational-qualifications-table]').length).toEqual(0)
    expect($('[data-qa=educational-qualifications-change-link]').length).toEqual(0)
    expect($('[data-qa=highest-level-of-education]').length).toEqual(0)
    expect($('[data-qa=highest-level-of-education-change-link]').length).toEqual(0)
    expect($('[data-qa=additional-training]').length).toEqual(0)
    expect($('[data-qa=additional-training-change-link]').length).toEqual(0)
    expect($('[data-qa=last-updated]').length).toEqual(0)
  })

  it('should show unavailable message given problem retrieving education data', () => {
    // Given
    const inductionDto = aValidInductionDto()
    const educationDto: EducationDto = undefined
    const pageViewModel = {
      induction: {
        problemRetrievingData: false,
        inductionDto,
      },
      education: {
        problemRetrievingData: true,
        educationDto,
      },
      prisonerSummary,
      hasEditAuthority: true,
    }

    // When
    const content = nunjucks.render('_educationAndQualificationsHistory.njk', pageViewModel)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=education-or-induction-unavailable-message]').length).toEqual(1)
    expect($('[data-qa=link-to-add-educational-qualifications]').length).toEqual(0)
    expect($('[data-qa=link-to-create-induction]').length).toEqual(0)
    expect($('[data-qa=educational-qualifications-table]').length).toEqual(0)
    expect($('[data-qa=educational-qualifications-change-link]').length).toEqual(0)
    expect($('[data-qa=highest-level-of-education]').length).toEqual(0)
    expect($('[data-qa=highest-level-of-education-change-link]').length).toEqual(0)
    expect($('[data-qa=additional-training]').length).toEqual(0)
    expect($('[data-qa=additional-training-change-link]').length).toEqual(0)
    expect($('[data-qa=last-updated]').length).toEqual(0)
  })
})
