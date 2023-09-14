import type { FrontendComponentsPageAdditions } from 'viewModels'
import type { FrontendComponent } from 'frontendComponentApiClient'

const toFrontendComponentsPageAdditions = (
  header: FrontendComponent,
  footer: FrontendComponent,
): FrontendComponentsPageAdditions => {
  return {
    headerHtml: header.html,
    footerHtml: footer.html,
    cssIncludes: Array.from(new Set(header.css.concat(footer.css))),
    jsIncludes: Array.from(new Set(header.javascript.concat(footer.javascript))),
    problemRetrievingData: false,
  }
}

export default toFrontendComponentsPageAdditions
