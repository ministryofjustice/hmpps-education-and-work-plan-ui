import ContentMatcherBuilder from './contentMatcherBuilder'

/**
 * Builder class that builds the body matching snippet to perform string equality matches on the request body content.
 * Matches can be case-sensitive using the [equalTo] function; or case-insensitive using the [equalToIgnoreCase] function.
 */
export default class EqualToMatcherBuilder extends ContentMatcherBuilder {
  constructor(private readonly expected: string) {
    super()
  }

  private caseInsensitive: boolean = false

  /**
   * Content Matcher that matches if the request body has case-sensitive string equality to the specified value.
   */
  static equalTo = (expected: string) => new EqualToMatcherBuilder(expected)

  /**
   * Content Matcher that matches if the request body has case-insensitive string equality to the specified value.
   */
  static equalToIgnoreCase = (expected: string) => new EqualToMatcherBuilder(expected).caseInsensitiveMatch()

  caseInsensitiveMatch = (caseInsensitive = true): EqualToMatcherBuilder => {
    this.caseInsensitive = caseInsensitive
    return this
  }

  build = (): Record<string, unknown> => {
    return { equalTo: this.expected, caseInsensitive: this.caseInsensitive }
  }
}
