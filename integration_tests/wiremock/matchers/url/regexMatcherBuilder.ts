import UrlMatcherBuilder from './urlMatcherBuilder'

/**
 * Builder class that builds the request URL matching snippet that will match if the request URL matches the specified regex.
 * This matcher is used to match the entire URL, including any query string parameters.
 */
class RegexMatcherBuilder extends UrlMatcherBuilder {
  private constructor(private readonly expected: RegExp) {
    super()
  }

  static urlMatching = (expected: RegExp) => new RegexMatcherBuilder(expected)

  build = (): Record<string, unknown> => {
    return { urlPattern: this.expected }
  }
}

const { urlMatching } = RegexMatcherBuilder

export { RegexMatcherBuilder, urlMatching }
