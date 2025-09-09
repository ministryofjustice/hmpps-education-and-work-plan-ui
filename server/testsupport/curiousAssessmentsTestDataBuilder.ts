import type {
  AllAssessmentDTO,
  LearnerLatestAssessmentV1DTO,
  LearnerAssessmentV1DTO,
  LearnerLddInfoExternalV1DTO,
  LearnerAssessmentV2DTO,
  ExternalAssessmentsDTO,
  LearnerAssessmentsDTO,
  LearnerAssessmentsFunctionalSkillsDTO,
  LearnerAssessmentsAlnDTO,
} from 'curiousApiClient'

const anAllAssessmentDTO = (options?: {
  v1Assessments?: Array<LearnerLatestAssessmentV1DTO>
  v2Assessments?: LearnerAssessmentV2DTO
}): AllAssessmentDTO => ({
  v1: options?.v1Assessments === null ? null : options?.v1Assessments || [aLearnerLatestAssessmentV1DTO()],
  v2: options?.v2Assessments === null ? null : options?.v2Assessments || aLearnerAssessmentV2DTO(),
})

const aLearnerLatestAssessmentV1DTO = (options?: {
  prisonNumber?: string
  qualifications?: Array<LearnerAssessmentV1DTO>
  lddAssessments?: Array<LearnerLddInfoExternalV1DTO>
}): LearnerLatestAssessmentV1DTO => ({
  prn: options?.prisonNumber || 'A1234BC',
  qualifications: options?.qualifications || [aLearnerAssessmentV1DTO()],
  ldd: options?.lddAssessments || [aLearnerLddInfoExternalV1DTO()],
})

const aLearnerAssessmentV1DTO = (options?: {
  prisonId?: string
  prisonName?: string
  qualificationType?: 'English' | 'Maths' | 'Digital Literacy'
  qualificationGrade?: string
  assessmentDate?: string
}): LearnerAssessmentV1DTO => ({
  establishmentId: options?.prisonId || 'MDI',
  establishmentName: options?.prisonName || 'MOORLAND (HMP & YOI)',
  qualification: {
    qualificationType: options?.qualificationType || 'English',
    qualificationGrade: options?.qualificationGrade || 'Level 1',
    assessmentDate: options?.assessmentDate || '2012-02-16',
  },
})

const aLearnerLddInfoExternalV1DTO = (options?: {
  prisonId?: string
  prisonName?: string
  lddPrimaryName?: string
  lddSecondaryNames?: string[]
  inDepthAssessmentDate?: string
  rapidAssessmentDate?: string
}): LearnerLddInfoExternalV1DTO => ({
  establishmentId: options?.prisonId === null ? null : options?.prisonId || 'MDI',
  establishmentName: options?.prisonName === null ? null : options?.prisonName || 'MOORLAND (HMP & YOI)',
  lddPrimaryName: options?.lddPrimaryName === null ? null : options?.lddPrimaryName || 'Visual impairment',
  lddSecondaryNames:
    options?.lddSecondaryNames === null
      ? null
      : options?.lddSecondaryNames || [
          'Hearing impairment',
          'Mental health difficulty',
          'Social and emotional difficulties',
        ],
  inDepthAssessmentDate:
    options?.inDepthAssessmentDate === null ? null : options?.inDepthAssessmentDate || '2012-02-16',
  rapidAssessmentDate: options?.rapidAssessmentDate === null ? null : options?.rapidAssessmentDate || '2012-02-16',
})

const aLearnerAssessmentV2DTO = (options?: {
  prisonNumber?: string
  assessments?: ExternalAssessmentsDTO
}): LearnerAssessmentV2DTO => ({
  prn: options?.prisonNumber || 'A1234BC',
  assessments: options?.assessments || anExternalAssessmentsDTO(),
})

const anExternalAssessmentsDTO = (options?: {
  alnAssessments?: Array<LearnerAssessmentsAlnDTO>
  digitalFunctionalSkillsAssessments?: Array<LearnerAssessmentsFunctionalSkillsDTO>
  englishFunctionalSkills?: Array<LearnerAssessmentsFunctionalSkillsDTO>
  mathsFunctionalSkills?: Array<LearnerAssessmentsFunctionalSkillsDTO>
  esolAssessments?: Array<LearnerAssessmentsDTO>
  readingAssessments?: Array<LearnerAssessmentsDTO>
}): ExternalAssessmentsDTO => ({
  aln: options?.alnAssessments || [anAlnLearnerAssessmentsDTO()],
  digitalSkillsFunctionalSkills: options?.digitalFunctionalSkillsAssessments || [
    aDigitalFunctionalSkillsLearnerAssessmentsDTO(),
  ],
  englishFunctionalSkills: options?.englishFunctionalSkills || [anEnglishFunctionalSkillsLearnerAssessmentsDTO()],
  mathsFunctionalSkills: options?.mathsFunctionalSkills || [aMathsFunctionalSkillsLearnerAssessmentsDTO()],
  esol: options?.esolAssessments || [anEsolLearnerAssessmentsDTO()],
  reading: options?.readingAssessments || [aReadingLearnerAssessmentsDTO()],
})

