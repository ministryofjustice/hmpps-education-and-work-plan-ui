import superagent, { Response, SuperAgentRequest } from 'superagent'
import logger from '../../../logger'
import WiremockMatchedRequest from './wiremockMatchedRequest'
import WiremockRequestMatcher from './wiremockRequestMatcher'
import { RequestPatternBuilder } from './requestPatternBuilder'

const wiremockAdminUrl = 'http://localhost:9091/__admin'

/**
 * Returns matching wiremock requests.
 *
 * @deprecated Use one of [getMatchingWiremockRequest], [getMatchingWiremockRequests], [getTypedWiremockRequestBody] or
 * [getTypedWiremockRequestBodies] instead.
 */
const getMatchingRequests = body => superagent.post(`${wiremockAdminUrl}/requests/find`).send(body)

/**
 * Returns the Wiremock [WiremockMatchedRequest] from the Wiremock journal that matches the specified [WiremockRequestMatcher]
 * If more than 1 requests match, the last request from the journal is returned.
 * If there are no matches, undefined is returned.
 */
const getMatchingWiremockRequest = async (requestMatcher: WiremockRequestMatcher): Promise<WiremockMatchedRequest> => {
  const matchedRequests: Array<WiremockMatchedRequest> = await getMatchingWiremockRequests(requestMatcher)
  if (matchedRequests.length > 1) {
    logger.info(
      `Wiremock API for request matching: ${JSON.stringify(requestMatcher)} returned ${
        matchedRequests.length
      } matches. Returning the last from the array.`,
    )
    return matchedRequests[matchedRequests.length - 1]
  }
  if (matchedRequests.length === 0) {
    logger.info(
      `Wiremock API for request matching: ${JSON.stringify(requestMatcher)} returned 0 matches. Returning undefined.`,
    )
    return undefined
  }
  return matchedRequests[0]
}

/**
 * Returns an array of Wiremock [WiremockMatchedRequest]s from the Wiremock journal that matches the specified [WiremockRequestMatcher]
 */
const getMatchingWiremockRequests = async (
  requestMatcher: WiremockRequestMatcher,
): Promise<Array<WiremockMatchedRequest>> => {
  try {
    const wiremockApiResponse: Response = await superagent
      .post(`${wiremockAdminUrl}/requests/find`)
      .send(requestMatcher)
    return (wiremockApiResponse.body || '[]').requests as Array<WiremockMatchedRequest>
  } catch (error) {
    logger.error(`Error querying wiremock API for request matching: ${JSON.stringify(requestMatcher)}`, error)
    throw error
  }
}

/**
 * Returns the typed request body from the Wiremock journal that matches the specified [WiremockRequestMatcher]
 * If more than 1 requests match, the last request from the journal is returned.
 * If there are no matches, undefined is returned.
 */
const getTypedWiremockRequestBody = async <T>(requestMatcher: WiremockRequestMatcher): Promise<T> => {
  const matchedRequests: Array<T> = await getTypedWiremockRequestBodies(requestMatcher)
  if (matchedRequests.length > 1) {
    logger.info(
      `Wiremock API for request matching: ${JSON.stringify(requestMatcher)} returned ${
        matchedRequests.length
      } matches. Returning the last from the array.`,
    )
    return matchedRequests[matchedRequests.length - 1]
  }
  if (matchedRequests.length === 0) {
    logger.info(
      `Wiremock API for request matching: ${JSON.stringify(requestMatcher)} returned 0 matches. Returning undefined.`,
    )
    return undefined
  }
  return matchedRequests[0]
}

/**
 * Returns all typed request bodies from the Wiremock journal that match the specified [WiremockRequestMatcher]
 */
const getTypedWiremockRequestBodies = async <T>(requestMatcher: WiremockRequestMatcher): Promise<Array<T>> => {
  const matchingWiremockRequests: Array<WiremockMatchedRequest> = await getMatchingWiremockRequests(requestMatcher)
  return matchingWiremockRequests.map(request => JSON.parse(request.body)) as Array<T>
}

const resetStubs = (): Promise<Array<Response>> =>
  Promise.all([superagent.delete(`${wiremockAdminUrl}/mappings`), superagent.delete(`${wiremockAdminUrl}/requests`)])

const stubFor = (mapping: Record<string, unknown>): SuperAgentRequest =>
  superagent.post(`${wiremockAdminUrl}/mappings`).send(mapping)

/**
 * Verify the expected number of requests were made to wiremock that match the specified [RequestPatternBuilder]
 */
const verify = async (expectedCount: number, requestPatternBuilder: RequestPatternBuilder): Promise<boolean> => {
  const matchedRequests: Array<WiremockMatchedRequest> = await getMatchingWiremockRequests(
    requestPatternBuilder.build(),
  )
  return matchedRequests.length === expectedCount
}

export {
  getMatchingRequests,
  getMatchingWiremockRequest,
  getMatchingWiremockRequests,
  getTypedWiremockRequestBody,
  getTypedWiremockRequestBodies,
  resetStubs,
  stubFor,
  verify,
}
