import { parseISO } from 'date-fns'
import type { QualificationDto } from 'dto'
import QualificationLevelValue from '../enums/qualificationLevelValue'

const aValidQualificationDto = (options?: {
  reference?: string
  subject?: string
  grade?: string
  level?: QualificationLevelValue
  createdBy?: string
  createdAt?: Date
  updatedBy?: string
  updatedAt?: Date
}): QualificationDto => ({
  reference: options?.reference || '2bb661f2-bfd6-46fa-a7e0-1aa655e94e70',
  subject: options?.subject || 'GCSE Maths',
  grade: options?.grade || 'A*',
  level: options?.level || QualificationLevelValue.LEVEL_2,
  createdBy: options?.createdBy || 'asmith_gen',
  createdAt: options?.createdAt || parseISO('2023-06-19T09:39:44Z'),
  updatedBy: options?.updatedBy || 'asmith_gen',
  updatedAt: options?.updatedAt || parseISO('2023-06-19T09:39:44Z'),
})

export default aValidQualificationDto
