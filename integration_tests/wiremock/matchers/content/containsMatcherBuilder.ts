import ContentMatcherBuilder from './contentMatcherBuilder'

/**
 * Builder class that builds the body matching snippet that will match if the request body content contains the specified string.
 */
class ContainsMatcherBuilder extends ContentMatcherBuilder {
  constructor(private readonly expected: string) {
    super()
  }

  static containing = (expected: string) => new ContainsMatcherBuilder(expected)

  build = (): Record<string, unknown> => {
    return { contains: this.expected }
  }
}

const { containing } = ContainsMatcherBuilder

export { ContainsMatcherBuilder, containing }
