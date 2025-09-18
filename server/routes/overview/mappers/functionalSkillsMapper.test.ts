import { parseISO, startOfDay } from 'date-fns'
import type { LearnerProfile } from 'curiousApiClient'
import toFunctionalSkills from './functionalSkillsMapper'
import {
  aLearnerAssessmentV1DTO,
  aLearnerLatestAssessmentV1DTO,
  anAllAssessmentDTO,
} from '../../../testsupport/curiousAssessmentsTestDataBuilder'
import { aValidCurious1Assessment } from '../../../testsupport/assessmentTestDataBuilder'

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
      })

      const expected = {
        assessments: [
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
