import { HmppsAuthClient, PrisonerSearchClient } from '../data'
import EducationAndWorkPlanClient from '../data/educationAndWorkPlanClient'
import CiagInductionClient from '../data/ciagInductionClient'

export default class PrisonerListService {
  constructor(
    private readonly hmppsAuthClient: HmppsAuthClient,
    private readonly prisonerSearchClient: PrisonerSearchClient,
    private readonly educationAndWorkPlanClient: EducationAndWorkPlanClient,
    private readonly ciagInductionClient: CiagInductionClient,
  ) {}
}
