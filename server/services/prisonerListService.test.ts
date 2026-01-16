import EducationAndWorkPlanClient from '../data/educationAndWorkPlanClient'
import PrisonerService from './prisonerService'
import PrisonerListService from './prisonerListService'
import CiagInductionClient from '../data/ciagInductionClient'
import aValidCiagInductionSummaryListResponse from '../testsupport/ciagInductionSummaryListResponseTestDataBuilder'
import aValidActionPlanSummaryResponse from '../testsupport/actionPlanSummaryResponseTestDataBuilder'
import aValidActionPlanSummaryListResponse from '../testsupport/actionPlanSummaryListResponseTestDataBuilder'
import aValidCiagInductionSummaryResponse from '../testsupport/ciagInductionSummaryReponseTestDataBuilder'
import aValidPrisonerSummary from '../testsupport/prisonerSummaryTestDataBuilder'

jest.mock('../data/educationAndWorkPlanClient')
jest.mock('./prisonerService')
jest.mock('../data/ciagInductionClient')

describe('prisonerListService', () => {
  const prisonerService = new PrisonerService(null, null) as jest.Mocked<PrisonerService>
  const educationAndWorkPlanClient = new EducationAndWorkPlanClient(null) as jest.Mocked<EducationAndWorkPlanClient>
  const ciagInductionClient = new CiagInductionClient(null) as jest.Mocked<CiagInductionClient>

  const prisonerListService = new PrisonerListService(prisonerService, educationAndWorkPlanClient, ciagInductionClient)

  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should get prisoner search summaries for a given prison id', async () => {
    // Given
    const prisonId = 'BXI'
    const username = 'a-dps-user'

    const expectedPrisonNumbers: string[] = ['A1234BC', 'F4329JC', 'T4381KA', 'P4381IA']

    const fred = aValidPrisonerSummary({
      prisonNumber: 'A1234BC',
      firstName: 'Fred',
    })
    const jim = aValidPrisonerSummary({
      prisonNumber: 'F4329JC',
      firstName: 'Jim',
    })
    const bill = aValidPrisonerSummary({
      prisonNumber: 'T4381KA',
      firstName: 'Bill',
    })
    const albert = aValidPrisonerSummary({
      prisonNumber: 'P4381IA',
      firstName: 'Albert',
    })
    const prisonerSummaries = {
      problemRetrievingData: false,
      prisoners: [fred, jim, bill, albert],
    }
    prisonerService.getPrisonersByPrisonId.mockResolvedValue(prisonerSummaries)

    const fredsCiagInduction = aValidCiagInductionSummaryResponse({ prisonNumber: 'A1234BC' })
    const jimsCiagInduction = aValidCiagInductionSummaryResponse({ prisonNumber: 'F4329JC' })
    const ciagInductionListResponse = aValidCiagInductionSummaryListResponse({
      ciagProfileList: [fredsCiagInduction, jimsCiagInduction],
    })
    ciagInductionClient.getCiagInductionsForPrisonNumbers.mockResolvedValue(ciagInductionListResponse)

    const fredsActionPlanSummary = aValidActionPlanSummaryResponse({
      prisonNumber: 'A1234BC',
    })
    const billsActionPlanSummary = aValidActionPlanSummaryResponse({
      prisonNumber: 'T4381KA',
    })
    const actionPlanSummaries = aValidActionPlanSummaryListResponse({
      actionPlanSummaries: [fredsActionPlanSummary, billsActionPlanSummary],
    })
    educationAndWorkPlanClient.getActionPlans.mockResolvedValue(actionPlanSummaries)

    const fredsPrisonerSearchSummary = { ...fred, hasCiagInduction: true, hasActionPlan: true }
    const jimsPrisonerSearchSummary = { ...jim, hasCiagInduction: true, hasActionPlan: false }
    const billsPrisonerSearchSummary = { ...bill, hasCiagInduction: false, hasActionPlan: true }
    const albertsPrisonerSearchSummary = { ...albert, hasCiagInduction: false, hasActionPlan: false }
    const expectedPrisonerSearchSummaries = [
      fredsPrisonerSearchSummary,
      jimsPrisonerSearchSummary,
      billsPrisonerSearchSummary,
      albertsPrisonerSearchSummary,
    ]

    // When
    const actual = await prisonerListService.getPrisonerSearchSummariesForPrisonId(prisonId, username)

    // Then
    expect(actual).toEqual(expectedPrisonerSearchSummaries)
    expect(prisonerService.getPrisonersByPrisonId).toHaveBeenCalledWith(prisonId, username)
    expect(ciagInductionClient.getCiagInductionsForPrisonNumbers).toHaveBeenCalledWith(expectedPrisonNumbers, username)
    expect(educationAndWorkPlanClient.getActionPlans).toHaveBeenCalledWith(expectedPrisonNumbers, username)
  })
})
