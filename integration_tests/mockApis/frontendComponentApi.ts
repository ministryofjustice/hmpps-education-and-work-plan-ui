import { SuperAgentRequest } from 'superagent'
import { stubFor } from './wiremock'

const stubGetFooterComponent = (): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/footer`,
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: [
        {
          html: '\n    <footer class="connect-dps-common-footer" role="contentinfo">\n    <div class="govuk-width-container ">\n        <div class="connect-dps-common-footer__info">\n            <div class="connect-dps-common-footer__help">\n                <h2>Get help with DPS</h2>\n                <p>Call 0800 917 5148 or #6598 from inside an establishment.</p>\n            </div>\n        </div>\n        <div class="connect-dps-common-footer__support-links">\n            <h2 class="govuk-visually-hidden">Support links</h2>\n\n            <ul class="connect-dps-common-footer__inline-list">\n                <li class="connect-dps-common-footer__inline-list-item">\n                    <a class="connect-dps-common-footer__link" href="https://eu.surveymonkey.com/r/FRZYGVQ?source=[source_value]" target=\'_blank\' referrerpolicy=\'no-referrer\' rel=\'noopener\'>\n                        Feedback\n                    </a>\n                </li>\n\n                \n                    <li class="connect-dps-common-footer__inline-list-item">\n                        <a class="connect-dps-common-footer__link" href="https://dps-dev.prison.service.justice.gov.uk/accessibility-statement">\n                            Accessibility statement\n                        </a>\n                    </li>\n                \n                    <li class="connect-dps-common-footer__inline-list-item">\n                        <a class="connect-dps-common-footer__link" href="https://dps-dev.prison.service.justice.gov.uk/terms-and-conditions">\n                            Terms and conditions\n                        </a>\n                    </li>\n                \n                    <li class="connect-dps-common-footer__inline-list-item">\n                        <a class="connect-dps-common-footer__link" href="https://dps-dev.prison.service.justice.gov.uk/privacy-policy">\n                            Privacy policy\n                        </a>\n                    </li>\n                \n                    <li class="connect-dps-common-footer__inline-list-item">\n                        <a class="connect-dps-common-footer__link" href="https://dps-dev.prison.service.justice.gov.uk/cookies-policy">\n                            Cookies policy\n                        </a>\n                    </li>\n                \n            </ul>\n        </div>\n    </div>\n</footer>\n\n',
          css: [],
          javascript: [],
        },
      ],
    },
  })

const stubGetFooterComponent500error = (): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/footer`,
    },
    response: {
      status: 500,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        errorCode: 'VC5000',
        errorMessage: 'Unexpected error',
        httpStatusCode: 500,
        userMessage: 'An unexpected error occurred',
        developerMessage: 'An unexpected error occurred',
      },
    },
  })

export default { stubGetFooterComponent, stubGetFooterComponent500error }
