import { getMatchingWiremockRequests, WiremockMatchedRequest, WiremockRequestMatcher } from '../mockApis/wiremock'

const verifyWiremockRequestSent = async (options: {
  requestMatcher: WiremockRequestMatcher
  times: number
}): Promise<boolean> => {
  const matchedRequests: Array<WiremockMatchedRequest> = await getMatchingWiremockRequests(options.requestMatcher)
  return matchedRequests.length === options.times
}

export default verifyWiremockRequestSent
