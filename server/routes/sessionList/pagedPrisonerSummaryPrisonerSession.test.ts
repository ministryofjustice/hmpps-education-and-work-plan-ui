import { startOfDay } from 'date-fns'
import PagedPrisonerSummaryPrisonerSession, { FilterBy, SortBy, SortOrder } from './pagedPrisonerSummaryPrisonerSession'
import aValidPrisonerSummaryPrisonerSession from '../../testsupport/prisonerSummaryPrisonerSessionTestDataBuilder'
import SessionTypeValue from '../../enums/sessionTypeValue'
import InductionScheduleStatusValue from '../../enums/inductionScheduleStatusValue'
import ReviewScheduleStatusValue from '../../enums/reviewScheduleStatusValue'

describe('pagedPrisonerSummaryPrisonerSession', () => {
  const terrySmith = aValidPrisonerSummaryPrisonerSession({
    prisonNumber: 'A1234BC',
    firstName: 'Terry',
    lastName: 'Smith',
    location: 'C-1-1024',
    releaseDate: startOfDay('2030-12-31'),
    receptionDate: null,
    sessionType: SessionTypeValue.REVIEW,
    deadlineDate: startOfDay('2025-02-11'),
    exemption: undefined,
  })
  const jimAardvark = aValidPrisonerSummaryPrisonerSession({
    prisonNumber: 'G9981UK',
    firstName: 'Jim',
    lastName: 'Aardvark',
    location: 'A-8-1098',
    releaseDate: startOfDay('2024-01-01'),
    receptionDate: startOfDay('1999-01-01'),
    sessionType: SessionTypeValue.INDUCTION,
    deadlineDate: startOfDay('2025-02-05'),
    exemption: {
      exemptionDate: startOfDay('2025-02-01'),
      exemptionReason: InductionScheduleStatusValue.EXEMPT_SCREENING_AND_ASSESSMENT_IN_PROGRESS,
    },
  })
  const bobSmith = aValidPrisonerSummaryPrisonerSession({
    prisonNumber: 'G9712LP',
    firstName: 'Bob',
    lastName: 'Smith',
    location: 'A-8-42',
    releaseDate: startOfDay('2030-12-30'),
    receptionDate: startOfDay('1980-06-12'),
    sessionType: SessionTypeValue.REVIEW,
    deadlineDate: startOfDay('2025-03-01'),
    exemption: {
      exemptionDate: startOfDay('2025-02-20'),
      exemptionReason: ReviewScheduleStatusValue.EXEMPT_PRISON_REGIME_CIRCUMSTANCES,
    },
  })
  const fredSmith = aValidPrisonerSummaryPrisonerSession({
    prisonNumber: 'H9712FP',
    firstName: 'Fred',
    lastName: 'Smith',
    location: 'RECP',
    releaseDate: null,
    receptionDate: startOfDay('2024-10-13'),
    sessionType: SessionTypeValue.INDUCTION,
    deadlineDate: startOfDay('2025-03-10'),
    exemption: undefined,
  })
  const billHumphries = aValidPrisonerSummaryPrisonerSession({
    prisonNumber: 'Y6219RL',
    firstName: 'Bill',
    lastName: 'Humphries',
    location: 'COURT',
    releaseDate: null,
    receptionDate: startOfDay('2024-10-01'),
    sessionType: SessionTypeValue.INDUCTION,
    deadlineDate: startOfDay('2025-01-27'),
    exemption: {
      exemptionDate: startOfDay('2025-01-18'),
      exemptionReason: InductionScheduleStatusValue.EXEMPT_PRISONER_SAFETY_ISSUES,
    },
  })

  describe('constructor', () => {
    it('should construct given fewer PrisonerSummaryPrisonerSession records than the pagesize', () => {
      // Given
      const pageSize = 5
      const prisonerSummaryPrisonerSessions = [terrySmith, jimAardvark, bobSmith]

      // When
      const pagedPrisonerSummaryPrisonerSession = new PagedPrisonerSummaryPrisonerSession(
        prisonerSummaryPrisonerSessions,
        pageSize,
      )

      // Then
      expect(pagedPrisonerSummaryPrisonerSession.pageSize).toEqual(5)
      expect(pagedPrisonerSummaryPrisonerSession.totalResults).toEqual(3)
      expect(pagedPrisonerSummaryPrisonerSession.totalPages).toEqual(1)
      expect(pagedPrisonerSummaryPrisonerSession.currentPageNumber).toEqual(1)
      expect(pagedPrisonerSummaryPrisonerSession.resultIndexFrom).toEqual(1)
      expect(pagedPrisonerSummaryPrisonerSession.resultIndexTo).toEqual(3)
    })

    it('should construct given more PrisonerSummaryPrisonerSession records than the pagesize', () => {
      // Given
      const pageSize = 2
      const prisonerSummaryPrisonerSessions = [terrySmith, jimAardvark, bobSmith]

      // When
      const pagedPrisonerSummaryPrisonerSession = new PagedPrisonerSummaryPrisonerSession(
        prisonerSummaryPrisonerSessions,
        pageSize,
      )

      // Then
      expect(pagedPrisonerSummaryPrisonerSession.pageSize).toEqual(2)
      expect(pagedPrisonerSummaryPrisonerSession.totalResults).toEqual(3)
      expect(pagedPrisonerSummaryPrisonerSession.totalPages).toEqual(2)
      expect(pagedPrisonerSummaryPrisonerSession.currentPageNumber).toEqual(1)
      expect(pagedPrisonerSummaryPrisonerSession.resultIndexFrom).toEqual(1)
      expect(pagedPrisonerSummaryPrisonerSession.resultIndexTo).toEqual(2)
    })

    it('should construct given equal number of PrisonerSummaryPrisonerSession records to the pagesize', () => {
      // Given
      const pageSize = 3
      const prisonerSummaryPrisonerSessions = [terrySmith, jimAardvark, bobSmith]

      // When
      const pagedPrisonerSummaryPrisonerSession = new PagedPrisonerSummaryPrisonerSession(
        prisonerSummaryPrisonerSessions,
        pageSize,
      )

      // Then
      expect(pagedPrisonerSummaryPrisonerSession.pageSize).toEqual(3)
      expect(pagedPrisonerSummaryPrisonerSession.totalResults).toEqual(3)
      expect(pagedPrisonerSummaryPrisonerSession.totalPages).toEqual(1)
      expect(pagedPrisonerSummaryPrisonerSession.currentPageNumber).toEqual(1)
      expect(pagedPrisonerSummaryPrisonerSession.resultIndexFrom).toEqual(1)
      expect(pagedPrisonerSummaryPrisonerSession.resultIndexTo).toEqual(3)
    })
  })

  describe('setCurrentPageNumber', () => {
    it('should set current page given page number less than 1', () => {
      // Given
      const pageSize = 2
      const prisonerSummaryPrisonerSessions = [terrySmith, jimAardvark, bobSmith]
      const pagedPrisonerSummaryPrisonerSession = new PagedPrisonerSummaryPrisonerSession(
        prisonerSummaryPrisonerSessions,
        pageSize,
      )

      const pageNumber = 0

      // When
      pagedPrisonerSummaryPrisonerSession.setCurrentPageNumber(pageNumber)

      // Then
      expect(pagedPrisonerSummaryPrisonerSession.currentPageNumber).toEqual(1) // expect first page to be set
      expect(pagedPrisonerSummaryPrisonerSession.resultIndexFrom).toEqual(1)
      expect(pagedPrisonerSummaryPrisonerSession.resultIndexTo).toEqual(2)
    })

    it('should set current page given page number greater than number of pages', () => {
      // Given
      const pageSize = 2
      const prisonerSummaryPrisonerSessions = [terrySmith, jimAardvark, bobSmith]
      const pagedPrisonerSummaryPrisonerSession = new PagedPrisonerSummaryPrisonerSession(
        prisonerSummaryPrisonerSessions,
        pageSize,
      )

      const pageNumber = 3

      // When
      pagedPrisonerSummaryPrisonerSession.setCurrentPageNumber(pageNumber)

      // Then
      expect(pagedPrisonerSummaryPrisonerSession.currentPageNumber).toEqual(2) // expect last page to be set
      expect(pagedPrisonerSummaryPrisonerSession.resultIndexFrom).toEqual(3)
      expect(pagedPrisonerSummaryPrisonerSession.resultIndexTo).toEqual(3)
    })

    it('should set current page given page number within the range of page numbers', () => {
      // Given
      const pageSize = 2
      const prisonerSummaryPrisonerSessions = [terrySmith, jimAardvark, bobSmith]
      const pagedPrisonerSummaryPrisonerSession = new PagedPrisonerSummaryPrisonerSession(
        prisonerSummaryPrisonerSessions,
        pageSize,
      )

      const pageNumber = 2

      // When
      pagedPrisonerSummaryPrisonerSession.setCurrentPageNumber(pageNumber)

      // Then
      expect(pagedPrisonerSummaryPrisonerSession.currentPageNumber).toEqual(2)
      expect(pagedPrisonerSummaryPrisonerSession.resultIndexFrom).toEqual(3)
      expect(pagedPrisonerSummaryPrisonerSession.resultIndexTo).toEqual(3)
    })
  })

  describe('getCurrentPageResults', () => {
    const prisonerSummaryPrisonerSessions = [terrySmith, jimAardvark, bobSmith, fredSmith, billHumphries]
    const pagedPrisonerSummaryPrisonerSession = new PagedPrisonerSummaryPrisonerSession(
      prisonerSummaryPrisonerSessions,
      2,
    )
    // 5 records with a page size of 2 means there are 3 pages of data. The records have not been sorted.

    it('should get the current page results where the current page is not the last page', () => {
      // Given
      pagedPrisonerSummaryPrisonerSession.setCurrentPageNumber(1)

      // When
      const actual = pagedPrisonerSummaryPrisonerSession.getCurrentPage()

      // Then
      expect(actual).toEqual([terrySmith, jimAardvark])
    })

    it('should get the current page results where the current page is the last page', () => {
      // Given
      pagedPrisonerSummaryPrisonerSession.setCurrentPageNumber(3)

      // When
      const actual = pagedPrisonerSummaryPrisonerSession.getCurrentPage()

      // Then
      expect(actual).toEqual([billHumphries])
    })
  })

  describe('sort', () => {
    describe('name', () => {
      it('should sort on name ascending', () => {
        // Given
        const prisonerSummaryPrisonerSessions = [terrySmith, jimAardvark, bobSmith]
        const pagedPrisonerSummaryPrisonerSession = new PagedPrisonerSummaryPrisonerSession(
          prisonerSummaryPrisonerSessions,
          10,
        )

        // When
        pagedPrisonerSummaryPrisonerSession.sort(SortBy.NAME, SortOrder.ASCENDING)

        // Then
        expect(pagedPrisonerSummaryPrisonerSession.getCurrentPage()).toEqual([jimAardvark, bobSmith, terrySmith])
      })

      it('should sort on name descending', () => {
        // Given
        const prisonerSummaryPrisonerSessions = [terrySmith, jimAardvark, bobSmith]
        const pagedPrisonerSummaryPrisonerSession = new PagedPrisonerSummaryPrisonerSession(
          prisonerSummaryPrisonerSessions,
          10,
        )

        // When
        pagedPrisonerSummaryPrisonerSession.sort(SortBy.NAME, SortOrder.DESCENDING)

        // Then
        expect(pagedPrisonerSummaryPrisonerSession.getCurrentPage()).toEqual([terrySmith, bobSmith, jimAardvark])
      })
    })

    describe('location', () => {
      it('should sort on location ascending', () => {
        // Given
        const prisonerSummaryPrisonerSessions = [
          terrySmith, // C-1-1024
          jimAardvark, // A-8-1098
          bobSmith, // A-8-42
          fredSmith, // RECP
          billHumphries, // COURT
        ]
        const pagedPrisonerSummaryPrisonerSession = new PagedPrisonerSummaryPrisonerSession(
          prisonerSummaryPrisonerSessions,
          10,
        )

        // When
        pagedPrisonerSummaryPrisonerSession.sort(SortBy.LOCATION, SortOrder.ASCENDING)

        // Then
        expect(pagedPrisonerSummaryPrisonerSession.getCurrentPage()).toEqual([
          jimAardvark, // A-8-1098
          bobSmith, // A-8-42
          terrySmith, // C-1-1024
          billHumphries, // COURT
          fredSmith, // RECP
        ])
      })

      it('should sort on location descending', () => {
        // Given
        const prisonerSummaryPrisonerSessions = [
          terrySmith, // C-1-1024
          jimAardvark, // A-8-1098
          bobSmith, // A-8-42
          fredSmith, // RECP
          billHumphries, // COURT
        ]
        const pagedPrisonerSummaryPrisonerSession = new PagedPrisonerSummaryPrisonerSession(
          prisonerSummaryPrisonerSessions,
          10,
        )

        // When
        pagedPrisonerSummaryPrisonerSession.sort(SortBy.LOCATION, SortOrder.DESCENDING)

        // Then
        expect(pagedPrisonerSummaryPrisonerSession.getCurrentPage()).toEqual([
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
        const prisonerSummaryPrisonerSessions = [
          terrySmith, // 2030-12-31
          jimAardvark, // 2024-01-01
          bobSmith, // 2030-12-30
          fredSmith, // no release date
          billHumphries, // no release date
        ]
        const pagedPrisonerSummaryPrisonerSession = new PagedPrisonerSummaryPrisonerSession(
          prisonerSummaryPrisonerSessions,
          10,
        )

        // When
        pagedPrisonerSummaryPrisonerSession.sort(SortBy.RELEASE_DATE, SortOrder.ASCENDING)

        // Then
        expect(pagedPrisonerSummaryPrisonerSession.getCurrentPage()).toEqual([
          jimAardvark, // 2024-01-01
          bobSmith, // 2030-12-30
          terrySmith, // 2030-12-31
          billHumphries, // no release date
          fredSmith, // no release date
        ])
      })

      it('should sort on release date descending', () => {
        // Given
        const prisonerSummaryPrisonerSessions = [
          terrySmith, // 2030-12-31
          jimAardvark, // 2024-01-01
          bobSmith, // 2030-12-30
          fredSmith, // no release date
          billHumphries, // no release date
        ]
        const pagedPrisonerSummaryPrisonerSession = new PagedPrisonerSummaryPrisonerSession(
          prisonerSummaryPrisonerSessions,
          10,
        )

        // When
        pagedPrisonerSummaryPrisonerSession.sort(SortBy.RELEASE_DATE, SortOrder.DESCENDING)

        // Then
        expect(pagedPrisonerSummaryPrisonerSession.getCurrentPage()).toEqual([
          fredSmith, // no release date
          billHumphries, // no release date
          terrySmith, // 2030-12-31
          bobSmith, // 2030-12-30
          jimAardvark, // 2024-01-01
        ])
      })
    })

    describe('session type', () => {
      it('should sort on session type ascending', () => {
        // Given
        const prisonerSummaryPrisonerSessions = [
          terrySmith, // REVIEW
          jimAardvark, // INDUCTION
          bobSmith, // REVIEW
          fredSmith, // INDUCTION
          billHumphries, // INDUCTION
        ]
        const pagedPrisonerSummaryPrisonerSession = new PagedPrisonerSummaryPrisonerSession(
          prisonerSummaryPrisonerSessions,
          10,
        )

        // When
        pagedPrisonerSummaryPrisonerSession.sort(SortBy.SESSION_TYPE, SortOrder.ASCENDING)

        // Then
        expect(pagedPrisonerSummaryPrisonerSession.getCurrentPage()).toEqual([
          jimAardvark, // INDUCTION
          fredSmith, // INDUCTION
          billHumphries, // INDUCTION
          terrySmith, // REVIEW
          bobSmith, // REVIEW
        ])
      })

      it('should sort on session type descending', () => {
        // Given
        const prisonerSummaryPrisonerSessions = [
          terrySmith, // REVIEW
          jimAardvark, // INDUCTION
          bobSmith, // REVIEW
          fredSmith, // INDUCTION
          billHumphries, // INDUCTION
        ]
        const pagedPrisonerSummaryPrisonerSession = new PagedPrisonerSummaryPrisonerSession(
          prisonerSummaryPrisonerSessions,
          10,
        )

        // When
        pagedPrisonerSummaryPrisonerSession.sort(SortBy.SESSION_TYPE, SortOrder.DESCENDING)

        // Then
        expect(pagedPrisonerSummaryPrisonerSession.getCurrentPage()).toEqual([
          terrySmith, // REVIEW
          bobSmith, // REVIEW
          jimAardvark, // INDUCTION
          fredSmith, // INDUCTION
          billHumphries, // INDUCTION
        ])
      })
    })

    describe('due by date', () => {
      it('should sort on due by date ascending', () => {
        // Given
        const prisonerSummaryPrisonerSessions = [
          terrySmith, // 2025-02-11
          jimAardvark, // 2025-02-05
          bobSmith, // 2025-03-01
          fredSmith, // 2025-03-10
          billHumphries, // 2025-01-27
        ]
        const pagedPrisonerSummaryPrisonerSession = new PagedPrisonerSummaryPrisonerSession(
          prisonerSummaryPrisonerSessions,
          10,
        )

        // When
        pagedPrisonerSummaryPrisonerSession.sort(SortBy.DUE_BY, SortOrder.ASCENDING)

        // Then
        expect(pagedPrisonerSummaryPrisonerSession.getCurrentPage()).toEqual([
          billHumphries, // 2025-01-27
          jimAardvark, // 2025-02-05
          terrySmith, // 2025-02-11
          bobSmith, // 2025-03-01
          fredSmith, // 2025-03-10
        ])
      })

      it('should sort on due by date descending', () => {
        // Given
        const prisonerSummaryPrisonerSessions = [
          terrySmith, // 2025-02-11
          jimAardvark, // 2025-02-05
          bobSmith, // 2025-03-01
          fredSmith, // 2025-03-10
          billHumphries, // 2025-01-27
        ]
        const pagedPrisonerSummaryPrisonerSession = new PagedPrisonerSummaryPrisonerSession(
          prisonerSummaryPrisonerSessions,
          10,
        )

        // When
        pagedPrisonerSummaryPrisonerSession.sort(SortBy.DUE_BY, SortOrder.DESCENDING)

        // Then
        expect(pagedPrisonerSummaryPrisonerSession.getCurrentPage()).toEqual([
          fredSmith, // 2025-03-10
          bobSmith, // 2025-03-01
          terrySmith, // 2025-02-11
          jimAardvark, // 2025-02-05
          billHumphries, // 2025-01-27
        ])
      })
    })

    describe('exemption date', () => {
      it('should sort on exemption date ascending', () => {
        // Given
        const prisonerSummaryPrisonerSessions = [
          terrySmith, // no exemption set
          jimAardvark, // 2025-02-01
          bobSmith, // 2025-02-20
          fredSmith, // no exemption set
          billHumphries, // 2025-01-18
        ]
        const pagedPrisonerSummaryPrisonerSession = new PagedPrisonerSummaryPrisonerSession(
          prisonerSummaryPrisonerSessions,
          10,
        )

        // When
        pagedPrisonerSummaryPrisonerSession.sort(SortBy.EXEMPTION_DATE, SortOrder.ASCENDING)

        // Then
        expect(pagedPrisonerSummaryPrisonerSession.getCurrentPage()).toEqual([
          billHumphries, // 2025-01-18
          jimAardvark, // 2025-02-01
          bobSmith, // 2025-02-20
          fredSmith, // no exemption set
          terrySmith, // no exemption set
        ])
      })

      it('should sort on exemption date descending', () => {
        // Given
        const prisonerSummaryPrisonerSessions = [
          terrySmith, // no exemption set
          jimAardvark, // 2025-02-01
          bobSmith, // 2025-02-20
          fredSmith, // no exemption set
          billHumphries, // 2025-01-18
        ]
        const pagedPrisonerSummaryPrisonerSession = new PagedPrisonerSummaryPrisonerSession(
          prisonerSummaryPrisonerSessions,
          10,
        )

        // When
        pagedPrisonerSummaryPrisonerSession.sort(SortBy.EXEMPTION_DATE, SortOrder.DESCENDING)

        // Then
        expect(pagedPrisonerSummaryPrisonerSession.getCurrentPage()).toEqual([
          terrySmith, // no exemption set
          fredSmith, // no exemption set
          bobSmith, // 2025-02-20
          jimAardvark, // 2025-02-01
          billHumphries, // 2025-01-18
        ])
      })
    })

    describe('exemption reason', () => {
      it('should sort on exemption reason ascending', () => {
        // Given
        const prisonerSummaryPrisonerSessions = [
          terrySmith, // no exemption set
          jimAardvark, // InductionScheduleStatusValue.EXEMPT_SCREENING_AND_ASSESSMENT_IN_PROGRESS ('Screening and assessment in progress for an identified learning need, neurodivergence or health concern')
          bobSmith, // ReviewScheduleStatusValue.EXEMPT_PRISON_REGIME_CIRCUMSTANCES ('Prison regime changes or circumstances outside the contractor's control')
          fredSmith, // no exemption set
          billHumphries, // InductionScheduleStatusValue.EXEMPT_PRISONER_SAFETY_ISSUES ('Prisoner safety')
        ]
        const pagedPrisonerSummaryPrisonerSession = new PagedPrisonerSummaryPrisonerSession(
          prisonerSummaryPrisonerSessions,
          10,
        )

        // When
        pagedPrisonerSummaryPrisonerSession.sort(SortBy.EXEMPTION_REASON, SortOrder.ASCENDING)

        // Then
        expect(pagedPrisonerSummaryPrisonerSession.getCurrentPage()).toEqual([
          terrySmith, // no exemption set
          fredSmith, // no exemption set
          bobSmith, // ReviewScheduleStatusValue.EXEMPT_PRISON_REGIME_CIRCUMSTANCES ('Prison regime changes or circumstances outside the contractor's control')
          billHumphries, // InductionScheduleStatusValue.EXEMPT_PRISONER_SAFETY_ISSUES ('Prisoner safety')
          jimAardvark, // InductionScheduleStatusValue.EXEMPT_SCREENING_AND_ASSESSMENT_IN_PROGRESS ('Screening and assessment in progress for an identified learning need, neurodivergence or health concern')
        ])
      })

      it('should sort on status descending', () => {
        // Given
        const prisonerSummaryPrisonerSessions = [
          terrySmith, // no exemption set
          jimAardvark, // InductionScheduleStatusValue.EXEMPT_SCREENING_AND_ASSESSMENT_IN_PROGRESS ('Screening and assessment in progress for an identified learning need, neurodivergence or health concern')
          bobSmith, // ReviewScheduleStatusValue.EXEMPT_PRISON_REGIME_CIRCUMSTANCES ('Prison regime changes or circumstances outside the contractor's control')
          fredSmith, // no exemption set
          billHumphries, // InductionScheduleStatusValue.EXEMPT_PRISONER_SAFETY_ISSUES ('Prisoner safety')
        ]
        const pagedPrisonerSummaryPrisonerSession = new PagedPrisonerSummaryPrisonerSession(
          prisonerSummaryPrisonerSessions,
          10,
        )

        // When
        pagedPrisonerSummaryPrisonerSession.sort(SortBy.EXEMPTION_REASON, SortOrder.DESCENDING)

        // Then
        expect(pagedPrisonerSummaryPrisonerSession.getCurrentPage()).toEqual([
          jimAardvark, // InductionScheduleStatusValue.EXEMPT_SCREENING_AND_ASSESSMENT_IN_PROGRESS ('Screening and assessment in progress for an identified learning need, neurodivergence or health concern')
          billHumphries, // InductionScheduleStatusValue.EXEMPT_PRISONER_SAFETY_ISSUES ('Prisoner safety')
          bobSmith, // ReviewScheduleStatusValue.EXEMPT_PRISON_REGIME_CIRCUMSTANCES ('Prison regime changes or circumstances outside the contractor's control')
          terrySmith, // no exemption set
          fredSmith, // no exemption set
        ])
      })
    })
  })

  describe('filter', () => {
    describe('name', () => {
      it.each(['', '   ', null, undefined])(`should not filter given '%s' to filter on`, value => {
        // Given
        const prisonerSummaryPrisonerSessions = [terrySmith, jimAardvark, bobSmith, fredSmith, billHumphries]
        const pagedPrisonerSummaryPrisonerSession = new PagedPrisonerSummaryPrisonerSession(
          prisonerSummaryPrisonerSessions,
          10,
        )

        // When
        pagedPrisonerSummaryPrisonerSession.filter(FilterBy.NAME, value)

        // Then
        expect(pagedPrisonerSummaryPrisonerSession.currentPageNumber).toEqual(1)
        expect(pagedPrisonerSummaryPrisonerSession.totalPages).toEqual(1)
        expect(pagedPrisonerSummaryPrisonerSession.resultIndexFrom).toEqual(1)
        expect(pagedPrisonerSummaryPrisonerSession.resultIndexTo).toEqual(5)
        expect(pagedPrisonerSummaryPrisonerSession.getCurrentPage()).toEqual([
          terrySmith,
          jimAardvark,
          bobSmith,
          fredSmith,
          billHumphries,
        ])
      })

      it('should filter given value that filters out all records', () => {
        // Given
        const prisonerSummaryPrisonerSessions = [terrySmith, jimAardvark, bobSmith, fredSmith, billHumphries]
        const pagedPrisonerSummaryPrisonerSession = new PagedPrisonerSummaryPrisonerSession(
          prisonerSummaryPrisonerSessions,
          10,
        )

        const value = 'this will match nothing and therefore filter everything out'

        // When
        pagedPrisonerSummaryPrisonerSession.filter(FilterBy.NAME, value)

        // Then
        expect(pagedPrisonerSummaryPrisonerSession.currentPageNumber).toEqual(1)
        expect(pagedPrisonerSummaryPrisonerSession.totalPages).toEqual(1)
        expect(pagedPrisonerSummaryPrisonerSession.resultIndexFrom).toEqual(0)
        expect(pagedPrisonerSummaryPrisonerSession.resultIndexTo).toEqual(0)
        expect(pagedPrisonerSummaryPrisonerSession.getCurrentPage()).toEqual([])
      })

      it('should filter given value that filters out some records', () => {
        // Given
        const prisonerSummaryPrisonerSessions = [terrySmith, jimAardvark, bobSmith, fredSmith, billHumphries]
        const pagedPrisonerSummaryPrisonerSession = new PagedPrisonerSummaryPrisonerSession(
          prisonerSummaryPrisonerSessions,
          2,
        ) // totalPages will be 3 before filtering

        const value = '  SmItH  '

        // When
        pagedPrisonerSummaryPrisonerSession.filter(FilterBy.NAME, value)

        // Then
        expect(pagedPrisonerSummaryPrisonerSession.currentPageNumber).toEqual(1)
        expect(pagedPrisonerSummaryPrisonerSession.totalPages).toEqual(2)
        expect(pagedPrisonerSummaryPrisonerSession.resultIndexFrom).toEqual(1)
        expect(pagedPrisonerSummaryPrisonerSession.resultIndexTo).toEqual(2)
        expect(pagedPrisonerSummaryPrisonerSession.getCurrentPage()).toEqual([terrySmith, bobSmith])
      })

      it.each([
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
      ])(`should filter given value '%s' that will return a specific prisoner`, value => {
        // Given
        const prisonerSummaryPrisonerSessions = [terrySmith, jimAardvark, bobSmith, fredSmith, billHumphries]
        const pagedPrisonerSummaryPrisonerSession = new PagedPrisonerSummaryPrisonerSession(
          prisonerSummaryPrisonerSessions,
          10,
        )

        // When
        pagedPrisonerSummaryPrisonerSession.filter(FilterBy.NAME, value)

        // Then
        expect(pagedPrisonerSummaryPrisonerSession.currentPageNumber).toEqual(1)
        expect(pagedPrisonerSummaryPrisonerSession.totalPages).toEqual(1)
        expect(pagedPrisonerSummaryPrisonerSession.resultIndexFrom).toEqual(1)
        expect(pagedPrisonerSummaryPrisonerSession.resultIndexTo).toEqual(1)
        expect(pagedPrisonerSummaryPrisonerSession.getCurrentPage()).toEqual([jimAardvark])
      })
    })

    describe('session type', () => {
      it.each(['', '   ', null, undefined])(`should not filter given '%s' to filter on`, value => {
        // Given
        const prisonerSummaryPrisonerSessions = [terrySmith, jimAardvark, bobSmith, fredSmith, billHumphries]
        const pagedPrisonerSummaryPrisonerSession = new PagedPrisonerSummaryPrisonerSession(
          prisonerSummaryPrisonerSessions,
          10,
        )

        // When
        pagedPrisonerSummaryPrisonerSession.filter(FilterBy.SESSION_TYPE, value)

        // Then
        expect(pagedPrisonerSummaryPrisonerSession.currentPageNumber).toEqual(1)
        expect(pagedPrisonerSummaryPrisonerSession.resultIndexFrom).toEqual(1)
        expect(pagedPrisonerSummaryPrisonerSession.resultIndexTo).toEqual(5)
        expect(pagedPrisonerSummaryPrisonerSession.getCurrentPage()).toEqual([
          terrySmith,
          jimAardvark,
          bobSmith,
          fredSmith,
          billHumphries,
        ])
      })

      it('should filter given value that filters out some records', () => {
        // Given
        const prisonerSummaryPrisonerSessions = [
          terrySmith, // REVIEW
          jimAardvark, // INDUCTION
          bobSmith, // REVIEW
          fredSmith, // INDUCTION
          billHumphries, // INDUCTION
        ]
        const pagedPrisonerSummaryPrisonerSession = new PagedPrisonerSummaryPrisonerSession(
          prisonerSummaryPrisonerSessions,
          10,
        )

        const value = 'REVIEW'

        // When
        pagedPrisonerSummaryPrisonerSession.filter(FilterBy.SESSION_TYPE, value)

        // Then
        expect(pagedPrisonerSummaryPrisonerSession.currentPageNumber).toEqual(1)
        expect(pagedPrisonerSummaryPrisonerSession.resultIndexFrom).toEqual(1)
        expect(pagedPrisonerSummaryPrisonerSession.resultIndexTo).toEqual(2)
        expect(pagedPrisonerSummaryPrisonerSession.getCurrentPage()).toEqual([
          terrySmith, // REVIEW
          bobSmith, // REVIEW
        ])
      })
    })
  })

  describe('combining operations', () => {
    it('should combine operations', () => {
      // Given
      const prisonerSummaryPrisonerSessions = [
        terrySmith, // REVIEW, no exemption set
        jimAardvark, // INDUCTION, exemption date: 2025-02-01
        bobSmith, // REVIEW, exemptin date: 2025-02-20
        fredSmith, // INDUCTION, no exemption set
        billHumphries, // INDUCTION, exemption date: 2025-01-18
      ]
      const pagedPrisonerSummaryPrisonerSession = new PagedPrisonerSummaryPrisonerSession(
        prisonerSummaryPrisonerSessions,
        2,
      )
      // 5 records with a page size of 2 means there are 3 pages of data.

      // When
      pagedPrisonerSummaryPrisonerSession //
        .sort(SortBy.NAME, SortOrder.DESCENDING) // all 5 records sorted by name descending (terrySmith, fredSmith, bobSmith, billHumphries, jimAardvark)
        .setCurrentPageNumber(2) // page 2 (bobSmith, billHumphries)
        .filter(FilterBy.NAME, 'S') // jimAardvark is removed as he does not have an S in his name
        .filter(FilterBy.SESSION_TYPE, 'INDUCTION') // only fredSmith and billHumphries remain as they have the session type INDUCTION
        .sort(SortBy.EXEMPTION_DATE, SortOrder.ASCENDING) // 2 remaining records sorted by exemption date ascending (billHumphries, fredSmith)

      // Then
      expect(pagedPrisonerSummaryPrisonerSession.currentPageNumber).toEqual(1)
      expect(pagedPrisonerSummaryPrisonerSession.resultIndexFrom).toEqual(1)
      expect(pagedPrisonerSummaryPrisonerSession.resultIndexTo).toEqual(2)
      expect(pagedPrisonerSummaryPrisonerSession.getCurrentPage()).toEqual([
        billHumphries, // INDUCTION, exemption date: 2025-01-18
        fredSmith, // INDUCTION, no exemption set
      ])
    })
  })
})
