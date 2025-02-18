import type { PrisonerSearchSummary } from 'viewModels'
import type { SessionResponse } from 'educationAndWorkPlanApiClient'
import { addDays, format, startOfToday } from 'date-fns'
import { randomUUID } from 'crypto'
import { SuperAgentRequest } from 'superagent'
import { stubFor } from './wiremock'
import actionPlans from '../mockData/actionPlanByPrisonNumberData'
import timelinesKeyedByPrisonNumber from '../mockData/timelineData'
import stubPing from './common'
import HopingToGetWorkValue from '../../server/enums/hopingToGetWorkValue'
import HasWorkedBeforeValue from '../../server/enums/hasWorkedBeforeValue'
import GoalStatusValue from '../../server/enums/goalStatusValue'
import EducationLevelValue from '../../server/enums/educationLevelValue'
import QualificationLevelValue from '../../server/enums/qualificationLevelValue'
import InductionScheduleStatusValue from '../../server/enums/inductionScheduleStatusValue'
import SessionStatusValue from '../../server/enums/sessionStatusValue'

const createGoals = (): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'POST',
      urlPattern: '/action-plans/.*/goals',
    },
    response: {
      status: 201,
    },
  })

const getGoalsByStatus = (
  conf: { prisonNumber: string; status?: GoalStatusValue; goals?: [] } = {
    prisonNumber: 'G6115VJ',
    status: GoalStatusValue.ACTIVE,
    goals: undefined,
  },
): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/action-plans/${conf.prisonNumber}/goals\\?status=${conf.status}`,
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        goals: conf.goals || actionPlans[conf.prisonNumber].response.jsonBody.goals,
      },
    },
  })

const getGoalsByStatus500 = (
  conf: { prisonNumber: string; status?: GoalStatusValue } = {
    prisonNumber: 'G6115VJ',
    status: GoalStatusValue.ACTIVE,
  },
): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/action-plans/${conf.prisonNumber}/goals\\?status=${conf.status}`,
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

const getGoalsByStatus404 = (
  conf: { prisonNumber: string; status?: GoalStatusValue } = {
    prisonNumber: 'G6115VJ',
    status: GoalStatusValue.ACTIVE,
  },
): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/action-plans/${conf.prisonNumber}/goals\\?status=${conf.status}`,
    },
    response: {
      status: 404,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        status: 404,
        errorCode: null,
        userMessage: 'No goals added yet',
        developerMessage: 'No goals added yet',
        moreInfo: null,
      },
    },
  })

const updateGoal = (
  prisonNumber = 'G6115VJ',
  goalReference = '10efc562-be8f-4675-9283-9ede0c19dade',
): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'PUT',
      urlPattern: `/action-plans/${prisonNumber}/goals/${goalReference}`,
    },
    response: {
      status: 204,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    },
  })

const updateGoal500Error = (
  prisonNumber = 'G6115VJ',
  goalReference = '10efc562-be8f-4675-9283-9ede0c19dade',
): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'PUT',
      urlPattern: `/action-plans/${prisonNumber}/goals/${goalReference}`,
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

const createActionPlan = (): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'POST',
      urlPattern: '/action-plans/.*',
    },
    response: {
      status: 201,
    },
  })

const getActionPlan = (prisonNumber = 'G6115VJ'): SuperAgentRequest => stubFor(actionPlans[prisonNumber])

const getActionPlan404Error = (prisonNumber = 'G6115VJ'): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/action-plans/${prisonNumber}`,
    },
    response: {
      status: 404,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        status: 404,
        errorCode: null,
        userMessage: `Unable to find ActionPlan for prisoner [${prisonNumber}]`,
        developerMessage: `Unable to find ActionPlan for prisoner [${prisonNumber}]`,
        moreInfo: null,
      },
    },
  })

const getActionPlan500Error = (prisonNumber = 'G6115VJ'): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/action-plans/${prisonNumber}`,
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

const stubActionPlansList = (): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'POST',
      urlPattern: '/action-plans',
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        actionPlanSummaries: [
          {
            reference: '814ade0a-a3b2-46a3-862f-79211ba13f7b',
            prisonNumber: 'A1234BC',
            reviewDate: '2024-12-19',
          },
        ],
      },
    },
  })

const stubActionPlansListFromPrisonerSearchSummaries = (
  prisonerSearchSummaries: Array<PrisonerSearchSummary>,
): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'POST',
      urlPattern: '/action-plans',
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        actionPlanSummaries: prisonerSearchSummaries
          .filter(prisonerSearchSummary => prisonerSearchSummary.hasCiagInduction)
          .map(prisonerSearchSummary => {
            return {
              reference: randomUUID(),
              prisonNumber: prisonerSearchSummary.prisonNumber,
              reviewDate: randomReviewDate(),
            }
          }),
      },
    },
  })

const stubActionPlansList500error = (): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'POST',
      urlPattern: `/action-plans`,
    },
    response: {
      status: 500,
      body: 'Unexpected error',
    },
  })

const stubGetTimeline = (prisonNumber = 'G6115VJ'): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/timelines/${prisonNumber}`,
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: timelinesKeyedByPrisonNumber[prisonNumber],
    },
  })

