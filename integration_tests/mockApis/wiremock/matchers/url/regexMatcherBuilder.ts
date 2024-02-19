import UrlMatcherBuilder from './urlMatcherBuilder'

/**
 * Builder class that builds the request URL matching snippet that will match if the request URL matches the specified regex.
 * This matcher is used to match the entire URL, including any query string parameters.
 */
export default class RegexMatcherBuilder extends UrlMatcherBuilder {
  private constructor(private readonly expected: RegExp) {
    super()
  }

  /**
   * URL Matcher that matches on regular expression match of the entire request URL path including any query string parameters.
   */
  static urlMatching = (expected: RegExp) => new RegexMatcherBuilder(expected)

  build = (): Record<string, unknown> => {
    return { urlPattern: this.expected }
  }
}
