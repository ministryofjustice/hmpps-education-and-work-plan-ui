import type { ActionPlanReviews, CreatedActionPlanReview } from 'viewModels'
import type { ReviewExemptionDto, ReviewPlanDto } from 'dto'
import EducationAndWorkPlanClient from '../data/educationAndWorkPlanClient'
import { HmppsAuthClient } from '../data'
import logger from '../../logger'
import PrisonService from './prisonService'
import toActionPlanReviews from '../data/mappers/actionPlanReviewsMapper'
import toCreateActionPlanReviewRequest from '../data/mappers/createActionPlanReviewRequestMapper'
import toCreatedActionPlan from '../data/mappers/createdActionPlanReviewMapper'
import toUpdateReviewScheduleStatusRequest from '../data/mappers/updateReviewScheduleStatusRequestMapper'

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
      if (!actionPlanReviewsResponse) {
        logger.info(`No Review Schedule found for prisoner [${prisonNumber}] in Education And Work Plan API`)
        return {
          problemRetrievingData: false,
          completedReviews: [],
          latestReviewSchedule: undefined,
        }
      }

      const prisonNamesById = await this.prisonService.getAllPrisonNamesById(username)
      return toActionPlanReviews(actionPlanReviewsResponse, prisonNamesById)
    } catch (error) {
      logger.error(
        `Error retrieving Action Plan Reviews for prisoner [${prisonNumber}] from Education And Work Plan API `,
        error,
      )
      return {
        problemRetrievingData: true,
        completedReviews: undefined,
        latestReviewSchedule: undefined,
      }
    }
  }

  async createActionPlanReview(reviewPlanDto: ReviewPlanDto, username: string): Promise<CreatedActionPlanReview> {
    const systemToken = await this.hmppsAuthClient.getSystemClientToken(username)

    try {
      const createActionPlanReviewRequest = toCreateActionPlanReviewRequest(reviewPlanDto)
      const createActionPlanReviewResponse = await this.educationAndWorkPlanClient.createActionPlanReview(
        reviewPlanDto.prisonNumber,
        createActionPlanReviewRequest,
        systemToken,
      )
      const prisonNamesById = await this.prisonService.getAllPrisonNamesById(username)
      return toCreatedActionPlan(createActionPlanReviewResponse, prisonNamesById)
    } catch (error) {
      logger.error(
        `Error creating Action Plan Review for prisoner [${reviewPlanDto.prisonNumber}] in the Education And Work Plan API `,
        error,
      )
      throw error
    }
  }

  async updateActionPlanReviewScheduleStatus(reviewExemptionDto: ReviewExemptionDto, username: string): Promise<void> {
    const systemToken = await this.hmppsAuthClient.getSystemClientToken(username)

    try {
      const updateReviewScheduleStatusRequest = toUpdateReviewScheduleStatusRequest(reviewExemptionDto)
      await this.educationAndWorkPlanClient.updateActionPlanReviewScheduleStatus(
        reviewExemptionDto.prisonNumber,
        updateReviewScheduleStatusRequest,
        systemToken,
      )
    } catch (error) {
      logger.error(
        `Error updating Action Plan Review Schedule Status for prisoner [${reviewExemptionDto.prisonNumber}] in the Education And Work Plan API `,
        error,
      )
      throw error
    }
  }
}
