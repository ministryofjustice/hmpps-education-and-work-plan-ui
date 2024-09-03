import type { EducationResponse } from 'educationAndWorkPlanApiClient'
import EducationLevelValue from '../enums/educationLevelValue'
import QualificationLevelValue from '../enums/qualificationLevelValue'

const aValidEducationResponse = (): EducationResponse => ({
  reference: 'dea24acc-fde5-4ead-a9eb-e1757de2542c',
  educationLevel: EducationLevelValue.SECONDARY_SCHOOL_TOOK_EXAMS,
  qualifications: [{ subject: 'Pottery', grade: 'C', level: QualificationLevelValue.LEVEL_4 }],
  updatedAt: new Date('2023-06-19T00:00:00Z').toISOString(),
  updatedByDisplayName: 'Alex Smith',
})

export default aValidEducationResponse
