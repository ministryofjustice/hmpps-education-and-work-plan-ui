import ContentMatcher from './matchers/content/contentMatcher'
import UrlMatcher from './matchers/url/urlMatcher'

class RequestPatternBuilder {
  private constructor(
    private readonly method: HttpMethod,
    private readonly urlMatcher: UrlMatcher,
  ) {}

  static getRequestedFor = (urlMatcher: UrlMatcher) => new RequestPatternBuilder(HttpMethod.GET, urlMatcher)

  static postRequestedFor = (urlMatcher: UrlMatcher) => new RequestPatternBuilder(HttpMethod.POST, urlMatcher)

  static putRequestedFor = (urlMatcher: UrlMatcher) => new RequestPatternBuilder(HttpMethod.PUT, urlMatcher)

  static deleteRequestedFor = (urlMatcher: UrlMatcher) => new RequestPatternBuilder(HttpMethod.DELETE, urlMatcher)

  static patchRequestedFor = (urlMatcher: UrlMatcher) => new RequestPatternBuilder(HttpMethod.PATCH, urlMatcher)

  private bodyPatterns: Array<Record<string, never>> = []

  withRequestBody = (contentMatcher: ContentMatcher): RequestPatternBuilder => {
    this.bodyPatterns.push(contentMatcher.build())
    return this
  }
}

enum HttpMethod {
  GET,
  POST,
  PUT,
  DELETE,
  PATCH,
}

const { getRequestedFor, postRequestedFor, putRequestedFor, deleteRequestedFor, patchRequestedFor } =
  RequestPatternBuilder

export {
  RequestPatternBuilder,
  getRequestedFor,
  postRequestedFor,
  putRequestedFor,
  deleteRequestedFor,
  patchRequestedFor,
}
