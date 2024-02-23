import ContentMatcherBuilder from './contentMatcherBuilder'

/**
 * Builder class that builds the body matching snippet to perform JSONPath matches on the request body content.
 */
export default class JsonPathMatcherBuilder extends ContentMatcherBuilder {
  constructor(private readonly expected: string) {
    super()
  }

  /**
   * Content Matcher that matches if the request body matches the specified JSONPath expression.
   */
  static matchingJsonPath = (expected: string) => new JsonPathMatcherBuilder(expected)

  build = (): Record<string, unknown> => {
    return { matchesJsonPath: this.expected }
  }
}
