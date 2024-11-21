import type { ActionPlanReviews } from 'viewModels'
import EducationAndWorkPlanClient from '../data/educationAndWorkPlanClient'
import { HmppsAuthClient } from '../data'
import logger from '../../logger'
import PrisonService from './prisonService'
import toActionPlanReviews from '../data/mappers/actionPlanReviewsMapper'

export default class ReviewService {
  constructor(
    private readonly educationAndWorkPlanClient: EducationAndWorkPlanClient,
    private readonly prisonService: PrisonService,
    private readonly hmppsAuthClient: HmppsAuthClient,
  ) {}

  async getActionPlanReviews(prisonNumber: string, username: string): Promise<ActionPlanReviews> {
    const systemToken = await this.hmppsAuthClient.getSystemClientToken(username)
    try {
      const actionPlanReviewsResponse = await this.educationAndWorkPlanClient.getActionPlanReviews(
        prisonNumber,
        systemToken,
      )
      const prisonNamesById = await this.getAllPrisonNamesByIdSafely(systemToken)
      return toActionPlanReviews(actionPlanReviewsResponse, prisonNamesById)
    } catch (error) {
      logger.error(
        `Error retrieving Action Plan Reviews for prisoner [${prisonNumber}] from Education And Work Plan API `,
        error,
      )
      return { problemRetrievingData: true } as ActionPlanReviews
    }
  }

  private async getAllPrisonNamesByIdSafely(token: string): Promise<Map<string, string>> {
    try {
      return await this.prisonService.getAllPrisonNamesById(token)
    } catch (error) {
      logger.error(`Error retrieving prison names, defaulting to just IDs: ${error}`)
      return new Map()
    }
  }
}
