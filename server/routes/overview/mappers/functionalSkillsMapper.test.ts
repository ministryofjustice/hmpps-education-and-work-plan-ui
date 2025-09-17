import { parseISO, startOfDay } from 'date-fns'
import type { AllAssessmentDTO, LearnerProfile } from 'curiousApiClient'
import type { Assessment } from 'viewModels'
import toFunctionalSkills from './functionalSkillsMapper'
import {
  aLearnerAssessmentV1DTO,
  aLearnerLatestAssessmentV1DTO,
  anAllAssessmentDTO,
} from '../../../testsupport/curiousAssessmentsTestDataBuilder'
import { aValidCurious1Assessment } from '../../../testsupport/assessmentTestDataBuilder'

describe('functionalSkillsMapper', () => {
  describe('Map to functional skills from the Curious 1 assessments data as precedence over the Curious 2 assessments', () => {
    const allAssessments = anAllAssessmentDTO()

    it('should map to functional skills given learner profiles', () => {
      // Given
      const prisonNumber = 'G6123VU'
      const learnerProfiles: Array<LearnerProfile> = [
        {
          prn: prisonNumber,
          establishmentId: 'MDI',
          establishmentName: 'MOORLAND (HMP & YOI)',
          qualifications: [
            {
              qualificationType: 'English',
              qualificationGrade: 'Level 1',
              assessmentDate: '2012-02-16',
            },
            {
              qualificationType: 'Maths',
              qualificationGrade: 'Level 2',
              assessmentDate: '2012-02-18',
            },
          ],
        },
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

      const expected = {
        assessments: [
          aValidCurious1Assessment({
            assessmentDate: startOfDay(parseISO('2012-02-16')),
            level: 'Level 1',
            prisonId: 'MDI',
            type: 'ENGLISH',
          }),
          aValidCurious1Assessment({
            assessmentDate: startOfDay(parseISO('2012-02-18')),
            level: 'Level 2',
            prisonId: 'MDI',
            type: 'MATHS',
          }),
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

    it('should map to functional skills given no learner profiles', () => {
      // Given
      const learnerProfiles: Array<LearnerProfile> = []

      const expected = {
        assessments: [] as Array<Assessment>,
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
              aLearnerAssessmentV1DTO({
                prisonId: 'MDI',
                qualificationType: 'Maths',
                qualificationGrade: 'Level 2',
                assessmentDate: '2012-02-18',
              }),
            ],
          }),
          aLearnerLatestAssessmentV1DTO({
            prisonNumber,
            qualifications: [
              aLearnerAssessmentV1DTO({
                prisonId: 'DNI',
                qualificationType: 'Digital Literacy',
                qualificationGrade: 'Level 3',
                assessmentDate: '2022-08-29',
              }),
            ],
          }),
        ],
      })

      const expected = {
        assessments: [
          aValidCurious1Assessment({
            assessmentDate: startOfDay(parseISO('2012-02-16')),
            level: 'Level 1',
            prisonId: 'MDI',
            type: 'ENGLISH',
          }),
          aValidCurious1Assessment({
            assessmentDate: startOfDay(parseISO('2012-02-18')),
            level: 'Level 2',
            prisonId: 'MDI',
            type: 'MATHS',
          }),
          aValidCurious1Assessment({
            assessmentDate: startOfDay(parseISO('2022-08-29')),
            level: 'Level 3',
            prisonId: 'DNI',
            type: 'DIGITAL_LITERACY',
          }),
        ],
      }

      // When
      const actual = toFunctionalSkills(allAssessments)

      // Then
      expect(actual).toEqual(expected)
    })

    it('should map to functional skills given null assessments', () => {
      // Given
      const allAssessments: AllAssessmentDTO = null

      const expected = {
        assessments: [] as Array<Assessment>,
      }

      // When
      const actual = toFunctionalSkills(allAssessments)

      // Then
      expect(actual).toEqual(expected)
    })

    it('should map to functional skills given no v1 assessments', () => {
      // Given
      const allAssessments = anAllAssessmentDTO({
        v1Assessments: null,
      })

      const expected = {
        assessments: [] as Array<Assessment>,
      }

      // When
      const actual = toFunctionalSkills(allAssessments)

      // Then
      expect(actual).toEqual(expected)
    })

    it('should map to functional skills given no v1 assessment qualifications', () => {
      // Given
      const allAssessments = anAllAssessmentDTO({
        v1Assessments: [
          aLearnerLatestAssessmentV1DTO({
            qualifications: null,
          }),
        ],
      })

      const expected = {
        assessments: [] as Array<Assessment>,
      }

      // When
      const actual = toFunctionalSkills(allAssessments)

      // Then
      expect(actual).toEqual(expected)
    })
  })
})
