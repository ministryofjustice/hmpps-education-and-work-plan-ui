import { getMatchingWiremockRequests, WiremockMatchedRequest, WiremockRequestMatcher } from './wiremock'

const verifyWiremockRequestSent = async (options: {
  requestMatcher: WiremockRequestMatcher
  times: number
}): Promise<boolean> => {
  const matchedRequests: Array<WiremockMatchedRequest> = await getMatchingWiremockRequests(options.requestMatcher)
  return matchedRequests.length === options.times
}

interface UrlPathPattern {
  urlPathPattern: string
}

interface UrlPattern {
  urlPattern: string
}

class RequestPatternBuilder {
  static getRequestedFor = () => new RequestPatternBuilder('GET')

  static postRequestedFor = () => new RequestPatternBuilder('POST')

  static putRequestedFor = () => new RequestPatternBuilder('PUT')

  static deleteRequestedFor = () => new RequestPatternBuilder('DELETE')

  static patchRequestedFor = () => new RequestPatternBuilder('PATCH')

  constructor(readonly method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH') {}
}

const { getRequestedFor } = RequestPatternBuilder
const { postRequestedFor } = RequestPatternBuilder
const { putRequestedFor } = RequestPatternBuilder
const { deleteRequestedFor } = RequestPatternBuilder
const { patchRequestedFor } = RequestPatternBuilder

export {
  verifyWiremockRequestSent,
  RequestPatternBuilder,
  getRequestedFor,
  postRequestedFor,
  putRequestedFor,
  deleteRequestedFor,
  patchRequestedFor,
}
