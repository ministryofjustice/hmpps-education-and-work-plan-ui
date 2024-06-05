import objectsSortedAlphabeticallyWithOtherLastByFilter from './objectsSortedAlphabeticallyWithOtherLastByFilter'
import TypeOfWorkExperienceValue from '../enums/typeOfWorkExperienceValue'

describe('objectsSortedAlphabeticallyWithOtherLastByFilter', () => {
  it('should sort an array of objects alphabetically on one of the properties, but with OTHER at the end', () => {
    // Given
    const object1 = {
      experienceType: TypeOfWorkExperienceValue.SPORTS,
      experienceTypeOther: undefined as string,
      role: 'Football coach',
      details: 'Teaching and coaching football',
    }
    const object2 = {
      experienceType: TypeOfWorkExperienceValue.OTHER,
      experienceTypeOther: 'Entertainment industry',
      role: 'Childrens entertainer',
      details: 'Hosting birthday parties',
    }
    const object3 = {
      experienceType: TypeOfWorkExperienceValue.WASTE_MANAGEMENT,
      experienceTypeOther: undefined as string,
      role: 'Refuse collector',
      details: 'Collecting and emptying household refuse and waste',
    }
    const object4 = {
      experienceType: TypeOfWorkExperienceValue.DRIVING,
      experienceTypeOther: undefined as string,
      role: 'Driving instructor',
      details: 'Teaching people to drive',
    }

    const objects = [object1, object2, object3, object4]

    const expected = [object4, object1, object3, object2] // alphabetically on ENUM string, with OTHER at the end

    // When
    const actual = objectsSortedAlphabeticallyWithOtherLastByFilter(objects, 'experienceType')

    // Then
    expect(actual).toEqual(expected)
    expect(objects).toEqual([object1, object2, object3, object4]) // assert the source array has not been changed
  })
})
