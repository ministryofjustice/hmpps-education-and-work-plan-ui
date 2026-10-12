import { telemetry } from '@ministryofjustice/hmpps-azure-telemetry'
import type { RequestHandler } from 'express'
import { PrisonUser } from '../interfaces/hmppsUser'

export default function addCaseloadToTelemetry(): RequestHandler {
  return (req, res, next) => {
    const { activeCaseLoadId } = (res?.locals?.user || {}) as PrisonUser

    telemetry.setSpanAttributes({
      ...(activeCaseLoadId && { activeCaseLoadId }),
    })
    return next()
  }
}
