import ContentMatcherBuilder from './contentMatcherBuilder'

/**
 * Builder class that builds the body matching snippet that will match if the request body content dot not match the specified regex.
 */
class NegativeRegexMatcherBuilder extends ContentMatcherBuilder {
  constructor(private readonly expected: RegExp) {
    super()
  }

  static notMatching = (expected: RegExp) => new NegativeRegexMatcherBuilder(expected)

  build = (): Record<string, unknown> => {
    return { doesNotMatch: this.expected }
  }
}

const { notMatching } = NegativeRegexMatcherBuilder

export { NegativeRegexMatcherBuilder, notMatching }
