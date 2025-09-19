import { parseISO, startOfDay } from 'date-fns'
import type { LearnerProfile } from 'curiousApiClient'
import toFunctionalSkills from './functionalSkillsMapper'
import {
  aDigitalFunctionalSkillsLearnerAssessmentsDTO,
  aLearnerAssessmentV1DTO,
  aLearnerAssessmentV2DTO,
  aLearnerLatestAssessmentV1DTO,
  aMathsFunctionalSkillsLearnerAssessmentsDTO,
  anAllAssessmentDTO,
  anEnglishFunctionalSkillsLearnerAssessmentsDTO,
  anEsolLearnerAssessmentsDTO,
  anExternalAssessmentsDTO,
  aReadingLearnerAssessmentsDTO,
} from '../../../testsupport/curiousAssessmentsTestDataBuilder'
import { aValidCurious1Assessment, aValidCurious2Assessment } from '../../../testsupport/assessmentTestDataBuilder'
import AssessmentTypeValue from '../../../enums/assessmentTypeValue'

describe('functionalSkillsMapper', () => {
  describe('Map to functional skills from the Curious 1 assessments data as precedence over the Curious 2 assessments', () => {
    it('should map to functional skills given learner profiles', () => {
      // Given
      const prisonNumber = 'G6123VU'
      const learnerProfiles: Array<LearnerProfile> = [
        {
          prn: prisonNumber,
          establishmentId: 'DNI',
          establishmentName: 'DONCASTER (HMP)',
          qualifications: [
            {
              qualificationType: 'Digital Literacy',
              qualificationGrade: 'Level 3',
              assessmentDate: '2022-08-29',
            },
          ],
        },
      ]

      const allAssessments = anAllAssessmentDTO({
        v1Assessments: [
          aLearnerLatestAssessmentV1DTO({
            // We do not expect this assessment to be mapped because there is an assessment in the array of LearnerProfile
            qualifications: [
              aLearnerAssessmentV1DTO({
                prisonId: 'MDI',
                qualificationType: 'English',
                qualificationGrade: 'Level 1',
                assessmentDate: '2012-02-16',
              }),
            ],
          }),
        ],
        v2Assessments: aLearnerAssessmentV2DTO({
          assessments: anExternalAssessmentsDTO({
            // We expect all of these Curious 2 assessments to be mapped
            englishFunctionalSkills: [anEnglishFunctionalSkillsLearnerAssessmentsDTO()],
            mathsFunctionalSkills: [aMathsFunctionalSkillsLearnerAssessmentsDTO()],
            digitalFunctionalSkillsAssessments: [aDigitalFunctionalSkillsLearnerAssessmentsDTO()],
            esolAssessments: [anEsolLearnerAssessmentsDTO()],
            readingAssessments: [aReadingLearnerAssessmentsDTO()],
          }),
        }),
      })

      const expected = {
        assessments: [
          // The Curious 2 English assessment
          aValidCurious2Assessment({
            type: AssessmentTypeValue.ENGLISH,
            assessmentDate: startOfDay('2025-10-01'),
            prisonId: 'MDI',
            level: 'Entry Level 2',
            levelBanding: '2.1',
            nextStep: 'Progress to course at level consistent with assessment result',
            referral: 'Education Specialist',
          }),
          // The Curious 2 Maths assessment
          aValidCurious2Assessment({
            type: AssessmentTypeValue.MATHS,
            assessmentDate: startOfDay('2025-10-01'),
            prisonId: 'MDI',
            level: 'Entry Level 2',
            levelBanding: '2.1',
            nextStep: 'Progress to course at level consistent with assessment result',
            referral: 'Education Specialist',
          }),
          // The Curious 2 Digital Literacy assessment
          aValidCurious2Assessment({
            type: AssessmentTypeValue.DIGITAL_LITERACY,
            assessmentDate: startOfDay('2025-10-01'),
            prisonId: 'MDI',
            level: 'Level 1',
            levelBanding: '1.2',
            nextStep: null,
            referral: null,
          }),
          // The Curious 2 Reading assessment
          aValidCurious2Assessment({
            type: AssessmentTypeValue.READING,
            assessmentDate: startOfDay('2025-10-01'),
            prisonId: 'MDI',
            level: 'non-reader',
            levelBanding: null,
            nextStep: 'Refer for reading support level.',
            referral: 'Education Specialist',
          }),
          // The Curious 2 ESOL assessment
          aValidCurious2Assessment({
            type: AssessmentTypeValue.ESOL,
            assessmentDate: startOfDay('2025-10-01'),
            prisonId: 'MDI',
            level: 'ESOL Pathway',
            levelBanding: null,
            nextStep: 'English Language Support Level 1',
            referral: 'Education Specialist',
          }),
          // The Curious 1 assessment mapped from the LearnerProfile array
          aValidCurious1Assessment({
            assessmentDate: startOfDay(parseISO('2022-08-29')),
            level: 'Level 3',
            prisonId: 'DNI',
            type: 'DIGITAL_LITERACY',
          }),
        ],
      }

      // When
      const actual = toFunctionalSkills(allAssessments, learnerProfiles)

      // Then
      expect(actual).toEqual(expected)
    })
  })

  describe('Map to functional skills from Curious 2 assessments data', () => {
    it('should map to functional skills given assessments contain v1 functional skills assessments', () => {
      // Given
      const prisonNumber = 'G6123VU'
      const allAssessments = anAllAssessmentDTO({
        v1Assessments: [
          aLearnerLatestAssessmentV1DTO({
            prisonNumber,
            qualifications: [
              aLearnerAssessmentV1DTO({
                prisonId: 'MDI',
                qualificationType: 'English',
                qualificationGrade: 'Level 1',
                assessmentDate: '2012-02-16',
              }),
            ],
          }),
        ],
        v2Assessments: aLearnerAssessmentV2DTO({
          assessments: anExternalAssessmentsDTO({
            englishFunctionalSkills: [],
            mathsFunctionalSkills: [],
            digitalFunctionalSkillsAssessments: [],
            esolAssessments: [],
            readingAssessments: [],
          }),
        }),
      })

      const expected = {
        assessments: [
          aValidCurious1Assessment({
            assessmentDate: startOfDay(parseISO('2012-02-16')),
            level: 'Level 1',
            prisonId: 'MDI',
            type: 'ENGLISH',
          }),
        ],
      }

      // When
      const actual = toFunctionalSkills(allAssessments)

      // Then
      expect(actual).toEqual(expected)
    })
  })
})
