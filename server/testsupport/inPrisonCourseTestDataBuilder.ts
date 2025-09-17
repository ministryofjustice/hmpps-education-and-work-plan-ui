import { startOfDay, startOfToday, subMonths } from 'date-fns'
import type { InPrisonCourse } from 'viewModels'

const aValidInPrisonCourse = (options?: {
  prisonId?: string
  courseName?: string
  courseCode?: string
  courseStartDate?: Date
  courseStatus?: 'COMPLETED' | 'IN_PROGRESS' | 'WITHDRAWN' | 'TEMPORARILY_WITHDRAWN'
  courseCompletionDate?: Date
  coursePlannedEndDate?: Date
  isAccredited?: boolean
  grade?: string
  withdrawalReason?: string
  source: 'CURIOUS1' | 'CURIOUS2'
}): InPrisonCourse => ({
  prisonId: options?.prisonId || 'MDI',
  courseName: options?.courseName || 'GCSE Needlecraft',
  courseCode: options?.courseCode || '007SEW101',
  courseStartDate: options?.courseStartDate || startOfDay('2021-06-01'),
  courseStatus: options?.courseStatus || 'IN_PROGRESS',
  courseCompletionDate:
    options?.courseCompletionDate === null ? null : options?.courseCompletionDate || startOfDay('2016-07-15'),
  coursePlannedEndDate:
    options?.coursePlannedEndDate === null ? null : options?.coursePlannedEndDate || startOfDay('2016-07-15'),
  isAccredited: options?.isAccredited !== false,
  grade: options?.grade === null ? null : options?.grade || 'Pass',
  withdrawalReason: options?.withdrawalReason === null ? null : options?.withdrawalReason || 'Ill health',
  source: options?.source || 'CURIOUS1',
})

const aValidEnglishInPrisonCourse = (): InPrisonCourse =>
  aValidInPrisonCourse({
    prisonId: 'MDI',
    courseName: 'GCSE English',
    courseCode: '008ENGL06',
    courseStartDate: startOfDay('2021-06-01'),
    courseStatus: 'IN_PROGRESS',
    courseCompletionDate: null,
    isAccredited: true,
    grade: null,
    source: 'CURIOUS1',
  })

const aValidMathsInPrisonCourse = (): InPrisonCourse =>
  aValidInPrisonCourse({
    prisonId: 'WDI',
    courseName: 'GCSE Maths',
    courseCode: '246674',
    courseStartDate: startOfDay('2016-05-18'),
    courseStatus: 'COMPLETED',
    courseCompletionDate: startOfDay('2016-07-15'),
    isAccredited: true,
    grade: 'No achievement',
    source: 'CURIOUS1',
  })

const aValidWoodWorkingInPrisonCourse = (): InPrisonCourse =>
  aValidInPrisonCourse({
    prisonId: 'MDI',
    courseName: 'City & Guilds Wood Working',
    courseCode: '008WOOD06',
    courseStartDate: startOfDay('2021-06-01'),
    courseStatus: 'IN_PROGRESS',
    courseCompletionDate: null,
    isAccredited: true,
    grade: null,
    source: 'CURIOUS1',
  })

const aValidEnglishInPrisonCourseCompletedWithinLast12Months = (): InPrisonCourse => {
  return {
    prisonId: 'MDI',
    courseName: 'GCSE English',
    courseCode: '008ENGL06',
    courseStartDate: startOfDay('2023-10-01'),
    courseStatus: 'COMPLETED',
    courseCompletionDate: subMonths(startOfToday(), 3),
    isAccredited: true,
    grade: null,
    source: 'CURIOUS1',
  }
}

export {
  aValidInPrisonCourse,
  aValidEnglishInPrisonCourse,
  aValidMathsInPrisonCourse,
  aValidWoodWorkingInPrisonCourse,
  aValidEnglishInPrisonCourseCompletedWithinLast12Months,
}
