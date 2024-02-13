import UrlMatcherBuilder from './urlMatcherBuilder'

/**
 * Builder class that builds the request URL matching snippet to perform string equality matches on the request URL path.
 * This matcher is used to match the URL path; not the full URL that might include query string parameters.
 */
export default class PathEqualToMatcherBuilder extends UrlMatcherBuilder {
  private constructor(private readonly expected: string) {
    super()
  }

  /**
   * URL Matcher that matches on string equality of the request URL path (excludes any query string parameters).
   * @param expected
   */
  static urlPathEqualTo = (expected: string) => new PathEqualToMatcherBuilder(expected)

  build = (): Record<string, unknown> => {
    return { urlPath: this.expected }
  }
}
