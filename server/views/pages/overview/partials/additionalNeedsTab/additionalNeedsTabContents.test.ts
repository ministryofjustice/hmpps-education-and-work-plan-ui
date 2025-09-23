import * as cheerio from 'cheerio'
import nunjucks from 'nunjucks'
import { startOfDay } from 'date-fns'
import type { AlnAssessment, CuriousAlnAndLddAssessments, LddAssessment } from 'viewModels'
import {
  aLddAssessment,
  anAlnAssessment,
  validCuriousAlnAndLddAssessments,
} from '../../../../../testsupport/curiousAlnAndLddAssessmentsTestDataBuilder'
import aValidPrisonerSummary from '../../../../../testsupport/prisonerSummaryTestDataBuilder'
import fallbackMessageFilter from '../../../../../filters/fallbackMessageFilter'
import formatDateFilter from '../../../../../filters/formatDateFilter'
import { Result } from '../../../../../utils/result/result'
import formatAlnAssessmentReferralScreenValueFilter from '../../../../../filters/formatAlnAssessmentReferralFilter'
import AlnAssessmentReferral from '../../../../../enums/alnAssessmentReferral'

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
  .addFilter('fallbackMessage', fallbackMessageFilter)
  .addFilter('formatDate', formatDateFilter)
  .addFilter('formatAlnAssessmentReferralScreenValue', formatAlnAssessmentReferralScreenValueFilter)

const prisonerSummary = aValidPrisonerSummary()
const prisonNamesById = { BXI: 'Brixton (HMP)', MDI: 'Moorland (HMP & YOI)' }
const template = 'additionalNeedsTabContents.njk'
const templateParams = {
  tab: 'additional-needs',
  prisonerSummary,
  prisonNamesById: Result.fulfilled(prisonNamesById),
  curiousAlnAndLddAssessments: Result.fulfilled(validCuriousAlnAndLddAssessments()),
}

