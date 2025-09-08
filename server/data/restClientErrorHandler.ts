import { SanitisedError } from '@ministryofjustice/hmpps-rest-client'
import logger from '../../logger'

const restClientErrorHandler = ({ ignore404 = false }: { ignore404?: boolean }) => {
  return <Response, ErrorData>(path: string, method: string, error: SanitisedError<ErrorData>): Response => {
    if (ignore404 && error.responseStatus === 404) {
      logger.info(`Returned null for 404 not found when calling: ${path}`)
      return null
    }
    logger.warn({ ...error }, `Error calling path: '${path}', verb: '${method}'`)
    throw error
  }
}

export default restClientErrorHandler
