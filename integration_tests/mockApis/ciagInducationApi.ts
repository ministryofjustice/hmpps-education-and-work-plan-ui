import type { PrisonerSearchSummary } from 'viewModels'
import { SuperAgentRequest } from 'superagent'
import { stubFor } from './wiremock'

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
              hasWorkedBefore: 'YES',
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
  stubCiagInductionList,
  stubCiagInductionListFromPrisonerSearchSummaries,
  stubCiagInductionList500error,
}
