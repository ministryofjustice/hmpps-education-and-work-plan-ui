import type { Assessment, FunctionalSkills } from 'viewModels'
import dateComparator from './dateComparator'

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
    assessments: mostRecentAssessments([...(allFunctionalSkills.assessments || [])]),
  } as FunctionalSkills
}

/**
 * Returns a FunctionalSkills object where the assessments are sorted by date descending.
 * If the array of assessments already includes English and Maths these are returned in chronological order relative
 * to the other assessments.
 * If the array of assessments does not contain English and/or Maths, these are added to the array, but with no assessment
 * date, and are presented at the top of the array.
 */
const allFunctionalSkills = (functionalSkills: FunctionalSkills): FunctionalSkills => {
  return {
    ...functionalSkills,
    assessments: allAssessments([...(functionalSkills.assessments || [])]),
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

const allAssessments = (assessments: Array<Assessment>): Array<Assessment> => {
  const allAssessmentsSortedByDate = assessments.sort((left: Assessment, right: Assessment) =>
    dateComparator(left.assessmentDate, right.assessmentDate),
  )
  const allAssessmentTypes = [...new Set(allAssessmentsSortedByDate.map(assessment => assessment.type))]

  if (!allAssessmentTypes.includes('MATHS')) {
    allAssessmentsSortedByDate.unshift({ type: 'MATHS' } as Assessment)
  }
  if (!allAssessmentTypes.includes('ENGLISH')) {
    allAssessmentsSortedByDate.unshift({ type: 'ENGLISH' } as Assessment)
  }

  return allAssessmentsSortedByDate
}

const assessmentsGroupedByTypeSortedByDateDesc = (assessments: Array<Assessment>): Map<string, Array<Assessment>> => {
  const map = new Map<string, Array<Assessment>>()
  assessments.forEach(assessment => {
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

export { allFunctionalSkills, mostRecentFunctionalSkills }
