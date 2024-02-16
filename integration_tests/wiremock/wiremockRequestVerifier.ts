import { getMatchingWiremockRequests, WiremockMatchedRequest } from '../mockApis/wiremock'
import { RequestPatternBuilder } from './requestPatternBuilder'

const verify = async (requestPatternBuilder: RequestPatternBuilder): Promise<boolean> => {
  const matchedRequests: Array<WiremockMatchedRequest> = await getMatchingWiremockRequests(
    requestPatternBuilder.build(),
  )
  return matchedRequests.length === requestPatternBuilder.expectedRequestCount
}

export default verify
