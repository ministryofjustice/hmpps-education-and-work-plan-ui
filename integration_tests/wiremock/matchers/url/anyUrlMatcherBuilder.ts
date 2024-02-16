import UrlMatcherBuilder from './urlMatcherBuilder'

/**
 * Builder class that builds the request URL matching snippet to perform matches on any request URL.
 * This matcher is used to match the entire URL, including any query string parameters.
 */
class AnyUrlMatcherBuilder extends UrlMatcherBuilder {
  static anyUrl = () => new AnyUrlMatcherBuilder()

  build = (): Record<string, unknown> => {
    return {}
  }
}

const { anyUrl } = AnyUrlMatcherBuilder

export { AnyUrlMatcherBuilder, anyUrl }
