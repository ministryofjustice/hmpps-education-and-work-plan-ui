import nunjucks from 'nunjucks'
import * as cheerio from 'cheerio'
import { startOfDay } from 'date-fns'
import type { InductionDto } from 'inductionDto'
import aValidPrisonerSummary from '../../../../../testsupport/prisonerSummaryTestDataBuilder'
import { aValidInductionDto } from '../../../../../testsupport/inductionDtoTestDataBuilder'
import formatDateFilter from '../../../../../filters/formatDateFilter'
import formatYesNoFilter from '../../../../../filters/formatYesNoFilter'
import formatHasWorkedBeforeFilter from '../../../../../filters/formatHasWorkedBeforeFilter'
import formatJobTypeFilter from '../../../../../filters/formatJobTypeFilter'
import sortedAlphabeticallyWithOtherLastFilter from '../../../../../filters/sortedAlphabeticallyWithOtherLastFilter'
import objectsSortedAlphabeticallyWithOtherLastByFilter from '../../../../../filters/objectsSortedAlphabeticallyWithOtherLastByFilter'
import formatAbilityToWorkConstraintFilter from '../../../../../filters/formatAbilityToWorkConstraintFilter'
import previousWorkExperienceObjectsSortedInScreenOrderFilter from '../../../../../filters/previousWorkExperienceObjectsSortedInScreenOrderFilter'
import formatInPrisonWorkInterestFilter from '../../../../../filters/formatInPrisonWorkInterestFilter'
import formatSkillFilter from '../../../../../filters/formatSkillFilter'
import formatPersonalInterestFilter from '../../../../../filters/formatPersonalInterestFilter'

const njkEnv = nunjucks.configure([
  'node_modules/govuk-frontend/govuk/',
  'node_modules/govuk-frontend/govuk/components/',
  'node_modules/govuk-frontend/govuk/template/',
  'node_modules/govuk-frontend/dist/',
  'node_modules/@ministryofjustice/frontend/',
  'server/views/',
  __dirname,
])

njkEnv.addFilter('formatDate', formatDateFilter)
njkEnv.addFilter('formatYesNo', formatYesNoFilter)
njkEnv.addFilter('formatHasWorkedBefore', formatHasWorkedBeforeFilter)
njkEnv.addFilter('formatJobType', formatJobTypeFilter)
njkEnv.addFilter('sortedAlphabeticallyWithOtherLast', sortedAlphabeticallyWithOtherLastFilter)
njkEnv.addFilter('objectsSortedAlphabeticallyWithOtherLastBy', objectsSortedAlphabeticallyWithOtherLastByFilter)
njkEnv.addFilter('formatAbilityToWorkConstraint', formatAbilityToWorkConstraintFilter)
njkEnv.addFilter(
  'previousWorkExperienceObjectsSortedInScreenOrder',
  previousWorkExperienceObjectsSortedInScreenOrderFilter,
)
njkEnv.addFilter('formatInPrisonWorkInterest', formatInPrisonWorkInterestFilter)
njkEnv.addFilter('formatSkill', formatSkillFilter)
njkEnv.addFilter('formatPersonalInterest', formatPersonalInterestFilter)

const prisonerSummary = aValidPrisonerSummary()
const template = 'workAndInterestsTabContents.njk'

const userHasPermissionTo = jest.fn()
const templateParams = {
  prisonerSummary,
  userHasPermissionTo,
  induction: {
    problemRetrievingData: false,
    inductionDto: aValidInductionDto(),
  },
  inductionSchedule: {
    problemRetrievingData: false,
    inductionStatus: 'INDUCTION_DUE',
    inductionDueDate: startOfDay('2025-02-15'),
  },
}

describe('workAndInterestsTabContents', () => {
  beforeEach(() => {
    jest.resetAllMocks()
    userHasPermissionTo.mockReturnValue(true)
  })

  it('should render details of the induction given the prisoner has had an induction', () => {
    // Given
    const params = {
      ...templateParams,
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=work-and-interests-question-set]').length).toEqual(1)
    expect($('#in-prison-work-interests-summary-card').length).toEqual(1)
    expect($('#skills-and-interests-summary-card').length).toEqual(1)

    expect($('[data-qa=induction-not-created-yet]').length).toEqual(0)
    expect($('[data-qa=link-to-create-induction]').length).toEqual(0)

    expect($('[data-qa=induction-unavailable-message]').length).toEqual(0)

    // Expect 11 checks to see if the user has permission to update the induction, one for each "change" link
    for (let n = 1; n <= 11; n += 1) {
      expect(userHasPermissionTo).toHaveBeenNthCalledWith(n, 'UPDATE_INDUCTION')
    }
  })

  it('should render unavailable message given problem retrieving induction', () => {
    // Given
    const params = {
      ...templateParams,
      induction: {
        problemRetrievingData: true,
      },
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=work-and-interests-question-set]').length).toEqual(0)
    expect($('#in-prison-work-interests-summary-card').length).toEqual(0)
    expect($('#skills-and-interests-summary-card').length).toEqual(0)

    expect($('[data-qa=induction-not-created-yet]').length).toEqual(0)
    expect($('[data-qa=link-to-create-induction]').length).toEqual(0)

    expect($('[data-qa=induction-unavailable-message]').length).toEqual(1)

    expect(userHasPermissionTo).not.toHaveBeenCalled()
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
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=work-and-interests-question-set]').length).toEqual(0)
    expect($('#in-prison-work-interests-summary-card').length).toEqual(0)
    expect($('#skills-and-interests-summary-card').length).toEqual(0)

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

  it('should not render link to create induction given prisoner has no induction and user does have permission to create inductions but there was a problem retrieving the inductions schedule', () => {
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
