import { SuperAgentRequest } from 'superagent'
import { stubFor } from '../wiremock'
import HopingToGetWorkValue from '../../../server/enums/hopingToGetWorkValue'
import HasWorkedBeforeValue from '../../../server/enums/hasWorkedBeforeValue'

const stubGetInduction = (options?: {
  prisonNumber?: string
  hopingToGetWork?: HopingToGetWorkValue
  hasWorkedBefore?: HasWorkedBeforeValue
  hasQualifications?: boolean
}): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/inductions/${options?.prisonNumber || 'G6115VJ'}`,
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        reference: '814ade0a-a3b2-46a3-862f-79211ba13f7b',
        prisonNumber: options?.prisonNumber || 'G6115VJ',
        createdBy: 'A_USER_GEN',
        createdByDisplayName: 'Alex Smith',
        createdAt: '2023-08-29T11:29:22.8793',
        createdAtPrison: 'MDI',
        updatedBy: 'A_USER_GEN',
        updatedByDisplayName: 'Alex Smith',
        updatedAt: '2023-08-29T10:29:22.457',
        updatedAtPrison: 'MDI',
        workOnRelease: {
          reference: 'bdebe39f-6f85-459b-81be-a26341c3fe3c',
          createdBy: 'A_USER_GEN',
          createdByDisplayName: 'Alex Smith',
          createdAt: '2023-08-29T11:29:22.8793',
          createdAtPrison: 'MDI',
          updatedBy: 'A_USER_GEN',
          updatedByDisplayName: 'Alex Smith',
          updatedAt: '2023-08-29T10:29:22.457',
          updatedAtPrison: 'MDI',
          hopingToWork: options?.hopingToGetWork || HopingToGetWorkValue.YES,
          affectAbilityToWork: ['LIMITED_BY_OFFENCE', 'OTHER'],
          affectAbilityToWorkOther: 'Live in the wrong location',
        },
        previousQualifications: {
          reference: 'dea24acc-fde5-4ead-a9eb-e1757de2542c',
          createdBy: 'A_USER_GEN',
          createdByDisplayName: 'Alex Smith',
          createdAt: '2023-08-29T11:29:22.8793',
          createdAtPrison: 'MDI',
          updatedBy: 'A_USER_GEN',
          updatedByDisplayName: 'Alex Smith',
          updatedAt: '2023-08-29T10:29:22.457',
          updatedAtPrison: 'MDI',
          educationLevel: 'UNDERGRADUATE_DEGREE_AT_UNIVERSITY',
          qualifications:
            !options ||
            options.hasQualifications === null ||
            options.hasQualifications === undefined ||
            options.hasQualifications === true
              ? [
                  {
                    reference: '45b969cc-00c8-41c9-8a79-133d2ccf6326',
                    subject: 'French',
                    grade: 'C',
                    level: 'LEVEL_3',
                    createdBy: 'A_USER_GEN',
                    createdAt: '2023-08-29T11:29:22.8793',
                  },
                  {
                    reference: '99b56087-3e92-45b1-9082-c609976bbedb',
                    subject: 'Maths',
                    grade: 'A',
                    level: 'LEVEL_3',
                    createdBy: 'A_USER_GEN',
                    createdAt: '2023-08-29T11:29:22.8793',
                  },
                  {
                    reference: 'cd1f3651-04f0-448b-8fec-0e8953d95e01',
                    subject: 'Maths',
                    grade: '1st',
                    level: 'LEVEL_6',
                    createdBy: 'A_USER_GEN',
                    createdAt: '2023-08-29T11:29:22.8793',
                  },
                  {
                    reference: 'cc3e2441-88d1-4474-b483-207b33d143b3',
                    subject: 'English',
                    grade: 'A',
                    level: 'LEVEL_3',
                    createdBy: 'A_USER_GEN',
                    createdAt: '2023-08-29T11:29:22.8793',
                  },
                ]
              : [],
        },
        previousTraining: {
          reference: 'a8e1fe50-1e3b-4784-a27f-ee1c54fc7616',
          createdBy: 'A_USER_GEN',
          createdByDisplayName: 'Alex Smith',
          createdAt: '2023-08-29T11:29:22.8793',
          createdAtPrison: 'MDI',
          updatedBy: 'A_USER_GEN',
          updatedByDisplayName: 'Alex Smith',
          updatedAt: '2023-08-29T10:29:22.457',
          updatedAtPrison: 'MDI',
          trainingTypes: ['FULL_UK_DRIVING_LICENCE', 'HGV_LICENCE', 'OTHER'],
          trainingTypeOther: 'Accountancy Certification',
        },
        previousWorkExperiences: {
          reference: 'bb45462e-8225-490d-8c1c-ad6692223d4d',
          createdBy: 'A_USER_GEN',
          createdByDisplayName: 'Alex Smith',
          createdAt: '2023-08-29T11:29:22.8793',
          createdAtPrison: 'MDI',
          updatedBy: 'A_USER_GEN',
          updatedByDisplayName: 'Alex Smith',
          updatedAt: '2023-08-29T10:29:22.457',
          updatedAtPrison: 'MDI',
          hasWorkedBefore: options?.hasWorkedBefore || HasWorkedBeforeValue.YES,
          experiences:
            (options?.hasWorkedBefore || HasWorkedBeforeValue.YES) === HasWorkedBeforeValue.YES
              ? [
                  {
                    experienceType: 'OFFICE',
                    experienceTypeOther: null,
                    role: 'Accountant',
                    details: 'Some daily tasks',
                  },
                  {
                    experienceType: 'OTHER',
                    experienceTypeOther: 'Finance',
                    role: 'Trader',
                    details: 'Some trading tasks',
                  },
                ]
              : [],
        },
        futureWorkInterests: {
          reference: 'cad34670-691d-4862-8014-dc08a6f620b9',
          createdBy: 'A_USER_GEN',
          createdByDisplayName: 'Alex Smith',
          createdAt: '2023-08-29T11:29:22.8793',
          createdAtPrison: 'MDI',
          updatedBy: 'A_USER_GEN',
          updatedByDisplayName: 'Alex Smith',
          updatedAt: '2023-08-29T10:29:22.457',
          updatedAtPrison: 'MDI',
          interests: [
            {
              workType: 'WASTE_MANAGEMENT',
              role: 'Bin man',
            },
            {
              workType: 'CONSTRUCTION',
            },
            {
              workType: 'OTHER',
              workTypeOther: 'Renewable energy',
            },
          ],
        },
        personalSkillsAndInterests: {
          reference: '517c470f-f9b5-4d49-9148-4458fe358439',
          createdBy: 'A_USER_GEN',
          createdByDisplayName: 'Alex Smith',
          createdAt: '2023-08-29T11:29:22.8793',
          createdAtPrison: 'MDI',
          updatedBy: 'A_USER_GEN',
          updatedByDisplayName: 'Alex Smith',
          updatedAt: '2023-08-29T10:29:22.457',
          updatedAtPrison: 'MDI',
          skills: [
            {
              skillType: 'COMMUNICATION',
              skillTypeOther: null,
            },
            {
              skillType: 'POSITIVE_ATTITUDE',
              skillTypeOther: null,
            },
            {
              skillType: 'THINKING_AND_PROBLEM_SOLVING',
              skillTypeOther: null,
            },
            {
              skillType: 'OTHER',
              skillTypeOther: 'Logical thinking',
            },
          ],
          interests: [
            {
              interestType: 'CREATIVE',
              interestTypeOther: null,
            },
            {
              interestType: 'DIGITAL',
              interestTypeOther: null,
            },
            {
              interestType: 'SOLO_ACTIVITIES',
              interestTypeOther: null,
            },
            {
              interestType: 'OTHER',
              interestTypeOther: 'Car boot sales',
            },
          ],
        },
        inPrisonInterests: {
          reference: 'ae6a6a94-df32-4a90-b39d-ff1a100a6da0',
          createdBy: 'A_USER_GEN',
          createdByDisplayName: 'Alex Smith',
          createdAt: '2023-08-29T11:29:22.8793',
          createdAtPrison: 'MDI',
          updatedBy: 'A_USER_GEN',
          updatedByDisplayName: 'Alex Smith',
          updatedAt: '2023-06-19T09:39:44Z',
          updatedAtPrison: 'MDI',
          inPrisonWorkInterests: [
            {
              workType: 'MAINTENANCE',
              workTypeOther: null,
            },
          ],
          inPrisonTrainingInterests: [
            {
              trainingType: 'MACHINERY_TICKETS',
              trainingTypeOther: null,
            },
          ],
        },
      },
    },
  })

const stubGetOriginalQuestionSetInduction = (options: {
  prisonNumber?: string
  questionSet: 'LONG' | 'SHORT'
}): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/inductions/${options.prisonNumber || 'G6115VJ'}`,
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        reference: '814ade0a-a3b2-46a3-862f-79211ba13f7b',
        prisonNumber: options.prisonNumber || 'G6115VJ',
        createdBy: 'A_USER_GEN',
        createdByDisplayName: 'Alex Smith',
        createdAt: '2023-08-29T11:29:22.8793',
        createdAtPrison: 'MDI',
        updatedBy: 'A_USER_GEN',
        updatedByDisplayName: 'Alex Smith',
        updatedAt: '2023-08-29T10:29:22.457',
        updatedAtPrison: 'MDI',
        workOnRelease: {
          reference: 'bdebe39f-6f85-459b-81be-a26341c3fe3c',
          createdBy: 'A_USER_GEN',
          createdByDisplayName: 'Alex Smith',
          createdAt: '2023-08-29T11:29:22.8793',
          createdAtPrison: 'MDI',
          updatedBy: 'A_USER_GEN',
          updatedByDisplayName: 'Alex Smith',
          updatedAt: '2023-08-29T10:29:22.457',
          updatedAtPrison: 'MDI',
          hopingToWork: options.questionSet === 'LONG' ? 'YES' : 'NO',
          affectAbilityToWork: ['LIMITED_BY_OFFENCE', 'OTHER'],
          affectAbilityToWorkOther: 'Live in the wrong location',
        },
        previousQualifications: {
          reference: 'dea24acc-fde5-4ead-a9eb-e1757de2542c',
          createdBy: 'A_USER_GEN',
          createdByDisplayName: 'Alex Smith',
          createdAt: '2023-08-29T11:29:22.8793',
          createdAtPrison: 'MDI',
          updatedBy: 'A_USER_GEN',
          updatedByDisplayName: 'Alex Smith',
          updatedAt: '2023-08-29T10:29:22.457',
          updatedAtPrison: 'MDI',
          educationLevel: options.questionSet === 'LONG' ? 'UNDERGRADUATE_DEGREE_AT_UNIVERSITY' : undefined,
          qualifications: [
            {
              subject: 'French',
              grade: 'C',
              level: 'LEVEL_3',
            },
            {
              subject: 'Maths',
              grade: 'A',
              level: 'LEVEL_3',
            },
            {
              subject: 'Maths',
              grade: '1st',
              level: 'LEVEL_6',
            },
            {
              subject: 'English',
              grade: 'A',
              level: 'LEVEL_3',
            },
          ],
        },
        previousTraining: {
          reference: 'a8e1fe50-1e3b-4784-a27f-ee1c54fc7616',
          createdBy: 'A_USER_GEN',
          createdByDisplayName: 'Alex Smith',
          createdAt: '2023-08-29T11:29:22.8793',
          createdAtPrison: 'MDI',
          updatedBy: 'A_USER_GEN',
          updatedByDisplayName: 'Alex Smith',
          updatedAt: '2023-08-29T10:29:22.457',
          updatedAtPrison: 'MDI',
          trainingTypes: ['FULL_UK_DRIVING_LICENCE', 'HGV_LICENCE', 'OTHER'],
          trainingTypeOther: 'Accountancy Certification',
        },
        inPrisonInterests:
          options.questionSet === 'SHORT'
            ? {
                reference: 'ae6a6a94-df32-4a90-b39d-ff1a100a6da0',
                createdBy: 'A_USER_GEN',
                createdByDisplayName: 'Alex Smith',
                createdAt: '2023-08-29T11:29:22.8793',
                createdAtPrison: 'MDI',
                updatedBy: 'A_USER_GEN',
                updatedByDisplayName: 'Alex Smith',
                updatedAt: '2023-06-19T09:39:44Z',
                updatedAtPrison: 'MDI',
                inPrisonWorkInterests: [
                  {
                    workType: 'MAINTENANCE',
                    workTypeOther: null,
                  },
                ],
                inPrisonTrainingInterests: [
                  {
                    trainingType: 'MACHINERY_TICKETS',
                    trainingTypeOther: null,
                  },
                ],
              }
            : {},
        previousWorkExperiences:
          options.questionSet === 'LONG'
            ? {
                reference: 'bb45462e-8225-490d-8c1c-ad6692223d4d',
                createdBy: 'A_USER_GEN',
                createdByDisplayName: 'Alex Smith',
                createdAt: '2023-08-29T11:29:22.8793',
                createdAtPrison: 'MDI',
                updatedBy: 'A_USER_GEN',
                updatedByDisplayName: 'Alex Smith',
                updatedAt: '2023-08-29T10:29:22.457',
                updatedAtPrison: 'MDI',
                hasWorkedBefore: 'YES',
                experiences: [
                  {
                    experienceType: 'OFFICE',
                    experienceTypeOther: null,
                    role: 'Accountant',
                    details: 'Some daily tasks',
                  },
                  {
                    experienceType: 'OTHER',
                    experienceTypeOther: 'Finance',
                    role: 'Trader',
                    details: 'Some trading tasks',
                  },
                ],
              }
            : {},
        futureWorkInterests:
          options.questionSet === 'LONG'
            ? {
                reference: 'cad34670-691d-4862-8014-dc08a6f620b9',
                createdBy: 'A_USER_GEN',
                createdByDisplayName: 'Alex Smith',
                createdAt: '2023-08-29T11:29:22.8793',
                createdAtPrison: 'MDI',
                updatedBy: 'A_USER_GEN',
                updatedByDisplayName: 'Alex Smith',
                updatedAt: '2023-08-29T10:29:22.457',
                updatedAtPrison: 'MDI',
                interests: [
                  {
                    workType: 'WASTE_MANAGEMENT',
                    role: 'Bin man',
                  },
                  {
                    workType: 'CONSTRUCTION',
                  },
                  {
                    workType: 'OTHER',
                    workTypeOther: 'Renewable energy',
                  },
                ],
              }
            : {},
        personalSkillsAndInterests:
          options.questionSet === 'LONG'
            ? {
                reference: '517c470f-f9b5-4d49-9148-4458fe358439',
                createdBy: 'A_USER_GEN',
                createdByDisplayName: 'Alex Smith',
                createdAt: '2023-08-29T11:29:22.8793',
                createdAtPrison: 'MDI',
                updatedBy: 'A_USER_GEN',
                updatedByDisplayName: 'Alex Smith',
                updatedAt: '2023-08-29T10:29:22.457',
                updatedAtPrison: 'MDI',
                skills: [
                  {
                    skillType: 'COMMUNICATION',
                    skillTypeOther: null,
                  },
                  {
                    skillType: 'POSITIVE_ATTITUDE',
                    skillTypeOther: null,
                  },
                  {
                    skillType: 'THINKING_AND_PROBLEM_SOLVING',
                    skillTypeOther: null,
                  },
                  {
                    skillType: 'OTHER',
                    skillTypeOther: 'Logical thinking',
                  },
                ],
                interests: [
                  {
                    interestType: 'CREATIVE',
                    interestTypeOther: null,
                  },
                  {
                    interestType: 'DIGITAL',
                    interestTypeOther: null,
                  },
                  {
                    interestType: 'SOLO_ACTIVITIES',
                    interestTypeOther: null,
                  },
                  {
                    interestType: 'OTHER',
                    interestTypeOther: 'Car boot sales',
                  },
                ],
              }
            : {},
      },
    },
  })

