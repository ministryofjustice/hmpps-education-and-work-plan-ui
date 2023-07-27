import type { Assessment, FunctionalSkills } from 'viewModels'

/**
 * Returns a FunctionalSkills object where the assessments are filtered such that only the most recent of each type
 * are returned; and that English and Maths are always returned.
 * In the case where English and/or Maths are not present in the original FunctionalSkills object, they are added to the
 * resultant object without a grade or assessment date. This allows the nunjucks view to render these 2 functional skills
 * even if they have not currently been assessed.
 * English is always first, Maths is always returned second. Other functional skill types are returned in no guaranteed
 * order.
 */
const mostRecentFunctionalSkills = (allFunctionalSkills: FunctionalSkills): FunctionalSkills => {
  return {
    ...allFunctionalSkills,
    assessments: mostRecentAssessments(allFunctionalSkills.assessments || []),
  } as FunctionalSkills
}

const mostRecentAssessments = (allAssessments: Array<Assessment>): Array<Assessment> => {
  const allAssessmentsGroupedByTypeSortedByDateDesc = assessmentsGroupedByTypeSortedByDateDesc(allAssessments)

  const latestEnglishAssessment = (
    allAssessmentsGroupedByTypeSortedByDateDesc.get('ENGLISH') || [{ type: 'ENGLISH' } as Assessment]
  ).at(0)
  const latestMathsAssessment = (
    allAssessmentsGroupedByTypeSortedByDateDesc.get('MATHS') || [{ type: 'MATHS' } as Assessment]
  ).at(0)
  const latestOtherAssessments = [...allAssessmentsGroupedByTypeSortedByDateDesc.keys()]
    .filter(key => key !== 'ENGLISH' && key !== 'MATHS')
    .map(key => allAssessmentsGroupedByTypeSortedByDateDesc.get(key).at(0))

  return Array.of(latestEnglishAssessment, latestMathsAssessment, ...latestOtherAssessments)
}

const assessmentsGroupedByTypeSortedByDateDesc = (
  allAssessments: Array<Assessment>,
): Map<string, Array<Assessment>> => {
  const map = new Map<string, Array<Assessment>>()
  allAssessments.forEach(assessment => {
    const key = assessment.type
    const value: Array<Assessment> = map.get(key) || []
    value.push(assessment)
    map.set(
      key,
      value.sort((left: Assessment, right: Assessment) => dateComparator(left.assessmentDate, right.assessmentDate)),
    )
  })
  return map
}

const dateComparator = (date1: Date, date2: Date): number => {
  if (date1 > date2) {
    return -1
  }
  if (date1 < date2) {
    return 1
  }
  return 0
}

export default mostRecentFunctionalSkills
