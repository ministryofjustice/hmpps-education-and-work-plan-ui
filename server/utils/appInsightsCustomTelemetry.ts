import { telemetry } from '@ministryofjustice/hmpps-azure-telemetry'
import type { RequestHandler } from 'express'
import { PrisonUser } from '../interfaces/hmppsUser'

export default function addUsernameAndCaseloadToTelemetry(): RequestHandler {
  return (req, res, next) => {
    const { username, activeCaseLoadId } = (res?.locals?.user || {}) as PrisonUser

    telemetry.setSpanAttributes({
      ...(username && { username }),
      ...(activeCaseLoadId && { activeCaseLoadId }),
    })
    return next()
  }
}
