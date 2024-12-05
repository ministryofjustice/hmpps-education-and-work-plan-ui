import type { Timeline } from 'viewModels'
import moment from 'moment'
import PrisonService from './prisonService'
import TimelineService from './timelineService'
import EducationAndWorkPlanClient from '../data/educationAndWorkPlanClient'
import toTimeline from '../data/mappers/timelineMapper'
import aValidTimelineResponse from '../testsupport/timelineResponseTestDataBuilder'
import HmppsAuthClient from '../data/hmppsAuthClient'

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
    'GOAL_COMPLETED',
    'ACTION_PLAN_REVIEW_COMPLETED',
    'PRISON_ADMISSION',
    'PRISON_RELEASE',
    'PRISON_TRANSFER',
  ]
  const mockedPrisonNamesById = new Map([
    ['ASI', 'Ashfield (HMP)'],
    ['MDI', 'Moorland (HMP & YOI)'],
  ])

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
            prisonName: 'ASI',
            timestamp: moment('2023-09-01T10:46:38.565Z').toDate(),
            correlationId: '847aa5ad-2068-40e1-aec0-66b19007c494',
            contextualInfo: {},
            actionedByDisplayName: 'Ralph Gen',
          },
          {
            reference: 'cd98ea4c-b415-48d9-a600-9068cefe65e4x',
            sourceReference: '33bc1045-7368-47c4-a261-4d616b7b51b9',
            eventType: 'GOAL_CREATED',
            prisonName: 'MDI',
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
      prisonService.getAllPrisonNamesById.mockResolvedValueOnce(mockedPrisonNamesById)

      // When
      const actual = await timelineService.getTimeline(prisonNumber, username)

      // Then
      expect(mockedTimelineMapper).toHaveBeenCalledWith(timelineResponse, mockedPrisonNamesById)
      expect(prisonService.getAllPrisonNamesById).toHaveBeenCalledWith(username)
      expect(actual).toEqual(timeline)
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
            prisonName: 'ASI',
            timestamp: moment('2023-09-01T10:46:38.565Z').toDate(),
            correlationId: '847aa5ad-2068-40e1-aec0-66b19007c494',
            contextualInfo: {},
            actionedByDisplayName: 'Ralph Gen',
          },
          {
            reference: 'cd98ea4c-b415-48d9-a600-9068cefe65e4x',
            sourceReference: '33bc1045-7368-47c4-a261-4d616b7b51b9',
            eventType: 'GOAL_CREATED',
            prisonName: 'MDI',
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

      prisonService.getAllPrisonNamesById.mockResolvedValue(new Map())

      // When
      const actual = await timelineService.getTimeline(prisonNumber, username)

      // Then
      expect(mockedTimelineMapper).toHaveBeenCalledWith(timelineResponse, new Map())
      expect(prisonService.getAllPrisonNamesById).toHaveBeenCalledWith(username)
      expect(actual).toEqual(timeline)
      expect(educationAndWorkPlanClient.getTimeline).toHaveBeenCalledWith(
        prisonNumber,
        systemToken,
        supportedTimelineEvents,
      )
      expect(hmppsAuthClient.getSystemClientToken).toHaveBeenCalledWith(username)
    })
  })
})
