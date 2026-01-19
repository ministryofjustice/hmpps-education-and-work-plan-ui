import SortOrder from '../../enums/sortDirection'
import SearchSortDirection from '../../enums/searchSortDirection'
import toSearchSortDirection from './searchSortDirectionMapper'

describe('searchSortDirectionMapper', () => {
  describe('toSearchSortDirection', () => {
    it.each([
      { sortOrder: SortOrder.ASCENDING, expected: SearchSortDirection.ASC },
      { sortOrder: SortOrder.DESCENDING, expected: SearchSortDirection.DESC },
    ])('should map $sortOrder to $expected', spec => {
      // Given

      // When
      const actual = toSearchSortDirection(spec.sortOrder)

      // Then
      expect(actual).toEqual(spec.expected)
    })
  })
})