const stubGetInduction404Error = (prisonNumber = 'G6115VJ'): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/inductions/${prisonNumber}`,
    },
    response: {
      status: 404,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        status: 404,
        errorCode: null,
        userMessage: `Induction not found for prisoner [${prisonNumber}]`,
        developerMessage: `Induction not found for prisoner [${prisonNumber}]`,
        moreInfo: null,
      },
    },
  })

const stubGetInduction500Error = (prisonNumber = 'G6115VJ'): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/inductions/${prisonNumber}`,
    },
    response: {
      status: 500,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        status: 500,
        errorCode: null,
        userMessage: 'An unexpected error occurred',
        developerMessage: 'An unexpected error occurred',
        moreInfo: null,
      },
    },
  })

const stubUpdateInduction = (prisonNumber = 'G6115VJ'): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'PUT',
      urlPattern: `/inductions/${prisonNumber}`,
    },
    response: {
      status: 204,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    },
  })

const stubUpdateInduction500Error = (prisonNumber = 'G6115VJ'): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'PUT',
      urlPattern: `/inductions/${prisonNumber}`,
    },
    response: {
      status: 500,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        status: 500,
        errorCode: null,
        userMessage: 'An unexpected error occurred',
        developerMessage: 'An unexpected error occurred',
        moreInfo: null,
      },
    },
  })

