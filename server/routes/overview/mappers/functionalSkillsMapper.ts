import { parseISO, startOfDay } from 'date-fns'
import type { Assessment as AssemmentDto, LearnerProfile } from 'curiousApiClient'
import type { Assessment, FunctionalSkills } from 'viewModels'

const toFunctionalSkills = (
  learnerProfiles: Array<LearnerProfile>,
  prisonNumber: string,
  prisonNamesById: Map<string, string>,
): FunctionalSkills => ({
  problemRetrievingData: false,
  assessments: learnerProfiles.flatMap(learnerProfile =>
    (learnerProfile.qualifications as Array<AssemmentDto>).map(assessment =>
      toAssessment(learnerProfile.establishmentId, assessment, prisonNamesById),
    ),
  ),
  prisonNumber,
})

const toAssessment = (
  prisonId: string,
  assessment: AssemmentDto,
  prisonNamesById: Map<string, string>,
): Assessment => ({
  prisonId,
  prisonName: prisonNamesById.get(prisonId),
  type: toAssessmentType(assessment.qualificationType),
  grade: assessment.qualificationGrade,
  assessmentDate: dateOrNull(assessment.assessmentDate),
})

const dateOrNull = (value: string): Date | undefined => {
  return value ? startOfDay(parseISO(value)) : undefined
}

const toAssessmentType = (qualificationType: string): 'ENGLISH' | 'MATHS' | 'DIGITAL_LITERACY' => {
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
