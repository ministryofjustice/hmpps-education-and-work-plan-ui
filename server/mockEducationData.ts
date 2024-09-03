// TODO delete this file once the education view has been tested

import type { EducationResponse } from 'educationAndWorkPlanApiClient'
import EducationLevelValue from './enums/educationLevelValue'
import QualificationLevelValue from './enums/qualificationLevelValue'

const today = new Date()

const mockEducationData: EducationResponse = {
  problemRetrievingData: false,
  educationLevel: EducationLevelValue.SECONDARY_SCHOOL_TOOK_EXAMS,
  updatedByDisplayName: 'Lynnette Orr',
  updatedAt: today,
  qualifications: [
    {
      subject: 'Maths',
      grade: 'A',
      level: QualificationLevelValue.LEVEL_4,
    },
    {
      subject: 'Science',
      grade: 'B',
      level: QualificationLevelValue.LEVEL_3,
    },
  ],
}

export default mockEducationData
