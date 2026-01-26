import toSessionSearchSortField from './sessionSearchSortFieldMapper'
import SessionSortBy from '../../enums/sessionSortBy'
import SessionSearchSortField from '../../enums/sessionSearchSortField'

describe('sessionSearchSortFieldMapper', () => {
  describe('toSessionSearchSortField', () => {
    it.each([
      { sortBy: SessionSortBy.NAME, expected: SessionSearchSortField.PRISONER_NAME },
      { sortBy: SessionSortBy.SESSION_TYPE, expected: SessionSearchSortField.SESSION_TYPE },
      { sortBy: SessionSortBy.RELEASE_DATE, expected: SessionSearchSortField.RELEASE_DATE },
      { sortBy: SessionSortBy.DUE_BY, expected: SessionSearchSortField.DUE_BY },
      { sortBy: SessionSortBy.EXEMPTION_REASON, expected: SessionSearchSortField.EXEMPTION_REASON },
      { sortBy: SessionSortBy.EXEMPTION_DATE, expected: SessionSearchSortField.EXEMPTION_DATE },
      { sortBy: SessionSortBy.LOCATION, expected: SessionSearchSortField.CELL_LOCATION },
    ])('should map $sortBy to $expected', spec => {
      // Given

      // When
      const actual = toSessionSearchSortField(spec.sortBy)

      // Then
      expect(actual).toEqual(spec.expected)
    })
  })
})
