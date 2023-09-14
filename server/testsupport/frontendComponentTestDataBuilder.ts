import type { FrontendComponent } from 'frontendComponentApiClient'

const aValidFrontEndComponentHeader = (): FrontendComponent => {
  return {
    html: '<div>Header</div>',
    css: ['https://frontend-componenents-dev/common.css', 'https://frontend-componenents-dev/headerStyles.css'],
    javascript: ['https://frontend-componenents-dev/common.js', 'https://frontend-componenents-dev/headerScripts.js'],
  }
}

const aValidFrontEndComponentFooter = (): FrontendComponent => {
  return {
    html: '<div>Footer</div>',
    css: ['https://frontend-componenents-dev/common.css', 'https://frontend-componenents-dev/footerStyles.css'],
    javascript: ['https://frontend-componenents-dev/common.js', 'https://frontend-componenents-dev/footerScripts.js'],
  }
}

export { aValidFrontEndComponentHeader, aValidFrontEndComponentFooter }
