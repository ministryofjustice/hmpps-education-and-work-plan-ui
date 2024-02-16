import ContentMatcherBuilder from './contentMatcherBuilder'

/**
 * Builder class that builds the body matching snippet to perform string equality matches on the request body content.
 * Matches can be case-sensitive using the [equalTo] function; or case-insensitive using the [equalToIgnoreCase] function.
 */
class EqualToMatcherBuilder extends ContentMatcherBuilder {
  constructor(private readonly expected: string) {
    super()
  }

  private caseInsensitive: boolean = false

  static equalTo = (expected: string) => new EqualToMatcherBuilder(expected)

  static equalToIgnoreCase = (expected: string) => new EqualToMatcherBuilder(expected).caseInsensitiveMatch()

  caseInsensitiveMatch = (caseInsensitive = true): EqualToMatcherBuilder => {
    this.caseInsensitive = caseInsensitive
    return this
  }

  build = (): Record<string, unknown> => {
    return { equalTo: this.expected, caseInsensitive: this.caseInsensitive }
  }
}

const { equalTo, equalToIgnoreCase } = EqualToMatcherBuilder

export { EqualToMatcherBuilder, equalTo, equalToIgnoreCase }
