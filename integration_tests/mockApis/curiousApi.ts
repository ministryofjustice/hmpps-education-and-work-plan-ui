import { startOfToday, subMonths } from 'date-fns'
import { SuperAgentRequest } from 'superagent'
import { stubFor } from './wiremock'

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
          rapidAssessmentDate: '2022-02-18',
          inDepthAssessmentDate: null,
          primaryLDDAndHealthProblem: 'Visual impairment',
          additionalLDDAndHealthProblems: [
            'Hearing impairment',
            'Mental health difficulty',
            'Social and emotional difficulties',
          ],
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

const stubLearnerProfileConnectionTimeoutError = (prisonNumber = 'G6115VJ'): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/learnerProfile/${prisonNumber}`,
    },
    response: {
      status: 503,
      fixedDelayMilliseconds: 6000, // response will take 6 seconds, which is longer than the configured timeout for the API in `config.ts`
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
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

const stubLearnerEducationWithCompletedCoursesInLast12Months = (
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
            learningStartDate: subMonths(startOfToday(), 8),
            learningPlannedEndDate: subMonths(startOfToday(), 2),
            learningActualEndDate: subMonths(startOfToday(), 1),
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
            prisonWithdrawalReason: null,
            completionStatus: 'The learner has completed the learning activities leading to the learning aim',
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

const stubLearnerEducationWithCompletedCoursesOlderThanLast12Months = (
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
            learningStartDate: subMonths(startOfToday(), 24),
            learningPlannedEndDate: subMonths(startOfToday(), 20),
            learningActualEndDate: subMonths(startOfToday(), 21),
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
            prisonWithdrawalReason: null,
            completionStatus: 'The learner has completed the learning activities leading to the learning aim',
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

const stubLearnerEducationWithWithdrawnCourses = (prisonNumber = 'G6115VJ', page = 0): SuperAgentRequest =>
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
            courseName: 'BTEC Bricklaying for beginners',
            courseCode: 'BTC_BRICK_001',
            isAccredited: false,
            aimSequenceNumber: 1,
            learningStartDate: '2021-04-13',
            learningPlannedEndDate: '2021-12-15',
            learningActualEndDate: '2021-08-09',
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
            prisonWithdrawalReason:
              'A period of short term absences have been agreed whilst learner concentrates on improving mental health.',
            completionStatus: 'Learner has temporarily withdrawn from the aim due to an agreed break in learning',
            withdrawalReasonAgreed: true,
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

const stubLearnerEducationWithWithdrawnAndInProgressCourses = (prisonNumber = 'G6115VJ', page = 0): SuperAgentRequest =>
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
            courseName: 'BTEC Bricklaying for beginners',
            courseCode: 'BTC_BRICK_001',
            isAccredited: false,
            aimSequenceNumber: 1,
            learningStartDate: '2021-04-13',
            learningPlannedEndDate: '2021-12-15',
            learningActualEndDate: '2024-08-09',
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
            prisonWithdrawalReason:
              'A period of short term absences have been agreed whilst learner concentrates on improving mental health.',
            completionStatus: 'Learner has temporarily withdrawn from the aim due to an agreed break in learning',
            withdrawalReasonAgreed: true,
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

const stubLearnerEducationWithNoCourses = (prisonNumber = 'G6115VJ', page = 0): SuperAgentRequest =>
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

const stubLearnerEducationConnectionTimeoutError = (prisonNumber = 'G6115VJ'): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPathPattern: `/learnerEducation/${prisonNumber}`,
    },
    response: {
      status: 503,
      fixedDelayMilliseconds: 6000, // response will take 6 seconds, which is longer than the 5 second timeout for the API config in `config.ts`
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    },
  })

export default {
  // Stubs for Learner Profile API
  stubLearnerProfile,
  stubLearnerProfile401Error,
  stubLearnerProfile404Error,
  stubLearnerProfileConnectionTimeoutError,

  // Stubs for Learner Education API
  stubLearnerEducation,
  stubLearnerEducationWithCompletedCoursesInLast12Months,
  stubLearnerEducationWithCompletedCoursesOlderThanLast12Months,
  stubLearnerEducationWithWithdrawnAndInProgressCourses,
  stubLearnerEducationWithWithdrawnCourses,
  stubLearnerEducationWithNoCourses,
  stubLearnerEducation401Error,
  stubLearnerEducation404Error,
  stubLearnerEducationConnectionTimeoutError,
}
