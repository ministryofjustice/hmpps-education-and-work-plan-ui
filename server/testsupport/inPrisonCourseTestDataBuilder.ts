import { startOfDay, startOfToday, subMonths } from 'date-fns'
import type { InPrisonCourse } from 'viewModels'

const aValidEnglishInPrisonCourse = (): InPrisonCourse => {
  return {
    prisonId: 'MDI',
    prisonName: 'Moorland (HMP & YOI)',
    courseName: 'GCSE English',
    courseCode: '008ENGL06',
    courseStartDate: startOfDay('2021-06-01'),
    courseStatus: 'IN_PROGRESS',
    courseCompletionDate: null,
    isAccredited: true,
    grade: null,
    source: 'CURIOUS',
  }
}

const aValidMathsInPrisonCourse = (): InPrisonCourse => {
  return {
    prisonId: 'WDI',
    prisonName: 'Wakefield (HMP)',
    courseName: 'GCSE Maths',
    courseCode: '246674',
    courseStartDate: startOfDay('2016-05-18'),
    courseStatus: 'COMPLETED',
    courseCompletionDate: startOfDay('2016-07-15'),
    isAccredited: true,
    grade: 'No achievement',
    source: 'CURIOUS',
  }
}

const aValidWoodWorkingInPrisonCourse = (): InPrisonCourse => {
  return {
    prisonId: 'MDI',
    prisonName: 'Moorland (HMP & YOI)',
    courseName: 'City & Guilds Wood Working',
    courseCode: '008WOOD06',
    courseStartDate: startOfDay('2021-06-01'),
    courseStatus: 'IN_PROGRESS',
    courseCompletionDate: null,
    isAccredited: true,
    grade: null,
    source: 'CURIOUS',
  }
}

const aValidEnglishInPrisonCourseCompletedWithinLast12Months = (): InPrisonCourse => {
  return {
    prisonId: 'MDI',
    prisonName: 'Moorland (HMP & YOI)',
    courseName: 'GCSE English',
    courseCode: '008ENGL06',
    courseStartDate: startOfDay('2023-10-01'),
    courseStatus: 'COMPLETED',
    courseCompletionDate: subMonths(startOfToday(), 3),
    isAccredited: true,
    grade: null,
    source: 'CURIOUS',
  }
}

export {
  aValidEnglishInPrisonCourse,
  aValidMathsInPrisonCourse,
  aValidWoodWorkingInPrisonCourse,
  aValidEnglishInPrisonCourseCompletedWithinLast12Months,
}