const anAlnLearnerAssessmentsDTO = (options?: {
  prisonId?: string
  prisonName?: string
  assessmentDate?: string
  assessmentOutcome?: 'Yes' | 'No'
  hasPrisonerConsent?: 'Yes' | 'No'
  stakeholderReferral?:
    | 'Healthcare'
    | 'Psychology'
    | 'Education Specialist'
    | 'NSM'
    | 'Substance Misuse Team'
    | 'Safer Custody'
    | 'Other'
}): LearnerAssessmentsAlnDTO => ({
  establishmentId: options?.prisonId || 'MDI',
  establishmentName: options?.prisonName || 'MOORLAND (HMP & YOI)',
  assessmentDate: options?.assessmentDate || '2025-10-01',
  assessmentOutcome: options?.assessmentOutcome || 'Yes',
  hasPrisonerConsent: options?.hasPrisonerConsent || 'Yes',
  stakeholderReferral:
    options?.stakeholderReferral === null ? null : options?.stakeholderReferral || 'Education Specialist',
})

const aReadingLearnerAssessmentsDTO = (options?: {
  prisonId?: string
  prisonName?: string
  assessmentDate?: string
  assessmentNextStep?: 'Refer for reading support level.' | 'Reading support not required at this time.'
  assessmentOutcome?: 'non-reader' | 'new reader' | 'emerging reader' | 'consolidating reader' | 'established reader'
  stakeholderReferral?: 'Healthcare' | 'Psychology' | 'Education Specialist' | 'NSM' | 'Substance Misuse Team' | 'Other'
  hasPrisonerConsent?: 'Yes' | 'No'
}): LearnerAssessmentsDTO => ({
  establishmentId: options?.prisonId || 'MDI',
  establishmentName: options?.prisonName || 'MOORLAND (HMP & YOI)',
  assessmentDate: options?.assessmentDate || '2025-10-01',
  assessmentNextStep: options?.assessmentNextStep || 'Refer for reading support level.',
  assessmentOutcome: options?.assessmentOutcome || 'non-reader',
  hasPrisonerConsent: options?.hasPrisonerConsent || 'Yes',
  stakeholderReferral: options?.stakeholderReferral || 'Education Specialist',
})

const anEsolLearnerAssessmentsDTO = (options?: {
  prisonId?: string
  prisonName?: string
  assessmentDate?: string
  assessmentNextStep?:
    | 'English Language Support Level 1'
    | 'English Language Support Level 2'
    | 'English Language Support Level 3'
  assessmentOutcome?: 'ESOL Pathway' | 'Function Skills Pathway'
  stakeholderReferral?: 'Healthcare' | 'Psychology' | 'Education Specialist' | 'NSM' | 'Substance Misuse Team' | 'Other'
  hasPrisonerConsent?: 'Yes' | 'No'
}): LearnerAssessmentsDTO => ({
  establishmentId: options?.prisonId || 'MDI',
  establishmentName: options?.prisonName || 'MOORLAND (HMP & YOI)',
  assessmentDate: options?.assessmentDate || '2025-10-01',
  assessmentNextStep: options?.assessmentNextStep || 'English Language Support Level 1',
  assessmentOutcome: options?.assessmentOutcome || 'ESOL Pathway',
  hasPrisonerConsent: options?.hasPrisonerConsent || 'Yes',
  stakeholderReferral: options?.stakeholderReferral || 'Education Specialist',
})

const anEnglishFunctionalSkillsLearnerAssessmentsDTO = (options?: {
  prisonId?: string
  prisonName?: string
  assessmentDate?: string
  assessmentNextStep?:
    | 'Progress to course at level consistent with assessment result'
    | 'Progress to course at lower level due to individual circumstances'
    | 'Progress to higher level based on evidence of prior attainment'
  workingTowardsLevel?:
    | 'Pre-Entry'
    | 'Entry Level 1'
    | 'Entry Level 2'
    | 'Entry Level 3'
    | 'Level 1'
    | 'Level 2'
    | 'Level 3'
  levelBranding?:
    | '0.0'
    | '0.1'
    | '0.2'
    | '0.3'
    | '0.4'
    | '0.5'
    | '0.6'
    | '0.7'
    | '0.8'
    | '0.9'
    | '1.0'
    | '1.1'
    | '1.2'
    | '1.3'
    | '1.4'
    | '1.5'
    | '1.6'
    | '1.7'
    | '1.8'
    | '1.9'
    | '2.0'
    | '2.1'
    | '2.2'
    | '2.3'
    | '2.4'
    | '2.5'
    | '2.6'
    | '2.7'
    | '2.8'
    | '2.9'
    | '3.0'
    | '3.1'
    | '3.2'
    | '3.3'
    | '3.4'
    | '3.5'
    | '3.6'
    | '3.7'
    | '3.8'
    | '3.9'
  stakeholderReferral?: 'Healthcare' | 'Psychology' | 'Education Specialist' | 'NSM' | 'Substance Misuse Team' | 'Other'
  hasPrisonerConsent?: 'Yes' | 'No'
}): LearnerAssessmentsFunctionalSkillsDTO => ({
  establishmentId: options?.prisonId || 'MDI',
  establishmentName: options?.prisonName || 'MOORLAND (HMP & YOI)',
  assessmentDate: options?.assessmentDate || '2025-10-01',
  assessmentNextStep: options?.assessmentNextStep || 'Progress to course at level consistent with assessment result',
  workingTowardsLevel: options?.workingTowardsLevel || 'Entry Level 2',
  levelBranding: options?.levelBranding || '2.1',
  hasPrisonerConsent: options?.hasPrisonerConsent || 'Yes',
  stakeholderReferral: options?.stakeholderReferral || 'Education Specialist',
})

