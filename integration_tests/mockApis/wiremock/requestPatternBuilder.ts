import ContentMatcherBuilder from './matchers/content/contentMatcherBuilder'
import UrlMatcherBuilder from './matchers/url/urlMatcherBuilder'
import WiremockRequestMatcher from './wiremockRequestMatcher'

class RequestPatternBuilder {
  private constructor(
    private readonly method: HttpMethod,
    private readonly urlMatcher: UrlMatcherBuilder,
  ) {}

  static getRequestedFor = (urlMatcher: UrlMatcherBuilder) => new RequestPatternBuilder(HttpMethod.GET, urlMatcher)

  static postRequestedFor = (urlMatcher: UrlMatcherBuilder) => new RequestPatternBuilder(HttpMethod.POST, urlMatcher)

  static putRequestedFor = (urlMatcher: UrlMatcherBuilder) => new RequestPatternBuilder(HttpMethod.PUT, urlMatcher)

  static deleteRequestedFor = (urlMatcher: UrlMatcherBuilder) =>
    new RequestPatternBuilder(HttpMethod.DELETE, urlMatcher)

  static patchRequestedFor = (urlMatcher: UrlMatcherBuilder) => new RequestPatternBuilder(HttpMethod.PATCH, urlMatcher)

  private bodyPatterns: Array<Record<string, unknown>> = []

  withRequestBody = (contentMatchers: ContentMatcherBuilder | Array<ContentMatcherBuilder>): RequestPatternBuilder => {
    if (Array.isArray(contentMatchers)) {
      contentMatchers.forEach(contentMatcher => this.bodyPatterns.push(contentMatcher.build()))
    } else {
      this.bodyPatterns.push(contentMatchers.build())
    }
    return this
  }

  /**
   * Builds a [WiremockRequestMatcher] from the properties in this builder instance.
   */
  build = (): WiremockRequestMatcher => {
    return {
      method: this.method.toString(),
      ...this.urlMatcher.build(),
      bodyPatterns: [...this.bodyPatterns],
    }
  }
}

enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  PATCH = 'PATCH',
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
