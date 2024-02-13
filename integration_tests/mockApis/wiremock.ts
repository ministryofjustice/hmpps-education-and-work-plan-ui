import superagent, { SuperAgentRequest, Response } from 'superagent'
import logger from '../../logger'

const wiremockAdminUrl = 'http://localhost:9091/__admin'

const stubFor = (mapping: Record<string, unknown>): SuperAgentRequest =>
  superagent.post(`${wiremockAdminUrl}/mappings`).send(mapping)

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

export {
  stubFor,
  getMatchingWiremockRequest,
  getMatchingWiremockRequests,
  getTypedWiremockRequestBody,
  getTypedWiremockRequestBodies,
  resetStubs,
}

/**
 * WiremockRequestMatcher - based heavily on the type defined in the (Wiremock openApi spec)[https://wiremock.org/assets/js/wiremock-admin-api.json]
 */
export interface WiremockRequestMatcher {
  method?: string
  url?: string
  urlPath?: string
  urlPathPattern?: string
  urlPattern?: string
  queryParameters?: Record<string, never>
  headers?: Record<string, never>
  basicAuthCredentials?: {
    password: string
    username: string
  }
  cookies?: Record<string, never>
  bodyPatterns?: Record<string, never>[]
}

/**
 * WiremockMatchedRequest - based heavily on the type defined in the (Wiremock openApi spec)[https://wiremock.org/assets/js/wiremock-admin-api.json]
 */
export interface WiremockMatchedRequest {
  url?: string
  absoluteUrl?: string
  method?: string
  headers: Record<string, unknown>
  body?: string
  browserProxyRequest?: boolean
  loggedDate?: Date
  loggedDateString?: string
  queryParams?: Record<string, { key: string; values: Array<string> }>
}
