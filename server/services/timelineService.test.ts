import type { Timeline } from 'viewModels'
import moment from 'moment'
import PrisonService from './prisonService'
import TimelineService from './timelineService'
import EducationAndWorkPlanClient from '../data/educationAndWorkPlanClient'
import HmppsAuthClient from '../data/hmppsAuthClient'
import toTimeline from '../data/mappers/timelineMapper'
import aValidTimelineResponse from '../testsupport/timelineResponseTestDataBuilder'

jest.mock('../data/mappers/timelineMapper')
jest.mock('./prisonService')
jest.mock('../data/educationAndWorkPlanClient')
jest.mock('../data/hmppsAuthClient')

describe('timelineService', () => {
  const mockedTimelineMapper = toTimeline as jest.MockedFunction<typeof toTimeline>

  const educationAndWorkPlanClient = new EducationAndWorkPlanClient() as jest.Mocked<EducationAndWorkPlanClient>
  const prisonService = new PrisonService(null, null, null) as jest.Mocked<PrisonService>
  const hmppsAuthClient = new HmppsAuthClient(null) as jest.Mocked<HmppsAuthClient>
  const timelineService = new TimelineService(educationAndWorkPlanClient, prisonService, hmppsAuthClient)

  const prisonNumber = 'A1234BC'
  const username = 'a-dps-user'
  const systemToken = 'a-system-token'
  const supportedTimelineEvents = [
    'ACTION_PLAN_CREATED',
    'INDUCTION_UPDATED',
    'GOAL_UPDATED',
    'GOAL_CREATED',
    'GOAL_ARCHIVED',
    'GOAL_UNARCHIVED',
    'PRISON_ADMISSION',
    'PRISON_RELEASE',
    'PRISON_TRANSFER',
  ]

  beforeEach(() => {
    jest.resetAllMocks()
    hmppsAuthClient.getSystemClientToken.mockResolvedValue(systemToken)
  })

  describe('getTimeline', () => {
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
            contextualInfo: {},
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
            contextualInfo: {
              GOAL_TITLE: 'Learn French',
            },
            actionedByDisplayName: 'Ralph Gen',
          },
        ],
      }
      mockedTimelineMapper.mockReturnValue(timeline)

      prisonService.getPrisonByPrisonId.mockResolvedValueOnce({ prisonId: 'ASI', prisonName: 'Ashfield (HMP)' })
      prisonService.getPrisonByPrisonId.mockResolvedValueOnce({ prisonId: 'MDI', prisonName: 'Moorland (HMP & YOI)' })

      // When
      const actual = await timelineService.getTimeline(prisonNumber, username)

      // Then
      expect(actual.events[0].prison.prisonName).toEqual('Ashfield (HMP)')
      expect(actual.events[1].prison.prisonName).toEqual('Moorland (HMP & YOI)')

      expect(mockedTimelineMapper).toHaveBeenCalledWith(timelineResponse)
      expect(prisonService.getPrisonByPrisonId).toHaveBeenCalledWith('ASI', username)
      expect(prisonService.getPrisonByPrisonId).toHaveBeenCalledWith('MDI', username)

      expect(educationAndWorkPlanClient.getTimeline).toHaveBeenCalledWith(
        prisonNumber,
        systemToken,
        supportedTimelineEvents,
      )
      expect(hmppsAuthClient.getSystemClientToken).toHaveBeenCalledWith(username)
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
            contextualInfo: {},
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
            contextualInfo: {
              GOAL_TITLE: 'Learn French',
            },
            actionedByDisplayName: 'Ralph Gen',
          },
        ],
      }
      mockedTimelineMapper.mockReturnValue(timeline)

      prisonService.getPrisonByPrisonId.mockResolvedValue({ prisonId: 'MDI', prisonName: undefined })

      // When
      const actual = await timelineService.getTimeline(prisonNumber, username)

      // Then
      expect(actual.events[0].prison.prisonName).toBeUndefined()
      expect(actual.events[1].prison.prisonName).toBeUndefined()

      expect(mockedTimelineMapper).toHaveBeenCalledWith(timelineResponse)
      expect(prisonService.getPrisonByPrisonId).toHaveBeenCalledWith('ASI', username)
      expect(prisonService.getPrisonByPrisonId).toHaveBeenCalledWith('MDI', username)

      expect(educationAndWorkPlanClient.getTimeline).toHaveBeenCalledWith(
        prisonNumber,
        systemToken,
        supportedTimelineEvents,
      )
      expect(hmppsAuthClient.getSystemClientToken).toHaveBeenCalledWith(username)
    })
  })
})
