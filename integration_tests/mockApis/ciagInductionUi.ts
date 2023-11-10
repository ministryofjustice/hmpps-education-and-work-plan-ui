import { stubFor } from './wiremock'

const stubCreateCiagInductionUi = (prisonNumber = 'G6115VJ') =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/plan/create/${prisonNumber}/hoping-to-get-work/new`,
    },
    response: {
      status: 200,
      headers: {
        'Content-Type': 'text/html',
      },
      body: '<html lang="en"><head><title>Mock CIAG UI - Create Induction page</title></head><body><h1>Create CIAG Induction</h1><span class="govuk-visually-hidden" id="pageId" data-qa="create-induction"></span></body></html>',
    },
  })

export default { stubCreateCiagInductionUi }
