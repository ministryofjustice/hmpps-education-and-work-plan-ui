import moment from 'moment'
import type { PrisonerEducation } from 'viewModels'

const aValidEnglishPrisonerEducation = (): PrisonerEducation => {
  return {
    prisonId: 'MDI',
    prisonName: 'MOORLAND (HMP & YOI)',
    courseName: 'GCSE English',
    courseCode: '008ENGL06',
    courseStartDate: moment('2021-06-01').toDate(),
    source: 'CURIOUS',
  }
}

const aValidMathsPrisonerEducation = (): PrisonerEducation => {
  return {
    prisonId: 'WDI',
    prisonName: 'WAKEFIELD (HMP)',
    courseName: 'GCSE Maths',
    courseCode: '246674',
    courseStartDate: moment('2016-05-18').toDate(),
    source: 'CURIOUS',
  }
}

const aValidWoodWorkingPrisonerEducation = (): PrisonerEducation => {
  return {
    prisonId: 'MDI',
    prisonName: 'MOORLAND (HMP & YOI)',
    courseName: 'City & Guilds Wood Working',
    courseCode: '008WOOD06',
    courseStartDate: moment('2021-06-01').toDate(),
    source: 'CURIOUS',
  }
}

export { aValidEnglishPrisonerEducation, aValidMathsPrisonerEducation, aValidWoodWorkingPrisonerEducation }
