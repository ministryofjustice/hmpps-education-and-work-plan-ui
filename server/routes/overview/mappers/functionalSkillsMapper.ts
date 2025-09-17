import { parseISO, startOfDay } from 'date-fns'
import type {
  AllAssessmentDTO,
  Assessment as AssemmentDto,
  LearnerAssessmentV1DTO,
  LearnerLatestAssessmentV1DTO,
  LearnerProfile,
} from 'curiousApiClient'
import type { Assessment, FunctionalSkills } from 'viewModels'

/**
 * Map to FunctionalSkills
 * @param allAssessments is an instance of AllAssessmentDTO from the Curious 2 /learnerAssessments/v2 endpoint. This contains the
 * prisoner's Functional Skills Assessments from Curious 2, plus **the latest of type** assessments as recorded in Curious 1.
 * It does not contain all Functional Skills Assessments recorded in Curious 1
 * @param learnerProfiles is an optional array of LearnerProfile from the Curious 1 /learnerProfile endpoint. Each
 * is a Functional Skills Assessment from Curious 1. If this argument is provided it is mapped in preference to the
 * Curious 1 assessments contained in the allAssessments argument.
 *
 * The complexity of two arguments is because the main Functional Skills page needs to show ALL functional skills the prisoner
 * has been assessed for; IE. a complete history. Currently the Curious 2 /learnerAssessments/v2 endpoint does not return
 * ALL functional skills recorded in Curious 1 - it only returns the latest of type.
 * TODO - tidy this complexity once the main Functional Skills page can call the new C2 endpoint.
 */
const toFunctionalSkills = (
  allAssessments: AllAssessmentDTO,
  learnerProfiles: Array<LearnerProfile> = null,
): FunctionalSkills => {
  let assessments: Array<Assessment>
  if (learnerProfiles) {
    assessments = learnerProfiles.flatMap(learnerProfile =>
      (learnerProfile.qualifications as Array<AssemmentDto>).map(assessment =>
        assessmentRecordedInCurious1(learnerProfile.establishmentId, assessment),
      ),
    )
  } else {
    const v1LearnerAssessments = ((allAssessments?.v1 || []) as Array<LearnerLatestAssessmentV1DTO>).flatMap(
      assessment => assessment.qualifications || [],
    ) as Array<LearnerAssessmentV1DTO>
    assessments = v1LearnerAssessments
      .filter(v1LearnerAssessment => v1LearnerAssessment.qualification != null)
      .map(learnerAssessmentV1DtoRecordedInCurious1)
  }

  return { assessments }
}

const assessmentRecordedInCurious1 = (prisonId: string, assessment: AssemmentDto): Assessment => ({
  prisonId,
  type: toAssessmentType(assessment.qualificationType),
  grade: assessment.qualificationGrade,
  assessmentDate: dateOrNull(assessment.assessmentDate),
  source: 'CURIOUS1',
})

const learnerAssessmentV1DtoRecordedInCurious1 = (v1LearnerAssessment: LearnerAssessmentV1DTO): Assessment => ({
  prisonId: v1LearnerAssessment.establishmentId,
  type: toAssessmentType(v1LearnerAssessment.qualification.qualificationType),
  grade: v1LearnerAssessment.qualification.qualificationGrade,
  assessmentDate: dateOrNull(v1LearnerAssessment.qualification.assessmentDate),
  source: 'CURIOUS1',
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
