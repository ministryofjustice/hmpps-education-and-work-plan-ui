import { EducationAndWorkPlanClient, HmppsAuthClient, PrisonerSearchClient } from '../data'
import PrisonerListService from './prisonerListService'
import CiagInductionClient from '../data/ciagInductionClient'
import aValidPagedCollectionOfPrisoners from '../testsupport/pagedCollectionOfPrisonersTestDataBuilder'
import aValidPrisoner from '../testsupport/prisonerTestDataBuilder'
import aValidCiagInductionListResponse from '../testsupport/ciagInductionListResponseTestDataBuilder'
import { aCiagInductionWithJobInterests } from '../testsupport/ciagInductionTestDataBuilder'
import aValidActionPlanSummaryResponse from '../testsupport/actionPlanSummaryResponseTestDataBuilder'
import aValidActionPlanSummaryListResponse from '../testsupport/actionPlanSummaryListResponseTestDataBuilder'
import toPrisonerSummary from '../data/mappers/prisonerSummaryMapper'

describe('prisonerListService', () => {
  const hmppsAuthClient = {
    getSystemClientToken: jest.fn(),
  }

  const prisonerSearchClient = {
    getPrisonersByPrisonId: jest.fn(),
  }

  const educationAndWorkPlanClient = {
    getActionPlans: jest.fn(),
  }

  const ciagInductionClient = {
    getCiagInductionsForPrisonNumbers: jest.fn(),
  }

  const prisonerListService = new PrisonerListService(
    hmppsAuthClient as unknown as HmppsAuthClient,
    prisonerSearchClient as unknown as PrisonerSearchClient,
    educationAndWorkPlanClient as unknown as EducationAndWorkPlanClient,
    ciagInductionClient as unknown as CiagInductionClient,
  )

  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should get prisoner search summaries for a given prison id', async () => {
    // Given
    const prisonId = 'BXI'
    const page = 0
    const pageSize = 9999

    const username = 'a-dps-user'
    const systemToken = 'a-system-token'
    hmppsAuthClient.getSystemClientToken.mockResolvedValue(systemToken)

    const expectedPrisonNumbers: string[] = ['A1234BC', 'F4329JC', 'T4381KA', 'P4381IA']

    const fred = aValidPrisoner({
      prisonNumber: 'A1234BC',
      firstName: 'Fred',
    })
    const jim = aValidPrisoner({
      prisonNumber: 'F4329JC',
      firstName: 'Jim',
    })
    const bill = aValidPrisoner({
      prisonNumber: 'T4381KA',
      firstName: 'Bill',
    })
    const albert = aValidPrisoner({
      prisonNumber: 'P4381IA',
      firstName: 'Albert',
    })
    const pagedCollectionOfPrisoners = aValidPagedCollectionOfPrisoners({
      content: [fred, jim, bill, albert],
    })
    prisonerSearchClient.getPrisonersByPrisonId.mockResolvedValue(pagedCollectionOfPrisoners)

    const fredsCiagInduction = aCiagInductionWithJobInterests('A1234BC')
    const jimsCiagInduction = aCiagInductionWithJobInterests('F4329JC')
    const ciagInductionListResponse = aValidCiagInductionListResponse({
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

    const fredsPrisonerSearchSummary = { ...toPrisonerSummary(fred), hasCiagInduction: true, hasActionPlan: true }
    const jimsPrisonerSearchSummary = { ...toPrisonerSummary(jim), hasCiagInduction: true, hasActionPlan: false }
    const billsPrisonerSearchSummary = { ...toPrisonerSummary(bill), hasCiagInduction: false, hasActionPlan: true }
    const albertsPrisonerSearchSummary = { ...toPrisonerSummary(albert), hasCiagInduction: false, hasActionPlan: false }
    const expectedPrisonerSearchSummaries = [
      fredsPrisonerSearchSummary,
      jimsPrisonerSearchSummary,
      billsPrisonerSearchSummary,
      albertsPrisonerSearchSummary,
    ]

    // When
    const actual = await prisonerListService.getPrisonerSearchSummariesForPrisonId(prisonId, page, pageSize, username)

    // Then
    expect(actual).toEqual(expectedPrisonerSearchSummaries)
    expect(hmppsAuthClient.getSystemClientToken).toHaveBeenCalledWith(username)
    expect(prisonerSearchClient.getPrisonersByPrisonId).toHaveBeenCalledWith(prisonId, page, pageSize, systemToken)
    expect(ciagInductionClient.getCiagInductionsForPrisonNumbers).toHaveBeenCalledWith(
      expectedPrisonNumbers,
      systemToken,
    )
    expect(educationAndWorkPlanClient.getActionPlans).toHaveBeenCalledWith(expectedPrisonNumbers, systemToken)
  })
})
