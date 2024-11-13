import type { PrisonerSearchSummary } from 'viewModels'
import type { Prisoner } from 'prisonerSearchApiClient'
import { HmppsAuthClient, PrisonerSearchClient } from '../data'
import EducationAndWorkPlanClient from '../data/educationAndWorkPlanClient'
import CiagInductionClient from '../data/ciagInductionClient'
import toPrisonerSearchSummary from '../data/mappers/prisonerSearchSummaryMapper'

export default class PrisonerListService {
  constructor(
    private readonly hmppsAuthClient: HmppsAuthClient,
    private readonly prisonerSearchClient: PrisonerSearchClient,
    private readonly educationAndWorkPlanClient: EducationAndWorkPlanClient,
    private readonly ciagInductionClient: CiagInductionClient,
  ) {}

  async getPrisonerSearchSummariesForPrisonId(
    prisonId: string,
    page: number,
    pageSize: number,
    username: string,
  ): Promise<PrisonerSearchSummary[]> {
    const systemToken = await this.hmppsAuthClient.getSystemClientToken(username)

    const prisoners: Prisoner[] = await this.prisonerSearchClient
      .getPrisonersByPrisonId(prisonId, page, pageSize, systemToken)
      .then(pagedCollectionOfPrisoners => pagedCollectionOfPrisoners.content)

    const prisonNumbers: string[] = prisoners.map(prisoner => prisoner.prisonerNumber)

    const prisonersWithCiagInduction: string[] = await this.ciagInductionClient
      .getCiagInductionsForPrisonNumbers(prisonNumbers, systemToken)
      .then(ciagInductionListResponse =>
        ciagInductionListResponse.ciagProfileList.map(
          (ciagInduction: { offenderId: string }) => ciagInduction.offenderId,
        ),
      )

    const prisonersWithActionPlan: string[] = await this.educationAndWorkPlanClient
      .getActionPlans(prisonNumbers, systemToken)
      .then(actionPlanSummaryListResponse =>
        actionPlanSummaryListResponse.actionPlanSummaries.map(
          (actionPlanSummary: { prisonNumber: string }) => actionPlanSummary.prisonNumber,
        ),
      )

    return prisoners.map(prisoner => {
      const prisonNumber: string = prisoner.prisonerNumber
      const prisonerHasCiagInduction = prisonersWithCiagInduction.includes(prisonNumber)
      const prisonerHasActionPlan = prisonersWithActionPlan.includes(prisonNumber)
      return toPrisonerSearchSummary(prisoner, prisonerHasCiagInduction, prisonerHasActionPlan)
    })
  }
}
