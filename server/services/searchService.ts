import type { PrisonerSearch } from 'viewModels'
import EducationAndWorkPlanClient from '../data/educationAndWorkPlanClient'
import SearchPlanStatus from '../enums/searchPlanStatus'
import { toPrisonerSearch } from '../data/mappers/prisonerSearchMapper'
import SortBy from '../enums/sortBy'
import SortOrder from '../enums/sortDirection'
import toSearchSortDirection from '../data/mappers/searchSortDirectionMapper'
import toSearchSortField from '../data/mappers/searchSortFieldMapper'

export default class SearchService {
  constructor(private readonly educationAndWorkPlanClient: EducationAndWorkPlanClient) {}

  async searchPrisonersInPrison(
    prisonId: string,
    username: string,
    page: number,
    pageSize: number,
    sortBy: SortBy,
    sortOrder: SortOrder,
    prisonerNameOrNumber?: string,
    planStatus?: SearchPlanStatus,
  ): Promise<PrisonerSearch> {
    const searchSortField = toSearchSortField(sortBy)
    const searchSortDirection = toSearchSortDirection(sortOrder)
    return toPrisonerSearch(
      await this.educationAndWorkPlanClient.searchByPrison(
        prisonId,
        username,
        prisonerNameOrNumber,
        planStatus,
        page,
        pageSize,
        searchSortField,
        searchSortDirection,
      ),
      {
        prisonId,
        sortBy,
        sortOrder,
        searchTerm: prisonerNameOrNumber,
      },
    )
  }
}
