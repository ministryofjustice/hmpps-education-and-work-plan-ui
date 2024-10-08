import { parseISO, startOfDay } from 'date-fns'
import type { PrisonerSupportNeeds } from 'viewModels'
import type { LearnerProfile } from 'curiousApiClient'
import toPrisonerSupportNeeds from './prisonerSupportNeedsMapper'

describe('prisonerSupportNeedsMapper', () => {
  it('should map to SupportNeeds', () => {
    // Given
    const learnerProfile: Array<LearnerProfile> = [
      {
        prn: 'G6123VU',
        establishmentId: 'MDI',
        establishmentName: 'MOORLAND (HMP & YOI)',
        rapidAssessmentDate: '2022-05-18',
        inDepthAssessmentDate: '2022-06-01',
        lddHealthProblem: 'Learner considers himself or herself to have a learning difficulty.',
        primaryLDDAndHealthProblem: 'Hearing impairment',
        additionalLDDAndHealthProblems: undefined,
      },
      {
        prn: 'G6123VU',
        establishmentId: 'DNI',
        establishmentName: 'DONCASTER (HMP)',
        rapidAssessmentDate: undefined,
        inDepthAssessmentDate: undefined,
        lddHealthProblem: 'Learner considers himself or herself to have a learning difficulty.',
        primaryLDDAndHealthProblem: 'Visual impairment',
        additionalLDDAndHealthProblems: [
          'Hearing impairment',
          'Social and emotional difficulties',
          'Mental health difficulty',
        ],
      },
    ]

    const expectedSupportNeeds: PrisonerSupportNeeds = {
      problemRetrievingData: false,
      healthAndSupportNeeds: [
        {
          prisonId: 'MDI',
          prisonName: 'MOORLAND (HMP & YOI)',
          rapidAssessmentDate: startOfDay(parseISO('2022-05-18')),
          inDepthAssessmentDate: startOfDay(parseISO('2022-06-01')),
          primaryLddAndHealthNeeds: 'Hearing impairment',
          additionalLddAndHealthNeeds: [],
        },
        {
          prisonId: 'DNI',
          prisonName: 'DONCASTER (HMP)',
          rapidAssessmentDate: undefined,
          inDepthAssessmentDate: undefined,
          primaryLddAndHealthNeeds: 'Visual impairment',
          additionalLddAndHealthNeeds: [
            'Hearing impairment',
            'Mental health difficulty',
            'Social and emotional difficulties',
          ],
        },
      ],
    }

    // When
    const supportNeeds = toPrisonerSupportNeeds(learnerProfile)

    // Then
    expect(supportNeeds).toEqual(expectedSupportNeeds)
  })
})
