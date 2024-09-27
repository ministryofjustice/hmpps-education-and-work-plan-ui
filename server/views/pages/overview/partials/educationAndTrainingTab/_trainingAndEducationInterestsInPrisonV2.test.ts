import nunjucks from 'nunjucks'
import * as cheerio from 'cheerio'
import type { InductionDto } from 'inductionDto'
import objectsSortedAlphabeticallyWithOtherLastBy from '../../../../../filters/objectsSortedAlphabeticallyWithOtherLastByFilter'
import formatDateFilter from '../../../../../filters/formatDateFilter'
import { aValidInductionDto } from '../../../../../testsupport/inductionDtoTestDataBuilder'
import InPrisonTrainingValue from '../../../../../enums/inPrisonTrainingValue'
import formatInPrisonTrainingFilter from '../../../../../filters/formatInPrisonTrainingFilter'

const njkEnv = nunjucks.configure([
  'node_modules/govuk-frontend/dist/',
  'node_modules/@ministryofjustice/frontend/',
  'server/views/',
  __dirname,
])
njkEnv
  .addFilter('objectsSortedAlphabeticallyWithOtherLastBy', objectsSortedAlphabeticallyWithOtherLastBy)
  .addFilter('formatInPrisonTraining', formatInPrisonTrainingFilter)
  .addFilter('formatDate', formatDateFilter)

describe('_trainingAndEducationInterestsInPrisonV2', () => {
  it('should list training interests given an induction with training interests', () => {
    // Given
    const inductionDto: InductionDto = aValidInductionDto()
    inductionDto.inPrisonInterests = {
      ...inductionDto.inPrisonInterests,
      inPrisonTrainingInterests: [
        { trainingType: InPrisonTrainingValue.FORKLIFT_DRIVING, trainingTypeOther: null },
        { trainingType: InPrisonTrainingValue.CATERING, trainingTypeOther: null },
        { trainingType: InPrisonTrainingValue.OTHER, trainingTypeOther: 'Advanced origami' },
      ],
    }
    const pageViewModel = {
      induction: {
        problemRetrievingData: false,
        inductionDto,
      },
    }

    // When
    const content = nunjucks.render('_trainingAndEducationInterestsInPrisonV2.njk', pageViewModel)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=in-prison-training-interests]').length).toEqual(1)
    expect($('[data-qa=in-prison-training-interests] li').length).toEqual(3)
    expect($('[data-qa=in-prison-training-change-link]').text().trim()).toEqual(
      'Change training and education interests',
    )
    expect($('[data-qa=training-interests-create-induction-message]').length).toEqual(0)
    expect($('[data-qa=training-interests-induction-unavailable-message]').length).toEqual(0)
  })

  it('should not list training interests given an induction without any training interests', () => {
    // Given
    const inductionDto: InductionDto = aValidInductionDto()
    inductionDto.inPrisonInterests = undefined
    const pageViewModel = {
      induction: {
        problemRetrievingData: false,
        inductionDto,
      },
    }

    // When
    const content = nunjucks.render('_trainingAndEducationInterestsInPrisonV2.njk', pageViewModel)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=in-prison-training-interests]').length).toEqual(0)
    expect($('[data-qa=in-prison-training-change-link]').text().trim()).toEqual('Add training and education interests')
    expect($('[data-qa=training-interests-create-induction-message]').length).toEqual(0)
    expect($('[data-qa=training-interests-induction-unavailable-message]').length).toEqual(0)
  })

  it('should show message to create the induction given no induction', () => {
    // Given
    const inductionDto: InductionDto = undefined
    const pageViewModel = {
      induction: {
        problemRetrievingData: false,
        inductionDto,
      },
    }

    // When
    const content = nunjucks.render('_trainingAndEducationInterestsInPrisonV2.njk', pageViewModel)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=training-interests-create-induction-message]').length).toEqual(1)
    expect($('[data-qa=training-interests-induction-unavailable-message]').length).toEqual(0)
  })

  it('should show induction unavailable message given problem retrieving data', () => {
    // Given
    const inductionDto: InductionDto = undefined
    const pageViewModel = {
      induction: {
        problemRetrievingData: true,
        inductionDto,
      },
    }

    // When
    const content = nunjucks.render('_trainingAndEducationInterestsInPrisonV2.njk', pageViewModel)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=training-interests-induction-unavailable-message]').length).toEqual(1)
  })
})
