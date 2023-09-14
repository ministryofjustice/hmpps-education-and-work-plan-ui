import type { FrontendComponentsPageAdditions } from 'viewModels'
import {
  aValidFrontEndComponentHeader,
  aValidFrontEndComponentFooter,
} from '../../testsupport/frontendComponentTestDataBuilder'
import toFrontendComponentsPageAdditions from './frontendComponentMapper'

describe('frontendComponentMapper', () => {
  it('should map header and footer FrontendComponents into FrontendComponentsPageAdditions', () => {
    // Given
    const header = aValidFrontEndComponentHeader()
    const footer = aValidFrontEndComponentFooter()

    const expectedPageAdditions: FrontendComponentsPageAdditions = {
      headerHtml: '<div>Header</div>',
      footerHtml: '<div>Footer</div>',
      cssIncludes: [
        'https://frontend-componenents-dev/common.css',
        'https://frontend-componenents-dev/headerStyles.css',
        'https://frontend-componenents-dev/footerStyles.css',
      ],
      jsIncludes: [
        'https://frontend-componenents-dev/common.js',
        'https://frontend-componenents-dev/headerScripts.js',
        'https://frontend-componenents-dev/footerScripts.js',
      ],
      problemRetrievingData: false,
    }

    // When
    const actual = toFrontendComponentsPageAdditions(header, footer)

    // Then
    expect(actual).toEqual(expectedPageAdditions)
  })
})
