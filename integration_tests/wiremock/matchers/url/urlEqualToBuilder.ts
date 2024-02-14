import UrlMatcher from './urlMatcher'

class UrlEqualToBuilder extends UrlMatcher {
  private constructor(private readonly url: string) {
    super()
  }

  static urlEqualTo = (url: string) => new UrlEqualToBuilder(url)

  build = (): Record<string, unknown> => {
    return { url: this.url }
  }
}

const { urlEqualTo } = UrlEqualToBuilder

export { UrlEqualToBuilder, urlEqualTo }