const stubGetTimeline404Error = (prisonNumber = 'G6115VJ'): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/timelines/${prisonNumber}`,
    },
    response: {
      status: 404,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        status: 404,
        errorCode: null,
        userMessage: `Timeline not found for prisoner ${prisonNumber}`,
        developerMessage: `Timeline not found for prisoner ${prisonNumber}`,
        moreInfo: null,
      },
    },
  })

const stubGetTimeline500Error = (prisonNumber = 'G6115VJ'): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/timelines/${prisonNumber}`,
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

const archiveGoal = (
  options: {
    prisonNumber: string
    goalReference: string
  } = {
    prisonNumber: 'G6115VJ',
    goalReference: '10efc562-be8f-4675-9283-9ede0c19dade',
  },
): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'PUT',
      urlPattern: `/action-plans/${options.prisonNumber}/goals/${options.goalReference}/archive`,
    },
    response: {
      status: 204,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    },
  })

const unarchiveGoal = (
  prisonNumber = 'G6115VJ',
  goalReference = '10efc562-be8f-4675-9283-9ede0c19dade',
): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'PUT',
      urlPattern: `/action-plans/${prisonNumber}/goals/${goalReference}/unarchive`,
    },
    response: {
      status: 204,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    },
  })

const completeGoal = (
  options: {
    prisonNumber: string
    goalReference: string
  } = {
    prisonNumber: 'G6115VJ',
    goalReference: '10efc562-be8f-4675-9283-9ede0c19dade',
  },
): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'PUT',
      urlPattern: `/action-plans/${options.prisonNumber}/goals/${options.goalReference}/complete`,
    },
    response: {
      status: 204,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    },
  })

const stubCreateEducation = (prisonNumber = 'G6115VJ'): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'POST',
      urlPattern: `/person/${prisonNumber}/education`,
    },
    response: {
      status: 201,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    },
  })

const stubUpdateEducation = (prisonNumber = 'G6115VJ'): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'PUT',
      urlPattern: `/person/${prisonNumber}/education`,
    },
    response: {
      status: 201,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    },
  })

const stubGetEducation = (options?: { prisonNumber?: string; hasQualifications?: boolean }): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/person/${options?.prisonNumber || 'G6115VJ'}/education`,
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        prisonNumber: options?.prisonNumber || 'G6115VJ',
        reference: 'dea24acc-fde5-4ead-a9eb-e1757de2542c',
        educationLevel: EducationLevelValue.SECONDARY_SCHOOL_TOOK_EXAMS,
        qualifications:
          !options ||
          options.hasQualifications === null ||
          options.hasQualifications === undefined ||
          options.hasQualifications === true
            ? [
                {
                  reference: '814ade0a-a3b2-46a3-862f-79211ba13f7b',
                  subject: 'Pottery',
                  grade: 'C',
                  level: QualificationLevelValue.LEVEL_4,
                  createdBy: 'asmith_gen',
                  createdAt: new Date('2023-06-19T09:39:44Z'),
                  createdAtPrison: 'BXI',
                  updatedBy: 'asmith_gen',
                  updatedAt: new Date('2023-06-19T09:39:44Z'),
                  updatedAtPrison: 'BXI',
                },
              ]
            : [],
        createdBy: 'asmith_gen',
        createdByDisplayName: 'Alex Smith',
        createdAt: new Date('2023-06-19T09:39:44Z'),
        createdAtPrison: 'BXI',
        updatedBy: 'asmith_gen',
        updatedByDisplayName: 'Alex Smith',
        updatedAt: new Date('2023-06-19T09:39:44Z'),
        updatedAtPrison: 'BXI',
      },
    },
  })

const stubGetEducation500Error = (prisonNumber = 'G6115VJ'): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/person/${prisonNumber}/education`,
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

