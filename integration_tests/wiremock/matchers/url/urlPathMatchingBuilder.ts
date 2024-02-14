import UrlMatcher from './urlMatcher'

class UrlPathMatchingBuilder extends UrlMatcher {
  private constructor(private readonly url: string) {
    super()
  }

  static urlPathMatching = (url: string) => new UrlPathMatchingBuilder(url)

  build = (): Record<string, unknown> => {
    return { urlPathPattern: this.url }
  }
}

const { urlPathMatching } = UrlPathMatchingBuilder

export { UrlPathMatchingBuilder, urlPathMatching }
