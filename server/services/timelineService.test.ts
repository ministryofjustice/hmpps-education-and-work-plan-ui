import type { TimelineResponse } from 'educationAndWorkPlanApiClient'
import type { Timeline } from 'viewModels'
import PrisonService from './prisonService'
import TimelineService from './timelineService'
import { EducationAndWorkPlanClient, HmppsAuthClient } from '../data'
import { toTimeline } from '../data/mappers/timelineMapper'
import aValidTimelineResponse from '../testsupport/timelineResponseTestDataBuilder'
import aValidTimeline from '../testsupport/timelineTestDataBuilder'

jest.mock('../data/mappers/timelineMapper')

describe('timelineService', () => {
  const mockedTimelineMapper = toTimeline as jest.MockedFunction<typeof toTimeline>

  const hmppsAuthClient = {
    getSystemClientToken: jest.fn(),
  }

  const educationAndWorkPlanClient = {
    getTimeline: jest.fn(),
  }

  const prisonService = {
    getPrisonByPrisonId: jest.fn(),
  }

  const timelineService = new TimelineService(
    hmppsAuthClient as unknown as HmppsAuthClient,
    educationAndWorkPlanClient as unknown as EducationAndWorkPlanClient,
    prisonService as unknown as PrisonService,
  )

  beforeEach(() => {
    jest.resetAllMocks()
  })

  const prisonNumber = 'A1234BC'
  const username = 'a-dps-user'
  const userToken = 'a-user-token'
  const systemToken = 'a-system-token'

  describe('getTimeline', () => {
    it('should get timeline', async () => {
      // Given
      hmppsAuthClient.getSystemClientToken.mockResolvedValue(systemToken)

      const timelineResponse: TimelineResponse = aValidTimelineResponse()
      educationAndWorkPlanClient.getTimeline.mockResolvedValue(timelineResponse)

      const timeline: Timeline = aValidTimeline()
      mockedTimelineMapper.mockReturnValue(timeline)

      // When
      const actual = await timelineService.getTimeline(prisonNumber, userToken, username)

      // Then
      expect(actual).toEqual(timeline)
      expect(hmppsAuthClient.getSystemClientToken).toHaveBeenCalledWith(username)
      expect(educationAndWorkPlanClient.getTimeline).toHaveBeenCalledWith(prisonNumber, userToken)
      expect(mockedTimelineMapper).toHaveBeenCalledWith(timelineResponse)
    })

    describe('lookup prison names', () => {
      it('should get timeline given prison name lookups for several different prisons', async () => {
        // Given
        hmppsAuthClient.getSystemClientToken.mockResolvedValue(systemToken)

        const timelineResponse: TimelineResponse = {
          reference: '6add2455-30f1-4b3e-a23e-1baf2d761e8f',
          prisonNumber: 'A1234BC',
          events: [
            {
              reference: 'f49a3412-df7f-41d2-ac04-ffd35e453af4',
              sourceReference: '32',
              eventType: 'INDUCTION_CREATED',
              prisonId: 'MDI',
              actionedBy: 'RALPH_GEN',
              timestamp: '2023-09-01T10:46:38.565Z',
              correlationId: '847aa5ad-2068-40e1-aec0-66b19007c494',
              contextualInfo: '',
              actionedByDisplayName: 'Ralph Gen',
            },
            {
              reference: 'cd98ea4c-b415-48d9-a600-9068cefe65e4x',
              sourceReference: '33bc1045-7368-47c4-a261-4d616b7b51b9',
              eventType: 'ACTION_PLAN_CREATED',
              prisonId: 'MDI',
              actionedBy: 'RALPH_GEN',
              timestamp: '2023-09-01T10:47:38.565Z',
              correlationId: '246aa049-c5df-459d-8231-bdeab3936d0f',
              contextualInfo: '',
              actionedByDisplayName: 'Ralph Gen',
            },
          ],
        }
        educationAndWorkPlanClient.getTimeline.mockResolvedValue(timelineResponse)

        const timeline: Timeline = {
          problemRetrievingData: false,
          reference: '6add2455-30f1-4b3e-a23e-1baf2d761e8f',
          prisonNumber: 'A1234BC',
          events: [
            {
              reference: 'f49a3412-df7f-41d2-ac04-ffd35e453af4',
              sourceReference: '32',
              eventType: 'INDUCTION_CREATED',
              prison: {
                prisonId: 'ASI',
                prisonName: undefined,
              },
              timestamp: '2023-09-01T10:46:38.565Z',
              correlationId: '847aa5ad-2068-40e1-aec0-66b19007c494',
              contextualInfo: '',
              actionedByDisplayName: 'Ralph Gen',
            },
            {
              reference: 'cd98ea4c-b415-48d9-a600-9068cefe65e4x',
              sourceReference: '33bc1045-7368-47c4-a261-4d616b7b51b9',
              eventType: 'ACTION_PLAN_CREATED',
              prison: {
                prisonId: 'MDI',
                prisonName: undefined,
              },
              timestamp: '2023-09-01T10:47:38.565Z',
              correlationId: '246aa049-c5df-459d-8231-bdeab3936d0f',
              contextualInfo: '',
              actionedByDisplayName: 'Ralph Gen',
            },
          ],
        }
        mockedTimelineMapper.mockReturnValue(timeline)

        prisonService.getPrisonByPrisonId.mockResolvedValueOnce({ prisonId: 'ASI', prisonName: 'Ashfield (HMP)' })
        prisonService.getPrisonByPrisonId.mockResolvedValueOnce({ prisonId: 'MDI', prisonName: 'Moorland (HMP & YOI)' })

        // When
        const actual = await timelineService.getTimeline(prisonNumber, userToken, username)

        // Then
        expect(actual.events[0].prison.prisonName).toEqual('Ashfield (HMP)')
        expect(actual.events[1].prison.prisonName).toEqual('Moorland (HMP & YOI)')

        expect(hmppsAuthClient.getSystemClientToken).toHaveBeenCalledWith(username)
        expect(mockedTimelineMapper).toHaveBeenCalledWith(timelineResponse)
        expect(prisonService.getPrisonByPrisonId).toHaveBeenCalledWith('ASI', systemToken)
        expect(prisonService.getPrisonByPrisonId).toHaveBeenCalledWith('MDI', systemToken)
      })

      it('should get timeline given prison name lookups fail', async () => {
        // Given
        hmppsAuthClient.getSystemClientToken.mockResolvedValue(systemToken)

        const timelineResponse: TimelineResponse = {
          reference: '6add2455-30f1-4b3e-a23e-1baf2d761e8f',
          prisonNumber: 'A1234BC',
          events: [
            {
              reference: 'f49a3412-df7f-41d2-ac04-ffd35e453af4',
              sourceReference: '32',
              eventType: 'INDUCTION_CREATED',
              prisonId: 'MDI',
              actionedBy: 'RALPH_GEN',
              timestamp: '2023-09-01T10:46:38.565Z',
              correlationId: '847aa5ad-2068-40e1-aec0-66b19007c494',
              contextualInfo: '',
              actionedByDisplayName: 'Ralph Gen',
            },
            {
              reference: 'cd98ea4c-b415-48d9-a600-9068cefe65e4x',
              sourceReference: '33bc1045-7368-47c4-a261-4d616b7b51b9',
              eventType: 'ACTION_PLAN_CREATED',
              prisonId: 'MDI',
              actionedBy: 'RALPH_GEN',
              timestamp: '2023-09-01T10:47:38.565Z',
              correlationId: '246aa049-c5df-459d-8231-bdeab3936d0f',
              contextualInfo: '',
              actionedByDisplayName: 'Ralph Gen',
            },
          ],
        }
        educationAndWorkPlanClient.getTimeline.mockResolvedValue(timelineResponse)

        const timeline: Timeline = {
          problemRetrievingData: false,
          reference: '6add2455-30f1-4b3e-a23e-1baf2d761e8f',
          prisonNumber: 'A1234BC',
          events: [
            {
              reference: 'f49a3412-df7f-41d2-ac04-ffd35e453af4',
              sourceReference: '32',
              eventType: 'INDUCTION_CREATED',
              prison: {
                prisonId: 'ASI',
                prisonName: undefined,
              },
              timestamp: '2023-09-01T10:46:38.565Z',
              correlationId: '847aa5ad-2068-40e1-aec0-66b19007c494',
              contextualInfo: '',
              actionedByDisplayName: 'Ralph Gen',
            },
            {
              reference: 'cd98ea4c-b415-48d9-a600-9068cefe65e4x',
              sourceReference: '33bc1045-7368-47c4-a261-4d616b7b51b9',
              eventType: 'ACTION_PLAN_CREATED',
              prison: {
                prisonId: 'MDI',
                prisonName: undefined,
              },
              timestamp: '2023-09-01T10:47:38.565Z',
              correlationId: '246aa049-c5df-459d-8231-bdeab3936d0f',
              contextualInfo: '',
              actionedByDisplayName: 'Ralph Gen',
            },
          ],
        }
        mockedTimelineMapper.mockReturnValue(timeline)

        prisonService.getPrisonByPrisonId.mockRejectedValue('some-error-looking-up-prison-name')

        // When
        const actual = await timelineService.getTimeline(prisonNumber, userToken, username)

        // Then
        expect(actual.events[0].prison.prisonName).toBeUndefined()
        expect(actual.events[1].prison.prisonName).toBeUndefined()

        expect(hmppsAuthClient.getSystemClientToken).toHaveBeenCalledWith(username)
        expect(mockedTimelineMapper).toHaveBeenCalledWith(timelineResponse)
        expect(prisonService.getPrisonByPrisonId).toHaveBeenCalledWith('ASI', systemToken)
        expect(prisonService.getPrisonByPrisonId).toHaveBeenCalledWith('MDI', systemToken)
      })
    })
  })
})
