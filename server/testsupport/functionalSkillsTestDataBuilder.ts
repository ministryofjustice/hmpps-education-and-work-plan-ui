import type { Assessment, FunctionalSkills } from 'viewModels'
import aValidAssessment from './assessmentTestDataBuilder'

const validFunctionalSkills = (options?: { assessments?: Array<Assessment> }): FunctionalSkills => ({
  assessments: options?.assessments || [aValidAssessment({ type: 'ENGLISH' }), aValidAssessment({ type: 'MATHS' })],
})

export default validFunctionalSkills
