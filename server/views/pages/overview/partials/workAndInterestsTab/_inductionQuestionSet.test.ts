import nunjucks from 'nunjucks'
import * as cheerio from 'cheerio'
import { startOfDay } from 'date-fns'
import type { FutureWorkInterestsDto, PreviousWorkExperiencesDto } from 'inductionDto'
import { aValidInductionDto } from '../../../../../testsupport/inductionDtoTestDataBuilder'
import aValidPrisonerSummary from '../../../../../testsupport/prisonerSummaryTestDataBuilder'
import formatDateFilter from '../../../../../filters/formatDateFilter'
import formatYesNoFilter from '../../../../../filters/formatYesNoFilter'
import formatHasWorkedBeforeFilter from '../../../../../filters/formatHasWorkedBeforeFilter'
import sortedAlphabeticallyWithOtherLastFilter from '../../../../../filters/sortedAlphabeticallyWithOtherLastFilter'
import objectsSortedAlphabeticallyWithOtherLastByFilter from '../../../../../filters/objectsSortedAlphabeticallyWithOtherLastByFilter'
import config from '../../../../../config'
import HopingToGetWorkValue from '../../../../../enums/hopingToGetWorkValue'
import HasWorkedBeforeValue from '../../../../../enums/hasWorkedBeforeValue'
import formatAbilityToWorkConstraintFilter from '../../../../../filters/formatAbilityToWorkConstraintFilter'
import formatJobTypeFilter from '../../../../../filters/formatJobTypeFilter'
import previousWorkExperienceObjectsSortedInScreenOrderFilter from '../../../../../filters/previousWorkExperienceObjectsSortedInScreenOrderFilter'

const njkEnv = nunjucks.configure([
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
njkEnv.addGlobal('featureToggles', config.featureToggles)
njkEnv.addFilter(
  'previousWorkExperienceObjectsSortedInScreenOrder',
  previousWorkExperienceObjectsSortedInScreenOrderFilter,
)

const prisonNamesById = { BXI: 'Brixton (HMP)', MDI: 'Moorland (HMP & YOI)' }
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
  prisonNamesById,
}

describe('Tests for _inductionQuestionSet.njk partial', () => {
  beforeEach(() => {
    jest.resetAllMocks()
    userHasPermissionTo.mockReturnValue(true)
  })

  it('Should display last updated using work response if they are not interested in working', () => {
    // When
    const anInductionDto = aValidInductionDto({
      hopingToGetWork: HopingToGetWorkValue.NO,
      hasWorkedBefore: HasWorkedBeforeValue.NO,
    })

    const params = {
      ...templateParams,
      induction: {
        problemRetrievingData: false,
        inductionDto: {
          ...anInductionDto,
          futureWorkInterests: undefined as FutureWorkInterestsDto,
          workOnRelease: {
            ...anInductionDto.workOnRelease,
            updatedAt: new Date('2021-05-10T10:00:00Z'),
            updatedByDisplayName: 'Some User',
          },
        },
      },
    }

    // When
    const content = nunjucks.render('_inductionQuestionSet.njk', params)
    const $ = cheerio.load(content)

    // Then
    const lastUpdated = $('[data-qa=work-interests-last-updated]').first().text().trim()
    expect(lastUpdated).toEqual('Last updated 10 May 2021 by Some User, Moorland (HMP & YOI)')
    expect(userHasPermissionTo).toHaveBeenCalledWith('UPDATE_INDUCTION')
  })

  it('Should display last updated using future work response if they are interested in working', () => {
    // Given
    const anInductionDto = aValidInductionDto({
      hopingToGetWork: HopingToGetWorkValue.YES,
      hasWorkedBefore: HasWorkedBeforeValue.NO,
    })

    const params = {
      ...templateParams,
      induction: {
        inductionDto: {
          ...anInductionDto,
          futureWorkInterests: {
            ...anInductionDto.futureWorkInterests,
            updatedByDisplayName: 'Future User',
            updatedAt: new Date('2024-06-20T10:00:00Z'),
          },
        },
      },
    }

    // When
    const content = nunjucks.render('_inductionQuestionSet.njk', params)
    const $ = cheerio.load(content)

    // Then
    const lastUpdated = $('[data-qa=work-interests-last-updated]').first().text().trim()
    expect(lastUpdated).toEqual('Last updated 20 June 2024 by Future User, Moorland (HMP & YOI)')
    expect(userHasPermissionTo).toHaveBeenCalledWith('UPDATE_INDUCTION')
  })

  it('Should handle has worked before and work experience if previously answered no to wanting to work (back compat)', () => {
    // Given
    const anInductionDto = aValidInductionDto({
      hopingToGetWork: HopingToGetWorkValue.NO,
    })

    const params = {
      ...templateParams,
      induction: {
        inductionDto: {
          ...anInductionDto,
          previousWorkExperiences: undefined as PreviousWorkExperiencesDto,
          workOnRelease: {
            ...anInductionDto.workOnRelease,
            updatedAt: new Date('2021-05-10T10:00:00Z'),
            updatedByDisplayName: 'Some User',
          },
        },
      },
    }

    // When
    const content = nunjucks.render('_inductionQuestionSet.njk', params)
    const $ = cheerio.load(content)

    // Then
    const lastUpdated = $('[data-qa=work-experience-last-updated]').first().text().trim()
    expect(lastUpdated).toEqual('Last updated 10 May 2021 by Some User, Moorland (HMP & YOI)')
    const hasWorkedBeforeAnswer = $('[data-qa=has-worked-before-answer]').first().text().trim()
    expect(hasWorkedBeforeAnswer).toEqual('Not entered.')
    const hasWorkedBeforeLink = $('[data-qa=has-worked-before-change-link]').first().text().trim()
    expect(hasWorkedBeforeLink).toEqual('Add worked before')
    expect(userHasPermissionTo).toHaveBeenCalledWith('UPDATE_INDUCTION')
  })

  it('Should handle has worked before and work experience if wanting to work', () => {
    // Given
    const anInductionDto = aValidInductionDto({
      hopingToGetWork: HopingToGetWorkValue.YES,
    })

    const params = {
      ...templateParams,
      induction: {
        inductionDto: {
          ...anInductionDto,
          previousWorkExperiences: {
            ...anInductionDto.previousWorkExperiences,
            updatedByDisplayName: 'Worked Before User',
            updatedAt: new Date('2024-06-20T10:00:00Z'),
          },
        },
      },
    }

    // When
    const content = nunjucks.render('_inductionQuestionSet.njk', params)
    const $ = cheerio.load(content)

    // Then
    const lastUpdated = $('[data-qa=work-experience-last-updated]').first().text().trim()
    expect(lastUpdated).toEqual('Last updated 20 June 2024 by Worked Before User, Moorland (HMP & YOI)')
    const hasWorkedBeforeAnswer = $('[data-qa=has-worked-before-answer]').first().text().trim()
    expect(hasWorkedBeforeAnswer).toEqual('Yes')
    const hasWorkedBeforeLink = $('[data-qa=has-worked-before-change-link]').first().text().trim()
    expect(hasWorkedBeforeLink).toEqual('Change worked before')
    expect(userHasPermissionTo).toHaveBeenCalledWith('UPDATE_INDUCTION')
  })
})
