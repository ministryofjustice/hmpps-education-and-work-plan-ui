import type { LearnerNeurodivergence, LearnerProfile } from 'curiousApiClient'
import nock from 'nock'
import CuriousClient from './curiousClient'
import config from '../config'

describe('curiousClient', () => {
  const curiousClient = new CuriousClient()

  config.apis.curious.url = 'http://localhost:8200'
  let curiousApi: nock.Scope

  beforeEach(() => {
    curiousApi = nock(config.apis.curious.url)
  })

  afterEach(() => {
    nock.cleanAll()
  })

  describe('getLearnerProfile', () => {
    it('should get learner profile', async () => {
      // Given
      const prisonNumber = 'A1234BC'
      const systemToken = 'a-system-token'

      const learnerProfile: Array<LearnerProfile> = [
        {
          prn: prisonNumber,
          establishmentId: 'MDI',
          establishmentName: 'MOORLAND (HMP & YOI)',
          uln: '3627609222',
          lddHealthProblem: 'No information provided by the learner.',
          priorAttainment: null,
          qualifications: [
            {
              qualificationType: 'Maths',
              qualificationGrade: 'Entry Level 1',
              assessmentDate: '2021-07-01',
            },
            {
              qualificationType: 'Digital Literacy',
              qualificationGrade: 'Entry Level 3',
              assessmentDate: '2021-07-01',
            },
          ],
          languageStatus: null,
          plannedHours: null,
          rapidAssessmentDate: null,
          inDepthAssessmentDate: null,
          primaryLDDAndHealthProblem: null,
          additionalLDDAndHealthProblems: [],
        },
      ]
      curiousApi.get(`/learnerProfile/${prisonNumber}`).reply(200, learnerProfile)

      // When
      const actual = await curiousClient.getLearnerProfile(prisonNumber, systemToken)

      // Then
      expect(actual).toEqual(learnerProfile)
      expect(nock.isDone()).toBe(true)
    })
  })

  describe('getLearnerNeurodivergence', () => {
    it('should get learner neuro divergence', async () => {
      // Given
      const prisonNumber = 'A1234BC'
      const systemToken = 'a-system-token'

      const learnerNeurodivergence: Array<LearnerNeurodivergence> = [
        {
          prn: prisonNumber,
          establishmentId: 'DNI',
          establishmentName: 'DONCASTER (HMP)',
          neurodivergenceSelfDeclared: ['ADHD'],
          selfDeclaredDate: '2022-05-16',
          neurodivergenceAssessed: ['No Identified Neurodiversity Need'],
          assessmentDate: '2022-05-16',
          neurodivergenceSupport: ['No Identified Support Required'],
          supportDate: '2022-05-16',
        },
      ]
      curiousApi.get(`/learnerNeurodivergence/${prisonNumber}`).reply(200, learnerNeurodivergence)

      // When
      const actual = await curiousClient.getLearnerNeurodivergence(prisonNumber, systemToken)

      // Then
      expect(actual).toEqual(learnerNeurodivergence)
      expect(nock.isDone()).toBe(true)
    })
  })
})
