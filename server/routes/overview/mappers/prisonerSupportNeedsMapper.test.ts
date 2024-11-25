import { parseISO, startOfDay } from 'date-fns'
import type { PrisonerSupportNeeds } from 'viewModels'
import type { LearnerProfile } from 'curiousApiClient'
import toPrisonerSupportNeeds from './prisonerSupportNeedsMapper'

describe('prisonerSupportNeedsMapper', () => {
  const examplePrisonNamesById = new Map([
    ['DNI', 'Doncaster (HMP)'],
    ['MDI', 'Moorland (HMP & YOI)'],
  ])

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
        lddHealthProblem: null,
        primaryLDDAndHealthProblem: null,
        additionalLDDAndHealthProblems: [],
      },
    ]

    const expectedSupportNeeds: PrisonerSupportNeeds = {
      problemRetrievingData: false,
      healthAndSupportNeeds: [
        {
          prisonId: 'MDI',
          prisonName: 'Moorland (HMP & YOI)',
          rapidAssessmentDate: startOfDay(parseISO('2022-05-18')),
          inDepthAssessmentDate: startOfDay(parseISO('2022-06-01')),
          primaryLddAndHealthNeeds: 'Hearing impairment',
          additionalLddAndHealthNeeds: [],
          hasSupportNeeds: true,
        },
        {
          prisonId: 'DNI',
          prisonName: 'Doncaster (HMP)',
          rapidAssessmentDate: undefined,
          inDepthAssessmentDate: undefined,
          primaryLddAndHealthNeeds: null,
          additionalLddAndHealthNeeds: [],
          hasSupportNeeds: false,
        },
      ],
    }

    // When
    const supportNeeds = toPrisonerSupportNeeds(learnerProfile, examplePrisonNamesById)

    // Then
    expect(supportNeeds).toEqual(expectedSupportNeeds)
  })
})
