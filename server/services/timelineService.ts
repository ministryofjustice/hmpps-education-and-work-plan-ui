import type { Timeline } from 'viewModels'
import EducationAndWorkPlanClient from '../data/educationAndWorkPlanClient'
import toTimeline from '../data/mappers/timelineMapper'
import logger from '../../logger'
import PrisonService from './prisonService'

const PLP_TIMELINE_EVENTS = [
  'ACTION_PLAN_CREATED',
  'INDUCTION_UPDATED',
  'GOAL_UPDATED',
  'GOAL_CREATED',
  'GOAL_ARCHIVED',
  'GOAL_UNARCHIVED',
]
const PRISON_TIMELINE_EVENTS = ['PRISON_ADMISSION', 'PRISON_RELEASE', 'PRISON_TRANSFER']
const SUPPORTED_TIMELINE_EVENTS = [...PLP_TIMELINE_EVENTS, ...PRISON_TIMELINE_EVENTS]

export default class TimelineService {
  constructor(
    private readonly educationAndWorkPlanClient: EducationAndWorkPlanClient,
    private readonly prisonService: PrisonService,
  ) {}

  async getTimeline(prisonNumber: string, token: string, username: string): Promise<Timeline> {
    try {
      const timelineResponse = await this.educationAndWorkPlanClient.getTimeline(
        prisonNumber,
        token,
        SUPPORTED_TIMELINE_EVENTS,
      )
      const prisonNamesById = await this.prisonService.getAllPrisonNamesById(username)
      return toTimeline(timelineResponse, prisonNamesById)
    } catch (error) {
      if (error.status === 404) {
        logger.info(`No Timeline for prisoner [${prisonNumber}]: ${error}`)
        return undefined
      }
      logger.error(`Error retrieving Timeline for Prisoner [${prisonNumber}]: ${error}`)
      return { problemRetrievingData: true } as Timeline
    }
  }
}
