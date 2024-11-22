import type { ActionPlanReviews, CreatedActionPlan } from 'viewModels'
import type { ReviewPlanDto } from 'dto'
import EducationAndWorkPlanClient from '../data/educationAndWorkPlanClient'
import { HmppsAuthClient } from '../data'
import logger from '../../logger'
import PrisonService from './prisonService'
import toActionPlanReviews from '../data/mappers/actionPlanReviewsMapper'
import toCreateActionPlanReviewRequest from '../data/mappers/createActionPlanReviewRequestMapper'
import toCreatedActionPlan from '../data/mappers/createdActionPlanMapper'

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

  async createActionPlanReview(reviewPlanDto: ReviewPlanDto, username: string): Promise<CreatedActionPlan> {
    const systemToken = await this.hmppsAuthClient.getSystemClientToken(username)

    try {
      const createActionPlanReviewRequest = toCreateActionPlanReviewRequest(reviewPlanDto)
      const createActionPlanReviewResponse = await this.educationAndWorkPlanClient.createActionPlanReview(
        reviewPlanDto.prisonNumber,
        createActionPlanReviewRequest,
        systemToken,
      )
      const prisonNamesById = await this.getAllPrisonNamesByIdSafely(systemToken)
      return toCreatedActionPlan(createActionPlanReviewResponse, prisonNamesById)
    } catch (error) {
      logger.error(
        `Error creating Action Plan Review for prisoner [${reviewPlanDto.prisonNumber}] in the Education And Work Plan API `,
        error,
      )
      throw error
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
