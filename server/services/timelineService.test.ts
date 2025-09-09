import { parseISO, startOfDay } from 'date-fns'
import type { Timeline } from 'viewModels'
import PrisonService from './prisonService'
import TimelineService from './timelineService'
import EducationAndWorkPlanClient from '../data/educationAndWorkPlanClient'
import toTimeline from '../data/mappers/timelineMapper'
import aValidTimelineResponse from '../testsupport/timelineResponseTestDataBuilder'
import HmppsAuthClient from '../data/hmppsAuthClient'
import TimelineApiFilterOptions from '../data/timelineApiFilterOptions'
import TimelineFilterTypeValue from '../enums/timelineFilterTypeValue'
import aValidTimeline from '../testsupport/timelineTestDataBuilder'

jest.mock('../data/mappers/timelineMapper')
jest.mock('./prisonService')
jest.mock('../data/educationAndWorkPlanClient')
jest.mock('../data/hmppsAuthClient')

describe('timelineService', () => {
  const mockedTimelineMapper = toTimeline as jest.MockedFunction<typeof toTimeline>

  const educationAndWorkPlanClient = new EducationAndWorkPlanClient() as jest.Mocked<EducationAndWorkPlanClient>
  const prisonService = new PrisonService(null, null) as jest.Mocked<PrisonService>
  const hmppsAuthClient = new HmppsAuthClient(null) as jest.Mocked<HmppsAuthClient>
  const timelineService = new TimelineService(educationAndWorkPlanClient, prisonService, hmppsAuthClient)

  const prisonNumber = 'A1234BC'
  const username = 'a-dps-user'
  const systemToken = 'a-system-token'
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

      const filterOptions = {
        prisonNumber,
        username,
        filterOptions: {
          goals: false,
          inductions: false,
          prisonEvents: false,
          reviews: false,
          prisonId: undefined as string,
          eventsSince: undefined as Date,
        },
      }

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
            timestamp: parseISO('2023-09-01T10:46:38.565Z'),
            correlationId: '847aa5ad-2068-40e1-aec0-66b19007c494',
            contextualInfo: {},
            actionedByDisplayName: 'Ralph Gen',
          },
          {
            reference: 'cd98ea4c-b415-48d9-a600-9068cefe65e4x',
            sourceReference: '33bc1045-7368-47c4-a261-4d616b7b51b9',
            eventType: 'GOAL_CREATED',
            prisonName: 'MDI',
            timestamp: parseISO('2023-09-01T10:47:38.565Z'),
            correlationId: '246aa049-c5df-459d-8231-bdeab3936d0f',
            contextualInfo: {
              GOAL_TITLE: 'Learn French',
            },
            actionedByDisplayName: 'Ralph Gen',
          },
        ],
        filteredBy: [TimelineFilterTypeValue.ALL],
      }
      mockedTimelineMapper.mockReturnValue(timeline)
      prisonService.getAllPrisonNamesById.mockResolvedValueOnce(mockedPrisonNamesById)

      const expectedApiFilterOptions = new TimelineApiFilterOptions()

      // When
      const actual = await timelineService.getTimeline(filterOptions)

      // Then
      expect(mockedTimelineMapper).toHaveBeenCalledWith(timelineResponse, mockedPrisonNamesById, [
        TimelineFilterTypeValue.ALL,
      ])
      expect(prisonService.getAllPrisonNamesById).toHaveBeenCalledWith(username)
      expect(actual).toEqual(timeline)
      expect(educationAndWorkPlanClient.getTimeline).toHaveBeenCalledWith(
        prisonNumber,
        expectedApiFilterOptions,
        systemToken,
      )
      expect(hmppsAuthClient.getSystemClientToken).toHaveBeenCalledWith(username)
    })

    it('should get timeline given prison name lookups fail', async () => {
      // Given
      const timelineResponse = aValidTimelineResponse()
      educationAndWorkPlanClient.getTimeline.mockResolvedValue(timelineResponse)

      const filterOptions = {
        prisonNumber,
        username,
        filterOptions: {
          goals: false,
          inductions: false,
          prisonEvents: false,
          reviews: false,
          prisonId: undefined as string,
          eventsSince: undefined as Date,
        },
      }

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
            timestamp: parseISO('2023-09-01T10:46:38.565Z'),
            correlationId: '847aa5ad-2068-40e1-aec0-66b19007c494',
            contextualInfo: {},
            actionedByDisplayName: 'Ralph Gen',
          },
          {
            reference: 'cd98ea4c-b415-48d9-a600-9068cefe65e4x',
            sourceReference: '33bc1045-7368-47c4-a261-4d616b7b51b9',
            eventType: 'GOAL_CREATED',
            prisonName: 'MDI',
            timestamp: parseISO('2023-09-01T10:47:38.565Z'),
            correlationId: '246aa049-c5df-459d-8231-bdeab3936d0f',
            contextualInfo: {
              GOAL_TITLE: 'Learn French',
            },
            actionedByDisplayName: 'Ralph Gen',
          },
        ],
        filteredBy: [TimelineFilterTypeValue.ALL],
      }
      mockedTimelineMapper.mockReturnValue(timeline)

      prisonService.getAllPrisonNamesById.mockResolvedValue(new Map())

      const expectedApiFilterOptions = new TimelineApiFilterOptions()

      // When
      const actual = await timelineService.getTimeline(filterOptions)

      // Then
      expect(mockedTimelineMapper).toHaveBeenCalledWith(timelineResponse, new Map(), [TimelineFilterTypeValue.ALL])
      expect(prisonService.getAllPrisonNamesById).toHaveBeenCalledWith(username)
      expect(actual).toEqual(timeline)
      expect(educationAndWorkPlanClient.getTimeline).toHaveBeenCalledWith(
        prisonNumber,
        expectedApiFilterOptions,
        systemToken,
      )
      expect(hmppsAuthClient.getSystemClientToken).toHaveBeenCalledWith(username)
    })

    it('should get timeline given prison name lookups for several different prisons', async () => {
      // Given
      const timelineResponse = aValidTimelineResponse()
      educationAndWorkPlanClient.getTimeline.mockResolvedValue(timelineResponse)

      const filterOptions = {
        prisonNumber,
        username,
        filterOptions: {
          goals: false,
          inductions: false,
          prisonEvents: false,
          reviews: false,
          prisonId: undefined as string,
          eventsSince: undefined as Date,
        },
      }

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
            timestamp: parseISO('2023-09-01T10:46:38.565Z'),
            correlationId: '847aa5ad-2068-40e1-aec0-66b19007c494',
            contextualInfo: {},
            actionedByDisplayName: 'Ralph Gen',
          },
          {
            reference: 'cd98ea4c-b415-48d9-a600-9068cefe65e4x',
            sourceReference: '33bc1045-7368-47c4-a261-4d616b7b51b9',
            eventType: 'GOAL_CREATED',
            prisonName: 'MDI',
            timestamp: parseISO('2023-09-01T10:47:38.565Z'),
            correlationId: '246aa049-c5df-459d-8231-bdeab3936d0f',
            contextualInfo: {
              GOAL_TITLE: 'Learn French',
            },
            actionedByDisplayName: 'Ralph Gen',
          },
        ],
        filteredBy: [TimelineFilterTypeValue.ALL],
      }
      mockedTimelineMapper.mockReturnValue(timeline)
      prisonService.getAllPrisonNamesById.mockResolvedValueOnce(mockedPrisonNamesById)

      const expectedApiFilterOptions = new TimelineApiFilterOptions()

      // When
      const actual = await timelineService.getTimeline(filterOptions)

      // Then
      expect(mockedTimelineMapper).toHaveBeenCalledWith(timelineResponse, mockedPrisonNamesById, [
        TimelineFilterTypeValue.ALL,
      ])
      expect(prisonService.getAllPrisonNamesById).toHaveBeenCalledWith(username)
      expect(actual).toEqual(timeline)
      expect(educationAndWorkPlanClient.getTimeline).toHaveBeenCalledWith(
        prisonNumber,
        expectedApiFilterOptions,
        systemToken,
      )
      expect(hmppsAuthClient.getSystemClientToken).toHaveBeenCalledWith(username)
    })

    it('should get timeline given all filter options', async () => {
      // Given
      const timelineResponse = aValidTimelineResponse()
      educationAndWorkPlanClient.getTimeline.mockResolvedValue(timelineResponse)

      const filterOptions = {
        prisonNumber,
        username,
        filterOptions: {
          goals: true,
          inductions: true,
          prisonEvents: true,
          reviews: true,
          prisonId: 'BXI',
          eventsSince: startOfDay(parseISO('2025-03-20')),
        },
      }

      const timeline = aValidTimeline({
        filteredBy: [TimelineFilterTypeValue.ALL],
      })
      mockedTimelineMapper.mockReturnValue(timeline)

      prisonService.getAllPrisonNamesById.mockResolvedValue(new Map())

      const expectedApiFilterOptions = new TimelineApiFilterOptions({
        inductions: true,
        goals: true,
        reviews: true,
        prisonEvents: true,
        eventsSince: startOfDay(parseISO('2025-03-20')),
        prisonId: 'BXI',
      })

      // When
      const actual = await timelineService.getTimeline(filterOptions)

      // Then
      expect(actual).toEqual(timeline)
      expect(educationAndWorkPlanClient.getTimeline).toHaveBeenCalledWith(
        prisonNumber,
        expectedApiFilterOptions,
        systemToken,
      )
    })

    it('should get timeline given no filter options', async () => {
      // Given
      const timelineResponse = aValidTimelineResponse()
      educationAndWorkPlanClient.getTimeline.mockResolvedValue(timelineResponse)

      const filterOptions = {
        prisonNumber,
        username,
        filterOptions: {
          goals: false,
          inductions: false,
          prisonEvents: false,
          reviews: false,
          prisonId: undefined as string,
          eventsSince: undefined as Date,
        },
      }

      const timeline = aValidTimeline({
        filteredBy: [TimelineFilterTypeValue.ALL],
      })
      mockedTimelineMapper.mockReturnValue(timeline)

      prisonService.getAllPrisonNamesById.mockResolvedValue(new Map())

      const expectedApiFilterOptions = new TimelineApiFilterOptions({
        inductions: false,
        goals: false,
        reviews: false,
        prisonEvents: false,
        eventsSince: undefined,
        prisonId: undefined,
      })

      // When
      const actual = await timelineService.getTimeline(filterOptions)

      // Then
      expect(actual).toEqual(timeline)
      expect(educationAndWorkPlanClient.getTimeline).toHaveBeenCalledWith(
        prisonNumber,
        expectedApiFilterOptions,
        systemToken,
      )
    })

    it('should get timeline given some filter options', async () => {
      // Given
      const timelineResponse = aValidTimelineResponse()
      educationAndWorkPlanClient.getTimeline.mockResolvedValue(timelineResponse)

      const filterOptions = {
        prisonNumber,
        username,
        filterOptions: {
          goals: true,
          inductions: false,
          prisonEvents: true,
          reviews: false,
          prisonId: 'BXI',
          eventsSince: undefined as Date,
        },
      }

      const timeline = aValidTimeline({
        filteredBy: [
          TimelineFilterTypeValue.GOALS,
          TimelineFilterTypeValue.CURRENT_PRISON,
          TimelineFilterTypeValue.PRISON_MOVEMENTS,
        ],
      })
      mockedTimelineMapper.mockReturnValue(timeline)

      prisonService.getAllPrisonNamesById.mockResolvedValue(new Map())

      const expectedApiFilterOptions = new TimelineApiFilterOptions({
        inductions: false,
        goals: true,
        reviews: false,
        prisonEvents: true,
        eventsSince: undefined,
        prisonId: 'BXI',
      })

      // When
      const actual = await timelineService.getTimeline(filterOptions)

      // Then
      expect(actual).toEqual(timeline)
      expect(educationAndWorkPlanClient.getTimeline).toHaveBeenCalledWith(
        prisonNumber,
        expectedApiFilterOptions,
        systemToken,
      )
    })

    it('should not get the timeline given Education and Work Plan API returns null indicating timeline Not Found', async () => {
      // Given
      educationAndWorkPlanClient.getTimeline.mockResolvedValue(null)

      const filterOptions = {
        prisonNumber,
        username,
        filterOptions: {
          goals: false,
          inductions: false,
          prisonEvents: false,
          reviews: false,
          prisonId: undefined as string,
          eventsSince: undefined as Date,
        },
      }

      const expectedApiFilterOptions = new TimelineApiFilterOptions()

      const expected = {
        problemRetrievingData: false,
        events: [] as Array<TimelineFilterTypeValue>,
        prisonNumber,
        filteredBy: [TimelineFilterTypeValue.ALL],
      }

      // When
      const actual = await timelineService.getTimeline(filterOptions)

      // Then
      expect(actual).toEqual(expected)
      expect(hmppsAuthClient.getSystemClientToken).toHaveBeenCalledWith(username)
      expect(educationAndWorkPlanClient.getTimeline).toHaveBeenCalledWith(
        prisonNumber,
        expectedApiFilterOptions,
        systemToken,
      )
      expect(mockedTimelineMapper).not.toHaveBeenCalled()
    })

    it('should not get Timeline given Education and Work Plan API returns an unexpected error', async () => {
      // Given
      const eductionAndWorkPlanApiError = {
        status: 500,
        data: {
          status: 500,
          userMessage: 'An unexpected error occurred',
          developerMessage: 'An unexpected error occurred',
        },
      }
      educationAndWorkPlanClient.getTimeline.mockRejectedValue(eductionAndWorkPlanApiError)

      const expected = {
        problemRetrievingData: true,
      }

      const filterOptions = {
        prisonNumber,
        username,
        filterOptions: {
          goals: false,
          inductions: false,
          prisonEvents: false,
          reviews: false,
          prisonId: undefined as string,
          eventsSince: undefined as Date,
        },
      }

      const expectedApiFilterOptions = new TimelineApiFilterOptions()

      // When
      const actual = await timelineService.getTimeline(filterOptions).catch(error => {
        return error
      })

      // Then
      expect(actual).toEqual(expected)
      expect(hmppsAuthClient.getSystemClientToken).toHaveBeenCalledWith(username)
      expect(educationAndWorkPlanClient.getTimeline).toHaveBeenCalledWith(
        prisonNumber,
        expectedApiFilterOptions,
        systemToken,
      )
      expect(mockedTimelineMapper).not.toHaveBeenCalled()
    })
  })
})
