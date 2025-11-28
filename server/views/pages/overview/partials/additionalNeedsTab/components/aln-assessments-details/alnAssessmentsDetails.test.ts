import nunjucks from 'nunjucks'
import * as cheerio from 'cheerio'
import { startOfDay } from 'date-fns'
import type { AlnAssessment } from 'viewModels'
import formatDateFilter from '../../../../../../../filters/formatDateFilter'
import aValidPrisonerSummary from '../../../../../../../testsupport/prisonerSummaryTestDataBuilder'
import formatAlnAssessmentReferralScreenValueFilter from '../../../../../../../filters/formatAlnAssessmentReferralFilter'
import AlnAssessmentReferral from '../../../../../../../enums/alnAssessmentReferral'
import { anAlnAssessment } from '../../../../../../../testsupport/curiousAlnAndLddAssessmentsTestDataBuilder'

const njkEnv = nunjucks.configure([
  'node_modules/govuk-frontend/dist/',
  'node_modules/@ministryofjustice/frontend/',
  'server/views/',
  __dirname,
])

njkEnv //
  .addFilter('formatDate', formatDateFilter)
  .addFilter('formatAlnAssessmentReferralScreenValue', formatAlnAssessmentReferralScreenValueFilter)

const prisonerSummary = aValidPrisonerSummary({ firstName: 'IFEREECA', lastName: 'PEIGH' })
const prisonNamesById = {
  BXI: 'Brixton (HMP)',
  LEI: 'Leeds (HMP)',
}
const templateParams = {
  prisonerSummary,
  prisonNamesById,
  alnAssessments: [anAlnAssessment()],
}

const template = 'alnAssessmentsDetails.test.njk'

describe('Tests for the ALN Assessments Details component', () => {
  it('should render the component', () => {
    // Given
    const params = {
      ...templateParams,
      alnAssessments: [
        anAlnAssessment({
          prisonId: 'LEI',
          assessmentDate: startOfDay('2024-10-13'),
          referral: null,
          additionalNeedsIdentified: true,
        }),
        anAlnAssessment({
          prisonId: 'BXI',
          assessmentDate: startOfDay('2023-01-06'),
          referral: [AlnAssessmentReferral.SAFER_CUSTODY, AlnAssessmentReferral.EDUCATION_SPECIALIST],
          additionalNeedsIdentified: false,
        }),
      ],
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    const assessmentAtLeeds = $('[data-qa=aln-assessment-from-LEI]')
    expect(assessmentAtLeeds.length).toEqual(1)
    expect(assessmentAtLeeds.find('h3').text().trim().replaceAll(/\s\s+/g, ' ')).toEqual(
      `Ifereeca Peigh's additional learning needs assessment recorded whilst at Leeds (HMP)`,
    )
    expect(assessmentAtLeeds.find('[data-qa=assessment-date]').text().trim()).toEqual('13 October 2024')
    expect(assessmentAtLeeds.find('[data-qa=assessment-outcome]').text().trim()).toEqual('Additional needs identified')
    expect(assessmentAtLeeds.find('[data-qa=assessment-referral]').text().trim()).toEqual('Not recorded in Curious')

    const assessmentAtBrixton = $('[data-qa=aln-assessment-from-BXI]')
    expect(assessmentAtBrixton.length).toEqual(1)
    expect(assessmentAtBrixton.find('h3').text().trim().replaceAll(/\s\s+/g, ' ')).toEqual(
      `Ifereeca Peigh's additional learning needs assessment recorded whilst at Brixton (HMP)`,
    )
    expect(assessmentAtBrixton.find('[data-qa=assessment-date]').text().trim()).toEqual('6 January 2023')
    expect(assessmentAtBrixton.find('[data-qa=assessment-outcome]').text().trim()).toEqual(
      'No additional needs identified',
    )
    expect(assessmentAtBrixton.find('[data-qa=assessment-referral] li').length).toEqual(2)
    expect(assessmentAtBrixton.find('[data-qa=assessment-referral] li').eq(0).text().trim()).toEqual('Safer Custody')
    expect(assessmentAtBrixton.find('[data-qa=assessment-referral] li').eq(1).text().trim()).toEqual(
      'Education Specialist',
    )
  })

  it('should render the component given prison name lookup does not resolve prisons', () => {
    // Given
    const params = {
      ...templateParams,
      prisonNamesById: {},
      alnAssessments: [
        anAlnAssessment({
          prisonId: 'LEI',
          assessmentDate: startOfDay('2024-10-13'),
          referral: [AlnAssessmentReferral.SAFER_CUSTODY],
          additionalNeedsIdentified: true,
        }),
        anAlnAssessment({
          prisonId: 'BXI',
          assessmentDate: startOfDay('2023-01-06'),
          referral: [AlnAssessmentReferral.EDUCATION_SPECIALIST],
          additionalNeedsIdentified: false,
        }),
      ],
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    const assessmentAtLeeds = $('[data-qa=aln-assessment-from-LEI]')
    expect(assessmentAtLeeds.length).toEqual(1)
    expect(assessmentAtLeeds.find('h3').text().trim().replaceAll(/\s\s+/g, ' ')).toEqual(
      `Ifereeca Peigh's additional learning needs assessment recorded whilst at LEI`,
    )

    const assessmentAtBrixton = $('[data-qa=aln-assessment-from-BXI]')
    expect(assessmentAtBrixton.length).toEqual(1)
    expect(assessmentAtBrixton.find('h3').text().trim().replaceAll(/\s\s+/g, ' ')).toEqual(
      `Ifereeca Peigh's additional learning needs assessment recorded whilst at BXI`,
    )
  })

  it('should render the component given no ALN assessments', () => {
    // Given
    const params = { ...templateParams, alnAssessments: [] as Array<AlnAssessment> }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=aln-assessments]').length).toEqual(0)
    expect($('[data-qa=no-aln-assessments]').length).toEqual(1)
  })
})
