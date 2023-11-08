import type { PrisonerSearchSummary } from 'viewModels'
import { SuperAgentRequest } from 'superagent'
import { stubFor } from './wiremock'

const stubGetLongQuestionSetCiagProfile = (prisonNumber = 'G6115VJ'): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/ciag/induction/${prisonNumber}`,
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        offenderId: prisonNumber,
        createdBy: 'A_USER_GEN',
        createdDateTime: '2023-08-29T11:29:22.8793',
        modifiedBy: 'A_USER_GEN',
        desireToWork: true,
        modifiedDateTime: '2023-08-29T10:29:22.457',
        hopingToGetWork: 'YES',
        reasonToNotGetWorkOther: null,
        abilityToWorkOther: 'Live in the wrong location',
        abilityToWork: ['LIMITED_BY_OFFENSE', 'OTHER'],
        reasonToNotGetWork: [],
        workExperience: {
          hasWorkedBefore: true,
          modifiedBy: 'A_USER_GEN',
          modifiedDateTime: '2023-08-29T10:29:22.457',
          id: 36,
          typeOfWorkExperience: ['OFFICE', 'OTHER'],
          typeOfWorkExperienceOther: 'Finance',
          workExperience: [
            {
              typeOfWorkExperience: 'OTHER',
              otherWork: null,
              role: 'Trader',
              details: 'Some trading tasks',
            },
            {
              typeOfWorkExperience: 'OFFICE',
              otherWork: null,
              role: 'Accountant',
              details: 'Some daily tasks',
            },
          ],
          workInterests: {
            id: 63,
            workInterests: ['WASTE_MANAGEMENT'],
            workInterestsOther: '',
            particularJobInterests: [
              {
                workInterest: 'WASTE_MANAGEMENT',
                role: 'Bin man',
              },
            ],
            modifiedBy: 'A_USER_GEN',
            modifiedDateTime: '2023-08-29T10:29:22.457',
          },
        },
        skillsAndInterests: {
          modifiedBy: 'A_USER_GEN',
          modifiedDateTime: '2023-08-29T10:29:22.457',
          id: 35,
          skills: ['OTHER', 'COMMUNICATION', 'POSITIVE_ATTITUDE', 'THINKING_AND_PROBLEM_SOLVING'],
          skillsOther: 'Logical thinking',
          personalInterests: ['CREATIVE', 'OTHER', 'SOLO_ACTIVITIES', 'DIGITAL'],
          personalInterestsOther: 'Car boot sales',
        },
        qualificationsAndTraining: {
          modifiedBy: 'A_USER_GEN',
          modifiedDateTime: '2023-08-29T10:29:22.457',
          id: 34,
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
          additionalTraining: ['FULL_UK_DRIVING_LICENCE', 'HGV_LICENCE', 'OTHER'],
          additionalTrainingOther: 'Accountancy Certification',
        },
        inPrisonInterests: null,
        schemaVersion: null,
      },
    },
  })

const stubGetShortQuestionSetCiagProfile = (prisonNumber = 'G6115VJ'): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/ciag/induction/${prisonNumber}`,
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        offenderId: prisonNumber,
        createdBy: 'A_USER_GEN',
        createdDateTime: '2023-08-29T11:29:22.8793',
        modifiedBy: 'A_USER_GEN',
        desireToWork: false,
        hopingToGetWork: 'NO',
        reasonToNotGetWorkOther: '',
        abilityToWorkOther: null,
        abilityToWork: [],
        reasonToNotGetWork: ['LIMIT_THEIR_ABILITY'],
        workExperience: null,
        skillsAndInterests: null,
        qualificationsAndTraining: {
          modifiedBy: 'A_USER_GEN',
          modifiedDateTime: '2023-10-23T08:34:35.497',
          id: 40,
          educationLevel: null,
          qualifications: [
            {
              subject: 'English',
              grade: 'C',
              level: 'LEVEL_6',
            },
          ],
          additionalTraining: ['FULL_UK_DRIVING_LICENCE'],
          additionalTrainingOther: '',
        },
        inPrisonInterests: {
          modifiedBy: 'A_USER_GEN',
          modifiedDateTime: '2023-10-23T08:34:35.497',
          id: 39,
          inPrisonWork: ['MAINTENANCE'],
          inPrisonWorkOther: '',
          inPrisonEducation: ['MACHINERY_TICKETS'],
          inPrisonEducationOther: '',
        },
        schemaVersion: null,
      },
    },
  })

