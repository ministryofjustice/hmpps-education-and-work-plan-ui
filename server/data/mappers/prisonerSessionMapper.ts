import type { PrisonerSession, Sessions } from 'viewModels'
import type { SessionResponse, SessionResponses } from 'educationAndWorkPlanApiClient'
import { startOfDay } from 'date-fns'

const toPrisonerSessions = (sessionResponses: SessionResponses): Sessions => ({
  sessions: sessionResponses.sessions.map((sessionResponse: SessionResponse) => toPrisonerSession(sessionResponse)),
  problemRetrievingData: false,
})

const toPrisonerSession = (sessionResponse: SessionResponse): PrisonerSession => ({
  prisonNumber: sessionResponse.prisonNumber,
  reference: sessionResponse.reference,
  sessionType: sessionResponse.sessionType,
  deadlineDate: startOfDay(sessionResponse.deadlineDate),
  exemption:
    sessionResponse.exemptionReason && sessionResponse.deadlineDate
      ? {
          exemptionReason: sessionResponse.exemptionReason,
          exemptionDate: startOfDay(sessionResponse.exemptionDate),
        }
      : undefined,
  releaseDate: null,
  firstName: null,
  lastName: null,
  location: null,
})

export default toPrisonerSessions
