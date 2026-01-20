import type { PrisonerSearchSummary } from 'viewModels'
import { SuperAgentRequest } from 'superagent'
import { stubFor } from './wiremock'

const stubCiagInductionListFromPrisonerSearchSummaries = (
  prisonerSearchSummaries: Array<PrisonerSearchSummary>,
): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'POST',
      urlPattern: `/ciag/induction/list`,
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        ciagProfileList: prisonerSearchSummaries
          .filter(prisonerSearchSummary => prisonerSearchSummary.hasCiagInduction)
          .map(prisonerSearchSummary => {
            return {
              offenderId: prisonerSearchSummary.prisonNumber,
            }
          }),
      },
    },
  })

export default {
  stubCiagInductionListFromPrisonerSearchSummaries,
}