const stubGetEducation404Error = (prisonNumber = 'G6115VJ'): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/person/${prisonNumber}/education`,
    },
    response: {
      status: 404,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        status: 404,
        errorCode: null,
        userMessage: 'No education added yet',
        developerMessage: 'No education added yet',
        moreInfo: null,
      },
    },
  })

const stubGetActionPlanReviews = (prisonNumber = 'G6115VJ'): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/action-plans/${prisonNumber}/reviews`,
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        completedReviews: [
          {
            reference: '814ade0a-a3b2-46a3-862f-79211ba13f7b',
            deadlineDate: '2024-10-15',
            completedDate: '2024-10-01',
            note: {
              reference: '8092b80e-4d60-418f-983a-da457ff8df40',
              content: 'Review went well and goals on target for completion',
              type: 'REVIEW',
              createdAt: '2023-01-16T09:34:12.453Z',
              createdBy: 'asmith_gen',
              createdByDisplayName: 'Alex Smith',
              createdAtPrisonName: 'Brixton (HMP)',
              updatedAt: '2023-09-23T13:42:01.401Z',
              updatedBy: 'asmith_gen',
              updatedByDisplayName: 'Alex Smith',
              updatedAtPrisonName: 'Brixton (HMP)',
            },
            createdAt: '2023-06-19T09:39:44.000Z',
            createdAtPrison: 'Moorland (HMP & YOI)',
            createdBy: 'asmith_gen',
            createdByDisplayName: 'Alex Smith',
          },
        ],
        latestReviewSchedule: {
          reference: '814ade0a-a3b2-46a3-862f-79211ba13f7b',
          reviewDateFrom: '2024-09-15',
          reviewDateTo: '2024-10-15',
          calculationRule: 'BETWEEN_6_AND_12_MONTHS_TO_SERVE',
          status: 'SCHEDULED',
          createdAt: '2023-06-19T09:39:44.000Z',
          createdAtPrison: 'Moorland (HMP & YOI)',
          createdBy: 'asmith_gen',
          createdByDisplayName: 'Alex Smith',
          updatedAt: '2023-06-19T09:39:44.000Z',
          updatedAtPrison: 'Moorland (HMP & YOI)',
          updatedBy: 'asmith_gen',
          updatedByDisplayName: 'Alex Smith',
        },
      },
    },
  })

const stubGetActionPlanReviews404Error = (prisonNumber = 'G6115VJ'): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/action-plans/${prisonNumber}/reviews`,
    },
    response: {
      status: 404,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        status: 404,
        errorCode: null,
        userMessage: `Review Schedule not found for prisoner ${prisonNumber}`,
        developerMessage: `Review Schedule not found for prisoner ${prisonNumber}`,
        moreInfo: null,
      },
    },
  })

const stubGetActionPlanReviews500Error = (prisonNumber = 'G6115VJ'): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/action-plans/${prisonNumber}/reviews`,
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

const stubCreateActionPlanReview = (): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'POST',
      urlPattern: '/action-plans/.*/reviews',
    },
    response: {
      status: 201,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        wasLastReviewBeforeRelease: false,
        latestReviewSchedule: {
          reference: '449b3d22-9a54-44f8-8883-1dfc0a5f35cb',
          reviewDateFrom: '2025-03-14',
          reviewDateTo: '2025-04-14',
          status: 'SCHEDULED',
          calculationRule: 'BETWEEN_6_AND_12_MONTHS_TO_SERVE',
          createdBy: 'A_USER_GEN',
          createdByDisplayName: 'Alex Smith',
          createdAt: '2023-08-29T11:29:22.8793',
          createdAtPrison: 'MDI',
          updatedBy: 'A_USER_GEN',
          updatedByDisplayName: 'Alex Smith',
          updatedAt: '2023-08-29T10:29:22.457',
          updatedAtPrison: 'MDI',
        },
      },
    },
  })

const stubUpdateActionPlanReviewScheduleStatus = (): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'PUT',
      urlPattern: '/action-plans/.*/reviews/schedule-status',
    },
    response: {
      status: 204,
    },
  })

const stubUpdateActionPlanReviewScheduleStatus500Error = (): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'PUT',
      urlPattern: '/action-plans/.*/reviews/schedule-status',
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

const stubGetInductionSchedule = (options?: {
  prisonNumber?: string
  deadlineDate?: Date
  scheduleStatus?: InductionScheduleStatusValue
}): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/inductions/${options?.prisonNumber || 'G6115VJ'}/induction-schedule`,
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        reference: '814ade0a-a3b2-46a3-862f-79211ba13f7b',
        prisonNumber: options?.prisonNumber || 'G6115VJ',
        deadlineDate: options?.deadlineDate ? format(options.deadlineDate, 'yyyy-MM-dd') : '2025-02-20',
        scheduleCalculationRule: 'NEW_PRISON_ADMISSION',
        scheduleStatus: options?.scheduleStatus || 'COMPLETED',
        inductionPerformedBy: undefined,
        inductionPerformedAt: undefined,
        createdAt: '2023-06-19T09:39:44.000Z',
        createdAtPrison: 'Moorland (HMP & YOI)',
        createdBy: 'asmith_gen',
        createdByDisplayName: 'Alex Smith',
        updatedAt: '2023-06-19T09:39:44.000Z',
        updatedAtPrison: 'Moorland (HMP & YOI)',
        updatedBy: 'asmith_gen',
        updatedByDisplayName: 'Alex Smith',
      },
    },
  })

const stubGetInductionSchedule404Error = (prisonNumber = 'G6115VJ'): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/inductions/${prisonNumber}/induction-schedule`,
    },
    response: {
      status: 404,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        status: 404,
        errorCode: null,
        userMessage: `Induction Schedule not found for prisoner ${prisonNumber}`,
        developerMessage: `Induction Schedule not found for prisoner ${prisonNumber}`,
        moreInfo: null,
      },
    },
  })

