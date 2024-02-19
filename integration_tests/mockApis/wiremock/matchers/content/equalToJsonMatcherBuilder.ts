import ContentMatcherBuilder from './contentMatcherBuilder'

/**
 * Builder class that builds the body matching snippet to perform JSON equality matches on the request body content.
 * The default behaviour is to perform a strict match, matching on array order and not to ignore extra elements.
 * This behaviour can be controlled with the [ignoreArrayOrderMatch] and [ignoreExtraElementsMatch] methods.
 */
export default class EqualToJsonMatcherBuilder extends ContentMatcherBuilder {
  constructor(private readonly expected: Record<string, unknown>) {
    super()
  }

  private ignoreArrayOrder: boolean = false

  private ignoreExtraElements: boolean = false

  /**
   * Content Matcher that matches if the request body content contains the specified JSON object.
   */
  static equalToJson = (expected: Record<string, unknown>) => new EqualToJsonMatcherBuilder(expected)

  ignoreArrayOrderMatch = (ignoreArrayOrder = true): EqualToJsonMatcherBuilder => {
    this.ignoreArrayOrder = ignoreArrayOrder
    return this
  }

  ignoreExtraElementsMatch = (ignoreExtraElements = true): EqualToJsonMatcherBuilder => {
    this.ignoreExtraElements = ignoreExtraElements
    return this
  }

  build = (): Record<string, unknown> => {
    return {
      equalToJson: this.expected,
      ignoreArrayOrder: this.ignoreArrayOrder,
      ignoreExtraElements: this.ignoreExtraElements,
    }
  }
}
