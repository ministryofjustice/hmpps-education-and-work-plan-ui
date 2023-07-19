import moment from 'moment'
import type { PrisonerSupportNeeds, HealthAndSupportNeeds, Neurodiversity } from 'viewModels'
import { toPrisonerSupportNeeds } from './prisonerSupportNeedsMapper'

describe('prisonerSupportNeedsMapper', () => {
  it('should map to SupportNeeds', () => {
    // Given
    const learnerProfile = [
      {
        prn: 'G6123VU',
        establishmentId: 'MDI',
        establishmentName: 'MOORLAND (HMP & YOI)',
        lddHealthProblem: 'Learner considers himself or herself to have a learning difficulty.',
        languageStatus: 'Bilingual',
        primaryLDDAndHealthProblem: 'Hearing impairment',
        additionalLDDAndHealthProblems: [],
      },
      {
        prn: 'G6123VU',
        establishmentId: 'DNI',
        establishmentName: 'DONCASTER (HMP)',
        lddHealthProblem: 'Learner considers himself or herself to have a learning difficulty.',
        languageStatus: 'Bilingual',
        primaryLDDAndHealthProblem: 'Visual impairment',
        additionalLDDAndHealthProblems: [
          'Hearing impairment',
          'Social and emotional difficulties',
          'Mental health difficulty',
        ],
      },
    ]
    const learnerNeurodivergence = [
      {
        prn: 'G6123VU',
        establishmentId: 'MDI',
        establishmentName: 'MOORLAND (HMP & YOI)',
        neurodivergenceSelfDeclared: ['Dyslexia'],
        selfDeclaredDate: '2022-02-18',
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

    const expectedSupportNeeds = {
      healthAndSupportNeeds: [
        {
          prisonId: 'MDI',
          prisonName: 'MOORLAND (HMP & YOI)',
          languageSupportNeeded: 'Bilingual',
          lddAndHealthNeeds: ['Hearing impairment'],
        } as HealthAndSupportNeeds,
        {
          prisonId: 'DNI',
          prisonName: 'DONCASTER (HMP)',
          languageSupportNeeded: 'Bilingual',
          lddAndHealthNeeds: [
            'Visual impairment',
            'Hearing impairment',
            'Mental health difficulty',
            'Social and emotional difficulties',
          ],
        } as HealthAndSupportNeeds,
      ],
      neurodiversities: [
        {
          prisonId: 'MDI',
          prisonName: 'MOORLAND (HMP & YOI)',
          supportNeeded: ['Writing support'],
          supportNeededRecordedDate: moment('2022-02-18').toDate(),
          selfDeclaredNeurodiversity: ['Dyslexia'],
          selfDeclaredRecordedDate: moment('2022-02-18').toDate(),
          assessedNeurodiversity: ['ADHD'],
          assessmentDate: moment('2022-05-18').toDate(),
        } as Neurodiversity,
        {
          prisonId: 'DNI',
          prisonName: 'DONCASTER (HMP)',
          supportNeeded: ['No Identified Support Required'],
          supportNeededRecordedDate: moment('2022-02-18').toDate(),
          selfDeclaredNeurodiversity: [],
          selfDeclaredRecordedDate: moment('2022-02-18').toDate(),
          assessedNeurodiversity: ['No Identified Neurodiversity Need'],
          assessmentDate: moment('2022-05-18').toDate(),
        } as Neurodiversity,
      ],
    } as PrisonerSupportNeeds

    // When
    const supportNeeds = toPrisonerSupportNeeds(learnerProfile, learnerNeurodivergence)

    // Then
    expect(supportNeeds).toEqual(expectedSupportNeeds)
  })
})
