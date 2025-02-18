import { Request, Response } from 'express'
import { startOfDay } from 'date-fns'
import type { PrisonerSummaryPrisonerSession, SessionsSummary } from 'viewModels'
import PrisonerSearchService from '../../services/prisonerSearchService'
import SessionService from '../../services/sessionService'
import SessionListController from './sessionListController'
import aValidPrisonerSummary from '../../testsupport/prisonerSummaryTestDataBuilder'
import { aValidPrisonerSession, aValidSessions } from '../../testsupport/prisonerSessionTestDataBuilder'
import SessionTypeValue from '../../enums/sessionTypeValue'
import ReviewScheduleStatusValue from '../../enums/reviewScheduleStatusValue'
import SessionStatusValue from '../../enums/sessionStatusValue'
import aValidSessionsSummary from '../../testsupport/sessionsSummaryTestDataBuilder'

jest.mock('../../services/prisonerSearchService')
jest.mock('../../services/sessionService')

describe('sessionListController', () => {
  const prisonerSearchService = new PrisonerSearchService(null, null, null) as jest.Mocked<PrisonerSearchService>
  const sessionService = new SessionService(null, null) as jest.Mocked<SessionService>
  const controller = new SessionListController(prisonerSearchService, sessionService)

  const sessionsSummary = aValidSessionsSummary()

  const jimmyLightFingers = aValidPrisonerSummary({
    prisonNumber: 'A1234BC',
    firstName: 'Jimmy',
    lastName: 'Lightfingers',
    releaseDate: startOfDay('2023-10-01'),
  })
  const jimmyMcShifty = aValidPrisonerSummary({
    prisonNumber: 'B1234BC',
    firstName: 'Jimmy',
    lastName: 'McShifty',
    releaseDate: startOfDay('2000-07-23'),
  })
  const donVitoCorleone = aValidPrisonerSummary({
    prisonNumber: 'C1234BC',
    firstName: 'Vito',
    lastName: 'Corleone',
    releaseDate: startOfDay('2020-09-10'),
  })
  const frederickMcNoSession = aValidPrisonerSummary({
    prisonNumber: 'D1234BC',
    firstName: 'Frederick',
    lastName: 'McNoSession',
    releaseDate: startOfDay('2020-09-10'),
  })
  const johnNogooder = aValidPrisonerSummary({
    prisonNumber: 'E1234BC',
    firstName: 'Johny',
    lastName: 'Nogooder',
    releaseDate: startOfDay('2023-04-12'),
  })
  const prisonerSummaries = {
    problemRetrievingData: false,
    prisoners: [jimmyLightFingers, jimmyMcShifty, donVitoCorleone, frederickMcNoSession, johnNogooder],
  }

  const jimmyLightFingersSession = aValidPrisonerSession({
    prisonNumber: 'A1234BC',
    sessionType: SessionTypeValue.INDUCTION,
    deadlineDate: startOfDay('2025-10-01'),
    exemption: undefined,
  })
  const jimmyMcShiftySession = aValidPrisonerSession({
    prisonNumber: 'B1234BC',
    sessionType: SessionTypeValue.REVIEW,
    deadlineDate: startOfDay('2025-09-30'),
    exemption: undefined,
  })
  const donVitoCorleoneSession = aValidPrisonerSession({
    prisonNumber: 'C1234BC',
    sessionType: SessionTypeValue.REVIEW,
    deadlineDate: startOfDay('2025-11-15'),
    exemption: {
      exemptionReason: ReviewScheduleStatusValue.EXEMPT_SECURITY_ISSUE_RISK_TO_STAFF,
      exemptionDate: startOfDay('2025-02-18'),
    },
  })
  const johnNogooderSession = aValidPrisonerSession({
    prisonNumber: 'E1234BC',
    sessionType: SessionTypeValue.INDUCTION,
    deadlineDate: startOfDay('2025-01-10'),
    exemption: undefined,
  })

  const username = 'a-dps-user'
  const activeCaseLoadId = 'BXI'

  const req = {
    session: {},
    query: {},
  } as unknown as Request
  const res = {
    render: jest.fn(),
    locals: {
      user: {
        username,
        activeCaseLoadId,
      },
      sessionsSummary,
    },
  } as unknown as Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
    req.session.sessionListSortOptions = undefined
    req.query = {}

    prisonerSearchService.getPrisonersByPrisonId.mockResolvedValue(prisonerSummaries)
  })

  describe('getDueSessionsView', () => {
    it('should get due sessions view given no filtering, paging or sorting query string parameters', async () => {
      // Given
      req.query = {}

      const prisonerSessions = aValidSessions({
        problemRetrievingData: false,
        sessions: [jimmyLightFingersSession, jimmyMcShiftySession],
      })
      sessionService.getSessionsInStatusForPrisoners.mockResolvedValue(prisonerSessions)

      const expectedView: RenderedSessionListView = {
        sessionsSummary,
        currentPageOfRecords: [
          { ...jimmyLightFingers, ...jimmyLightFingersSession },
          { ...jimmyMcShifty, ...jimmyMcShiftySession },
        ], // default sort order (due-by descending) applied
        searchTerm: '',
        sessionType: '',
        sortBy: 'due-by',
        sortOrder: 'descending',
        items: [],
        nextPage: {
          href: '',
          text: 'Next',
        },
        previousPage: {
          href: '',
          text: 'Previous',
        },
        results: {
          count: 2,
          from: 1,
          to: 2,
        },
      }

      // When
      await controller.getDueSessionsView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/sessionList/dueSessions', expectedView)
      expect(req.session.sessionListSortOptions).toEqual('due-by,descending')
      expect(prisonerSearchService.getPrisonersByPrisonId).toHaveBeenCalledWith(activeCaseLoadId, username)
      expect(sessionService.getSessionsInStatusForPrisoners).toHaveBeenCalledWith(
        ['A1234BC', 'B1234BC', 'C1234BC', 'D1234BC', 'E1234BC'],
        SessionStatusValue.DUE,
        username,
      )
    })

    describe('sorting', () => {
      it('should get due sessions view given sorting applied via session variable', async () => {
        // Given
        req.query = {}
        req.session.sessionListSortOptions = 'name,descending'

        const prisonerSessions = aValidSessions({
          problemRetrievingData: false,
          sessions: [jimmyLightFingersSession, jimmyMcShiftySession],
        })
        sessionService.getSessionsInStatusForPrisoners.mockResolvedValue(prisonerSessions)

        const expectedView: RenderedSessionListView = {
          sessionsSummary,
          currentPageOfRecords: [
            { ...jimmyMcShifty, ...jimmyMcShiftySession },
            { ...jimmyLightFingers, ...jimmyLightFingersSession },
          ], // sort order (name descending) applied
          searchTerm: '',
          sessionType: '',
          sortBy: 'name',
          sortOrder: 'descending',
          items: [],
          nextPage: {
            href: '',
            text: 'Next',
          },
          previousPage: {
            href: '',
            text: 'Previous',
          },
          results: {
            count: 2,
            from: 1,
            to: 2,
          },
        }

        // When
        await controller.getDueSessionsView(req, res, next)

        // Then
        expect(res.render).toHaveBeenCalledWith('pages/sessionList/dueSessions', expectedView)
        expect(req.session.sessionListSortOptions).toEqual('name,descending')
        expect(prisonerSearchService.getPrisonersByPrisonId).toHaveBeenCalledWith(activeCaseLoadId, username)
        expect(sessionService.getSessionsInStatusForPrisoners).toHaveBeenCalledWith(
          ['A1234BC', 'B1234BC', 'C1234BC', 'D1234BC', 'E1234BC'],
          SessionStatusValue.DUE,
          username,
        )
      })

      it('should get due sessions view given sorting applied via query string param', async () => {
        // Given
        req.query = { sort: 'release-date,ascending' }

        const prisonerSessions = aValidSessions({
          problemRetrievingData: false,
          sessions: [jimmyLightFingersSession, jimmyMcShiftySession],
        })
        sessionService.getSessionsInStatusForPrisoners.mockResolvedValue(prisonerSessions)

        const expectedView: RenderedSessionListView = {
          sessionsSummary,
          currentPageOfRecords: [
            { ...jimmyMcShifty, ...jimmyMcShiftySession },
            { ...jimmyLightFingers, ...jimmyLightFingersSession },
          ], // sort order (release-date ascending) applied
          searchTerm: '',
          sessionType: '',
          sortBy: 'release-date',
          sortOrder: 'ascending',
          items: [],
          nextPage: {
            href: '',
            text: 'Next',
          },
          previousPage: {
            href: '',
            text: 'Previous',
          },
          results: {
            count: 2,
            from: 1,
            to: 2,
          },
        }

        // When
        await controller.getDueSessionsView(req, res, next)

        // Then
        expect(res.render).toHaveBeenCalledWith('pages/sessionList/dueSessions', expectedView)
        expect(req.session.sessionListSortOptions).toEqual('release-date,ascending')
        expect(prisonerSearchService.getPrisonersByPrisonId).toHaveBeenCalledWith(activeCaseLoadId, username)
        expect(sessionService.getSessionsInStatusForPrisoners).toHaveBeenCalledWith(
          ['A1234BC', 'B1234BC', 'C1234BC', 'D1234BC', 'E1234BC'],
          SessionStatusValue.DUE,
          username,
        )
      })
    })

    describe('filtering', () => {
      it('should get due sessions view given name filtering', async () => {
        // Given
        req.query = { searchTerm: 'shifty' }

        const prisonerSessions = aValidSessions({
          problemRetrievingData: false,
          sessions: [jimmyLightFingersSession, jimmyMcShiftySession],
        })
        sessionService.getSessionsInStatusForPrisoners.mockResolvedValue(prisonerSessions)

        const expectedView: RenderedSessionListView = {
          sessionsSummary,
          currentPageOfRecords: [{ ...jimmyMcShifty, ...jimmyMcShiftySession }], // filtering on name applied
          searchTerm: 'shifty',
          sessionType: '',
          sortBy: 'due-by',
          sortOrder: 'descending',
          items: [],
          nextPage: {
            href: '',
            text: 'Next',
          },
          previousPage: {
            href: '',
            text: 'Previous',
          },
          results: {
            count: 1,
            from: 1,
            to: 1,
          },
        }

        // When
        await controller.getDueSessionsView(req, res, next)

        // Then
        expect(res.render).toHaveBeenCalledWith('pages/sessionList/dueSessions', expectedView)
        expect(req.session.sessionListSortOptions).toEqual('due-by,descending')
        expect(prisonerSearchService.getPrisonersByPrisonId).toHaveBeenCalledWith(activeCaseLoadId, username)
        expect(sessionService.getSessionsInStatusForPrisoners).toHaveBeenCalledWith(
          ['A1234BC', 'B1234BC', 'C1234BC', 'D1234BC', 'E1234BC'],
          SessionStatusValue.DUE,
          username,
        )
      })

      it('should get due sessions view given session type filtering', async () => {
        // Given
        req.query = { sessionType: 'INDUCTION' }

        const prisonerSessions = aValidSessions({
          problemRetrievingData: false,
          sessions: [jimmyLightFingersSession, jimmyMcShiftySession],
        })
        sessionService.getSessionsInStatusForPrisoners.mockResolvedValue(prisonerSessions)

        const expectedView: RenderedSessionListView = {
          sessionsSummary,
          currentPageOfRecords: [{ ...jimmyLightFingers, ...jimmyLightFingersSession }], // filtering on session type applied
          searchTerm: '',
          sessionType: 'INDUCTION',
          sortBy: 'due-by',
          sortOrder: 'descending',
          items: [],
          nextPage: {
            href: '',
            text: 'Next',
          },
          previousPage: {
            href: '',
            text: 'Previous',
          },
          results: {
            count: 1,
            from: 1,
            to: 1,
          },
        }

        // When
        await controller.getDueSessionsView(req, res, next)

        // Then
        expect(res.render).toHaveBeenCalledWith('pages/sessionList/dueSessions', expectedView)
        expect(req.session.sessionListSortOptions).toEqual('due-by,descending')
        expect(prisonerSearchService.getPrisonersByPrisonId).toHaveBeenCalledWith(activeCaseLoadId, username)
        expect(sessionService.getSessionsInStatusForPrisoners).toHaveBeenCalledWith(
          ['A1234BC', 'B1234BC', 'C1234BC', 'D1234BC', 'E1234BC'],
          SessionStatusValue.DUE,
          username,
        )
      })
    })
  })

  describe('getOnHoldSessionsView', () => {
    it('should get on-hold sessions view given no filtering, paging or sorting query string parameters', async () => {
      // Given
      req.query = {}

      const prisonerSessions = aValidSessions({
        problemRetrievingData: false,
        sessions: [donVitoCorleoneSession],
      })
      sessionService.getSessionsInStatusForPrisoners.mockResolvedValue(prisonerSessions)

      const expectedView: RenderedSessionListView = {
        sessionsSummary,
        currentPageOfRecords: [{ ...donVitoCorleone, ...donVitoCorleoneSession }], // default sort order (due-by descending) applied
        searchTerm: '',
        sessionType: '',
        sortBy: 'due-by',
        sortOrder: 'descending',
        items: [],
        nextPage: {
          href: '',
          text: 'Next',
        },
        previousPage: {
          href: '',
          text: 'Previous',
        },
        results: {
          count: 1,
          from: 1,
          to: 1,
        },
      }

      // When
      await controller.getOnHoldSessionsView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/sessionList/onHoldSessions', expectedView)
      expect(req.session.sessionListSortOptions).toEqual('due-by,descending')
      expect(prisonerSearchService.getPrisonersByPrisonId).toHaveBeenCalledWith(activeCaseLoadId, username)
      expect(sessionService.getSessionsInStatusForPrisoners).toHaveBeenCalledWith(
        ['A1234BC', 'B1234BC', 'C1234BC', 'D1234BC', 'E1234BC'],
        SessionStatusValue.ON_HOLD,
        username,
      )
    })
  })

  describe('getOverdueSessionsView', () => {
    it('should get overdue sessions view given no filtering, paging or sorting query string parameters', async () => {
      // Given
      req.query = {}

      const prisonerSessions = aValidSessions({
        problemRetrievingData: false,
        sessions: [johnNogooderSession],
      })
      sessionService.getSessionsInStatusForPrisoners.mockResolvedValue(prisonerSessions)

      const expectedView: RenderedSessionListView = {
        sessionsSummary,
        currentPageOfRecords: [{ ...johnNogooder, ...johnNogooderSession }], // default sort order (due-by descending) applied
        searchTerm: '',
        sessionType: '',
        sortBy: 'due-by',
        sortOrder: 'descending',
        items: [],
        nextPage: {
          href: '',
          text: 'Next',
        },
        previousPage: {
          href: '',
          text: 'Previous',
        },
        results: {
          count: 1,
          from: 1,
          to: 1,
        },
      }

      // When
      await controller.getOverdueSessionsView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/sessionList/overdueSessions', expectedView)
      expect(req.session.sessionListSortOptions).toEqual('due-by,descending')
      expect(prisonerSearchService.getPrisonersByPrisonId).toHaveBeenCalledWith(activeCaseLoadId, username)
      expect(sessionService.getSessionsInStatusForPrisoners).toHaveBeenCalledWith(
        ['A1234BC', 'B1234BC', 'C1234BC', 'D1234BC', 'E1234BC'],
        SessionStatusValue.OVERDUE,
        username,
      )
    })
  })
})

interface RenderedSessionListView {
  sessionsSummary: SessionsSummary
  currentPageOfRecords: PrisonerSummaryPrisonerSession[]
  searchTerm: string
  sessionType: string
  sortBy: string
  sortOrder: string
  items: Array<{ href: string; selected: boolean; text: string; type: undefined }>
  results: { count: number; from: number; to: number }
  previousPage: { href: string; text: string }
  nextPage: { href: string; text: string }
}
