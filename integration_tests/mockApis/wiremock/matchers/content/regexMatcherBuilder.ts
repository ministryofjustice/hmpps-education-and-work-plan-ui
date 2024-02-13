import ContentMatcherBuilder from './contentMatcherBuilder'

/**
 * Builder class that builds the body matching snippet that will match if the request body content matches the specified regex.
 */
export default class RegexMatcherBuilder extends ContentMatcherBuilder {
  constructor(private readonly expected: RegExp) {
    super()
  }

  /**
   * Content Matcher that matches if the request body content matches the specified regular expression.
   */
  static matching = (expected: RegExp) => new RegexMatcherBuilder(expected)

  build = (): Record<string, unknown> => {
    return { matches: this.expected }
  }
}
