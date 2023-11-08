import aValidPrisonerSearchSummary from '../../testsupport/prisonerSearchSummaryTestDataBuilder'
import PagedPrisonerSearchSummary, { FilterBy, SortBy, SortOrder } from './pagedPrisonerSearchSummary'

describe('pagedPrisonerSearchSummary', () => {
  const terrySmith = aValidPrisonerSearchSummary({
    prisonNumber: 'A1234BC',
    firstName: 'Terry',
    lastName: 'Smith',
    location: 'C-1-1024',
    releaseDate: '2030-12-31',
    receptionDate: '',
    hasCiagInduction: true,
    hasActionPlan: true,
  })
  const jimAardvark = aValidPrisonerSearchSummary({
    prisonNumber: 'G9981UK',
    firstName: 'Jim',
    lastName: 'Aardvark',
    location: 'A-8-1098',
    releaseDate: '2024-01-01',
    receptionDate: '1999-01-01',
    hasCiagInduction: true,
    hasActionPlan: false,
  })
  const bobSmith = aValidPrisonerSearchSummary({
    prisonNumber: 'G9712LP',
    firstName: 'Bob',
    lastName: 'Smith',
    location: 'A-8-42',
    releaseDate: '2030-12-30',
    receptionDate: '1980-06-12',
    hasCiagInduction: true,
    hasActionPlan: true,
  })
  const fredSmith = aValidPrisonerSearchSummary({
    prisonNumber: 'H9712FP',
    firstName: 'Fred',
    lastName: 'Smith',
    location: 'RECP',
    releaseDate: '',
    receptionDate: '2024-10-13',
    hasCiagInduction: false,
    hasActionPlan: false,
  })
  const billHumphries = aValidPrisonerSearchSummary({
    prisonNumber: 'Y6219RL',
    firstName: 'Bill',
    lastName: 'Humphries',
    location: 'COURT',
    releaseDate: '',
    receptionDate: '2024-10-01',
    hasCiagInduction: false,
    hasActionPlan: false,
  })

  describe('constructor', () => {
    it('should construct given fewer prisoner search summaries than the pagesize', () => {
      // Given
      const pageSize = 5
      const prisonerSearchSummaries = [terrySmith, jimAardvark, bobSmith]

      // When
      const pagedPrisonerSearchSummaries = new PagedPrisonerSearchSummary(prisonerSearchSummaries, pageSize)

      // Then
      expect(pagedPrisonerSearchSummaries.pageSize).toEqual(5)
      expect(pagedPrisonerSearchSummaries.totalResults).toEqual(3)
      expect(pagedPrisonerSearchSummaries.totalPages).toEqual(1)
      expect(pagedPrisonerSearchSummaries.currentPageNumber).toEqual(1)
      expect(pagedPrisonerSearchSummaries.resultIndexFrom).toEqual(1)
      expect(pagedPrisonerSearchSummaries.resultIndexTo).toEqual(3)
    })

    it('should construct given more prisoner search summaries than the pagesize', () => {
      // Given
      const pageSize = 2
      const prisonerSearchSummaries = [terrySmith, jimAardvark, bobSmith]

      // When
      const pagedPrisonerSearchSummaries = new PagedPrisonerSearchSummary(prisonerSearchSummaries, pageSize)

      // Then
      expect(pagedPrisonerSearchSummaries.pageSize).toEqual(2)
      expect(pagedPrisonerSearchSummaries.totalResults).toEqual(3)
      expect(pagedPrisonerSearchSummaries.totalPages).toEqual(2)
      expect(pagedPrisonerSearchSummaries.currentPageNumber).toEqual(1)
      expect(pagedPrisonerSearchSummaries.resultIndexFrom).toEqual(1)
      expect(pagedPrisonerSearchSummaries.resultIndexTo).toEqual(2)
    })

    it('should construct given equal number of prisoner search summaries to the pagesize', () => {
      // Given
      const pageSize = 3
      const prisonerSearchSummaries = [terrySmith, jimAardvark, bobSmith]

      // When
      const pagedPrisonerSearchSummaries = new PagedPrisonerSearchSummary(prisonerSearchSummaries, pageSize)

      // Then
      expect(pagedPrisonerSearchSummaries.pageSize).toEqual(3)
      expect(pagedPrisonerSearchSummaries.totalResults).toEqual(3)
      expect(pagedPrisonerSearchSummaries.totalPages).toEqual(1)
      expect(pagedPrisonerSearchSummaries.currentPageNumber).toEqual(1)
      expect(pagedPrisonerSearchSummaries.resultIndexFrom).toEqual(1)
      expect(pagedPrisonerSearchSummaries.resultIndexTo).toEqual(3)
    })
  })

  describe('setCurrentPageNumber', () => {
    it('should set current page given page number less than 1', () => {
      // Given
      const pageSize = 2
      const prisonerSearchSummaries = [terrySmith, jimAardvark, bobSmith]
      const pagedPrisonerSearchSummaries = new PagedPrisonerSearchSummary(prisonerSearchSummaries, pageSize)

      const pageNumber = 0

      // When
      pagedPrisonerSearchSummaries.setCurrentPageNumber(pageNumber)

      // Then
      expect(pagedPrisonerSearchSummaries.currentPageNumber).toEqual(1) // expect first page to be set
      expect(pagedPrisonerSearchSummaries.resultIndexFrom).toEqual(1)
      expect(pagedPrisonerSearchSummaries.resultIndexTo).toEqual(2)
    })

    it('should set current page given page number greater than number of pages', () => {
      // Given
      const pageSize = 2
      const prisonerSearchSummaries = [terrySmith, jimAardvark, bobSmith]
      const pagedPrisonerSearchSummaries = new PagedPrisonerSearchSummary(prisonerSearchSummaries, pageSize)

      const pageNumber = 3

      // When
      pagedPrisonerSearchSummaries.setCurrentPageNumber(pageNumber)

      // Then
      expect(pagedPrisonerSearchSummaries.currentPageNumber).toEqual(2) // expect last page to be set
      expect(pagedPrisonerSearchSummaries.resultIndexFrom).toEqual(3)
      expect(pagedPrisonerSearchSummaries.resultIndexTo).toEqual(3)
    })

    it('should set current page given page number within the range of page numbers', () => {
      // Given
      const pageSize = 2
      const prisonerSearchSummaries = [terrySmith, jimAardvark, bobSmith]
      const pagedPrisonerSearchSummaries = new PagedPrisonerSearchSummary(prisonerSearchSummaries, pageSize)

      const pageNumber = 2

      // When
      pagedPrisonerSearchSummaries.setCurrentPageNumber(pageNumber)

      // Then
      expect(pagedPrisonerSearchSummaries.currentPageNumber).toEqual(2)
      expect(pagedPrisonerSearchSummaries.resultIndexFrom).toEqual(3)
      expect(pagedPrisonerSearchSummaries.resultIndexTo).toEqual(3)
    })
  })

  describe('getCurrentPageResults', () => {
    const prisonerSearchSummaries = [terrySmith, jimAardvark, bobSmith, fredSmith, billHumphries]
    const pagedPrisonerSearchSummaries = new PagedPrisonerSearchSummary(prisonerSearchSummaries, 2)
    // 5 records with a page size of 2 means there are 3 pages of data. The records have not been sorted.

    it('should get the current page results where the current page is not the last page', () => {
      // Given
      pagedPrisonerSearchSummaries.setCurrentPageNumber(1)

      // When
      const actual = pagedPrisonerSearchSummaries.getCurrentPage()

      // Then
      expect(actual).toEqual([terrySmith, jimAardvark])
    })

    it('should get the current page results where the current page is the last page', () => {
      // Given
      pagedPrisonerSearchSummaries.setCurrentPageNumber(3)

      // When
      const actual = pagedPrisonerSearchSummaries.getCurrentPage()

      // Then
      expect(actual).toEqual([billHumphries])
    })
  })

  describe('sort', () => {
    describe('name', () => {
      it('should sort on name ascending', () => {
        // Given
        const prisonerSearchSummaries = [terrySmith, jimAardvark, bobSmith]
        const pagedPrisonerSearchSummaries = new PagedPrisonerSearchSummary(prisonerSearchSummaries, 10)

        // When
        pagedPrisonerSearchSummaries.sort(SortBy.NAME, SortOrder.ASCENDING)

        // Then
        expect(pagedPrisonerSearchSummaries.getCurrentPage()).toEqual([jimAardvark, bobSmith, terrySmith])
      })

      it('should sort on name descending', () => {
        // Given
        const prisonerSearchSummaries = [terrySmith, jimAardvark, bobSmith]
        const pagedPrisonerSearchSummaries = new PagedPrisonerSearchSummary(prisonerSearchSummaries, 10)

        // When
        pagedPrisonerSearchSummaries.sort(SortBy.NAME, SortOrder.DESCENDING)

        // Then
        expect(pagedPrisonerSearchSummaries.getCurrentPage()).toEqual([terrySmith, bobSmith, jimAardvark])
      })
    })

    describe('location', () => {
      it('should sort on location ascending', () => {
        // Given
        const prisonerSearchSummaries = [
          terrySmith, // C-1-1024
          jimAardvark, // A-8-1098
          bobSmith, // A-8-42
          fredSmith, // RECP
          billHumphries, // COURT
        ]
        const pagedPrisonerSearchSummaries = new PagedPrisonerSearchSummary(prisonerSearchSummaries, 10)

        // When
        pagedPrisonerSearchSummaries.sort(SortBy.LOCATION, SortOrder.ASCENDING)

        // Then
        expect(pagedPrisonerSearchSummaries.getCurrentPage()).toEqual([
          jimAardvark, // A-8-1098
          bobSmith, // A-8-42
          terrySmith, // C-1-1024
          billHumphries, // COURT
          fredSmith, // RECP
        ])
      })

      it('should sort on location descending', () => {
        // Given
        const prisonerSearchSummaries = [
          terrySmith, // C-1-1024
          jimAardvark, // A-8-1098
          bobSmith, // A-8-42
          fredSmith, // RECP
          billHumphries, // COURT
        ]
        const pagedPrisonerSearchSummaries = new PagedPrisonerSearchSummary(prisonerSearchSummaries, 10)

        // When
        pagedPrisonerSearchSummaries.sort(SortBy.LOCATION, SortOrder.DESCENDING)

        // Then
        expect(pagedPrisonerSearchSummaries.getCurrentPage()).toEqual([
          fredSmith, // RECP
          billHumphries, // COURT
          terrySmith, // C-1-1024
          bobSmith, // A-8-42
          jimAardvark, // A-8-1098
        ])
      })
    })

    describe('release date', () => {
      it('should sort on release date ascending', () => {
        // Given
        const prisonerSearchSummaries = [
          terrySmith, // 2030-12-31
          jimAardvark, // 2024-01-01
          bobSmith, // 2030-12-30
          fredSmith, // no release date
          billHumphries, // no release date
        ]
        const pagedPrisonerSearchSummaries = new PagedPrisonerSearchSummary(prisonerSearchSummaries, 10)

        // When
        pagedPrisonerSearchSummaries.sort(SortBy.RELEASE_DATE, SortOrder.ASCENDING)

        // Then
        expect(pagedPrisonerSearchSummaries.getCurrentPage()).toEqual([
          jimAardvark, // 2024-01-01
          bobSmith, // 2030-12-30
          terrySmith, // 2030-12-31
          billHumphries, // no release date
          fredSmith, // no release date
        ])
      })

      it('should sort on release date descending', () => {
        // Given
        const prisonerSearchSummaries = [
          terrySmith, // 2030-12-31
          jimAardvark, // 2024-01-01
          bobSmith, // 2030-12-30
          fredSmith, // no release date
          billHumphries, // no release date
        ]
        const pagedPrisonerSearchSummaries = new PagedPrisonerSearchSummary(prisonerSearchSummaries, 10)

        // When
        pagedPrisonerSearchSummaries.sort(SortBy.RELEASE_DATE, SortOrder.DESCENDING)

        // Then
        expect(pagedPrisonerSearchSummaries.getCurrentPage()).toEqual([
          fredSmith, // no release date
          billHumphries, // no release date
          terrySmith, // 2030-12-31
          bobSmith, // 2030-12-30
          jimAardvark, // 2024-01-01
        ])
      })
    })

    describe('reception date', () => {
      it('should sort on reception date ascending', () => {
        // Given
        const prisonerSearchSummaries = [
          terrySmith, // no reception date
          jimAardvark, // 1999-01-01
          bobSmith, // 1980-06-12
          fredSmith, // 2024-10-13
          billHumphries, // 2024-10-01
        ]
        const pagedPrisonerSearchSummaries = new PagedPrisonerSearchSummary(prisonerSearchSummaries, 10)

        // When
        pagedPrisonerSearchSummaries.sort(SortBy.RECEPTION_DATE, SortOrder.ASCENDING)

        // Then
        expect(pagedPrisonerSearchSummaries.getCurrentPage()).toEqual([
          bobSmith, // 1980-06-12
          jimAardvark, // 1999-01-01
          billHumphries, // 2024-10-01
          fredSmith, // 2024-10-13
          terrySmith, // no reception date
        ])
      })

      it('should sort on reception date descending', () => {
        // Given
        const prisonerSearchSummaries = [
          terrySmith, // no reception date
          jimAardvark, // 1999-01-01
          bobSmith, // 1980-06-12
          fredSmith, // 2024-10-13
          billHumphries, // 2024-10-01
        ]
        const pagedPrisonerSearchSummaries = new PagedPrisonerSearchSummary(prisonerSearchSummaries, 10)

        // When
        pagedPrisonerSearchSummaries.sort(SortBy.RECEPTION_DATE, SortOrder.DESCENDING)

        // Then
        expect(pagedPrisonerSearchSummaries.getCurrentPage()).toEqual([
          terrySmith, // no reception date
          fredSmith, // 2024-10-13
          billHumphries, // 2024-10-01
          jimAardvark, // 1999-01-01
          bobSmith, // 1980-06-12
        ])
      })
    })

    describe('status', () => {
      it('should sort on status ascending', () => {
        // Given
        const prisonerSearchSummaries = [
          terrySmith, // hasCiagInduction: true, hasActionPlan: true; status = ''
          jimAardvark, // hasCiagInduction: true, hasActionPlan: false; status = 'NEEDS_PLAN'
        ]
        const pagedPrisonerSearchSummaries = new PagedPrisonerSearchSummary(prisonerSearchSummaries, 10)

        // When
        pagedPrisonerSearchSummaries.sort(SortBy.STATUS, SortOrder.ASCENDING)

        // Then
        expect(pagedPrisonerSearchSummaries.getCurrentPage()).toEqual([
          terrySmith, // hasCiagInduction: true, hasActionPlan: true; status = ''
          jimAardvark, // hasCiagInduction: true, hasActionPlan: false; status = 'NEEDS_PLAN'
        ])
      })

      it('should sort on status descending', () => {
        // Given
        const prisonerSearchSummaries = [
          terrySmith, // hasCiagInduction: true, hasActionPlan: true; status = ''
          jimAardvark, // hasCiagInduction: true, hasActionPlan: false; status = 'NEEDS_PLAN'
        ]
        const pagedPrisonerSearchSummaries = new PagedPrisonerSearchSummary(prisonerSearchSummaries, 10)

        // When
        pagedPrisonerSearchSummaries.sort(SortBy.STATUS, SortOrder.DESCENDING)

        // Then
        expect(pagedPrisonerSearchSummaries.getCurrentPage()).toEqual([
          jimAardvark, // hasCiagInduction: true, hasActionPlan: false; status = 'NEEDS_PLAN'
          terrySmith, // hasCiagInduction: true, hasActionPlan: true; status = ''
        ])
      })
    })
  })

  describe('filter', () => {
    describe('name', () => {
      Array.of('', '   ', null, undefined).forEach(value => {
        it(`should not filter given '${value}' to filter on`, () => {
          // Given
          const prisonerSearchSummaries = [terrySmith, jimAardvark, bobSmith, fredSmith, billHumphries]
          const pagedPrisonerSearchSummaries = new PagedPrisonerSearchSummary(prisonerSearchSummaries, 10)

          // When
          pagedPrisonerSearchSummaries.filter(FilterBy.NAME, value)

          // Then
          expect(pagedPrisonerSearchSummaries.currentPageNumber).toEqual(1)
          expect(pagedPrisonerSearchSummaries.totalPages).toEqual(1)
          expect(pagedPrisonerSearchSummaries.resultIndexFrom).toEqual(1)
          expect(pagedPrisonerSearchSummaries.resultIndexTo).toEqual(5)
          expect(pagedPrisonerSearchSummaries.getCurrentPage()).toEqual([
            terrySmith,
            jimAardvark,
            bobSmith,
            fredSmith,
            billHumphries,
          ])
        })
      })

      it('should filter given value that filters out all records', () => {
        // Given
        const prisonerSearchSummaries = [terrySmith, jimAardvark, bobSmith, fredSmith, billHumphries]
        const pagedPrisonerSearchSummaries = new PagedPrisonerSearchSummary(prisonerSearchSummaries, 10)

        const value = 'this will match nothing and therefore filter everything out'

        // When
        pagedPrisonerSearchSummaries.filter(FilterBy.NAME, value)

        // Then
        expect(pagedPrisonerSearchSummaries.currentPageNumber).toEqual(1)
        expect(pagedPrisonerSearchSummaries.totalPages).toEqual(1)
        expect(pagedPrisonerSearchSummaries.resultIndexFrom).toEqual(0)
        expect(pagedPrisonerSearchSummaries.resultIndexTo).toEqual(0)
        expect(pagedPrisonerSearchSummaries.getCurrentPage()).toEqual([])
      })

      it('should filter given value that filters out some records', () => {
        // Given
        const prisonerSearchSummaries = [terrySmith, jimAardvark, bobSmith, fredSmith, billHumphries]
        const pagedPrisonerSearchSummaries = new PagedPrisonerSearchSummary(prisonerSearchSummaries, 2) // totalPages will be 3 before filtering

        const value = '  SmItH  '

        // When
        pagedPrisonerSearchSummaries.filter(FilterBy.NAME, value)

        // Then
        expect(pagedPrisonerSearchSummaries.currentPageNumber).toEqual(1)
        expect(pagedPrisonerSearchSummaries.totalPages).toEqual(2)
        expect(pagedPrisonerSearchSummaries.resultIndexFrom).toEqual(1)
        expect(pagedPrisonerSearchSummaries.resultIndexTo).toEqual(2)
        expect(pagedPrisonerSearchSummaries.getCurrentPage()).toEqual([terrySmith, bobSmith])
      })

      Array.of(
        'J',
        'jim',
        'aardv',
        'aardvark',
        'jim aardvark',
        'j aardvark',
        'aardvark j',
        'aardvark jim',
        'Jim, Aardvark',
        'AARDVARK, JIM',
        'G9981UK',
        'G9981',
        '9981',
      ).forEach(value => {
        it(`should filter given value '${value}' that will return a specific prisoner`, () => {
          // Given
          const prisonerSearchSummaries = [terrySmith, jimAardvark, bobSmith, fredSmith, billHumphries]
          const pagedPrisonerSearchSummaries = new PagedPrisonerSearchSummary(prisonerSearchSummaries, 10)

          // When
          pagedPrisonerSearchSummaries.filter(FilterBy.NAME, value)

          // Then
          expect(pagedPrisonerSearchSummaries.currentPageNumber).toEqual(1)
          expect(pagedPrisonerSearchSummaries.totalPages).toEqual(1)
          expect(pagedPrisonerSearchSummaries.resultIndexFrom).toEqual(1)
          expect(pagedPrisonerSearchSummaries.resultIndexTo).toEqual(1)
          expect(pagedPrisonerSearchSummaries.getCurrentPage()).toEqual([jimAardvark])
        })
      })
    })

    describe('status', () => {
      Array.of('', '   ', null, undefined).forEach(value => {
        it(`should not filter given '${value}' to filter on`, () => {
          // Given
          const prisonerSearchSummaries = [terrySmith, jimAardvark, bobSmith, fredSmith, billHumphries]
          const pagedPrisonerSearchSummaries = new PagedPrisonerSearchSummary(prisonerSearchSummaries, 10)

          // When
          pagedPrisonerSearchSummaries.filter(FilterBy.STATUS, value)

          // Then
          expect(pagedPrisonerSearchSummaries.currentPageNumber).toEqual(1)
          expect(pagedPrisonerSearchSummaries.resultIndexFrom).toEqual(1)
          expect(pagedPrisonerSearchSummaries.resultIndexTo).toEqual(5)
          expect(pagedPrisonerSearchSummaries.getCurrentPage()).toEqual([
            terrySmith,
            jimAardvark,
            bobSmith,
            fredSmith,
            billHumphries,
          ])
        })
      })

      it('should filter given value that filters out all records', () => {
        // Given
        const prisonerSearchSummaries = [
          terrySmith, // hasCiagInduction: true, hasActionPlan: true; status = ''
          bobSmith, // hasCiagInduction: true, hasActionPlan: true; status = ''
        ]
        const pagedPrisonerSearchSummaries = new PagedPrisonerSearchSummary(prisonerSearchSummaries, 10)

        const value = 'NEEDS_PLAN'

        // When
        pagedPrisonerSearchSummaries.filter(FilterBy.STATUS, value)

        // Then
        expect(pagedPrisonerSearchSummaries.currentPageNumber).toEqual(1)
        expect(pagedPrisonerSearchSummaries.resultIndexFrom).toEqual(0)
        expect(pagedPrisonerSearchSummaries.resultIndexTo).toEqual(0)
        expect(pagedPrisonerSearchSummaries.getCurrentPage()).toEqual([])
      })

      it('should filter given value that filters out some records', () => {
        // Given
        const prisonerSearchSummaries = [
          terrySmith, // hasCiagInduction: true, hasActionPlan: true; status = ''
          jimAardvark, // hasCiagInduction: true, hasActionPlan: false; status = 'NEEDS_PLAN'
          bobSmith, // hasCiagInduction: true, hasActionPlan: true; status = ''
          fredSmith, // hasCiagInduction: false, hasActionPlan: false; status = 'NEEDS_PLAN'
          billHumphries, // hasCiagInduction: false, hasActionPlan: false; status = 'NEEDS_PLAN'
        ]
        const pagedPrisonerSearchSummaries = new PagedPrisonerSearchSummary(prisonerSearchSummaries, 10)

        const value = 'NEEDS_PLAN'

        // When
        pagedPrisonerSearchSummaries.filter(FilterBy.STATUS, value)

        // Then
        expect(pagedPrisonerSearchSummaries.currentPageNumber).toEqual(1)
        expect(pagedPrisonerSearchSummaries.resultIndexFrom).toEqual(1)
        expect(pagedPrisonerSearchSummaries.resultIndexTo).toEqual(3)
        expect(pagedPrisonerSearchSummaries.getCurrentPage()).toEqual([
          jimAardvark, // hasCiagInduction: true, hasActionPlan: false; status = 'NEEDS_PLAN'
          fredSmith, // hasCiagInduction: false, hasActionPlan: false; status = 'NEEDS_PLAN'
          billHumphries, // hasCiagInduction: false, hasActionPlan: false; status = 'NEEDS_PLAN'
        ])
      })
    })
  })

  describe('combining operations', () => {
    it('should combine operations', () => {
      // Given
      const prisonerSearchSummaries = [
        terrySmith, // hasCiagInduction: true, hasActionPlan: true; status = ''
        jimAardvark, // hasCiagInduction: true, hasActionPlan: false; status = 'NEEDS_PLAN'
        bobSmith, // hasCiagInduction: true, hasActionPlan: true; status = ''
        fredSmith, // hasCiagInduction: false, hasActionPlan: false; status = 'NEEDS_PLAN', receptionDate: 2024-10-13
        billHumphries, // hasCiagInduction: false, hasActionPlan: false; status = 'NEEDS_PLAN', receptionDate: 2024-10-01
      ]
      const pagedPrisonerSearchSummaries = new PagedPrisonerSearchSummary(prisonerSearchSummaries, 2)
      // 5 records with a page size of 2 means there are 3 pages of data.

      // When
      pagedPrisonerSearchSummaries //
        .sort(SortBy.NAME, SortOrder.DESCENDING) // all 5 records sorted by name descending (terrySmith, fredSmith, bobSmith, billHumphries, jimAardvark)
        .setCurrentPageNumber(2) // page 2 (bobSmith, billHumphries)
        .filter(FilterBy.NAME, 'S') // jimAardvark is removed as he does not have an S in his name
        .filter(FilterBy.STATUS, 'NEEDS_PLAN') // only fredSmith and billHumphries remain as they have the status NEEDS_PLAN
        .sort(SortBy.RECEPTION_DATE, SortOrder.ASCENDING) // 2 remaining records sorted by reception date ascending (billHumphries, fredSmith)

      // Then
      expect(pagedPrisonerSearchSummaries.currentPageNumber).toEqual(1)
      expect(pagedPrisonerSearchSummaries.resultIndexFrom).toEqual(1)
      expect(pagedPrisonerSearchSummaries.resultIndexTo).toEqual(2)
      expect(pagedPrisonerSearchSummaries.getCurrentPage()).toEqual([
        billHumphries, // hasCiagInduction: false, hasActionPlan: false; status = 'NEEDS_PLAN', receptionDate: 2024-10-01
        fredSmith, // hasCiagInduction: false, hasActionPlan: false; status = 'NEEDS_PLAN', receptionDate: 2024-10-13
      ])
    })
  })
})
