import type { FrontendComponentsPageAdditions } from 'viewModels'

export default function aValidFrontEndComponentFooter(): FrontendComponentsPageAdditions {
  return {
    footerHtml: '<div>Footer</div>',
    cssIncludes: ['https://frontend-componenents-dev/footerStyles.css'],
    jsIncludes: ['https://frontend-componenents-dev/footerScripts.js'],
  }
}
