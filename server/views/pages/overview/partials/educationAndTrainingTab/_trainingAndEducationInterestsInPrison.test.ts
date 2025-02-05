import nunjucks from 'nunjucks'
import * as cheerio from 'cheerio'
import { startOfDay } from 'date-fns'
import type { InductionDto } from 'inductionDto'
import objectsSortedAlphabeticallyWithOtherLastBy from '../../../../../filters/objectsSortedAlphabeticallyWithOtherLastByFilter'
import formatDateFilter from '../../../../../filters/formatDateFilter'
import { aValidInductionDto } from '../../../../../testsupport/inductionDtoTestDataBuilder'
import InPrisonTrainingValue from '../../../../../enums/inPrisonTrainingValue'
import formatInPrisonTrainingFilter from '../../../../../filters/formatInPrisonTrainingFilter'
import aValidPrisonerSummary from '../../../../../testsupport/prisonerSummaryTestDataBuilder'

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

describe('_trainingAndEducationInterestsInPrison', () => {
  beforeEach(() => {
    jest.resetAllMocks()
    userHasPermissionTo.mockReturnValue(true)
  })

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
    const params = {
      ...templateParams,
      induction: {
        problemRetrievingData: false,
        inductionDto,
      },
    }

    // When
    const content = nunjucks.render('_trainingAndEducationInterestsInPrison.njk', params)
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

  it('should not render the change link given user does not have permission to update inductions', () => {
    // Given
    userHasPermissionTo.mockReturnValue(false)
    const inductionDto: InductionDto = aValidInductionDto()
    inductionDto.inPrisonInterests = {
      ...inductionDto.inPrisonInterests,
      inPrisonTrainingInterests: [
        { trainingType: InPrisonTrainingValue.FORKLIFT_DRIVING, trainingTypeOther: null },
        { trainingType: InPrisonTrainingValue.CATERING, trainingTypeOther: null },
        { trainingType: InPrisonTrainingValue.OTHER, trainingTypeOther: 'Advanced origami' },
      ],
    }
    const params = {
      ...templateParams,
      induction: {
        problemRetrievingData: false,
        inductionDto,
      },
    }

    // When
    const content = nunjucks.render('_trainingAndEducationInterestsInPrison.njk', params)

    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=in-prison-training-change-link]').length).toEqual(0)
    expect($('[data-qa=training-interests-create-induction-message]').length).toEqual(0)
    expect(userHasPermissionTo).toHaveBeenCalledWith('UPDATE_INDUCTION')
  })

  it('should not list training interests given an induction without any training interests', () => {
    // Given
    const inductionDto: InductionDto = aValidInductionDto()
    inductionDto.inPrisonInterests = undefined
    const params = {
      ...templateParams,
      induction: {
        problemRetrievingData: false,
        inductionDto,
      },
    }

    // When
    const content = nunjucks.render('_trainingAndEducationInterestsInPrison.njk', params)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=in-prison-training-interests]').length).toEqual(0)
    expect($('[data-qa=in-prison-training-change-link]').text().trim()).toEqual('Add training and education interests')
    expect($('[data-qa=training-interests-create-induction-message]').length).toEqual(0)
    expect($('[data-qa=training-interests-induction-unavailable-message]').length).toEqual(0)
  })

  it('should not render link to create induction given prisoner has no induction and user does not have permission to create inductions', () => {
    // Given
    userHasPermissionTo.mockReturnValue(false)
    const params = {
      ...templateParams,
      induction: {
        problemRetrievingData: false,
        inductionDto: undefined as InductionDto,
      },
    }

    // When
    const content = nunjucks.render('_trainingAndEducationInterestsInPrison.njk', params)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=induction-not-created-yet]').length).toEqual(1)
    expect($('[data-qa=link-to-create-induction]').length).toEqual(0)
    expect($('[data-qa=induction-unavailable-message]').length).toEqual(0)

    expect(userHasPermissionTo).toHaveBeenCalledWith('RECORD_INDUCTION')
  })

  it('should render link to create induction given prisoner has no induction and user does have permission to create inductions', () => {
    // Given
    userHasPermissionTo.mockReturnValue(true)
    const params = {
      ...templateParams,
      induction: {
        problemRetrievingData: false,
        inductionDto: undefined as InductionDto,
      },
    }

    // When
    const content = nunjucks.render('_trainingAndEducationInterestsInPrison.njk', params)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=induction-not-created-yet]').length).toEqual(1)
    expect($('[data-qa=link-to-create-induction]').length).toEqual(1)
    expect($('[data-qa=induction-unavailable-message]').length).toEqual(0)

    expect(userHasPermissionTo).toHaveBeenCalledWith('RECORD_INDUCTION')
  })

  it('should not render link to create induction given prisoner has no induction and user does have permission to create inductions but inductions schedule is on hold', () => {
    // Given
    userHasPermissionTo.mockReturnValue(true)
    const params = {
      ...templateParams,
      induction: {
        problemRetrievingData: false,
        inductionDto: undefined as InductionDto,
      },
      inductionSchedule: {
        problemRetrievingData: false,
        inductionStatus: 'ON_HOLD',
        inductionDueDate: startOfDay('2025-02-15'),
      },
    }

    // When
    const content = nunjucks.render('_trainingAndEducationInterestsInPrison.njk', params)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=induction-not-created-yet]').length).toEqual(1)
    expect($('[data-qa=link-to-create-induction]').length).toEqual(0)
    expect($('[data-qa=induction-unavailable-message]').length).toEqual(0)

    expect(userHasPermissionTo).toHaveBeenCalledWith('RECORD_INDUCTION')
  })

  it('should not render link to create induction given prisoner has no induction and user does have permissions create inductions but there was a problem retrieving the inductions schedule', () => {
    // Given
    userHasPermissionTo.mockReturnValue(true)
    const params = {
      ...templateParams,
      induction: {
        problemRetrievingData: false,
        inductionDto: undefined as InductionDto,
      },
      inductionSchedule: {
        problemRetrievingData: true,
      },
    }

    // When
    const content = nunjucks.render('_trainingAndEducationInterestsInPrison.njk', params)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=induction-not-created-yet]').length).toEqual(1)
    expect($('[data-qa=link-to-create-induction]').length).toEqual(0)
    expect($('[data-qa=induction-unavailable-message]').length).toEqual(0)

    expect(userHasPermissionTo).toHaveBeenCalledWith('RECORD_INDUCTION')
  })

  it('should show induction unavailable message given problem retrieving induction data', () => {
    // Given
    const params = {
      ...templateParams,
      induction: {
        problemRetrievingData: true,
      },
    }

    // When
    const content = nunjucks.render('_trainingAndEducationInterestsInPrison.njk', params)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=training-interests-induction-unavailable-message]').length).toEqual(1)
  })
})
