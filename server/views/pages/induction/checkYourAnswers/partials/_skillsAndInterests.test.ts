import nunjucks from 'nunjucks'
import * as cheerio from 'cheerio'
import aValidPrisonerSummary from '../../../../../testsupport/prisonerSummaryTestDataBuilder'
import config from '../../../../../config'
import { aValidInductionDto } from '../../../../../testsupport/inductionDtoTestDataBuilder'
import { anEmployabilitySkillResponseDto } from '../../../../../testsupport/employabilitySkillResponseDtoTestDataBuilder'
import EmployabilitySkillsValue from '../../../../../enums/employabilitySkillsValue'
import { formatEmployabilitySkillsFilter } from '../../../../../filters/formatEmployabilitySkillsFilter'
import formatPersonalInterestFilter from '../../../../../filters/formatPersonalInterestFilter'
import EmployabilitySkillRatingValue from '../../../../../enums/employabilitySkillRatingValue'
import formatEmployabilitySkillRatingFilter from '../../../../../filters/formatEmployabilitySkillRatingFilter'
import aPersonalSkillsAndInterestsDto from '../../../../../testsupport/personalSkillsAndInterestsDtoTestDataBuilder'
import { aPersonalInterestDto } from '../../../../../testsupport/createOrUpdatePersonalSkillsAndInterestsDtoTestDataBuilder'
import PersonalInterestsValue from '../../../../../enums/personalInterestsValue'

const njkEnv = nunjucks.configure([
  'node_modules/govuk-frontend/govuk/',
  'node_modules/govuk-frontend/govuk/components/',
  'node_modules/govuk-frontend/govuk/template/',
  'node_modules/govuk-frontend/dist/',
  'node_modules/@ministryofjustice/frontend/',
  'server/views/',
  __dirname,
])

njkEnv //
  .addFilter('formatEmployabilitySkill', formatEmployabilitySkillsFilter)
  .addFilter('formatEmployabilitySkillRating', formatEmployabilitySkillRatingFilter)
  .addFilter('formatPersonalInterest', formatPersonalInterestFilter)
  .addGlobal('featureToggles', config.featureToggles)

jest.replaceProperty(config.featureToggles, 'employabilitySkillsEnabled', true)

const prisonerSummary = aValidPrisonerSummary()
const template = '_skillsAndInterests.njk'
const templateParams = {
  prisonerSummary,
  inductionDto: aValidInductionDto(),
}

describe('Check Your Answers Page - Skills and interests section', () => {
  describe('employability skills', () => {
    it('should render employability skills correctly', () => {
      // Given
      const params = {
        ...templateParams,
        inductionDto: aValidInductionDto({
          employabilitySkills: [
            anEmployabilitySkillResponseDto({
              employabilitySkillType: EmployabilitySkillsValue.TEAMWORK,
              employabilitySkillRating: EmployabilitySkillRatingValue.NOT_CONFIDENT,
            }),
            anEmployabilitySkillResponseDto({
              employabilitySkillType: EmployabilitySkillsValue.CREATIVITY,
              employabilitySkillRating: EmployabilitySkillRatingValue.VERY_CONFIDENT,
            }),
          ],
        }),
      }

      // When
      const content = njkEnv.render(template, params)
      const $ = cheerio.load(content)

      // Then
      const employabilitySkills = $('[data-qa=employability-skills] div')
      expect(employabilitySkills.length).toEqual(2)

      expect(employabilitySkills.eq(0).attr('data-qa')).toEqual('employability-skill-TEAMWORK')
      expect(employabilitySkills.eq(0).text().trim()).toEqual('Teamwork: 1 - not confident')

      expect(employabilitySkills.eq(1).attr('data-qa')).toEqual('employability-skill-CREATIVITY')
      expect(employabilitySkills.eq(1).text().trim()).toEqual('Creativity: 4 - very confident')
    })

    it('should render no employability skills given the prisoner has no employability skills', () => {
      // Given
      const params = {
        ...templateParams,
        inductionDto: aValidInductionDto({
          employabilitySkills: [
            anEmployabilitySkillResponseDto({ employabilitySkillType: EmployabilitySkillsValue.NONE }),
          ],
        }),
      }

      // When
      const content = njkEnv.render(template, params)
      const $ = cheerio.load(content)

      // Then
      const employabilitySkills = $('[data-qa=employability-skills] div')
      expect(employabilitySkills.length).toEqual(1)

      expect(employabilitySkills.eq(0).attr('data-qa')).toEqual('employability-skill-NONE')
      expect(employabilitySkills.eq(0).text().trim()).toEqual('None')
    })
  })

  describe('personal interests', () => {
    it('should render personal interests correctly', () => {
      // Given
      const params = {
        ...templateParams,
        inductionDto: aValidInductionDto({
          personalSkillsAndInterests: aPersonalSkillsAndInterestsDto({
            interests: [
              aPersonalInterestDto({ interestType: PersonalInterestsValue.DIGITAL }),
              aPersonalInterestDto({
                interestType: PersonalInterestsValue.OTHER,
                interestTypeOther: 'Renewable energy',
              }),
            ],
          }),
        }),
      }

      // When
      const content = njkEnv.render(template, params)
      const $ = cheerio.load(content)

      // Then
      const personalInterests = $('[data-qa=personalInterests] div')
      expect(personalInterests.length).toEqual(2)

      expect(personalInterests.eq(0).attr('data-qa')).toEqual('personalInterests-DIGITAL')
      expect(personalInterests.eq(0).text().trim()).toEqual('Digital,')

      expect(personalInterests.eq(1).attr('data-qa')).toEqual('personalInterests-OTHER')
      expect(personalInterests.eq(1).text().trim()).toEqual('Other - Renewable energy')
    })

    it('should render no personal interests given the prisoner has no personal interests', () => {
      // Given
      const params = {
        ...templateParams,
        inductionDto: aValidInductionDto({
          personalSkillsAndInterests: aPersonalSkillsAndInterestsDto({
            interests: [aPersonalInterestDto({ interestType: PersonalInterestsValue.NONE })],
          }),
        }),
      }

      // When
      const content = njkEnv.render(template, params)
      const $ = cheerio.load(content)

      // Then
      const personalInterests = $('[data-qa=personalInterests] div')
      expect(personalInterests.length).toEqual(1)

      expect(personalInterests.eq(0).attr('data-qa')).toEqual('personalInterests-NONE')
      expect(personalInterests.eq(0).text().trim()).toEqual('None')
    })
  })
})
