import type { PrisonerSearch } from 'viewModels'
import EducationAndWorkPlanClient from '../data/educationAndWorkPlanClient'
import SearchSortField from '../enums/searchSortField'
import SearchSortDirection from '../enums/searchSortDirection'
import SearchPlanStatus from '../enums/searchPlanStatus'
import { toPrisonerSearch } from '../data/mappers/prisonerSearchMapper'

export default class SearchService {
  constructor(private readonly educationAndWorkPlanClient: EducationAndWorkPlanClient) {}

  async searchPrisonersInPrison(
    prisonId: string,
    username: string,
    page: number,
    pageSize: number,
    sortBy: SearchSortField,
    sortDirection: SearchSortDirection,
    prisonerNameOrNumber?: string,
    planStatus?: SearchPlanStatus,
  ): Promise<PrisonerSearch> {
    return toPrisonerSearch(
      await this.educationAndWorkPlanClient.searchByPrison(
        prisonId,
        username,
        prisonerNameOrNumber,
        planStatus,
        page,
        pageSize,
        sortBy,
        sortDirection,
      ),
      {
        prisonId,
        sortField: sortBy,
        sortDirection,
        searchTerm: prisonerNameOrNumber,
      },
    )
  }
}
