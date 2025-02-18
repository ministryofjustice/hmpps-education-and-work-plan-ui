import type { SessionResponse } from 'educationAndWorkPlanApiClient'
import { randomUUID } from 'crypto'
import { addDays, format, startOfToday, subDays } from 'date-fns'
import SessionStatusValue from '../../server/enums/sessionStatusValue'
import randomNumber from '../../server/testsupport/dataUtils'

const sessionResponseMockDataGenerator = (options: {
  prisonNumbers: Array<string>
  status: SessionStatusValue
}): Array<SessionResponse> =>
  options.prisonNumbers.map((prisonNumber, idx) => {
    const deadlineDate =
      options.status === SessionStatusValue.DUE
        ? addDays(startOfToday(), randomNumber(1, 20))
        : subDays(startOfToday(), randomNumber(1, 20))
    return {
      prisonNumber,
      sessionType: idx % 2 ? 'INDUCTION' : 'REVIEW',
      deadlineDate: format(deadlineDate, 'yyyy-MM-dd'),
      reference: randomUUID(),
      exemptionReason:
        options.status === SessionStatusValue.ON_HOLD ? 'EXEMPT_PRISONER_OTHER_HEALTH_ISSUES' : undefined,
      exemptionDate:
        options.status === SessionStatusValue.ON_HOLD
          ? format(subDays(startOfToday(), randomNumber(1, 20)), 'yyyy-MM-dd')
          : undefined,
    }
  })

export default { generatePrisonerSessionResponses: sessionResponseMockDataGenerator }
