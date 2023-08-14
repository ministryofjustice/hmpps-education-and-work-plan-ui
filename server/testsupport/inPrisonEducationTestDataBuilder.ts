import moment from 'moment'
import type { InPrisonEducation } from 'viewModels'

const aValidEnglishInPrisonEducation = (): InPrisonEducation => {
  return {
    prisonId: 'MDI',
    prisonName: 'MOORLAND (HMP & YOI)',
    courseName: 'GCSE English',
    courseCode: '008ENGL06',
    courseStartDate: moment('2021-06-01').toDate(),
    courseCompleted: false,
    courseCompletionDate: null,
    source: 'CURIOUS',
  }
}

const aValidMathsInPrisonEducation = (): InPrisonEducation => {
  return {
    prisonId: 'WDI',
    prisonName: 'WAKEFIELD (HMP)',
    courseName: 'GCSE Maths',
    courseCode: '246674',
    courseStartDate: moment('2016-05-18').toDate(),
    courseCompleted: true,
    courseCompletionDate: moment('2016-07-15').toDate(),
    source: 'CURIOUS',
  }
}

const aValidWoodWorkingInPrisonEducation = (): InPrisonEducation => {
  return {
    prisonId: 'MDI',
    prisonName: 'MOORLAND (HMP & YOI)',
    courseName: 'City & Guilds Wood Working',
    courseCode: '008WOOD06',
    courseStartDate: moment('2021-06-01').toDate(),
    courseCompleted: false,
    courseCompletionDate: null,
    source: 'CURIOUS',
  }
}

export { aValidEnglishInPrisonEducation, aValidMathsInPrisonEducation, aValidWoodWorkingInPrisonEducation }
