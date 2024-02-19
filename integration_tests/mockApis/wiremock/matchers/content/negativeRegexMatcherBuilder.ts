import ContentMatcherBuilder from './contentMatcherBuilder'

/**
 * Builder class that builds the body matching snippet that will match if the request body content dot not match the specified regex.
 */
export default class NegativeRegexMatcherBuilder extends ContentMatcherBuilder {
  constructor(private readonly expected: RegExp) {
    super()
  }

  /**
   * Content Matcher that matches if the request body content does not match the specified regular expression.
   */
  static notMatching = (expected: RegExp) => new NegativeRegexMatcherBuilder(expected)

  build = (): Record<string, unknown> => {
    return { doesNotMatch: this.expected }
  }
}
