import type { EducationResponse } from 'educationAndWorkPlanApiClient'
import EducationLevelValue from '../enums/educationLevelValue'
import QualificationLevelValue from '../enums/qualificationLevelValue'

const aValidEducationResponse = (): EducationResponse => ({
  createdBy: 'asmith_gen',
  createdByDisplayName: 'Alex Smith',
  createdAt: '2023-06-19T09:39:44Z',
  createdAtPrison: 'BXI',
  updatedBy: 'asmith_gen',
  updatedByDisplayName: 'Alex Smith',
  updatedAtPrison: 'BXI',
  reference: 'dea24acc-fde5-4ead-a9eb-e1757de2542c',
  educationLevel: EducationLevelValue.SECONDARY_SCHOOL_TOOK_EXAMS,
  qualifications: [
    {
      reference: '814ade0a-a3b2-46a3-862f-79211ba13f7b',
      subject: 'Pottery',
      grade: 'C',
      level: QualificationLevelValue.LEVEL_4,
      createdBy: 'asmith_gen',
      createdAt: new Date('2023-06-19T09:39:44Z').toISOString(),
      updatedBy: 'asmith_gen',
      updatedAt: new Date('2023-06-19T09:39:44Z').toISOString(),
    },
  ],
  updatedAt: new Date('2023-06-19T00:00:00Z').toISOString(),
})

export default aValidEducationResponse
