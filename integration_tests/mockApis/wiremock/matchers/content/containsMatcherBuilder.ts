import ContentMatcherBuilder from './contentMatcherBuilder'

/**
 * Builder class that builds the body matching snippet that will match if the request body content contains the specified string.
 */
export default class ContainsMatcherBuilder extends ContentMatcherBuilder {
  constructor(private readonly expected: string) {
    super()
  }

  /**
   * Content Matcher that matches if the request body content contains the specified string.
   */
  static containing = (expected: string) => new ContainsMatcherBuilder(expected)

  build = (): Record<string, unknown> => {
    return { contains: this.expected }
  }
}
