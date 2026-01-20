import { SuperAgentRequest } from 'superagent'
import { stubFor } from '../wiremock'
import EducationLevelValue from '../../../server/enums/educationLevelValue'
import QualificationLevelValue from '../../../server/enums/qualificationLevelValue'

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

const stubCreateEducation500Error = (prisonNumber = 'G6115VJ'): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'POST',
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

const stubUpdateEducation500Error = (prisonNumber = 'G6115VJ'): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'PUT',
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

export default {
  stubCreateEducation,
  stubCreateEducation500Error,

  stubUpdateEducation,
  stubUpdateEducation500Error,

  stubGetEducation,
  stubGetEducation500Error,
  stubGetEducation404Error,
}
