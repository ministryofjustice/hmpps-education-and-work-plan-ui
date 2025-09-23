import { parseISO } from 'date-fns'
import type { LddAssessment, CuriousAlnAndLddAssessments, AlnAssessment } from 'viewModels'
import type {
  AllAssessmentDTO,
  LearnerAssessmentsAlnDTO,
  LearnerLatestAssessmentV1DTO,
  LearnerLddInfoExternalV1DTO,
} from 'curiousApiClient'
import AlnAssessmentReferral from '../../../enums/alnAssessmentReferral'

const toCuriousAlnAndLddAssessments = (allAssessments: AllAssessmentDTO): CuriousAlnAndLddAssessments => ({
  lddAssessments: (allAssessments?.v1 || [])
    .flatMap((assessment: LearnerLatestAssessmentV1DTO) => assessment.ldd || [])
    .filter(
      (lddAssessment: LearnerLddInfoExternalV1DTO) =>
        lddAssessment.lddPrimaryName && (lddAssessment.rapidAssessmentDate || lddAssessment.inDepthAssessmentDate),
    )
    .map(toLddAssessment),
  alnAssessments: allAssessments?.v2?.assessments?.aln?.map(toAlnAssessment) || [],
})

const toLddAssessment = (learnerLddInfo: LearnerLddInfoExternalV1DTO): LddAssessment => ({
  prisonId: learnerLddInfo.establishmentId,
  rapidAssessmentDate: learnerLddInfo.rapidAssessmentDate ? parseISO(learnerLddInfo.rapidAssessmentDate) : null,
  inDepthAssessmentDate: learnerLddInfo.inDepthAssessmentDate ? parseISO(learnerLddInfo.inDepthAssessmentDate) : null,
  primaryLddAndHealthNeed: learnerLddInfo.lddPrimaryName,
  additionalLddAndHealthNeeds: learnerLddInfo.lddSecondaryNames || [],
})

const toAlnAssessment = (curiousV2AlnAssessment: LearnerAssessmentsAlnDTO): AlnAssessment => ({
  prisonId: curiousV2AlnAssessment.establishmentId,
  assessmentDate: parseISO(curiousV2AlnAssessment.assessmentDate),
  referral: toAlnAssessmentReferral(curiousV2AlnAssessment.stakeholderReferral),
  additionalNeedsIdentified: curiousV2AlnAssessment.assessmentOutcome?.toLowerCase().trim() === 'yes',
})

const toAlnAssessmentReferral = (apiStakeholderReferral: string): AlnAssessmentReferral =>
  ({
    healthcare: AlnAssessmentReferral.HEALTHCARE,
    psychology: AlnAssessmentReferral.PSYCHOLOGY,
    'education specialist': AlnAssessmentReferral.EDUCATION_SPECIALIST,
    nsm: AlnAssessmentReferral.NSM,
    'substance misuse team': AlnAssessmentReferral.SUBSTANCE_MISUSE_TEAM,
    'safer custody': AlnAssessmentReferral.SAFER_CUSTODY,
    other: AlnAssessmentReferral.OTHER,
  })[apiStakeholderReferral?.toLowerCase().trim()]

export default toCuriousAlnAndLddAssessments
