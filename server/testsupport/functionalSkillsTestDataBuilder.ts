import type { Assessment, FunctionalSkills } from 'viewModels'
import aValidAssessment from './assessmentTestDataBuilder'

const validFunctionalSkills = (options?: {
  prisonNumber?: string
  assessments?: Array<Assessment>
  problemRetrievingData?: boolean
}): FunctionalSkills => {
  return {
    prisonNumber: options?.prisonNumber || 'A1234BC',
    assessments: options?.assessments || [aValidAssessment({ type: 'ENGLISH' }), aValidAssessment({ type: 'MATHS' })],
    problemRetrievingData:
      !options || options.problemRetrievingData === null || options.problemRetrievingData === undefined
        ? false
        : options.problemRetrievingData,
  }
}

const validFunctionalSkillsWithNoAssessments = (options?: {
  prisonNumber?: string
  problemRetrievingData?: boolean
}): FunctionalSkills => {
  return validFunctionalSkills({ ...options, assessments: [] })
}

const functionalSkillsWithProblemRetrievingData = (options?: { prisonNumber?: string }): FunctionalSkills => {
  return validFunctionalSkills({ ...options, assessments: [], problemRetrievingData: true })
}

export { validFunctionalSkills, validFunctionalSkillsWithNoAssessments, functionalSkillsWithProblemRetrievingData }
