import UrlMatcherBuilder from './urlMatcherBuilder'

/**
 * Builder class that builds the request URL matching snippet to perform string equality matches on the request URL.
 * This matcher is used to match the entire URL, including any query string parameters.
 */
class EqualToMatcherBuilder extends UrlMatcherBuilder {
  private constructor(private readonly expected: string) {
    super()
  }

  static urlEqualTo = (expected: string) => new EqualToMatcherBuilder(expected)

  build = (): Record<string, unknown> => {
    return { url: this.expected }
  }
}

const { urlEqualTo } = EqualToMatcherBuilder

export { EqualToMatcherBuilder, urlEqualTo }
