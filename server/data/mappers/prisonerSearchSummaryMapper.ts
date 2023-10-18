import type { PrisonerSearchSummary } from 'viewModels'
import type { Prisoner } from 'prisonRegisterApiClient'
import toPrisonerSummary from './prisonerSummaryMapper'

export default function toPrisonerSearchSummary(
  prisoner: Prisoner,
  hasCiagInduction: boolean,
  hasActionPlan: boolean,
): PrisonerSearchSummary {
  return {
    ...toPrisonerSummary(prisoner),
    hasCiagInduction,
    hasActionPlan,
  }
}
