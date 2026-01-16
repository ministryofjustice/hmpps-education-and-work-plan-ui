import type { PrisonerSearchSummary } from 'viewModels'
import EducationAndWorkPlanClient from '../data/educationAndWorkPlanClient'
import CiagInductionClient from '../data/ciagInductionClient'
import PrisonerService from './prisonerService'
import SearchPlanStatus from '../enums/searchPlanStatus'

export default class PrisonerListService {
  constructor(
    private readonly prisonerService: PrisonerService,
    private readonly educationAndWorkPlanClient: EducationAndWorkPlanClient,
    private readonly ciagInductionClient: CiagInductionClient,
  ) {}

  async getPrisonerSearchSummariesForPrisonId(prisonId: string, username: string): Promise<PrisonerSearchSummary[]> {
    const prisonerSummaries = (await this.prisonerService.getPrisonersByPrisonId(prisonId, username)).prisoners

    const prisonNumbers: string[] = prisonerSummaries.map(prisoner => prisoner.prisonNumber)

    const prisonersWithCiagInduction: string[] = (
      await this.ciagInductionClient.getCiagInductionsForPrisonNumbers(prisonNumbers, username)
    ).ciagProfileList.map((ciagInduction: { offenderId: string }) => ciagInduction.offenderId)

    const prisonersWithActionPlan: string[] = (
      await this.educationAndWorkPlanClient.getActionPlans(prisonNumbers, username)
    ).actionPlanSummaries.map((actionPlanSummary: { prisonNumber: string }) => actionPlanSummary.prisonNumber)

    return prisonerSummaries.map(prisoner => ({
      ...prisoner,
      hasCiagInduction: prisonersWithCiagInduction.includes(prisoner.prisonNumber),
      hasActionPlan: prisonersWithActionPlan.includes(prisoner.prisonNumber),
      planStatus: undefined as SearchPlanStatus,
    }))
  }
}
