import ContentMatcherBuilder from './contentMatcherBuilder'

/**
 * Builder class that builds the body matching snippet to perform JSONPath matches on the request body content.
 */
class JsonPathMatcherBuilder extends ContentMatcherBuilder {
  constructor(private readonly expected: string) {
    super()
  }

  static matchingJsonPath = (expected: string) => new JsonPathMatcherBuilder(expected)

  build = (): Record<string, unknown> => {
    return { matchesJsonPath: this.expected }
  }
}

const { matchingJsonPath } = JsonPathMatcherBuilder

export { JsonPathMatcherBuilder, matchingJsonPath }
