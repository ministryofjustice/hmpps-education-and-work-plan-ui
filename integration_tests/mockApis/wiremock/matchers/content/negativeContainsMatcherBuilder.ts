import ContentMatcherBuilder from './contentMatcherBuilder'

/**
 * Builder class that builds the body matching snippet that will match if the request body content does not contain the specified string.
 */
export default class NegativeContainsMatcherBuilder extends ContentMatcherBuilder {
  constructor(private readonly expected: string) {
    super()
  }

  /**
   * Content Matcher that matches if the request body content does not contain the specified string.
   */
  static notContaining = (expected: string) => new NegativeContainsMatcherBuilder(expected)

  build = (): Record<string, unknown> => {
    return { contains: this.expected }
  }
}
