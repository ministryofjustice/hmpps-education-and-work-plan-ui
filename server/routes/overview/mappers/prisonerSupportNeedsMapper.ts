import { parseISO } from 'date-fns'
import type { LddAssessment, PrisonerSupportNeeds } from 'viewModels'
import type { AllAssessmentDTO, LearnerLatestAssessmentV1DTO, LearnerLddInfoExternalV1DTO } from 'curiousApiClient'

const toPrisonerSupportNeeds = (allAssessments: AllAssessmentDTO): PrisonerSupportNeeds => ({
  lddAssessments: (allAssessments?.v1 || [])
    .flatMap((assessment: LearnerLatestAssessmentV1DTO) => assessment.ldd || [])
    .filter(
      (lddAssessment: LearnerLddInfoExternalV1DTO) =>
        lddAssessment.lddPrimaryName && (lddAssessment.rapidAssessmentDate || lddAssessment.inDepthAssessmentDate),
    )
    .map(toLddAssessment),
})

const toLddAssessment = (learnerLddInfo: LearnerLddInfoExternalV1DTO): LddAssessment => ({
  prisonId: learnerLddInfo.establishmentId,
  rapidAssessmentDate: learnerLddInfo.rapidAssessmentDate ? parseISO(learnerLddInfo.rapidAssessmentDate) : null,
  inDepthAssessmentDate: learnerLddInfo.inDepthAssessmentDate ? parseISO(learnerLddInfo.inDepthAssessmentDate) : null,
  primaryLddAndHealthNeeds: learnerLddInfo.lddPrimaryName,
  additionalLddAndHealthNeeds: learnerLddInfo.lddSecondaryNames || [],
})

export default toPrisonerSupportNeeds
