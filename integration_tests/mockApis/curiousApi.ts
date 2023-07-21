import { SuperAgentRequest } from 'superagent'
import { stubFor } from './wiremock'

const stubNeurodivergenceForPrisonerWithAllCategoriesOfSupportNeed = (prisonNumber = 'G6115VJ'): SuperAgentRequest =>
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

const stubNeurodivergenceForPrisonerWithSelfDeclaredSupportNeeds = (prisonNumber = 'G6115VJ'): SuperAgentRequest =>
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

const stubNeurodivergenceForPrisonerWithNoCurrentAssessment = (prisonNumber = 'G6115VJ'): SuperAgentRequest =>
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

const stubNeurodivergenceForPrisonerNotInCurious = (prisonNumber = 'G6115VJ'): SuperAgentRequest =>
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

const stubNeurodivergence401Error = (prisonNumber = 'G6115VJ'): SuperAgentRequest =>
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

const stubLearnerProfile = (prisonNumber = 'G6115VJ'): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/learnerProfile/${prisonNumber}`,
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: [
        {
          prn: prisonNumber,
          establishmentId: 'MDI',
          establishmentName: 'MOORLAND (HMP & YOI)',
          uln: '3627609222',
          lddHealthProblem: 'No information provided by the learner.',
          priorAttainment: null,
          qualifications: [
            {
              qualificationType: 'Maths',
              qualificationGrade: 'Entry Level 1',
              assessmentDate: '2021-07-01',
            },
            {
              qualificationType: 'Digital Literacy',
              qualificationGrade: 'Entry Level 3',
              assessmentDate: '2021-07-01',
            },
          ],
          languageStatus: null,
          plannedHours: null,
          rapidAssessmentDate: null,
          inDepthAssessmentDate: null,
          primaryLDDAndHealthProblem: null,
          additionalLDDAndHealthProblems: [],
        },
      ],
    },
  })

const stubLearnerProfile401Error = (prisonNumber = 'G6115VJ'): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/learnerProfile/${prisonNumber}`,
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
  // Stubs for Neuro Divergence API
  stubNeurodivergenceForPrisonerWithAllCategoriesOfSupportNeed,
  stubNeurodivergenceForPrisonerWithSelfDeclaredSupportNeeds,
  stubNeurodivergenceForPrisonerWithNoCurrentAssessment,
  stubNeurodivergenceForPrisonerNotInCurious,
  stubNeurodivergence401Error,

  // Stubs for Learner Profile API
  stubLearnerProfile,
  stubLearnerProfile401Error,
}
