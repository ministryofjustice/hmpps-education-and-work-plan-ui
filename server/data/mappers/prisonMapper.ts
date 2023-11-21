import type { PrisonResponse } from 'prisonRegisterApiClient'
import type { Prison } from 'viewModels'

export default function toPrison(prisonResponse: PrisonResponse): Prison {
  return {
    prisonId: prisonResponse.prisonId,
    prisonName: prisonResponse.prisonName,
  }
}
