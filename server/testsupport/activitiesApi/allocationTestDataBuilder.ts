import type { PrisonerAllocation, PrisonersAllocationsResponse } from 'activitiesApiClient'
import randomNumber from '../dataUtils'

type AValidPrisonerAllocationParams = {
  prisonNumber?: string
  activityId?: number
  activitySummary?: string
  status?: PrisonerAllocation['status']
}
export const aValidPrisonerAllocation = ({
  prisonNumber = 'A1234BC',
  activityId = 1,
  activitySummary = 'Activity Summary',
  status = 'ACTIVE',
}: AValidPrisonerAllocationParams = {}): PrisonerAllocation => ({
  id: randomNumber(1000, 9999),
  prisonerNumber: prisonNumber,
  bookingId: 10001,
  activitySummary,
  activityId,
  scheduleId: activityId,
  scheduleDescription: activitySummary,
  isUnemployment: false,
  startDate: '2024-03-22T11:37:47.843Z',
  status,
  exclusions: [],
})

// Convert a collection of prisoner allocations to a prisoners allocations response
export const aValidPrisonersAllocationsResponse = (
  prisonerAllocations: Array<AValidPrisonerAllocationParams> = [],
): PrisonersAllocationsResponse =>
  Array.from(
    prisonerAllocations.reduce<Set<string>>(
      (uniquePrisoners, allocation) => uniquePrisoners.add(allocation.prisonNumber),
      new Set(),
    ),
  ).map(prisonNumber => ({
    prisonerNumber: prisonNumber,
    allocations: prisonerAllocations.filter(p => p.prisonNumber === prisonNumber).map(aValidPrisonerAllocation),
  }))
