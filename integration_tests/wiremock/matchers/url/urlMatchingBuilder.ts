import UrlMatcher from './urlMatcher'

class UrlMatchingBuilder extends UrlMatcher {
  private constructor(private readonly url: string) {
    super()
  }

  static urlMatching = (url: string) => new UrlMatchingBuilder(url)

  build = (): Record<string, unknown> => {
    return { urlPattern: this.url }
  }
}

const { urlMatching } = UrlMatchingBuilder

export { UrlMatchingBuilder, urlMatching }
