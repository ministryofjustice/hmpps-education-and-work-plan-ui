import { SuperAgentRequest } from 'superagent'
import { stubFor } from './wiremock'

const stubNeurodivergenceForPrisonerWithAllCategoriesOfSupportNeed = (prisonNumber: string): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/learnerNeurodivergence/${prisonNumber}`,
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: [
        {
          prn: prisonNumber,
          establishmentId: 'MDI',
          establishmentName: 'MOORLAND (HMP & YOI)',
          neurodivergenceSelfDeclared: ['Dyslexia'],
          selfDeclaredDate: '2022-02-01',
          neurodivergenceAssessed: ['Attention Deficit Hyperactivity Disorder', 'Alzheimers'],
          assessmentDate: '2022-02-10',
          neurodivergenceSupport: ['Communications', 'Visual Support'],
          supportDate: '2022-02-16',
        },
      ],
    },
  })

const stubNeurodivergenceForPrisonerWithSelfDeclaredSupportNeeds = (prisonNumber: string): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/learnerNeurodivergence/${prisonNumber}`,
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: [
        {
          prn: prisonNumber,
          establishmentId: 'DNI',
          establishmentName: 'DONCASTER (HMP)',
          neurodivergenceSelfDeclared: ['ADHD'],
          selfDeclaredDate: '2022-05-16',
          neurodivergenceAssessed: ['No Identified Neurodiversity Need'],
          assessmentDate: '2022-05-16',
          neurodivergenceSupport: ['No Identified Support Required'],
          supportDate: '2022-05-16',
        },
      ],
    },
  })

const stubNeurodivergenceForPrisonerWithNoCurrentAssessment = (prisonNumber: string): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/learnerNeurodivergence/${prisonNumber}`,
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: [],
    },
  })

const stubNeurodivergenceForPrisonerNotInCurious = (prisonNumber: string): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/learnerNeurodivergence/${prisonNumber}`,
    },
    response: {
      status: 404,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        errorCode: 'VC4004',
        errorMessage: 'Resource not found',
        httpStatusCode: 404,
      },
    },
  })

const stubNeurodivergence401Error = (prisonNumber: string): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/learnerNeurodivergence/${prisonNumber}`,
    },
    response: {
      status: 401,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        errorCode: 'VC4001',
        errorMessage: 'Invalid token',
        httpStatusCode: 401,
      },
    },
  })

export default {
  stubNeurodivergenceForPrisonerWithAllCategoriesOfSupportNeed,
  stubNeurodivergenceForPrisonerWithSelfDeclaredSupportNeeds,
  stubNeurodivergenceForPrisonerWithNoCurrentAssessment,
  stubNeurodivergenceForPrisonerNotInCurious,
  stubNeurodivergence401Error,
}
