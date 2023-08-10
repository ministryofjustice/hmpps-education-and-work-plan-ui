import type { LearnerEducation } from 'curiousApiClient'

const aValidEnglishLearnerEducation = (prisonNumber = 'A1234BC'): LearnerEducation => {
  return {
    prn: prisonNumber,
    establishmentId: 'MDI',
    establishmentName: 'MOORLAND (HMP & YOI)',
    courseName: 'GCSE English',
    courseCode: '008ENGL06',
    isAccredited: false,
    aimSequenceNumber: 1,
    learningStartDate: '2021-06-01',
    learningPlannedEndDate: '2021-08-06',
    learningActualEndDate: null,
    learnersAimType: null,
    miNotionalNVQLevelV2: null,
    sectorSubjectAreaTier1: null,
    sectorSubjectAreaTier2: null,
    occupationalIndicator: null,
    accessHEIndicator: null,
    keySkillsIndicator: null,
    functionalSkillsIndicator: null,
    gceIndicator: null,
    gcsIndicator: null,
    asLevelIndicator: null,
    a2LevelIndicator: null,
    qcfIndicator: null,
    qcfDiplomaIndicator: null,
    qcfCertificateIndicator: null,
    lrsGLH: null,
    attendedGLH: null,
    actualGLH: 100,
    outcome: null,
    outcomeGrade: null,
    employmentOutcome: null,
    withdrawalReasons: null,
    prisonWithdrawalReason: null,
    completionStatus:
      'The learner is continuing or intending to continue the learning activities leading to the learning aim',
    withdrawalReasonAgreed: false,
    fundingModel: 'Adult skills',
    fundingAdjustmentPriorLearning: null,
    subcontractedPartnershipUKPRN: null,
    deliveryLocationPostCode: 'DN7 6BW',
    unitType: null,
    fundingType: 'DPS',
    deliveryMethodType: 'Pack only learning - In Cell/Room',
    alevelIndicator: null,
  }
}

const aValidMathsLearnerEducation = (prisonNumber = 'A1234BC'): LearnerEducation => {
  return {
    prn: prisonNumber,
    establishmentId: 'WDI',
    establishmentName: 'WAKEFIELD (HMP)',
    courseName: 'GCSE Maths',
    courseCode: '246674',
    isAccredited: true,
    aimSequenceNumber: 1,
    learningStartDate: '2016-05-18',
    learningPlannedEndDate: '2016-12-23',
    learningActualEndDate: '2016-07-15',
    learnersAimType: 'Component learning aim within a programme',
    miNotionalNVQLevelV2: 'Level 5',
    sectorSubjectAreaTier1: 'Science and Mathematics',
    sectorSubjectAreaTier2: 'Science',
    occupationalIndicator: false,
    accessHEIndicator: false,
    keySkillsIndicator: false,
    functionalSkillsIndicator: false,
    gceIndicator: false,
    gcsIndicator: false,
    asLevelIndicator: false,
    a2LevelIndicator: false,
    qcfIndicator: false,
    qcfDiplomaIndicator: false,
    qcfCertificateIndicator: false,
    lrsGLH: 0,
    attendedGLH: 100,
    actualGLH: 200,
    outcome: 'No achievement',
    outcomeGrade: null,
    employmentOutcome: null,
    withdrawalReasons: 'Other',
    prisonWithdrawalReason: 'Significant ill health causing them to be unable to attend education',
    completionStatus: 'The learner has withdrawn from the learning activities leading to the learning aim',
    withdrawalReasonAgreed: true,
    fundingModel: 'Adult skills',
    fundingAdjustmentPriorLearning: null,
    subcontractedPartnershipUKPRN: null,
    deliveryLocationPostCode: 'WF2 9AG',
    unitType: 'QUALIFICATION',
    fundingType: 'Family Learning',
    deliveryMethodType: 'Pack only learning - In Cell/Room',
    alevelIndicator: false,
  }
}

const aValidWoodWorkingLearnerEducation = (prisonNumber = 'A1234BC'): LearnerEducation => {
  return {
    prn: prisonNumber,
    establishmentId: 'MDI',
    establishmentName: 'MOORLAND (HMP & YOI)',
    courseName: 'City & Guilds Wood Working',
    courseCode: '008WOOD06',
    isAccredited: false,
    aimSequenceNumber: 1,
    learningStartDate: '2021-06-01',
    learningPlannedEndDate: '2021-08-06',
    learningActualEndDate: null,
    learnersAimType: null,
    miNotionalNVQLevelV2: null,
    sectorSubjectAreaTier1: null,
    sectorSubjectAreaTier2: null,
    occupationalIndicator: null,
    accessHEIndicator: null,
    keySkillsIndicator: null,
    functionalSkillsIndicator: null,
    gceIndicator: null,
    gcsIndicator: null,
    asLevelIndicator: null,
    a2LevelIndicator: null,
    qcfIndicator: null,
    qcfDiplomaIndicator: null,
    qcfCertificateIndicator: null,
    lrsGLH: null,
    attendedGLH: null,
    actualGLH: 100,
    outcome: null,
    outcomeGrade: null,
    employmentOutcome: null,
    withdrawalReasons: null,
    prisonWithdrawalReason: null,
    completionStatus:
      'The learner is continuing or intending to continue the learning activities leading to the learning aim',
    withdrawalReasonAgreed: false,
    fundingModel: 'Adult skills',
    fundingAdjustmentPriorLearning: null,
    subcontractedPartnershipUKPRN: null,
    deliveryLocationPostCode: 'DN7 6BW',
    unitType: null,
    fundingType: 'DPS',
    deliveryMethodType: 'Pack only learning - In Cell/Room',
    alevelIndicator: null,
  }
}

export { aValidEnglishLearnerEducation, aValidMathsLearnerEducation, aValidWoodWorkingLearnerEducation }
