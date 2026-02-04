import type { CreateEmployabilitySkillDto, EmployabilitySkillsList } from 'dto'
import EducationAndWorkPlanClient from '../data/educationAndWorkPlanClient'
import logger from '../../logger'
import { toEmployabilitySkillsList } from '../data/mappers/employabilitySkillResponseDtoMapper'
import toCreateEmployabilitySkillsRequest from '../data/mappers/createEmployabilitySkillsRequestMapper'

export default class EmployabilitySkillsService {
  constructor(private readonly educationAndWorkPlanClient: EducationAndWorkPlanClient) {}

  async getEmployabilitySkills(username: string, prisonNumber: string): Promise<EmployabilitySkillsList> {
    try {
      const employabilitySkillsResponse = await this.educationAndWorkPlanClient.getEmployabilitySkills(
        prisonNumber,
        username,
      )
      return toEmployabilitySkillsList(employabilitySkillsResponse, prisonNumber)
    } catch (e) {
      logger.error(`Error getting Employability Skills for [${prisonNumber}]`, e)
      throw e
    }
  }

  async createEmployabilitySkills(
    prisonNumber: string,
    employabilitySkillDtos: Array<CreateEmployabilitySkillDto>,
    username: string,
  ): Promise<void> {
    try {
      const createEmployabilitySkillRequest = toCreateEmployabilitySkillsRequest(employabilitySkillDtos)
      return await this.educationAndWorkPlanClient.createEmployabilitySkills(
        prisonNumber,
        createEmployabilitySkillRequest,
        username,
      )
    } catch (error) {
      logger.error(
        `Error creating Employability Skills for prisoner [${prisonNumber}] in the Education And Work Plan API`,
        error,
      )
      throw error
    }
  }
}
