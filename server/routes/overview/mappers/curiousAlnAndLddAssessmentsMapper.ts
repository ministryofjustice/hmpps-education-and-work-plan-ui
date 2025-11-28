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
        // At least one of the 4 fields needs to have a value for it to be considered a valid LDD record and for us to map it
        lddAssessment.lddPrimaryName?.length > 0 ||
        (lddAssessment.lddSecondaryNames || []).length > 0 ||
        lddAssessment.rapidAssessmentDate != null ||
        lddAssessment.inDepthAssessmentDate != null,
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
  referral: curiousV2AlnAssessment.stakeholderReferral
    ? curiousV2AlnAssessment.stakeholderReferral.split(',').map(toAlnAssessmentReferral)
    : [],
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
