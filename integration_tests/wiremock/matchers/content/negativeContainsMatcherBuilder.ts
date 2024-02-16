import ContentMatcherBuilder from './contentMatcherBuilder'

/**
 * Builder class that builds the body matching snippet that will match if the request body content does not contain the specified string.
 */
class NegativeContainsMatcherBuilder extends ContentMatcherBuilder {
  constructor(private readonly expected: string) {
    super()
  }

  static notContaining = (expected: string) => new NegativeContainsMatcherBuilder(expected)

  build = (): Record<string, unknown> => {
    return { contains: this.expected }
  }
}

const { notContaining } = NegativeContainsMatcherBuilder

export { NegativeContainsMatcherBuilder, notContaining }
