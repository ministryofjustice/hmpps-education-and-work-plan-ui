import groupArrayByPropertyFilter from './groupArrayByPropertyFilter'

describe('groupArrayByPropertyFilter', () => {
  it('should group an array by the specified property value', () => {
    // Given
    const arrayOfCars = [
      { make: 'VW', model: 'Golf' },
      { make: 'Ford', model: 'Escort' },
      { make: 'Ford', model: 'Cortina' },
      { make: 'VW', model: 'Polo' },
      { make: 'Ford', model: 'Sierra' },
    ]

    const expected = {
      VW: [
        { make: 'VW', model: 'Golf' },
        { make: 'VW', model: 'Polo' },
      ],
      Ford: [
        { make: 'Ford', model: 'Escort' },
        { make: 'Ford', model: 'Cortina' },
        { make: 'Ford', model: 'Sierra' },
      ],
    }

    // When
    const actual = groupArrayByPropertyFilter(arrayOfCars, 'make')

    // Then
    expect(actual).toEqual(expected)
  })
})
