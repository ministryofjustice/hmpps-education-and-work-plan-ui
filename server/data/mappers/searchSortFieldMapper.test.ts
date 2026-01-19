import toSearchSortField from './searchSortFieldMapper'
import SearchSortField from '../../enums/searchSortField'
import SortBy from '../../enums/sortBy'

describe('searchSortFieldMapper', () => {
  describe('toSearchSortField', () => {
    it.each([
      { sortBy: SortBy.NAME, expected: SearchSortField.PRISONER_NAME },
      { sortBy: SortBy.STATUS, expected: SearchSortField.PLAN_STATUS },
      { sortBy: SortBy.RELEASE_DATE, expected: SearchSortField.RELEASE_DATE },
      { sortBy: SortBy.RECEPTION_DATE, expected: SearchSortField.ENTERED_PRISON_DATE },
      { sortBy: SortBy.LOCATION, expected: SearchSortField.CELL_LOCATION },
    ])('should map $sortBy to $expected', spec => {
      // Given

      // When
      const actual = toSearchSortField(spec.sortBy)

      // Then
      expect(actual).toEqual(spec.expected)
    })
  })
})
