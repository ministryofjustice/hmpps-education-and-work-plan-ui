import type { Job, WorkInterestJob } from 'viewModels'

/**
 * Comparator function that compares two `Job` view model instances, returning -1, 0 or 1 depending on whether the
 * first job's type property is alphabetically before, equal or after the second job's type property.
 * If the first job's type is 'OTHER' then 1 is returned.
 *
 * This comparator function can be used to sort an array of `Job` view model instances, resulting in the array being sorted
 * alphabetically on the `type` property, except 'OTHER' which will always be at the end of the array.
 */
const jobComparator = (left: Job, right: Job): number => {
  if (left.type === 'OTHER') {
    return 1
  }
  if (right.type === 'OTHER') {
    return -1
  }
  if (left.type > right.type) {
    return 1
  }
  if (left.type < right.type) {
    return -1
  }
  return 0
}

/**
 * Comparator function that compares two `WorkInterestJob` view model instances, returning -1, 0 or 1 depending on whether the
 * first job's type property is alphabetically before, equal or after the second job's type property.
 * If the first job's type is 'OTHER' then 1 is returned.
 *
 * This comparator function can be used to sort an array of `WorkInterestJob` view model instances, resulting in the array being sorted
 * alphabetically on the `type` property, except 'OTHER' which will always be at the end of the array.
 */
const workInterestJobComparator = (left: WorkInterestJob, right: WorkInterestJob): number => {
  if (left.jobType === 'OTHER') {
    return 1
  }
  if (right.jobType === 'OTHER') {
    return -1
  }
  if (left.jobType > right.jobType) {
    return 1
  }
  if (left.jobType < right.jobType) {
    return -1
  }
  return 0
}

export { jobComparator, workInterestJobComparator }
