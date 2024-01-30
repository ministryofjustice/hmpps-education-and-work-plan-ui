import type { TimelineResponse } from 'educationAndWorkPlanApiClient'
import type { Timeline } from 'viewModels'
import moment from 'moment'
import PrisonService from './prisonService'
import TimelineService from './timelineService'
import { EducationAndWorkPlanClient } from '../data'
import { toTimeline } from '../data/mappers/timelineMapper'
import aValidTimelineResponse from '../testsupport/timelineResponseTestDataBuilder'
import aValidTimeline from '../testsupport/timelineTestDataBuilder'
import config from '../config'

jest.mock('../data/mappers/timelineMapper')

describe('timelineService', () => {
  const mockedTimelineMapper = toTimeline as jest.MockedFunction<typeof toTimeline>

  const educationAndWorkPlanClient = {
    getTimeline: jest.fn(),
  }

  const prisonService = {
    lookupPrison: jest.fn(),
  }

  const timelineService = new TimelineService(
    educationAndWorkPlanClient as unknown as EducationAndWorkPlanClient,
    prisonService as unknown as PrisonService,
  )

  beforeEach(() => {
    jest.resetAllMocks()
  })

  const prisonNumber = 'A1234BC'
  const username = 'a-dps-user'
  const userToken = 'a-user-token'

  describe('getTimeline', () => {
    it('should get timeline', async () => {
      // Given
      const timelineResponse: TimelineResponse = aValidTimelineResponse()
      educationAndWorkPlanClient.getTimeline.mockResolvedValue(timelineResponse)

      const timeline: Timeline = aValidTimeline()
      mockedTimelineMapper.mockReturnValue(timeline)

      // When
      const actual = await timelineService.getTimeline(prisonNumber, userToken, username)

      // Then
      expect(actual).toEqual(timeline)
      expect(educationAndWorkPlanClient.getTimeline).toHaveBeenCalledWith(prisonNumber, userToken)
      expect(mockedTimelineMapper).toHaveBeenCalledWith(timelineResponse)
    })

    it('should get timeline with prison movement events', async () => {
      // Given
      config.featureToggles.includePrisonTimelineEventsEnabled = true
      const timelineResponse: TimelineResponse = {
        reference: '6add2455-30f1-4b3e-a23e-1baf2d761e8f',
        prisonNumber: 'A1234BC',
        events: [
          {
            reference: 'f49a3412-df7f-41d2-ac04-ffd35e453af4',
            sourceReference: '1211013',
            eventType: 'PRISON_ADMISSION',
            prisonId: 'MDI',
            actionedBy: 'system',
            timestamp: '2023-08-01T10:46:38.565Z',
            correlationId: '6457a634-6dbe-4179-983b-74e92883232c',
            contextualInfo: undefined,
            actionedByDisplayName: undefined,
          },
          {
            reference: '97cf372e-009f-4781-83d9-e4cc74ee321e',
            sourceReference: '3a60b143-dfe3-49a7-9cba-31c2b8a7fa8b',
            eventType: 'GOAL_CREATED',
            prisonId: 'MDI',
            actionedBy: 'RALPH_GEN',
            timestamp: '2023-09-01T10:46:38.565Z',
            correlationId: '847aa5ad-2068-40e1-aec0-66b19007c494',
            contextualInfo: 'Learn French',
            actionedByDisplayName: 'Ralph Gen',
          },
        ],
      }
      educationAndWorkPlanClient.getTimeline.mockResolvedValue(timelineResponse)
      const expectedFilteredTimelineResponse: TimelineResponse = {
        reference: '6add2455-30f1-4b3e-a23e-1baf2d761e8f',
        prisonNumber: 'A1234BC',
        events: [
          {
            reference: 'f49a3412-df7f-41d2-ac04-ffd35e453af4',
            sourceReference: '1211013',
            eventType: 'PRISON_ADMISSION',
            prisonId: 'MDI',
            actionedBy: 'system',
            timestamp: '2023-08-01T10:46:38.565Z',
            correlationId: '6457a634-6dbe-4179-983b-74e92883232c',
            contextualInfo: undefined,
            actionedByDisplayName: undefined,
          },
          {
            reference: '97cf372e-009f-4781-83d9-e4cc74ee321e',
            sourceReference: '3a60b143-dfe3-49a7-9cba-31c2b8a7fa8b',
            eventType: 'GOAL_CREATED',
            prisonId: 'MDI',
            actionedBy: 'RALPH_GEN',
            timestamp: '2023-09-01T10:46:38.565Z',
            correlationId: '847aa5ad-2068-40e1-aec0-66b19007c494',
            contextualInfo: 'Learn French',
            actionedByDisplayName: 'Ralph Gen',
          },
        ],
      }
      const timeline: Timeline = aValidTimeline()
      mockedTimelineMapper.mockReturnValue(timeline)

      // When
      const actual = await timelineService.getTimeline(prisonNumber, userToken, username)

      // Then
      expect(actual).toEqual(timeline)
      expect(educationAndWorkPlanClient.getTimeline).toHaveBeenCalledWith(prisonNumber, userToken)
      expect(mockedTimelineMapper).toHaveBeenCalledWith(expectedFilteredTimelineResponse) // this is the key test
    })

    it('should get timeline without prison movement events', async () => {
      // Given
      config.featureToggles.includePrisonTimelineEventsEnabled = false
      const timelineResponse: TimelineResponse = {
        reference: '6add2455-30f1-4b3e-a23e-1baf2d761e8f',
        prisonNumber: 'A1234BC',
        events: [
          {
            reference: 'f49a3412-df7f-41d2-ac04-ffd35e453af4',
            sourceReference: '1211013',
            eventType: 'PRISON_ADMISSION',
            prisonId: 'MDI',
            actionedBy: 'system',
            timestamp: '2023-08-01T10:46:38.565Z',
            correlationId: '6457a634-6dbe-4179-983b-74e92883232c',
            contextualInfo: undefined,
            actionedByDisplayName: undefined,
          },
          {
            reference: '97cf372e-009f-4781-83d9-e4cc74ee321e',
            sourceReference: '3a60b143-dfe3-49a7-9cba-31c2b8a7fa8b',
            eventType: 'GOAL_CREATED',
            prisonId: 'MDI',
            actionedBy: 'RALPH_GEN',
            timestamp: '2023-09-01T10:46:38.565Z',
            correlationId: '847aa5ad-2068-40e1-aec0-66b19007c494',
            contextualInfo: 'Learn French',
            actionedByDisplayName: 'Ralph Gen',
          },
        ],
      }
      educationAndWorkPlanClient.getTimeline.mockResolvedValue(timelineResponse)
      const expectedFilteredTimelineResponse: TimelineResponse = {
        reference: '6add2455-30f1-4b3e-a23e-1baf2d761e8f',
        prisonNumber: 'A1234BC',
        events: [
          {
            reference: '97cf372e-009f-4781-83d9-e4cc74ee321e',
            sourceReference: '3a60b143-dfe3-49a7-9cba-31c2b8a7fa8b',
            eventType: 'GOAL_CREATED',
            prisonId: 'MDI',
            actionedBy: 'RALPH_GEN',
            timestamp: '2023-09-01T10:46:38.565Z',
            correlationId: '847aa5ad-2068-40e1-aec0-66b19007c494',
            contextualInfo: 'Learn French',
            actionedByDisplayName: 'Ralph Gen',
          },
        ],
      }
      const timeline: Timeline = aValidTimeline()
      mockedTimelineMapper.mockReturnValue(timeline)

      // When
      const actual = await timelineService.getTimeline(prisonNumber, userToken, username)

      // Then
      expect(actual).toEqual(timeline)
      expect(educationAndWorkPlanClient.getTimeline).toHaveBeenCalledWith(prisonNumber, userToken)
      expect(mockedTimelineMapper).toHaveBeenCalledWith(expectedFilteredTimelineResponse) // this is the key test
    })
  })

  describe('lookup prison names', () => {
    it('should get timeline given prison name lookups for several different prisons', async () => {
      // Given
      const timelineResponse = aValidTimelineResponse()
      educationAndWorkPlanClient.getTimeline.mockResolvedValue(timelineResponse)

      const timeline: Timeline = {
        problemRetrievingData: false,
        reference: '6add2455-30f1-4b3e-a23e-1baf2d761e8f',
        prisonNumber: 'A1234BC',
        events: [
          {
            reference: 'f49a3412-df7f-41d2-ac04-ffd35e453af4',
            sourceReference: '32',
            eventType: 'ACTION_PLAN_CREATED',
            prison: {
              prisonId: 'ASI',
              prisonName: undefined,
            },
            timestamp: moment('2023-09-01T10:46:38.565Z').toDate(),
            correlationId: '847aa5ad-2068-40e1-aec0-66b19007c494',
            contextualInfo: '',
            actionedByDisplayName: 'Ralph Gen',
          },
          {
            reference: 'cd98ea4c-b415-48d9-a600-9068cefe65e4x',
            sourceReference: '33bc1045-7368-47c4-a261-4d616b7b51b9',
            eventType: 'GOAL_CREATED',
            prison: {
              prisonId: 'MDI',
              prisonName: undefined,
            },
            timestamp: moment('2023-09-01T10:47:38.565Z').toDate(),
            correlationId: '246aa049-c5df-459d-8231-bdeab3936d0f',
            contextualInfo: '',
            actionedByDisplayName: 'Ralph Gen',
          },
        ],
      }
      mockedTimelineMapper.mockReturnValue(timeline)

      prisonService.lookupPrison.mockResolvedValueOnce({ prisonId: 'ASI', prisonName: 'Ashfield (HMP)' })
      prisonService.lookupPrison.mockResolvedValueOnce({ prisonId: 'MDI', prisonName: 'Moorland (HMP & YOI)' })

      // When
      const actual = await timelineService.getTimeline(prisonNumber, userToken, username)

      // Then
      expect(actual.events[0].prison.prisonName).toEqual('Ashfield (HMP)')
      expect(actual.events[1].prison.prisonName).toEqual('Moorland (HMP & YOI)')

      expect(mockedTimelineMapper).toHaveBeenCalledWith(timelineResponse)
      expect(prisonService.lookupPrison).toHaveBeenCalledWith('ASI', username)
      expect(prisonService.lookupPrison).toHaveBeenCalledWith('MDI', username)
    })

    it('should get timeline given prison name lookups fail', async () => {
      // Given
      const timelineResponse = aValidTimelineResponse()
      educationAndWorkPlanClient.getTimeline.mockResolvedValue(timelineResponse)

      const timeline: Timeline = {
        problemRetrievingData: false,
        reference: '6add2455-30f1-4b3e-a23e-1baf2d761e8f',
        prisonNumber: 'A1234BC',
        events: [
          {
            reference: 'f49a3412-df7f-41d2-ac04-ffd35e453af4',
            sourceReference: '32',
            eventType: 'ACTION_PLAN_CREATED',
            prison: {
              prisonId: 'ASI',
              prisonName: undefined,
            },
            timestamp: moment('2023-09-01T10:46:38.565Z').toDate(),
            correlationId: '847aa5ad-2068-40e1-aec0-66b19007c494',
            contextualInfo: '',
            actionedByDisplayName: 'Ralph Gen',
          },
          {
            reference: 'cd98ea4c-b415-48d9-a600-9068cefe65e4x',
            sourceReference: '33bc1045-7368-47c4-a261-4d616b7b51b9',
            eventType: 'GOAL_CREATED',
            prison: {
              prisonId: 'MDI',
              prisonName: undefined,
            },
            timestamp: moment('2023-09-01T10:47:38.565Z').toDate(),
            correlationId: '246aa049-c5df-459d-8231-bdeab3936d0f',
            contextualInfo: '',
            actionedByDisplayName: 'Ralph Gen',
          },
        ],
      }
      mockedTimelineMapper.mockReturnValue(timeline)

      prisonService.lookupPrison.mockReturnValue({ prisonId: 'MDI', prisonName: undefined })

      // When
      const actual = await timelineService.getTimeline(prisonNumber, userToken, username)

      // Then
      expect(actual.events[0].prison.prisonName).toBeUndefined()
      expect(actual.events[1].prison.prisonName).toBeUndefined()

      expect(mockedTimelineMapper).toHaveBeenCalledWith(timelineResponse)
      expect(prisonService.lookupPrison).toHaveBeenCalledWith('ASI', username)
      expect(prisonService.lookupPrison).toHaveBeenCalledWith('MDI', username)
    })
  })
})
