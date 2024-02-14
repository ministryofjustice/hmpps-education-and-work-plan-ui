import UrlMatcher from './urlMatcher'

class UrlPathEqualToBuilder extends UrlMatcher {
  private constructor(private readonly url: string) {
    super()
  }

  static urlPathEqualTo = (url: string) => new UrlPathEqualToBuilder(url)

  build = (): Record<string, unknown> => {
    return { urlPath: this.url }
  }
}

const { urlPathEqualTo } = UrlPathEqualToBuilder

export { UrlPathEqualToBuilder, urlPathEqualTo }
