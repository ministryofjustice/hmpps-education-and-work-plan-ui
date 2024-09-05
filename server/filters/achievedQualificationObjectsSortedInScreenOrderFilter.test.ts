import type { AchievedQualificationDto } from 'dto'
import achievedQualificationObjectsSortedInScreenOrderFilter from './achievedQualificationObjectsSortedInScreenOrderFilter'

describe('achievedQualificationObjectsSortedInScreenOrderFilter', () => {
  it('should sort an array of qualifications', () => {
    // Given
    const qualification1: AchievedQualificationDto = {
      level: 'LEVEL_8',
      subject: 'English',
      grade: 'C+',
    }
    const qualification2: AchievedQualificationDto = {
      level: 'LEVEL_4',
      subject: 'Maths',
      grade: 'A',
    }
    const qualification3: AchievedQualificationDto = {
      level: 'ENTRY_LEVEL',
      subject: 'Pottery',
      grade: 'A',
    }
    const qualification4: AchievedQualificationDto = {
      level: 'LEVEL_6',
      subject: 'Metalwork',
      grade: 'B',
    }
    const qualification5: AchievedQualificationDto = {
      level: 'LEVEL_4',
      subject: 'Maths',
      grade: 'B',
    }

    const qualifications = [qualification1, qualification2, qualification3, qualification4, qualification5]

    const expected = [qualification1, qualification4, qualification2, qualification5, qualification3] // sorted by level, subject and grade

    // When
    const actual = achievedQualificationObjectsSortedInScreenOrderFilter(qualifications)

    // Then
    expect(actual).toEqual(expected)
  })
})