const aMathsFunctionalSkillsLearnerAssessmentsDTO = (options?: {
  prisonId?: string
  prisonName?: string
  assessmentDate?: string
  assessmentNextStep?:
    | 'Progress to course at level consistent with assessment result'
    | 'Progress to course at lower level due to individual circumstances'
    | 'Progress to higher level based on evidence of prior attainment'
  workingTowardsLevel?:
    | 'Pre-Entry'
    | 'Entry Level 1'
    | 'Entry Level 2'
    | 'Entry Level 3'
    | 'Level 1'
    | 'Level 2'
    | 'Level 3'
  levelBranding?:
    | '0.0'
    | '0.1'
    | '0.2'
    | '0.3'
    | '0.4'
    | '0.5'
    | '0.6'
    | '0.7'
    | '0.8'
    | '0.9'
    | '1.0'
    | '1.1'
    | '1.2'
    | '1.3'
    | '1.4'
    | '1.5'
    | '1.6'
    | '1.7'
    | '1.8'
    | '1.9'
    | '2.0'
    | '2.1'
    | '2.2'
    | '2.3'
    | '2.4'
    | '2.5'
    | '2.6'
    | '2.7'
    | '2.8'
    | '2.9'
    | '3.0'
    | '3.1'
    | '3.2'
    | '3.3'
    | '3.4'
    | '3.5'
    | '3.6'
    | '3.7'
    | '3.8'
    | '3.9'
  stakeholderReferral?: 'Healthcare' | 'Psychology' | 'Education Specialist' | 'NSM' | 'Substance Misuse Team' | 'Other'
  hasPrisonerConsent?: 'Yes' | 'No'
}): LearnerAssessmentsFunctionalSkillsDTO => ({
  establishmentId: options?.prisonId || 'MDI',
  establishmentName: options?.prisonName || 'MOORLAND (HMP & YOI)',
  assessmentDate: options?.assessmentDate || '2025-10-01',
  assessmentNextStep: options?.assessmentNextStep || 'Progress to course at level consistent with assessment result',
  workingTowardsLevel: options?.workingTowardsLevel || 'Entry Level 2',
  levelBranding: options?.levelBranding || '2.1',
  hasPrisonerConsent: options?.hasPrisonerConsent || 'Yes',
  stakeholderReferral: options?.stakeholderReferral || 'Education Specialist',
})

const aDigitalFunctionalSkillsLearnerAssessmentsDTO = (options?: {
  prisonId?: string
  prisonName?: string
  assessmentDate?: string
  workingTowardsLevel?: 'Pre-Entry' | 'Entry Level' | 'Level 1'
  levelBranding?:
    | '0.0'
    | '0.1'
    | '0.2'
    | '0.3'
    | '0.4'
    | '0.5'
    | '0.6'
    | '0.7'
    | '0.8'
    | '0.9'
    | '1.0'
    | '1.1'
    | '1.2'
    | '1.3'
    | '1.4'
    | '1.5'
    | '1.6'
    | '1.7'
    | '1.8'
    | '1.9'
}): LearnerAssessmentsFunctionalSkillsDTO => ({
  establishmentId: options?.prisonId || 'MDI',
  establishmentName: options?.prisonName || 'MOORLAND (HMP & YOI)',
  assessmentDate: options?.assessmentDate || '2025-10-01',
  workingTowardsLevel: options?.workingTowardsLevel || 'Level 1',
  levelBranding: options?.levelBranding || '1.2',
  assessmentNextStep: null,
  hasPrisonerConsent: null,
  stakeholderReferral: null,
})

export {
  anAllAssessmentDTO,
  aLearnerLatestAssessmentV1DTO,
  aLearnerAssessmentV1DTO,
  aLearnerLddInfoExternalV1DTO,
  aLearnerAssessmentV2DTO,
  anExternalAssessmentsDTO,
  anAlnLearnerAssessmentsDTO,
  aReadingLearnerAssessmentsDTO,
  anEsolLearnerAssessmentsDTO,
  anEnglishFunctionalSkillsLearnerAssessmentsDTO,
  aMathsFunctionalSkillsLearnerAssessmentsDTO,
  aDigitalFunctionalSkillsLearnerAssessmentsDTO,
}
