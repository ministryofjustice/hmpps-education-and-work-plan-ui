import { parseISO, startOfDay } from 'date-fns'
import type { PrisonerSupportNeeds } from 'viewModels'
import type { LearnerNeurodivergence, LearnerProfile } from 'curiousApiClient'
import { toPrisonerSupportNeeds } from './prisonerSupportNeedsMapper'

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
    const learnerNeurodivergence: Array<LearnerNeurodivergence> = [
      {
        prn: 'G6123VU',
        establishmentId: 'MDI',
        establishmentName: 'MOORLAND (HMP & YOI)',
        neurodivergenceSelfDeclared: ['Dyslexia'],
        selfDeclaredDate: null,
        neurodivergenceAssessed: ['ADHD'],
        assessmentDate: '2022-05-18',
        neurodivergenceSupport: ['Writing support'],
        supportDate: '2022-02-18',
      },
      {
        prn: 'G6123VU',
        establishmentId: 'DNI',
        establishmentName: 'DONCASTER (HMP)',
        neurodivergenceSelfDeclared: [],
        selfDeclaredDate: '2022-02-18',
        neurodivergenceAssessed: ['No Identified Neurodiversity Need'],
        assessmentDate: '2022-05-18',
        neurodivergenceSupport: ['No Identified Support Required'],
        supportDate: '2022-02-18',
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
      neurodiversities: [
        {
          prisonId: 'MDI',
          prisonName: 'MOORLAND (HMP & YOI)',
          supportNeeded: ['Writing support'],
          supportNeededRecordedDate: startOfDay(parseISO('2022-02-18')),
          selfDeclaredNeurodiversity: ['Dyslexia'],
          selfDeclaredRecordedDate: undefined,
          assessedNeurodiversity: ['ADHD'],
          assessmentDate: startOfDay(parseISO('2022-05-18')),
        },
        {
          prisonId: 'DNI',
          prisonName: 'DONCASTER (HMP)',
          supportNeeded: ['No Identified Support Required'],
          supportNeededRecordedDate: startOfDay(parseISO('2022-02-18')),
          selfDeclaredNeurodiversity: [],
          selfDeclaredRecordedDate: startOfDay(parseISO('2022-02-18')),
          assessedNeurodiversity: ['No Identified Neurodiversity Need'],
          assessmentDate: startOfDay(parseISO('2022-05-18')),
        },
      ],
    }

    // When
    const supportNeeds = toPrisonerSupportNeeds(learnerProfile, learnerNeurodivergence)

    // Then
    expect(supportNeeds).toEqual(expectedSupportNeeds)
  })
})