const stubGetInductionSchedule500Error = (prisonNumber = 'G6115VJ'): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/inductions/${prisonNumber}/induction-schedule`,
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

const stubUpdateInductionScheduleStatus = (): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'PUT',
      urlPattern: '/inductions/.*/induction-schedule',
    },
    response: {
      status: 204,
    },
  })

const stubUpdateInductionScheduleStatus500Error = (): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'PUT',
      urlPattern: '/inductions/.*/induction-schedule',
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

const stubGetSessionSummary = (): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/session/[A-Z]{3}/summary`,
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        overdueReviews: 1,
        overdueInductions: 2,
        dueReviews: 3,
        dueInductions: 4,
        exemptReviews: 5,
        exemptInductions: 6,
      },
    },
  })

const stubGetSessionSummary404Error = (): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/session/[A-Z]{3}/summary`,
    },
    response: {
      status: 404,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        status: 404,
        errorCode: null,
        userMessage: 'Session Summary not found for prison',
        developerMessage: 'Session Summary not found for prison',
        moreInfo: null,
      },
    },
  })

const stubGetSessionSummary500Error = (): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/session/[A-Z]{3}/summary`,
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

const stubGetSessionsForPrisoners = (options: {
  prisonerSessions: Array<SessionResponse>
  status: SessionStatusValue
}): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'POST',
      urlPathPattern: `/session/summary`,
      queryParameters: {
        status: { equalTo: options.status },
      },
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        sessions: options.prisonerSessions,
      },
    },
  })

const stubGetSessionsForPrisoners500Error = (status: SessionStatusValue): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'POST',
      urlPathPattern: `/session/summary`,
      queryParameters: {
        status: { equalTo: status },
      },
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

export default {
  createGoals,

  getGoalsByStatus,
  getGoalsByStatus404,
  getGoalsByStatus500,

  stubCreateEducation,
  stubUpdateEducation,
  stubGetEducation,
  stubGetEducation500Error,
  stubGetEducation404Error,

  updateGoal,
  updateGoal500Error,
  archiveGoal,
  completeGoal,
  unarchiveGoal,

  createActionPlan,
  getActionPlan,
  getActionPlan404Error,
  getActionPlan500Error,

  stubActionPlansList,
  stubActionPlansListFromPrisonerSearchSummaries,
  stubActionPlansList500error,

  stubGetTimeline,
  stubGetTimeline404Error,
  stubGetTimeline500Error,

  stubGetInduction,
  stubGetOriginalQuestionSetInduction,
  stubGetInduction404Error,
  stubGetInduction500Error,

  stubUpdateInduction,
  stubUpdateInduction500Error,
  stubCreateInduction,
  stubCreateInduction500Error,

  stubGetActionPlanReviews,
  stubGetActionPlanReviews404Error,
  stubGetActionPlanReviews500Error,
  stubCreateActionPlanReview,

  stubUpdateActionPlanReviewScheduleStatus,
  stubUpdateActionPlanReviewScheduleStatus500Error,

  stubGetInductionSchedule,
  stubGetInductionSchedule404Error,
  stubGetInductionSchedule500Error,
  stubUpdateInductionScheduleStatus,
  stubUpdateInductionScheduleStatus500Error,

  stubGetSessionSummary,
  stubGetSessionSummary404Error,
  stubGetSessionSummary500Error,

  stubGetSessionsForPrisoners,
  stubGetSessionsForPrisoners500Error,

  stubEducationAndWorkPlanApiPing: stubPing(),
}

/**
 * Returns a random date sometime between 30 days and 365 days years after today; or undefined.
 * Approximately 5% will return undefined, meaning the action plan has no review date.
 */
const randomReviewDate = (): string | undefined =>
  randomNumber(1, 100) > 5 ? format(addDays(startOfToday(), randomNumber(30, 5475)), 'yyyy-MM-dd') : undefined

const randomNumber = (min: number, max: number): number => Math.floor(Math.random() * (max - min) + min)
