import { SuperAgentRequest } from 'superagent'
import { stubFor } from './wiremock'

const stubGetCiagProfile = (prisonNumber = 'G6115VJ'): SuperAgentRequest =>
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
          workInterests: null,
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

export default { stubGetCiagProfile, stubGetCiagProfile404Error, stubGetCiagProfile500Error }
