import nunjucks from 'nunjucks'
import * as cheerio from 'cheerio'
import aValidPrisonerSummary from '../../../../../testsupport/prisonerSummaryTestDataBuilder'
import { Result } from '../../../../../utils/result/result'
import { aValidConditionDto, aValidConditionsList } from '../../../../../testsupport/conditionDtoTestDataBuilder'
import filterArrayOnPropertyFilter from '../../../../../filters/filterArrayOnPropertyFilter'
import ConditionType from '../../../../../enums/conditionType'
import ConditionSource from '../../../../../enums/conditionSource'
import formatConditionTypeScreenValueFilter from '../../../../../filters/formatConditionTypeFilter'

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
  .addFilter('filterArrayOnProperty', filterArrayOnPropertyFilter)
  .addFilter('formatConditionTypeScreenValue', formatConditionTypeScreenValueFilter)

const prisonerSummary = aValidPrisonerSummary()
const prisonNamesById = { BXI: 'Brixton (HMP)', MDI: 'Moorland (HMP & YOI)' }
const template = '_conditionsSummaryCard.njk'
const templateParams = {
  prisonerSummary,
  prisonNamesById,
  conditions: Result.fulfilled(aValidConditionsList()),
}

describe('Additional Needs tab - Conditions Summary Card', () => {
  it('should render the Conditions Summary Card given the prisoner only has self-declared Conditions recorded', () => {
    // Given
    const params = {
      ...templateParams,
      conditions: Result.fulfilled(
        aValidConditionsList({
          conditions: [
            aValidConditionDto({ conditionTypeCode: ConditionType.TOURETTES, source: ConditionSource.SELF_DECLARED }),
            aValidConditionDto({ conditionTypeCode: ConditionType.ADHD, source: ConditionSource.SELF_DECLARED }),
          ],
        }),
      ),
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=confirmed-diagnosis-conditions]').length).toEqual(0)
    expect($('[data-qa=self-declared-conditions]')).toHaveLength(1)
    expect($('[data-qa=self-declared-conditions] li')).toHaveLength(2)
    expect($('[data-qa=no-conditions-message]').length).toEqual(0)
  })

  it('should render the Conditions Summary Card given the prisoner only has diagnosed Conditions recorded', () => {
    // Given
    const params = {
      ...templateParams,
      conditions: Result.fulfilled(
        aValidConditionsList({
          conditions: [
            aValidConditionDto({ conditionTypeCode: ConditionType.ABI, source: ConditionSource.CONFIRMED_DIAGNOSIS }),
            aValidConditionDto({ conditionTypeCode: ConditionType.ASC, source: ConditionSource.CONFIRMED_DIAGNOSIS }),
            aValidConditionDto({ conditionTypeCode: ConditionType.FASD, source: ConditionSource.CONFIRMED_DIAGNOSIS }),
          ],
        }),
      ),
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=confirmed-diagnosis-conditions]').length).toEqual(1)
    expect($('[data-qa=confirmed-diagnosis-conditions] li')).toHaveLength(3)
    expect($('[data-qa=self-declared-conditions]')).toHaveLength(0)
    expect($('[data-qa=no-conditions-message]').length).toEqual(0)
  })

  it('should render the Conditions Summary Card given the prisoner has both diagnosed and self-declared Conditions recorded', () => {
    // Given
    const params = {
      ...templateParams,
      conditions: Result.fulfilled(
        aValidConditionsList({
          conditions: [
            aValidConditionDto({ conditionTypeCode: ConditionType.ABI, source: ConditionSource.CONFIRMED_DIAGNOSIS }),
            aValidConditionDto({ conditionTypeCode: ConditionType.ASC, source: ConditionSource.CONFIRMED_DIAGNOSIS }),
            aValidConditionDto({ conditionTypeCode: ConditionType.FASD, source: ConditionSource.CONFIRMED_DIAGNOSIS }),
            aValidConditionDto({ conditionTypeCode: ConditionType.TOURETTES, source: ConditionSource.SELF_DECLARED }),
            aValidConditionDto({ conditionTypeCode: ConditionType.ADHD, source: ConditionSource.SELF_DECLARED }),
          ],
        }),
      ),
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=confirmed-diagnosis-conditions]').length).toEqual(1)
    expect($('[data-qa=confirmed-diagnosis-conditions] li')).toHaveLength(3)
    expect($('[data-qa=self-declared-conditions]')).toHaveLength(1)
    expect($('[data-qa=self-declared-conditions] li')).toHaveLength(2)
    expect($('[data-qa=no-conditions-message]').length).toEqual(0)
  })

  it('should render the Conditions Summary Card given there are no Conditions recorded', () => {
    // Given
    const params = {
      ...templateParams,
      conditions: Result.fulfilled(aValidConditionsList({ conditions: [] })),
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=confirmed-diagnosis-conditions]').length).toEqual(0)
    expect($('[data-qa=self-declared-conditions]')).toHaveLength(0)
    expect($('[data-qa=no-conditions-message]').length).toEqual(1)
  })

  it('should render the Conditions Summary Card given the SAN service API promise is not resolved', () => {
    // Given
    const params = {
      ...templateParams,
      conditions: Result.rejected(new Error('Failed to get SAN conditions')),
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=san-conditions-unavailable-message]').length).toEqual(1)
  })
})
