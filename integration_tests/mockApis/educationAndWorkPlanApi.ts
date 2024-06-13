import type { PrisonerSearchSummary } from 'viewModels'
import { addDays, format, startOfToday } from 'date-fns'
import { randomUUID } from 'crypto'
import { SuperAgentRequest } from 'superagent'
import { stubFor } from './wiremock'
import actionPlans from '../mockData/actionPlanByPrisonNumberData'
import timelinesKeyedByPrisonNumber from '../mockData/timelineData'
import stubPing from './common'

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

const getActionPlan = (id = 'G6115VJ'): SuperAgentRequest => stubFor(actionPlans[id])

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

const getActionPlanForPrisonerWithNoGoals = (prisonNumber = 'G6115VJ'): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/action-plans/${prisonNumber}`,
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        prisonerNumber: `${prisonNumber}`,
        goals: [],
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

const stubGetInductionLongQuestionSet = (prisonNumber = 'G6115VJ'): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/inductions/${prisonNumber}`,
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        reference: '814ade0a-a3b2-46a3-862f-79211ba13f7b',
        prisonNumber,
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
          hopingToWork: 'YES',
          affectAbilityToWork: ['LIMITED_BY_OFFENSE', 'OTHER'],
          affectAbilityToWorkOther: 'Live in the wrong location',
          notHopingToWorkReasons: [],
          notHopingToWorkOtherReason: null,
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

const stubGetInductionLongQuestionSetCreatedWithOriginalQuestionSet = (prisonNumber = 'G6115VJ'): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/inductions/${prisonNumber}`,
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        reference: '814ade0a-a3b2-46a3-862f-79211ba13f7b',
        prisonNumber,
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
          hopingToWork: 'YES',
          affectAbilityToWork: ['LIMITED_BY_OFFENSE', 'OTHER'],
          affectAbilityToWorkOther: 'Live in the wrong location',
          notHopingToWorkReasons: [],
          notHopingToWorkOtherReason: null,
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
          hasWorkedBefore: true,
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
      },
    },
  })

const stubGetInductionLongQuestionSetWithNoQualifications = (prisonNumber = 'G6115VJ'): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/inductions/${prisonNumber}`,
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        reference: '814ade0a-a3b2-46a3-862f-79211ba13f7b',
        prisonNumber,
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
          hopingToWork: 'YES',
          affectAbilityToWork: ['LIMITED_BY_OFFENSE', 'OTHER'],
          affectAbilityToWorkOther: 'Live in the wrong location',
          notHopingToWorkReasons: [],
          notHopingToWorkOtherReason: null,
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
          educationLevel: 'PRIMARY_SCHOOL',
          qualifications: [],
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

const stubGetInductionShortQuestionSet = (prisonNumber = 'G6115VJ'): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/inductions/${prisonNumber}`,
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        reference: '814ade0a-a3b2-46a3-862f-79211ba13f7b',
        prisonNumber,
        createdBy: 'A_USER_GEN',
        createdByDisplayName: 'Alex Smith',
        createdAt: '2023-08-29T11:29:22.8793',
        createdAtPrison: 'MDI',
        updatedBy: 'A_USER_GEN',
        updatedByDisplayName: 'Alex Smith',
        updatedAt: '2023-06-19T09:39:44Z',
        updatedAtPrison: 'MDI',
        workOnRelease: {
          reference: 'bdebe39f-6f85-459b-81be-a26341c3fe3c',
          createdBy: 'A_USER_GEN',
          createdByDisplayName: 'Alex Smith',
          createdAt: '2023-08-29T11:29:22.8793',
          createdAtPrison: 'MDI',
          updatedBy: 'A_USER_GEN',
          updatedByDisplayName: 'Alex Smith',
          updatedAt: '2023-06-19T09:39:44Z',
          updatedAtPrison: 'MDI',
          hopingToWork: 'NO',
          affectAbilityToWork: [],
          affectAbilityToWorkOther: null,
          notHopingToWorkReasons: ['LIMIT_THEIR_ABILITY'],
          notHopingToWorkOtherReason: null,
        },
        previousQualifications: {
          reference: 'dea24acc-fde5-4ead-a9eb-e1757de2542c',
          createdBy: 'A_USER_GEN',
          createdByDisplayName: 'Alex Smith',
          createdAt: '2023-08-29T11:29:22.8793',
          createdAtPrison: 'MDI',
          updatedBy: 'A_USER_GEN',
          updatedByDisplayName: 'Alex Smith',
          updatedAt: '2023-06-19T09:39:44Z',
          updatedAtPrison: 'MDI',
          educationLevel: null,
          qualifications: [
            {
              subject: 'English',
              grade: 'C',
              level: 'LEVEL_6',
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
          updatedAt: '2023-06-19T09:39:44Z',
          updatedAtPrison: 'MDI',
          trainingTypes: ['FULL_UK_DRIVING_LICENCE'],
          trainingTypeOther: null,
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

export default {
  createGoals,
  getActionPlan,
  updateGoal,
  updateGoal500Error,
  getActionPlanForPrisonerWithNoGoals,
  getActionPlan500Error,
  stubActionPlansList,
  stubActionPlansListFromPrisonerSearchSummaries,
  stubActionPlansList500error,

  stubGetTimeline,
  stubGetTimeline404Error,
  stubGetTimeline500Error,

  stubGetInductionShortQuestionSet,
  stubGetInductionLongQuestionSet,
  stubGetInductionLongQuestionSetWithNoQualifications,
  stubGetInductionLongQuestionSetCreatedWithOriginalQuestionSet,
  stubGetInduction404Error,
  stubGetInduction500Error,

  stubUpdateInduction,
  stubUpdateInduction500Error,
  stubCreateInduction,
  stubCreateInduction500Error,

  stubEducationAndWorkPlanApiPing: stubPing(),
}

/**
 * Returns a random date sometime between 30 days and 365 days years after today; or undefined.
 * Approximately 5% will return undefined, meaning the action plan has no review date.
 */
const randomReviewDate = (): string | undefined =>
  randomNumber(1, 100) > 5 ? format(addDays(startOfToday(), randomNumber(30, 5475)), 'yyyy-MM-dd') : undefined

const randomNumber = (min: number, max: number): number => Math.floor(Math.random() * (max - min) + min)
