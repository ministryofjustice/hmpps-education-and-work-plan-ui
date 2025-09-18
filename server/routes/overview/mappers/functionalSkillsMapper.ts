import type { AllAssessmentDTO, ExternalAssessmentsDTO, LearnerProfile } from 'curiousApiClient'
import type { Assessment, FunctionalSkills } from 'viewModels'
import {
  toCurious1AssessmentsFromAllAssessmentDTO,
  toCurious1AssessmentsFromLearnerProfiles,
} from './curious1AssessmentMapper'

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
 * TODO - tidy this complexity once the main Functional Skills page can call just the new C2 endpoint.
 */
const toFunctionalSkills = (
  allAssessments: AllAssessmentDTO,
  learnerProfiles: Array<LearnerProfile> = null,
): FunctionalSkills => {
  const assessments: Array<Assessment> = []

  /*
  Map the assessments recorded in Curious2 into the assessments array.
  */
  const assessmentsRecordedInCurious2: ExternalAssessmentsDTO = allAssessments?.v2?.assessments
  if (assessmentsRecordedInCurious2) {
    // TODO - enable this mapping when the screens have been updated to render assessments from Curious 2
    // assessments.push(...toCurious2FunctionalSkillsAssessments(assessmentsRecordedInCurious2))
  }

  /*
  Map the assessments recorded in Curious1 into the assessments array.
  Curious1 Assessments are mapped from the array of LearnerProfile if specified in precedence to the array of LearnerLatestAssessmentV1DTO
  See method comment for rationale to this logic.
   */
  if (learnerProfiles) {
    assessments.push(...toCurious1AssessmentsFromLearnerProfiles(learnerProfiles))
  } else {
    assessments.push(...toCurious1AssessmentsFromAllAssessmentDTO(allAssessments))
  }

  return { assessments }
}

export default toFunctionalSkills
