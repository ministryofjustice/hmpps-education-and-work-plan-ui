import type { LearnerEductionPagedResponse } from 'curiousApiClient'
import {
  aValidEnglishLearnerEducation,
  aValidMathsLearnerEducation,
  aValidWoodWorkingLearnerEducation,
} from './learnerEducationTestDataBuilder'

const learnerEducationPagedResponsePage1Of1 = (prisonNumber = 'A1234BC'): LearnerEductionPagedResponse => {
  return {
    content: [aValidEnglishLearnerEducation(prisonNumber), aValidMathsLearnerEducation(prisonNumber)],
    empty: false,
    first: true,
    last: true,
    number: 0,
    numberOfElements: 2,
    pageable: {
      sort: [],
      pageNumber: 0,
      pageSize: 10,
      offset: 0,
      unpaged: false,
      paged: true,
    },
    size: 10,
    sort: [],
    totalElements: 2,
    totalPages: 1,
  }
}

const learnerEducationPagedResponsePage1Of2 = (prisonNumber = 'A1234BC'): LearnerEductionPagedResponse => {
  return {
    content: [aValidEnglishLearnerEducation(prisonNumber), aValidMathsLearnerEducation(prisonNumber)],
    empty: false,
    first: true,
    last: false,
    number: 0,
    numberOfElements: 2,
    pageable: {
      sort: [],
      pageNumber: 0,
      pageSize: 2,
      offset: 0,
      unpaged: false,
      paged: true,
    },
    size: 2,
    sort: [],
    totalElements: 3,
    totalPages: 1,
  }
}

const learnerEducationPagedResponsePage2Of2 = (prisonNumber = 'A1234BC'): LearnerEductionPagedResponse => {
  return {
    content: [aValidWoodWorkingLearnerEducation(prisonNumber)],
    empty: false,
    first: false,
    last: true,
    number: 0,
    numberOfElements: 1,
    pageable: {
      sort: [],
      pageNumber: 1,
      pageSize: 2,
      offset: 1,
      unpaged: false,
      paged: true,
    },
    size: 2,
    sort: [],
    totalElements: 3,
    totalPages: 1,
  }
}

export {
  learnerEducationPagedResponsePage1Of1,
  learnerEducationPagedResponsePage1Of2,
  learnerEducationPagedResponsePage2Of2,
}
