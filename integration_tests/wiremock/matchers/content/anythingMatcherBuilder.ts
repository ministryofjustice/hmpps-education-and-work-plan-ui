import ContentMatcherBuilder from './contentMatcherBuilder'

/**
 * Builder class that builds the body matching snippet that will match if the request body content contains anything.
 */
class AnythingMatcherBuilder extends ContentMatcherBuilder {
  static anything = () => new AnythingMatcherBuilder()

  build = (): Record<string, unknown> => {
    return { anything: '(always)' }
  }
}

const { anything } = AnythingMatcherBuilder

export { AnythingMatcherBuilder, anything }
