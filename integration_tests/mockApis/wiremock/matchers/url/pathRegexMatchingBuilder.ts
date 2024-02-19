import UrlMatcherBuilder from './urlMatcherBuilder'

/**
 * Builder class that builds the request URL matching snippet that will match if the request URL path matches the specified regex.
 * This matcher is used to match the URL path; not the full URL that might include query string parameters.
 */
export default class PathRegexMatchingBuilder extends UrlMatcherBuilder {
  private constructor(private readonly expected: RegExp) {
    super()
  }

  /**
   * URL Matcher that matches on regular expression match of the request URL path (excludes any query string parameters).
   */
  static urlPathMatching = (expected: RegExp) => new PathRegexMatchingBuilder(expected)

  build = (): Record<string, unknown> => {
    return { urlPathPattern: this.expected }
  }
}
