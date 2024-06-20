import type { AchievedQualificationDto } from 'inductionDto'
import achievedQualificationComparator from './achievedQualificationComparator'

describe('achievedQualificationComparator', () => {
  it('should determine if 2 qualification have equal qualification level, subject and grades', () => {
    // Given
    const qualification1: AchievedQualificationDto = {
      level: 'LEVEL_4',
      subject: 'Maths',
      grade: 'A',
    }
    const qualification2: AchievedQualificationDto = {
      level: 'LEVEL_4',
      subject: 'Maths',
      grade: 'A',
    }

    // When
    const actual = achievedQualificationComparator(qualification1, qualification2)

    // Then
    expect(actual).toEqual(0)
  })

  describe('primary comparison based on level', () => {
    it(`should determine if a qualification's level is alphabetically before another qualification's level`, () => {
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

      // When
      const actual = achievedQualificationComparator(qualification1, qualification2)

      // Then
      expect(actual).toEqual(-1)
    })

    it(`should determine if a qualification's level is alphabetically after another qualification's level`, () => {
      // Given
      const qualification1: AchievedQualificationDto = {
        level: 'LEVEL_4',
        subject: 'Maths',
        grade: 'A',
      }
      const qualification2: AchievedQualificationDto = {
        level: 'LEVEL_8',
        subject: 'English',
        grade: 'C+',
      }

      // When
      const actual = achievedQualificationComparator(qualification1, qualification2)

      // Then
      expect(actual).toEqual(1)
    })
  })

  describe('secondary comparison based on subject', () => {
    it(`should determine if a qualification's subject is alphabetically before another qualification's subject`, () => {
      // Given
      const qualification1: AchievedQualificationDto = {
        level: 'LEVEL_8',
        subject: 'English',
        grade: 'C+',
      }
      const qualification2: AchievedQualificationDto = {
        level: 'LEVEL_8',
        subject: 'Maths',
        grade: 'A',
      }

      // When
      const actual = achievedQualificationComparator(qualification1, qualification2)

      // Then
      expect(actual).toEqual(-1)
    })

    it(`should determine if a qualification's subject is alphabetically after another qualification's subject`, () => {
      // Given
      const qualification1: AchievedQualificationDto = {
        level: 'LEVEL_8',
        subject: 'Maths',
        grade: 'A',
      }
      const qualification2: AchievedQualificationDto = {
        level: 'LEVEL_8',
        subject: 'English',
        grade: 'C+',
      }

      // When
      const actual = achievedQualificationComparator(qualification1, qualification2)

      // Then
      expect(actual).toEqual(1)
    })
  })

  describe('tertiary comparison based on grade', () => {
    it(`should determine if a qualification's grade is alphabetically before another qualification's grade`, () => {
      // Given
      const qualification1: AchievedQualificationDto = {
        level: 'LEVEL_8',
        subject: 'English',
        grade: 'A',
      }
      const qualification2: AchievedQualificationDto = {
        level: 'LEVEL_8',
        subject: 'English',
        grade: 'C+',
      }

      // When
      const actual = achievedQualificationComparator(qualification1, qualification2)

      // Then
      expect(actual).toEqual(-1)
    })

    it(`should determine if a qualification's grade is alphabetically after another qualification's grade`, () => {
      // Given
      const qualification1: AchievedQualificationDto = {
        level: 'LEVEL_8',
        subject: 'English',
        grade: 'C+',
      }
      const qualification2: AchievedQualificationDto = {
        level: 'LEVEL_8',
        subject: 'English',
        grade: 'A',
      }

      // When
      const actual = achievedQualificationComparator(qualification1, qualification2)

      // Then
      expect(actual).toEqual(1)
    })
  })

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
    qualifications.sort(achievedQualificationComparator)

    // Then
    expect(qualifications).toEqual(expected)
  })
})
