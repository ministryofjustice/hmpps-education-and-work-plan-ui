import ContentMatcherBuilder from './contentMatcherBuilder'

/**
 * Builder class that builds the body matching snippet that will match if the request body content contains anything.
 */
export default class AnythingMatcherBuilder extends ContentMatcherBuilder {
  /**
   * Content Matcher that matches any request body content.
   */
  static anything = () => new AnythingMatcherBuilder()

  build = (): Record<string, unknown> => {
    return { anything: '(always)' }
  }
}
