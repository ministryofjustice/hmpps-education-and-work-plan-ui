import { SuperAgentRequest } from 'superagent'
import moment from 'moment'
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

const stubNeurodivergence404Error = (prisonNumber = 'G6115VJ'): SuperAgentRequest =>
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

const stubLearnerProfile404Error = (prisonNumber = 'G6115VJ'): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/learnerProfile/${prisonNumber}`,
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

const stubLearnerEducation = (prisonNumber = 'G6115VJ', page = 0): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPathPattern: `/learnerEducation/${prisonNumber}`,
      queryParameters: {
        page: { equalTo: `${page}` },
      },
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        content: [
          {
            prn: prisonNumber,
            establishmentId: 'MDI',
            establishmentName: 'MOORLAND (HMP & YOI)',
            courseName: 'GCSE English',
            courseCode: '008ENGL06',
            isAccredited: false,
            aimSequenceNumber: 1,
            learningStartDate: '2021-06-01',
            learningPlannedEndDate: '2021-08-06',
            learningActualEndDate: null,
            learnersAimType: null,
            miNotionalNVQLevelV2: null,
            sectorSubjectAreaTier1: null,
            sectorSubjectAreaTier2: null,
            occupationalIndicator: null,
            accessHEIndicator: null,
            keySkillsIndicator: null,
            functionalSkillsIndicator: null,
            gceIndicator: null,
            gcsIndicator: null,
            asLevelIndicator: null,
            a2LevelIndicator: null,
            qcfIndicator: null,
            qcfDiplomaIndicator: null,
            qcfCertificateIndicator: null,
            lrsGLH: null,
            attendedGLH: null,
            actualGLH: 100,
            outcome: null,
            outcomeGrade: null,
            employmentOutcome: null,
            withdrawalReasons: null,
            prisonWithdrawalReason: null,
            completionStatus:
              'The learner is continuing or intending to continue the learning activities leading to the learning aim',
            withdrawalReasonAgreed: false,
            fundingModel: 'Adult skills',
            fundingAdjustmentPriorLearning: null,
            subcontractedPartnershipUKPRN: null,
            deliveryLocationPostCode: 'DN7 6BW',
            unitType: null,
            fundingType: 'DPS',
            deliveryMethodType: 'Pack only learning - In Cell/Room',
            alevelIndicator: null,
          },
          {
            prn: prisonNumber,
            establishmentId: 'WDI',
            establishmentName: 'WAKEFIELD (HMP)',
            courseName: 'GCSE Maths',
            courseCode: '246674',
            isAccredited: true,
            aimSequenceNumber: 1,
            learningStartDate: '2016-05-18',
            learningPlannedEndDate: '2016-12-23',
            learningActualEndDate: '2016-07-15',
            learnersAimType: 'Component learning aim within a programme',
            miNotionalNVQLevelV2: 'Level 5',
            sectorSubjectAreaTier1: 'Science and Mathematics',
            sectorSubjectAreaTier2: 'Science',
            occupationalIndicator: false,
            accessHEIndicator: false,
            keySkillsIndicator: false,
            functionalSkillsIndicator: false,
            gceIndicator: false,
            gcsIndicator: false,
            asLevelIndicator: false,
            a2LevelIndicator: false,
            qcfIndicator: false,
            qcfDiplomaIndicator: false,
            qcfCertificateIndicator: false,
            lrsGLH: 0,
            attendedGLH: 100,
            actualGLH: 200,
            outcome: 'No achievement',
            outcomeGrade: null,
            employmentOutcome: null,
            withdrawalReasons: 'Other',
            prisonWithdrawalReason: 'Significant ill health causing them to be unable to attend education',
            completionStatus: 'The learner has withdrawn from the learning activities leading to the learning aim',
            withdrawalReasonAgreed: true,
            fundingModel: 'Adult skills',
            fundingAdjustmentPriorLearning: null,
            subcontractedPartnershipUKPRN: null,
            deliveryLocationPostCode: 'WF2 9AG',
            unitType: 'QUALIFICATION',
            fundingType: 'Family Learning',
            deliveryMethodType: 'Pack only learning - In Cell/Room',
            alevelIndicator: false,
          },
        ],
        empty: false,
        first: true,
        last: true,
        number: 0,
        numberOfElements: 2,
        pageable: {
          sort: [],
          pageNumber: 0,
          pageSize: 10,
          offset: 0,
          unpaged: false,
          paged: true,
        },
        size: 10,
        sort: [],
        totalElements: 2,
        totalPages: 1,
      },
    },
  })

const stubLearnerEducationWithCoursesQualificationsCompletedInLast12Months = (
  prisonNumber = 'G6115VJ',
  page = 0,
): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPathPattern: `/learnerEducation/${prisonNumber}`,
      queryParameters: {
        page: { equalTo: `${page}` },
      },
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        content: [
          {
            prn: prisonNumber,
            establishmentId: 'WDI',
            establishmentName: 'WAKEFIELD (HMP)',
            courseName: 'GCSE Maths',
            courseCode: '246674',
            isAccredited: true,
            aimSequenceNumber: 1,
            learningStartDate: moment().subtract(8, 'months').toDate(),
            learningPlannedEndDate: moment().subtract(2, 'months').toDate(),
            learningActualEndDate: moment().subtract(1, 'months').toDate(),
            learnersAimType: 'Component learning aim within a programme',
            miNotionalNVQLevelV2: 'Level 5',
            sectorSubjectAreaTier1: 'Science and Mathematics',
            sectorSubjectAreaTier2: 'Science',
            occupationalIndicator: false,
            accessHEIndicator: false,
            keySkillsIndicator: false,
            functionalSkillsIndicator: false,
            gceIndicator: false,
            gcsIndicator: false,
            asLevelIndicator: false,
            a2LevelIndicator: false,
            qcfIndicator: false,
            qcfDiplomaIndicator: false,
            qcfCertificateIndicator: false,
            lrsGLH: 0,
            attendedGLH: 100,
            actualGLH: 200,
            outcome: 'No achievement',
            outcomeGrade: null,
            employmentOutcome: null,
            withdrawalReasons: 'Other',
            prisonWithdrawalReason: 'Significant ill health causing them to be unable to attend education',
            completionStatus: 'The learner has withdrawn from the learning activities leading to the learning aim',
            withdrawalReasonAgreed: true,
            fundingModel: 'Adult skills',
            fundingAdjustmentPriorLearning: null,
            subcontractedPartnershipUKPRN: null,
            deliveryLocationPostCode: 'WF2 9AG',
            unitType: 'QUALIFICATION',
            fundingType: 'Family Learning',
            deliveryMethodType: 'Pack only learning - In Cell/Room',
            alevelIndicator: false,
          },
        ],
        empty: false,
        first: true,
        last: true,
        number: 0,
        numberOfElements: 2,
        pageable: {
          sort: [],
          pageNumber: 0,
          pageSize: 10,
          offset: 0,
          unpaged: false,
          paged: true,
        },
        size: 10,
        sort: [],
        totalElements: 2,
        totalPages: 1,
      },
    },
  })

const stubLearnerEducationWithCoursesCompletedInMoreThanLast12Months = (
  prisonNumber = 'G6115VJ',
  page = 0,
): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPathPattern: `/learnerEducation/${prisonNumber}`,
      queryParameters: {
        page: { equalTo: `${page}` },
      },
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        content: [
          {
            prn: prisonNumber,
            establishmentId: 'WDI',
            establishmentName: 'WAKEFIELD (HMP)',
            courseName: 'GCSE Maths',
            courseCode: '246674',
            isAccredited: true,
            aimSequenceNumber: 1,
            learningStartDate: moment().subtract(24, 'months').toDate(),
            learningPlannedEndDate: moment().subtract(20, 'months').toDate(),
            learningActualEndDate: moment().subtract(21, 'months').toDate(),
            learnersAimType: 'Component learning aim within a programme',
            miNotionalNVQLevelV2: 'Level 5',
            sectorSubjectAreaTier1: 'Science and Mathematics',
            sectorSubjectAreaTier2: 'Science',
            occupationalIndicator: false,
            accessHEIndicator: false,
            keySkillsIndicator: false,
            functionalSkillsIndicator: false,
            gceIndicator: false,
            gcsIndicator: false,
            asLevelIndicator: false,
            a2LevelIndicator: false,
            qcfIndicator: false,
            qcfDiplomaIndicator: false,
            qcfCertificateIndicator: false,
            lrsGLH: 0,
            attendedGLH: 100,
            actualGLH: 200,
            outcome: 'No achievement',
            outcomeGrade: null,
            employmentOutcome: null,
            withdrawalReasons: 'Other',
            prisonWithdrawalReason: 'Significant ill health causing them to be unable to attend education',
            completionStatus: 'The learner has withdrawn from the learning activities leading to the learning aim',
            withdrawalReasonAgreed: true,
            fundingModel: 'Adult skills',
            fundingAdjustmentPriorLearning: null,
            subcontractedPartnershipUKPRN: null,
            deliveryLocationPostCode: 'WF2 9AG',
            unitType: 'QUALIFICATION',
            fundingType: 'Family Learning',
            deliveryMethodType: 'Pack only learning - In Cell/Room',
            alevelIndicator: false,
          },
        ],
        empty: false,
        first: true,
        last: true,
        number: 0,
        numberOfElements: 2,
        pageable: {
          sort: [],
          pageNumber: 0,
          pageSize: 10,
          offset: 0,
          unpaged: false,
          paged: true,
        },
        size: 10,
        sort: [],
        totalElements: 2,
        totalPages: 1,
      },
    },
  })

const stubLearnerEducationWithNoCoursesQualifications = (prisonNumber = 'G6115VJ', page = 0): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPathPattern: `/learnerEducation/${prisonNumber}`,
      queryParameters: {
        page: { equalTo: `${page}` },
      },
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        content: [],
        empty: false,
        first: true,
        last: true,
        number: 0,
        numberOfElements: 0,
        pageable: {
          sort: [],
          pageNumber: 0,
          pageSize: 10,
          offset: 0,
          unpaged: false,
          paged: true,
        },
        size: 10,
        sort: [],
        totalElements: 0,
        totalPages: 1,
      },
    },
  })

const stubLearnerEducation401Error = (prisonNumber = 'G6115VJ', page = 0): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPathPattern: `/learnerEducation/${prisonNumber}`,
      queryParameters: {
        page: { equalTo: `${page}` },
      },
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

const stubLearnerEducation404Error = (prisonNumber = 'G6115VJ', page = 0): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPathPattern: `/learnerEducation/${prisonNumber}`,
      queryParameters: {
        page: { equalTo: `${page}` },
      },
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

export default {
  // Stubs for Neuro Divergence API
  stubNeurodivergenceForPrisonerWithAllCategoriesOfSupportNeed,
  stubNeurodivergenceForPrisonerWithSelfDeclaredSupportNeeds,
  stubNeurodivergenceForPrisonerWithNoCurrentAssessment,
  stubNeurodivergenceForPrisonerNotInCurious,
  stubNeurodivergence401Error,
  stubNeurodivergence404Error,

  // Stubs for Learner Profile API
  stubLearnerProfile,
  stubLearnerProfile401Error,
  stubLearnerProfile404Error,

  // Stubs for Learner Education API
  stubLearnerEducation,
  stubLearnerEducationWithCoursesQualificationsCompletedInLast12Months,
  stubLearnerEducationWithCoursesCompletedInMoreThanLast12Months,
  stubLearnerEducationWithNoCoursesQualifications,
  stubLearnerEducation401Error,
  stubLearnerEducation404Error,
}
