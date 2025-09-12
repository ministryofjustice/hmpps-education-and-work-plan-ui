import { parseISO, startOfDay } from 'date-fns'
import type { AllAssessmentDTO } from 'curiousApiClient'
import type { FunctionalSkills } from 'viewModels'
import toFunctionalSkills from './functionalSkillsMapper'
import {
  aLearnerAssessmentV1DTO,
  aLearnerLatestAssessmentV1DTO,
  anAllAssessmentDTO,
} from '../../../testsupport/curiousAssessmentsTestDataBuilder'

describe('functionalSkillsMapper', () => {
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

    const expected: FunctionalSkills = {
      assessments: [
        {
          assessmentDate: startOfDay(parseISO('2012-02-16')),
          grade: 'Level 1',
          prisonId: 'MDI',
          type: 'ENGLISH',
        },
        {
          assessmentDate: startOfDay(parseISO('2012-02-18')),
          grade: 'Level 2',
          prisonId: 'MDI',
          type: 'MATHS',
        },
        {
          assessmentDate: startOfDay(parseISO('2022-08-29')),
          grade: 'Level 3',
          prisonId: 'DNI',
          type: 'DIGITAL_LITERACY',
        },
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

    const expected: FunctionalSkills = {
      assessments: [],
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

    const expected: FunctionalSkills = {
      assessments: [],
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

    const expected: FunctionalSkills = {
      assessments: [],
    }

    // When
    const actual = toFunctionalSkills(allAssessments)

    // Then
    expect(actual).toEqual(expected)
  })
})
