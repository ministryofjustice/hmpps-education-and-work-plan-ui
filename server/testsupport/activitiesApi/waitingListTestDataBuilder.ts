import type { WaitingListApplication, WaitingListSearchResponse } from 'activitiesApiClient'
import randomNumber from '../dataUtils'

type AValidWaitingListApplicationParams = {
  prisonNumber?: string
  activityId?: number
  allocationId?: number
  status?: WaitingListApplication['status']
}
const aValidWaitingListApplication = ({
  prisonNumber = 'A1234BC',
  activityId = 1,
  allocationId = undefined,
  status = 'APPROVED',
}: AValidWaitingListApplicationParams = {}): WaitingListSearchResponse => ({
  content: [
    {
      id: randomNumber(1000, 9999),
      activityId,
      scheduleId: activityId,
      allocationId,
      prisonCode: 'MDI',
      prisonerNumber: prisonNumber,
      bookingId: randomNumber(1000, 9999),
      status,
      requestedDate: '2023-06-23',
      requestedBy: 'TEST_USER',
      creationTime: '2024-02-01T00:00:00',
      createdBy: 'TEST_USER',
      earliestReleaseDate: {
        releaseDate: `${new Date().getFullYear()}-12-31`,
        isTariffDate: false,
        isIndeterminateSentence: false,
        isImmigrationDetainee: false,
        isConvictedUnsentenced: false,
        isRemand: false,
      },
    },
  ],
})

export default aValidWaitingListApplication
