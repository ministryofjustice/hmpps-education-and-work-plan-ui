import type { Assessment, FunctionalSkills } from 'viewModels'
import { aValidCurious1Assessment } from './assessmentTestDataBuilder'

const validFunctionalSkills = (options?: { assessments?: Array<Assessment> }): FunctionalSkills => ({
  assessments: options?.assessments || [
    aValidCurious1Assessment({ type: 'ENGLISH' }),
    aValidCurious1Assessment({ type: 'MATHS' }),
  ],
})

export default validFunctionalSkills
