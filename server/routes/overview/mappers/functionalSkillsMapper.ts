import moment from 'moment'
import type { Assessment as AssemmentDto, LearnerProfile } from 'curiousApiClient'
import type { Assessment, FunctionalSkills } from 'viewModels'

const toFunctionalSkills = (learnerProfiles: Array<LearnerProfile>): FunctionalSkills => {
  return {
    problemRetrievingData: false,
    assessments: learnerProfiles?.flatMap(learnerProfile =>
      (learnerProfile.qualifications as Array<AssemmentDto>).map(assessment =>
        toAssessment(learnerProfile.establishmentId, learnerProfile.establishmentName, assessment),
      ),
    ),
  }
}

const toAssessment = (prisonId: string, prisonName: string, assessment: AssemmentDto): Assessment => {
  return {
    prisonId,
    prisonName,
    type: toAssessmentTypeOrNull(assessment.qualificationType),
    grade: assessment.qualificationGrade,
    assessmentDate: dateOrNull(assessment.assessmentDate),
  } as Assessment
}

const dateOrNull = (value: string): Date | undefined => {
  return value ? moment(value, true).toDate() : undefined
}

const toAssessmentTypeOrNull = (qualificationType: string): string | undefined => {
  switch (qualificationType) {
    case 'English': {
      return 'ENGLISH'
    }
    case 'Maths': {
      return 'MATHS'
    }
    case 'Digital Literacy': {
      return 'DIGITAL_LITERACY'
    }
    default: {
      return undefined
    }
  }
}

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

export { toFunctionalSkills, mostRecentFunctionalSkills }
