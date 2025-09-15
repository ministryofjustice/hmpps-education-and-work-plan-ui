import { parseISO, startOfDay } from 'date-fns'
import type { LddAssessment, PrisonerSupportNeeds } from 'viewModels'
import type { AllAssessmentDTO, LearnerLatestAssessmentV1DTO, LearnerLddInfoExternalV1DTO } from 'curiousApiClient'

const toPrisonerSupportNeeds = (allAssessments: AllAssessmentDTO): PrisonerSupportNeeds => {
  const learnerLddInfos = ((allAssessments?.v1 || []) as Array<LearnerLatestAssessmentV1DTO>).flatMap(
    assessment => assessment.ldd || [],
  ) as Array<LearnerLddInfoExternalV1DTO>
  return {
    lddAssessments: learnerLddInfos.map(toLddAssessment),
  }
}

const toLddAssessment = (learnerLddInfo: LearnerLddInfoExternalV1DTO): LddAssessment => ({
  prisonId: learnerLddInfo.establishmentId,
  rapidAssessmentDate: dateOrNull(learnerLddInfo.rapidAssessmentDate),
  inDepthAssessmentDate: dateOrNull(learnerLddInfo.inDepthAssessmentDate),
  primaryLddAndHealthNeeds: learnerLddInfo.lddPrimaryName,
  additionalLddAndHealthNeeds: learnerLddInfo.lddSecondaryNames || [],
  hasSupportNeeds: !!(
    learnerLddInfo.rapidAssessmentDate ||
    learnerLddInfo.inDepthAssessmentDate ||
    learnerLddInfo.lddPrimaryName ||
    (learnerLddInfo.lddSecondaryNames || []).length > 0
  ),
})

const dateOrNull = (value: string): Date | undefined => {
  return value ? startOfDay(parseISO(value)) : undefined
}

export default toPrisonerSupportNeeds
