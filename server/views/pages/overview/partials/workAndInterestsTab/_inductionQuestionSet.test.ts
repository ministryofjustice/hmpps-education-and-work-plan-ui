import nunjucks from 'nunjucks'
import * as cheerio from 'cheerio'
import aValidInductionDto from '../../../../../testsupport/inductionDtoTestDataBuilder'
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
import WorkAndInterestsView from '../../../../../routes/overview/workAndInterestsView'
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

describe('Tests for _inductionQuestionSet.njk partial', () => {
  it('Should display last updated using work response if they are not interested in working', () => {
    const anInductionDto = aValidInductionDto({
      hopingToGetWork: HopingToGetWorkValue.NO,
      hasWorkedBefore: HasWorkedBeforeValue.NO,
    })
    const content = nunjucks.render(
      '_inductionQuestionSet.njk',
      new WorkAndInterestsView(aValidPrisonerSummary(), {
        problemRetrievingData: false,
        inductionDto: {
          ...anInductionDto,
          futureWorkInterests: undefined,
          workOnRelease: {
            ...anInductionDto.workOnRelease,
            updatedAt: new Date('2021-05-10T10:00:00Z'),
            updatedByDisplayName: 'Some User',
          },
        },
      }),
    )
    const $ = cheerio.load(content)
    const lastUpdated = $('[data-qa=work-interests-last-updated]').first().text().trim()
    expect(lastUpdated).toEqual('Last updated: 10 May 2021 by Some User')
  })

  it('Should display last updated using future work response if they are interested in working', () => {
    const anInductionDto = aValidInductionDto({
      hopingToGetWork: HopingToGetWorkValue.NO,
      hasWorkedBefore: HasWorkedBeforeValue.NO,
    })
    const content = nunjucks.render(
      '_inductionQuestionSet.njk',
      new WorkAndInterestsView(aValidPrisonerSummary(), {
        problemRetrievingData: false,
        inductionDto: {
          ...anInductionDto,
          futureWorkInterests: {
            ...anInductionDto.futureWorkInterests,
            updatedByDisplayName: 'Future User',
            updatedAt: new Date('2024-06-20T10:00:00Z'),
          },
        },
      }),
    )
    const $ = cheerio.load(content)
    const lastUpdated = $('[data-qa=work-interests-last-updated]').first().text().trim()
    expect(lastUpdated).toEqual('Last updated: 20 June 2024 by Future User')
  })

  it('Should handle has worked before and work experience if previously answered no to wanting to work (back compat)', () => {
    const anInductionDto = aValidInductionDto({
      hopingToGetWork: HopingToGetWorkValue.NO,
    })
    const content = nunjucks.render(
      '_inductionQuestionSet.njk',
      new WorkAndInterestsView(aValidPrisonerSummary(), {
        problemRetrievingData: false,
        inductionDto: {
          ...anInductionDto,
          previousWorkExperiences: undefined,
          workOnRelease: {
            ...anInductionDto.workOnRelease,
            updatedAt: new Date('2021-05-10T10:00:00Z'),
            updatedByDisplayName: 'Some User',
          },
        },
      }),
    )
    const $ = cheerio.load(content)
    const lastUpdated = $('[data-qa=work-experience-last-updated]').first().text().trim()
    expect(lastUpdated).toEqual('Last updated: 10 May 2021 by Some User')
    const hasWorkedBeforeAnswer = $('[data-qa=has-worked-before-answer]').first().text().trim()
    expect(hasWorkedBeforeAnswer).toEqual('Not entered.')
    const hasWorkedBeforeLink = $('[data-qa=has-worked-before-change-link]').first().text().trim()
    expect(hasWorkedBeforeLink).toEqual('Add worked before')
  })

  it('Should handle has worked before and work experience if wanting to work', () => {
    const anInductionDto = aValidInductionDto({
      hopingToGetWork: HopingToGetWorkValue.YES,
    })
    const content = nunjucks.render(
      '_inductionQuestionSet.njk',
      new WorkAndInterestsView(aValidPrisonerSummary(), {
        problemRetrievingData: false,
        inductionDto: {
          ...anInductionDto,
          previousWorkExperiences: {
            ...anInductionDto.previousWorkExperiences,
            updatedByDisplayName: 'Worked Before User',
            updatedAt: new Date('2024-06-20T10:00:00Z'),
          },
        },
      }),
    )
    const $ = cheerio.load(content)
    const lastUpdated = $('[data-qa=work-experience-last-updated]').first().text().trim()
    expect(lastUpdated).toEqual('Last updated: 20 June 2024 by Worked Before User')
    const hasWorkedBeforeAnswer = $('[data-qa=has-worked-before-answer]').first().text().trim()
    expect(hasWorkedBeforeAnswer).toEqual('Yes')
    const hasWorkedBeforeLink = $('[data-qa=has-worked-before-change-link]').first().text().trim()
    expect(hasWorkedBeforeLink).toEqual('Change worked before')
  })
})
