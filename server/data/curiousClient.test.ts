import type { LearnerEductionPagedResponse, LearnerProfile } from 'curiousApiClient'
import nock from 'nock'
import CuriousClient from './curiousClient'
import config from '../config'
import { learnerEducationPagedResponsePage1Of1 } from '../testsupport/learnerEducationPagedResponseTestDataBuilder'

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

    it('should not get learner profile given API returns an error response', async () => {
      // Given
      const prisonNumber = 'A1234BC'
      const systemToken = 'a-system-token'

      const expectedResponseBody = {
        errorCode: 'VC4001',
        errorMessage: 'Invalid token',
        httpStatusCode: 401,
      }
      curiousApi.get(`/learnerProfile/${prisonNumber}`).reply(401, expectedResponseBody)

      // When
      try {
        await curiousClient.getLearnerProfile(prisonNumber, systemToken)
      } catch (e) {
        // Then
        expect(nock.isDone()).toBe(true)
        expect(e.status).toEqual(401)
        expect(e.data).toEqual(expectedResponseBody)
      }
    })
  })

  describe('getLearnerEducationPage', () => {
    it('should get learner eduction page', async () => {
      // Given
      const prisonNumber = 'A1234BC'
      const systemToken = 'a-system-token'
      const page = 0

      const learnerEducationPage1Of1: LearnerEductionPagedResponse = learnerEducationPagedResponsePage1Of1(prisonNumber)
      curiousApi.get(`/learnerEducation/${prisonNumber}?page=${page}`).reply(200, learnerEducationPage1Of1)

      // When
      const actual = await curiousClient.getLearnerEducationPage(prisonNumber, systemToken, page)

      // Then
      expect(actual).toEqual(learnerEducationPage1Of1)
      expect(nock.isDone()).toBe(true)
    })

    it('should not get learner education page given the API returns a 404', async () => {
      // Given
      const prisonNumber = 'A1234BC'
      const systemToken = 'a-system-token'
      const page = 0

      const expectedResponseBody = {
        errorCode: 'VC4004',
        errorMessage: 'Not found',
        httpStatusCode: 404,
      }
      curiousApi.get(`/learnerEducation/${prisonNumber}?page=${page}`).reply(404, expectedResponseBody)

      // When
      const actual = await curiousClient.getLearnerEducationPage(prisonNumber, systemToken, page)
      // Then
      expect(nock.isDone()).toBe(true)
      expect(actual).toBeNull()
    })

    it('should not get learner education page given the API returns an error response', async () => {
      // Given
      const prisonNumber = 'A1234BC'
      const systemToken = 'a-system-token'
      const page = 0

      const expectedResponseBody = {
        errorCode: 'VC4001',
        errorMessage: 'Invalid token',
        httpStatusCode: 401,
      }
      curiousApi.get(`/learnerEducation/${prisonNumber}?page=${page}`).reply(401, expectedResponseBody)

      // When
      try {
        await curiousClient.getLearnerEducationPage(prisonNumber, systemToken, page)
      } catch (e) {
        // Then
        expect(nock.isDone()).toBe(true)
        expect(e.status).toEqual(401)
        expect(e.data).toEqual(expectedResponseBody)
      }
    })
  })
})