describe('Additional Needs tab view', () => {
  it('should render the Additional Needs page given a prisoner only has LDD assessment data recorded', () => {
    // Given
    const curiousAlnAndLddAssessments = {
      lddAssessments: [
        aLddAssessment({
          prisonId: 'MDI',
          rapidAssessmentDate: startOfDay('2022-02-18'),
          inDepthAssessmentDate: null as Date,
          primaryLddAndHealthNeed: 'Visual impairment',
          additionalLddAndHealthNeeds: [
            'Hearing impairment',
            'Mental health difficulty',
            'Social and emotional difficulties',
          ],
        }),
      ],
      alnAssessments: [] as Array<AlnAssessment>,
    }
    const params = {
      ...templateParams,
      curiousAlnAndLddAssessments: Result.fulfilled(curiousAlnAndLddAssessments),
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=screening-and-assessments-summary-card]').length).toEqual(1)
    expect($('[data-qa=assessments]')).toHaveLength(1)
    expect($('[data-qa=ldd-assessments]')).toHaveLength(1)
    expect($('[data-qa=aln-assessments]')).toHaveLength(0)

    // LDD Assessment data from Moorland
    const moorlandAssessment = $('[data-qa=ldd-assessment-from-MDI]')
    expect(moorlandAssessment.length).toEqual(1)
    expect(moorlandAssessment.find('[data-qa=prison-name]').text().trim()).toContain('Moorland (HMP & YOI)')
    expect(moorlandAssessment.find('[data-qa=rapid-assessment-date]').text().trim()).toEqual('18 February 2022')
    expect(moorlandAssessment.find('[data-qa=in-depth-assessment-date]').text().trim()).toEqual(
      'Not recorded in Curious',
    )
    expect(moorlandAssessment.find('[data-qa=primary-ldd-need]').text().trim()).toEqual('Visual impairment')
    const moorlandAssessmentAdditionalNeeds = moorlandAssessment
      .find('[data-qa=additional-ldd-needs] li')
      .map((_idx, el) => $(el).text().trim())
      .get()
    expect(moorlandAssessmentAdditionalNeeds).toEqual([
      'Hearing impairment',
      'Mental health difficulty',
      'Social and emotional difficulties',
    ])
  })

  it('should render the Additional Needs page given a prisoner only has ALN assessment data recorded', () => {
    // Given
    const curiousAlnAndLddAssessments = {
      lddAssessments: [] as Array<LddAssessment>,
      alnAssessments: [
        anAlnAssessment({
          prisonId: 'BXI',
          assessmentDate: startOfDay('2025-10-02'),
          referral: AlnAssessmentReferral.PSYCHOLOGY,
          additionalNeedsIdentified: true,
        }),
      ],
    }
    const params = {
      ...templateParams,
      curiousAlnAndLddAssessments: Result.fulfilled(curiousAlnAndLddAssessments),
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=screening-and-assessments-summary-card]').length).toEqual(1)
    expect($('[data-qa=assessments]')).toHaveLength(1)
    expect($('[data-qa=ldd-assessments]')).toHaveLength(0)
    expect($('[data-qa=aln-assessments]')).toHaveLength(1)

    // ALN Assessment data from Brixton
    const brixtonAssessment = $('[data-qa=aln-assessment-from-BXI]')
    expect(brixtonAssessment.length).toEqual(1)
    expect(brixtonAssessment.find('[data-qa=prison-name]').text().trim()).toContain('Brixton (HMP)')
    expect(brixtonAssessment.find('[data-qa=assessment-date]').text().trim()).toEqual('2 October 2025')
    expect(brixtonAssessment.find('[data-qa=assessment-outcome]').text().trim()).toEqual('Additional needs identified')
  })

  it('should render the Additional Needs page given a prisoner has both LDD and ALN assessment data recorded', () => {
    // Given
    const curiousAlnAndLddAssessments = {
      lddAssessments: [
        aLddAssessment({
          prisonId: 'MDI',
          rapidAssessmentDate: startOfDay('2022-02-18'),
          inDepthAssessmentDate: null as Date,
          primaryLddAndHealthNeed: 'Visual impairment',
          additionalLddAndHealthNeeds: ['Hearing impairment'],
        }),
      ],
      alnAssessments: [
        anAlnAssessment({
          prisonId: 'BXI',
          assessmentDate: startOfDay('2025-10-02'),
          referral: AlnAssessmentReferral.PSYCHOLOGY,
          additionalNeedsIdentified: true,
        }),
      ],
    }
    const params = {
      ...templateParams,
      curiousAlnAndLddAssessments: Result.fulfilled(curiousAlnAndLddAssessments),
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=screening-and-assessments-summary-card]').length).toEqual(1)
    expect($('[data-qa=assessments]')).toHaveLength(1)
    expect($('[data-qa=aln-assessments]')).toHaveLength(1)
    expect($('[data-qa=ldd-assessment-details] [data-qa=ldd-assessments]')).toHaveLength(1)

    // ALN Assessment data from Brixton
    const brixtonAssessment = $('[data-qa=aln-assessment-from-BXI]')
    expect(brixtonAssessment.length).toEqual(1)
    expect(brixtonAssessment.find('[data-qa=prison-name]').text().trim()).toContain('Brixton (HMP)')
    expect(brixtonAssessment.find('[data-qa=assessment-date]').text().trim()).toEqual('2 October 2025')
    expect(brixtonAssessment.find('[data-qa=assessment-outcome]').text().trim()).toEqual('Additional needs identified')

    // LDD Assessment data from Moorland
    const moorlandAssessment = $('[data-qa=ldd-assessment-from-MDI]')
    expect(moorlandAssessment.length).toEqual(1)
    expect(moorlandAssessment.find('[data-qa=prison-name]').text().trim()).toContain('Moorland (HMP & YOI)')
    expect(moorlandAssessment.find('[data-qa=rapid-assessment-date]').text().trim()).toEqual('18 February 2022')
    expect(moorlandAssessment.find('[data-qa=in-depth-assessment-date]').text().trim()).toEqual(
      'Not recorded in Curious',
    )
    expect(moorlandAssessment.find('[data-qa=primary-ldd-need]').text().trim()).toEqual('Visual impairment')
    const moorlandAssessmentAdditionalNeeds = moorlandAssessment
      .find('[data-qa=additional-ldd-needs] li')
      .map((_idx, el) => $(el).text().trim())
      .get()
    expect(moorlandAssessmentAdditionalNeeds).toEqual(['Hearing impairment'])
  })

  it('should should render the Additional Needs page given there are no LDD assessments recorded', () => {
    // Given
    const curiousAlnAndLddAssessments: CuriousAlnAndLddAssessments = {
      lddAssessments: [],
      alnAssessments: [],
    }
    const params = {
      ...templateParams,
      curiousAlnAndLddAssessments: Result.fulfilled(curiousAlnAndLddAssessments),
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=assessments]').length).toEqual(0)
    expect($('[data-qa=ldd-assessments]')).toHaveLength(0)
    expect($('[data-qa=aln-assessments]')).toHaveLength(0)
    expect($('[data-qa=no-assessments-message]').length).toEqual(1)
  })

  it('should render the Additional Needs page given the Curious service API promise is not resolved', () => {
    // Given
    const params = {
      ...templateParams,
      curiousAlnAndLddAssessments: Result.rejected(new Error('Failed to get ALN and LDD assessments')),
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=curious-assessments-unavailable-message]').length).toEqual(1)
  })
})
