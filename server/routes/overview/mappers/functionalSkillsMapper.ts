import { parseISO, startOfDay } from 'date-fns'
import type { AllAssessmentDTO, LearnerAssessmentV1DTO, LearnerLatestAssessmentV1DTO } from 'curiousApiClient'
import type { Assessment, FunctionalSkills } from 'viewModels'

const toFunctionalSkills = (allAssessments: AllAssessmentDTO): FunctionalSkills => {
  const v1LearnerAssessments = ((allAssessments?.v1 || []) as Array<LearnerLatestAssessmentV1DTO>).flatMap(
    assessment => assessment.qualifications || [],
  ) as Array<LearnerAssessmentV1DTO>
  return {
    assessments: v1LearnerAssessments
      .filter(v1LearnerAssessment => v1LearnerAssessment.qualification != null)
      .map(toAssessment),
  }
}

const toAssessment = (v1LearnerAssessment: LearnerAssessmentV1DTO): Assessment => ({
  prisonId: v1LearnerAssessment.establishmentId,
  type: toAssessmentType(v1LearnerAssessment.qualification.qualificationType),
  grade: v1LearnerAssessment.qualification.qualificationGrade,
  assessmentDate: dateOrNull(v1LearnerAssessment.qualification.assessmentDate),
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
