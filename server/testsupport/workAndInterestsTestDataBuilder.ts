import moment from 'moment/moment'
import type { WorkAndInterests } from 'viewModels'

export default function aValidWorkAndInterests(): WorkAndInterests {
  return {
    problemRetrievingData: false,
    inductionQuestionSet: 'LONG_QUESTION_SET',
    data: {
      workExperience: {
        hasWorkedPreviously: false,
        jobs: [],
        updatedBy: 'A_DPS_USER_GEN',
        updatedAt: moment('2023-08-22T11:12:31.943Z').toDate(),
      },
      workInterests: {
        hopingToWorkOnRelease: 'NOT_SURE',
        constraintsOnAbilityToWork: ['NONE'],
        jobTypes: ['OUTDOOR'],
        specificJobRoles: ['Gardner'],
        updatedBy: 'A_DPS_USER_GEN',
        updatedAt: moment('2023-08-22T11:12:31.943Z').toDate(),
      },
      skillsAndInterests: {
        skills: ['THINKING_AND_PROBLEM_SOLVING'],
        personalInterests: ['CREATIVE', 'CRAFTS'],
        updatedBy: 'A_DPS_USER_GEN',
        updatedAt: moment('2023-08-22T11:12:31.943Z').toDate(),
      },
    },
  }
}
