import { parseISO } from 'date-fns'
import type { EducationDto, QualificationDto } from 'dto'
import EducationLevelValue from '../enums/educationLevelValue'
import aValidQualificationDto from './qualificationDtoTestDataBuilder'

const aValidEducationDto = (options?: {
  prisonNumber?: string
  reference?: string
  educationLevel?: EducationLevelValue
  qualifications?: Array<QualificationDto>
  createdBy?: string
  createdByDisplayName?: string
  createdAt?: Date
  createdAtPrison?: string
  updatedBy?: string
  updatedByDisplayName?: string
  updatedAt?: Date
  updatedAtPrison?: string
}): EducationDto => ({
  prisonNumber: options?.prisonNumber || 'G6115VJ',
  reference: options?.reference || 'dea24acc-fde5-4ead-a9eb-e1757de2542c',
  educationLevel: options?.educationLevel || EducationLevelValue.SECONDARY_SCHOOL_TOOK_EXAMS,
  qualifications: options?.qualifications || [aValidQualificationDto()],
  createdBy: options?.createdBy || 'asmith_gen',
  createdByDisplayName: options?.createdByDisplayName || 'Alex Smith',
  createdAt: options?.createdAt || parseISO('2023-06-19T09:39:44Z'),
  createdAtPrison: options?.createdAtPrison || 'MDI',
  updatedBy: options?.updatedBy || 'asmith_gen',
  updatedByDisplayName: options?.updatedByDisplayName || 'Alex Smith',
  updatedAt: options?.updatedAt || parseISO('2023-06-19T09:39:44Z'),
  updatedAtPrison: options?.updatedAtPrison || 'MDI',
})

export default aValidEducationDto
