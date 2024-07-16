import { parseISO, startOfDay } from 'date-fns'
import type { Assessment as AssemmentDto, LearnerProfile } from 'curiousApiClient'
import type { Assessment, FunctionalSkills } from 'viewModels'

const toFunctionalSkills = (learnerProfiles: Array<LearnerProfile>, prisonNumber: string): FunctionalSkills => {
  return {
    problemRetrievingData: false,
    assessments: learnerProfiles?.flatMap(learnerProfile =>
      (learnerProfile.qualifications as Array<AssemmentDto>).map(assessment =>
        toAssessment(learnerProfile.establishmentId, learnerProfile.establishmentName, assessment),
      ),
    ),
    prisonNumber,
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
  return value ? startOfDay(parseISO(value)) : undefined
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

export default toFunctionalSkills