const stubGetCiagProfile404Error = (prisonNumber = 'G6115VJ'): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/ciag/induction/${prisonNumber}`,
    },
    response: {
      status: 404,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        status: 404,
        errorCode: null,
        userMessage: `CIAG profile does not exist for offender ${prisonNumber}`,
        developerMessage: `CIAG profile does not exist for offender ${prisonNumber}`,
        moreInfo: null,
      },
    },
  })

const stubGetCiagProfile500Error = (prisonNumber = 'G6115VJ'): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/ciag/induction/${prisonNumber}`,
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

const stubCiagInductionList = (): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'POST',
      urlPattern: `/ciag/induction/list`,
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        ciagProfileList: [
          {
            offenderId: 'N6878UX',
            prisonId: 'string',
            prisonName: 'string',
            createdBy: 'string',
            createdDateTime: '2023-10-20T13:05:05.212Z',
            modifiedBy: 'string',
            modifiedDateTime: '2023-10-20T13:05:05.212Z',
            desireToWork: true,
            hopingToGetWork: 'YES',
            reasonToNotGetWorkOther: 'string',
            abilityToWorkOther: 'string',
            abilityToWork: ['CARING_RESPONSIBILITIES'],
            reasonToNotGetWork: ['LIMIT_THEIR_ABILITY'],
            workExperience: {
              hasWorkedBefore: true,
              modifiedBy: 'string',
              modifiedDateTime: '2023-10-20T13:05:05.212Z',
              id: 0,
              typeOfWorkExperience: ['OUTDOOR'],
              typeOfWorkExperienceOther: 'string',
              workExperience: [
                {
                  typeOfWorkExperience: 'OUTDOOR',
                  otherWork: 'string',
                  role: 'string',
                  details: 'string',
                },
              ],
              workInterests: {
                modifiedBy: 'string',
                modifiedDateTime: '2023-10-20T13:05:05.212Z',
                id: 0,
                workInterests: ['OUTDOOR'],
                workInterestsOther: 'string',
                particularJobInterests: [
                  {
                    workInterest: 'OUTDOOR',
                    role: 'string',
                  },
                ],
              },
            },
            skillsAndInterests: {
              modifiedBy: 'string',
              modifiedDateTime: '2023-10-20T13:05:05.212Z',
              id: 0,
              skills: ['COMMUNICATION'],
              skillsOther: 'string',
              personalInterests: ['COMMUNITY'],
              personalInterestsOther: 'string',
            },
            qualificationsAndTraining: {
              modifiedBy: 'string',
              modifiedDateTime: '2023-10-20T13:05:05.212Z',
              id: 0,
              educationLevel: 'PRIMARY_SCHOOL',
              qualifications: [
                {
                  subject: 'ENTRY_LEVEL_2',
                },
              ],
              additionalTraining: ['CSCS_CARD'],
              additionalTrainingOther: 'string',
            },
            inPrisonInterests: {
              modifiedBy: 'string',
              modifiedDateTime: '2023-10-20T13:05:05.212Z',
              id: 0,
              inPrisonWork: ['CLEANING_AND_HYGIENE'],
              inPrisonWorkOther: 'string',
              inPrisonEducation: ['BARBERING_AND_HAIRDRESSING'],
              inPrisonEducationOther: 'string',
            },
            schemaVersion: 'string',
          },
        ],
      },
    },
  })

const stubCiagInductionListFromPrisonerSearchSummaries = (
  prisonerSearchSummaries: Array<PrisonerSearchSummary>,
): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'POST',
      urlPattern: `/ciag/induction/list`,
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        ciagProfileList: prisonerSearchSummaries
          .filter(prisonerSearchSummary => prisonerSearchSummary.hasCiagInduction)
          .map(prisonerSearchSummary => {
            return {
              offenderId: prisonerSearchSummary.prisonNumber,
            }
          }),
      },
    },
  })

const stubCiagInductionList500error = (): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'POST',
      urlPattern: `/ciag/induction/list`,
    },
    response: {
      status: 500,
      body: 'Unexpected error',
    },
  })

export default {
  stubGetLongQuestionSetCiagProfile,
  stubGetShortQuestionSetCiagProfile,
  stubGetCiagProfile404Error,
  stubGetCiagProfile500Error,
  stubCiagInductionList,
  stubCiagInductionListFromPrisonerSearchSummaries,
  stubCiagInductionList500error,
}
