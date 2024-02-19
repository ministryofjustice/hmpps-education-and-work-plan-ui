import UrlMatcherBuilder from './urlMatcherBuilder'

/**
 * Builder class that builds the request URL matching snippet to perform matches on any request URL.
 * This matcher is used to match the entire URL, including any query string parameters.
 */
export default class AnyUrlMatcherBuilder extends UrlMatcherBuilder {
  /**
   * URL Matcher that matches on any URL.
   */
  static anyUrl = () => new AnyUrlMatcherBuilder()

  build = (): Record<string, unknown> => {
    return {}
  }
}
