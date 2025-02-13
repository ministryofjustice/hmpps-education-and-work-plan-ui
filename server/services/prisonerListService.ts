import type { PrisonerSearchSummary } from 'viewModels'
import { HmppsAuthClient } from '../data'
import EducationAndWorkPlanClient from '../data/educationAndWorkPlanClient'
import CiagInductionClient from '../data/ciagInductionClient'
import PrisonerSearchService from './prisonerSearchService'

export default class PrisonerListService {
  constructor(
    private readonly hmppsAuthClient: HmppsAuthClient,
    private readonly prisonerSearchService: PrisonerSearchService,
    private readonly educationAndWorkPlanClient: EducationAndWorkPlanClient,
    private readonly ciagInductionClient: CiagInductionClient,
  ) {}

  async getPrisonerSearchSummariesForPrisonId(prisonId: string, username: string): Promise<PrisonerSearchSummary[]> {
    const systemToken = await this.hmppsAuthClient.getSystemClientToken(username)

    const prisonerSummaries = (await this.prisonerSearchService.getPrisonersByPrisonId(prisonId, username)).prisoners

    const prisonNumbers: string[] = prisonerSummaries.map(prisoner => prisoner.prisonNumber)

    const prisonersWithCiagInduction: string[] = (
      await this.ciagInductionClient.getCiagInductionsForPrisonNumbers(prisonNumbers, systemToken)
    ).ciagProfileList.map((ciagInduction: { offenderId: string }) => ciagInduction.offenderId)

    const prisonersWithActionPlan: string[] = (
      await this.educationAndWorkPlanClient.getActionPlans(prisonNumbers, systemToken)
    ).actionPlanSummaries.map((actionPlanSummary: { prisonNumber: string }) => actionPlanSummary.prisonNumber)

    return prisonerSummaries.map(prisoner => ({
      ...prisoner,
      hasCiagInduction: prisonersWithCiagInduction.includes(prisoner.prisonNumber),
      hasActionPlan: prisonersWithActionPlan.includes(prisoner.prisonNumber),
    }))
  }
}
