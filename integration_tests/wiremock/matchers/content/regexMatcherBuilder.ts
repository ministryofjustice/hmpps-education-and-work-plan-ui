import ContentMatcherBuilder from './contentMatcherBuilder'

/**
 * Builder class that builds the body matching snippet that will match if the request body content matches the specified regex.
 */
class RegexMatcherBuilder extends ContentMatcherBuilder {
  constructor(private readonly expected: RegExp) {
    super()
  }

  static matching = (expected: RegExp) => new RegexMatcherBuilder(expected)

  build = (): Record<string, unknown> => {
    return { matches: this.expected }
  }
}

const { matching } = RegexMatcherBuilder

export { RegexMatcherBuilder, matching }
