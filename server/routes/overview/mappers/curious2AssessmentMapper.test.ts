import { startOfDay } from 'date-fns'
import type { ExternalAssessmentsDTO } from 'curiousApiClient'
import type { Assessment } from 'viewModels'
import {
  aDigitalFunctionalSkillsLearnerAssessmentsDTO,
  aMathsFunctionalSkillsLearnerAssessmentsDTO,
  anEnglishFunctionalSkillsLearnerAssessmentsDTO,
  anEsolLearnerAssessmentsDTO,
  anExternalAssessmentsDTO,
  aReadingLearnerAssessmentsDTO,
} from '../../../testsupport/curiousAssessmentsTestDataBuilder'
import {
  toCurious2ESOLAssessments,
  toCurious2FunctionalSkillsAssessments,
  toCurious2ReadingAssessments,
} from './curious2AssessmentMapper'
import { aValidCurious2Assessment } from '../../../testsupport/assessmentTestDataBuilder'
import AssessmentTypeValue from '../../../enums/assessmentTypeValue'

describe('curious2AssessmentMapper', () => {
  const externalAssessments = anExternalAssessmentsDTO({
    englishFunctionalSkills: [
      anEnglishFunctionalSkillsLearnerAssessmentsDTO({
        prisonId: 'LEI',
        assessmentDate: '2024-12-13',
        workingTowardsLevel: 'Pre-Entry',
        levelBranding: '0.3',
        assessmentNextStep: 'Progress to course at level consistent with assessment result',
        stakeholderReferral: 'Education Specialist',
      }),
      anEnglishFunctionalSkillsLearnerAssessmentsDTO({
        prisonId: 'LPI',
        assessmentDate: '2025-10-20',
        workingTowardsLevel: 'Level 1',
        levelBranding: '1.4',
        assessmentNextStep: 'Progress to higher level based on evidence of prior attainment',
        stakeholderReferral: 'NSM',
      }),
    ],
    mathsFunctionalSkills: [
      aMathsFunctionalSkillsLearnerAssessmentsDTO({
        prisonId: 'CYI',
        assessmentDate: '2025-06-15',
        workingTowardsLevel: 'Level 3',
        levelBranding: '3.3',
        assessmentNextStep: 'Progress to higher level based on evidence of prior attainment',
        stakeholderReferral: 'Psychology',
      }),
    ],
    digitalFunctionalSkillsAssessments: [
      aDigitalFunctionalSkillsLearnerAssessmentsDTO({
        prisonId: 'GPI',
        assessmentDate: '2025-05-22',
        workingTowardsLevel: 'Entry Level',
        levelBranding: '0.6',
      }),
      aDigitalFunctionalSkillsLearnerAssessmentsDTO({
        prisonId: 'FEI',
        assessmentDate: '2025-07-01',
        workingTowardsLevel: 'Level 1',
        levelBranding: '1.2',
      }),
    ],
    readingAssessments: [
      aReadingLearnerAssessmentsDTO({
        prisonId: 'LEI',
        assessmentDate: '2024-12-13',
        assessmentOutcome: 'non-reader',
        assessmentNextStep: 'Refer for reading support level.',
        stakeholderReferral: 'Education Specialist',
      }),
      aReadingLearnerAssessmentsDTO({
        prisonId: 'SKI',
        assessmentDate: '2025-09-01',
        assessmentOutcome: 'emerging reader',
        assessmentNextStep: 'Reading support not required at this time.',
        stakeholderReferral: 'Other',
      }),
    ],
    esolAssessments: [
      anEsolLearnerAssessmentsDTO({
        prisonId: 'BXI',
        assessmentDate: '2025-10-01',
        assessmentOutcome: 'ESOL Pathway',
        assessmentNextStep: 'English Language Support Level 1',
        stakeholderReferral: 'Education Specialist',
      }),
      anEsolLearnerAssessmentsDTO({
        prisonId: 'MDI',
        assessmentDate: '2025-10-15',
        assessmentOutcome: 'ESOL Pathway',
        assessmentNextStep: 'English Language Support Level 2',
        stakeholderReferral: 'Substance Misuse Team',
      }),
    ],
  })

  describe('toCurious2FunctionalSkillsAssessments', () => {
    it('should map Functional Skills assessments', () => {
      const externalAssessmentsDTO = {
        ...externalAssessments,
      }

      const expected: Array<Assessment> = [
        aValidCurious2Assessment({
          prisonId: 'LEI',
          type: AssessmentTypeValue.ENGLISH,
          assessmentDate: startOfDay('2024-12-13'),
          level: 'Pre-Entry',
          levelBanding: '0.3',
          nextStep: 'Progress to course at level consistent with assessment result',
          referral: 'Education Specialist',
        }),
        aValidCurious2Assessment({
          prisonId: 'LPI',
          type: AssessmentTypeValue.ENGLISH,
          assessmentDate: startOfDay('2025-10-20'),
          level: 'Level 1',
          levelBanding: '1.4',
          nextStep: 'Progress to higher level based on evidence of prior attainment',
          referral: 'NSM',
        }),
        aValidCurious2Assessment({
          prisonId: 'CYI',
          type: AssessmentTypeValue.MATHS,
          assessmentDate: startOfDay('2025-06-15'),
          level: 'Level 3',
          levelBanding: '3.3',
          nextStep: 'Progress to higher level based on evidence of prior attainment',
          referral: 'Psychology',
        }),
        aValidCurious2Assessment({
          prisonId: 'GPI',
          type: AssessmentTypeValue.DIGITAL_LITERACY,
          assessmentDate: startOfDay('2025-05-22'),
          level: 'Entry Level',
          levelBanding: '0.6',
          nextStep: null,
          referral: null,
        }),
        aValidCurious2Assessment({
          prisonId: 'FEI',
          type: AssessmentTypeValue.DIGITAL_LITERACY,
          assessmentDate: startOfDay('2025-07-01'),
          level: 'Level 1',
          levelBanding: '1.2',
          nextStep: null,
          referral: null,
        }),
      ]

      // When
      const actual = toCurious2FunctionalSkillsAssessments(externalAssessmentsDTO)

      // Then
      expect(actual).toEqual(expected)
    })

    it('should map Functional Skills assessments given null ExternalAssessmentsDTO', () => {
      // Given
      const externalAssessmentsDTO: ExternalAssessmentsDTO = null

      const expected: Array<Assessment> = []

      // When
      const actual = toCurious2FunctionalSkillsAssessments(externalAssessmentsDTO)

      // Then
      expect(actual).toEqual(expected)
    })

    it('should map Functional Skills assessments given functional skills arrays are all null within ExternalAssessmentsDTO', () => {
      // Given
      const externalAssessmentsDTO = {
        ...externalAssessments,
        englishFunctionalSkills: null,
        mathsFunctionalSkills: null,
        digitalSkillsFunctionalSkills: null,
      }

      const expected: Array<Assessment> = []

      // When
      const actual = toCurious2FunctionalSkillsAssessments(externalAssessmentsDTO)

      // Then
      expect(actual).toEqual(expected)
    })

    it('should map Functional Skills assessments given functional skills arrays are all empty arrays within ExternalAssessmentsDTO', () => {
      // Given
      const externalAssessmentsDTO = {
        ...externalAssessments,
        englishFunctionalSkills: [],
        mathsFunctionalSkills: [],
        digitalSkillsFunctionalSkills: [],
      }

      const expected: Array<Assessment> = []

      // When
      const actual = toCurious2FunctionalSkillsAssessments(externalAssessmentsDTO)

      // Then
      expect(actual).toEqual(expected)
    })
  })

  describe('toCurious2ReadingAssessments', () => {
    it('should map ESOL assessments', () => {
      // Given
      const externalAssessmentsDTO = {
        ...externalAssessments,
      }

      const expected: Array<Assessment> = [
        aValidCurious2Assessment({
          prisonId: 'LEI',
          type: AssessmentTypeValue.READING,
          assessmentDate: startOfDay('2024-12-13'),
          level: 'non-reader',
          levelBanding: null,
          nextStep: 'Refer for reading support level.',
          referral: 'Education Specialist',
        }),
        aValidCurious2Assessment({
          prisonId: 'SKI',
          type: AssessmentTypeValue.READING,
          assessmentDate: startOfDay('2025-09-01'),
          level: 'emerging reader',
          levelBanding: null,
          nextStep: 'Reading support not required at this time.',
          referral: 'Other',
        }),
      ]

      // When
      const actual = toCurious2ReadingAssessments(externalAssessmentsDTO)

      // Then
      expect(actual).toEqual(expected)
    })

    it('should map ESOL assessments given null ExternalAssessmentsDTO', () => {
      // Given
      const externalAssessmentsDTO: ExternalAssessmentsDTO = null

      const expected: Array<Assessment> = []

      // When
      const actual = toCurious2ReadingAssessments(externalAssessmentsDTO)

      // Then
      expect(actual).toEqual(expected)
    })

    it('should map ESOL assessments given Reading array in ExternalAssessmentsDTO is null', () => {
      // Given
      const externalAssessmentsDTO = {
        ...externalAssessments,
        reading: null,
      }

      const expected: Array<Assessment> = []

      // When
      const actual = toCurious2ReadingAssessments(externalAssessmentsDTO)

      // Then
      expect(actual).toEqual(expected)
    })

    it('should map Reading assessments given Reading array in ExternalAssessmentsDTO is empty array', () => {
      // Given
      const externalAssessmentsDTO = {
        ...externalAssessments,
        reading: [],
      }

      const expected: Array<Assessment> = []

      // When
      const actual = toCurious2ReadingAssessments(externalAssessmentsDTO)

      // Then
      expect(actual).toEqual(expected)
    })
  })

  describe('toCurious2ESOLAssessments', () => {
    it('should map ESOL assessments', () => {
      // Given
      const externalAssessmentsDTO = {
        ...externalAssessments,
      }

      const expected: Array<Assessment> = [
        aValidCurious2Assessment({
          prisonId: 'BXI',
          type: AssessmentTypeValue.ESOL,
          assessmentDate: startOfDay('2025-10-01'),
          level: 'ESOL Pathway',
          levelBanding: null,
          nextStep: 'English Language Support Level 1',
          referral: 'Education Specialist',
        }),
        aValidCurious2Assessment({
          prisonId: 'MDI',
          type: AssessmentTypeValue.ESOL,
          assessmentDate: startOfDay('2025-10-15'),
          level: 'ESOL Pathway',
          levelBanding: null,
          nextStep: 'English Language Support Level 2',
          referral: 'Substance Misuse Team',
        }),
      ]

      // When
      const actual = toCurious2ESOLAssessments(externalAssessmentsDTO)

      // Then
      expect(actual).toEqual(expected)
    })

    it('should map ESOL assessments given null ExternalAssessmentsDTO', () => {
      // Given
      const externalAssessmentsDTO: ExternalAssessmentsDTO = null

      const expected: Array<Assessment> = []

      // When
      const actual = toCurious2ESOLAssessments(externalAssessmentsDTO)

      // Then
      expect(actual).toEqual(expected)
    })

    it('should map ESOL assessments given ESOL array in ExternalAssessmentsDTO is null', () => {
      // Given
      const externalAssessmentsDTO = {
        ...externalAssessments,
        esol: null,
      }

      const expected: Array<Assessment> = []

      // When
      const actual = toCurious2ESOLAssessments(externalAssessmentsDTO)

      // Then
      expect(actual).toEqual(expected)
    })

    it('should map ESOL assessments given ESOL array in ExternalAssessmentsDTO is empty array', () => {
      // Given
      const externalAssessmentsDTO = {
        ...externalAssessments,
        esol: [],
      }

      const expected: Array<Assessment> = []

      // When
      const actual = toCurious2ESOLAssessments(externalAssessmentsDTO)

      // Then
      expect(actual).toEqual(expected)
    })
  })
})