const stubUpdateInduction400Error = (prisonNumber = 'G6115VJ'): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'PUT',
      urlPattern: `/inductions/${prisonNumber}`,
    },
    response: {
      status: 400,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        status: 400,
        errorCode: null,
        userMessage: 'Bad request',
        developerMessage: 'Bad request',
        moreInfo: null,
      },
    },
  })

const stubCreateInduction = (prisonNumber = 'G6115VJ'): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'POST',
      urlPattern: `/inductions/${prisonNumber}`,
    },
    response: {
      status: 201,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    },
  })

const stubCreateInduction500Error = (prisonNumber = 'G6115VJ'): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'POST',
      urlPattern: `/inductions/${prisonNumber}`,
    },
    response: {
      status: 500,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        status: 500,
        errorCode: null,
        userMessage: 'An unexpected error occurred',
        developerMessage: 'An unexpected error occurred',
        moreInfo: null,
      },
    },
  })

const stubCreateInduction400Error = (prisonNumber = 'G6115VJ'): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'POST',
      urlPattern: `/inductions/${prisonNumber}`,
    },
    response: {
      status: 400,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        status: 400,
        errorCode: null,
        userMessage: 'Bad request',
        developerMessage: 'Bad request',
        moreInfo: null,
      },
    },
  })

export default {
  stubGetInduction,
  stubGetOriginalQuestionSetInduction,
  stubGetInduction404Error,
  stubGetInduction500Error,

  stubUpdateInduction,
  stubUpdateInduction500Error,
  stubUpdateInduction400Error,
  stubCreateInduction,
  stubCreateInduction500Error,
  stubCreateInduction400Error,
}
