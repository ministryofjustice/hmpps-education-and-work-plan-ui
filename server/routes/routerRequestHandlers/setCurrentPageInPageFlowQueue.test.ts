import { NextFunction, Request, Response } from 'express'
import type { PageFlow } from 'viewModels'
import { SessionData } from 'express-session'
import setCurrentPageInPageFlowQueue from './setCurrentPageInPageFlowQueue'
import { setCurrentPageIndex } from '../pageFlowQueue'

jest.mock('../pageFlowQueue')

describe('setCurrentPageInPageFlowQueue', () => {
  const mockCurrentPageIndexSetter = setCurrentPageIndex as jest.MockedFunction<typeof setCurrentPageIndex>

  const req = {
    user: {} as Express.User,
    session: {} as SessionData,
    params: {} as Record<string, string>,
    query: {} as Record<string, string>,
    path: '',
  }
  const res = {
    redirect: jest.fn(),
    locals: {} as Record<string, unknown>,
  }
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
    req.user = {} as Express.User
    req.session = {} as SessionData
    req.params = {} as Record<string, string>
    req.query = {} as Record<string, string>
    req.path = ''
    res.locals = {} as Record<string, unknown>
  })

  it('should set the current page in page flow queue given there is a PageFlowQueue on the session', async () => {
    // Given
    const initialPageFlowQueue: PageFlow = {
      pageUrls: ['/first-page', '/second-page', '/third-page'],
      currentPageIndex: 0,
    }
    req.session.pageFlowQueue = initialPageFlowQueue
    req.path = '/second-page'

    const expectedPageFlowQueue: PageFlow = {
      pageUrls: ['/first-page', '/second-page', '/third-page'],
      currentPageIndex: 1,
    }
    mockCurrentPageIndexSetter.mockReturnValue(expectedPageFlowQueue)

    // When
    await setCurrentPageInPageFlowQueue(
      req as undefined as Request,
      res as undefined as Response,
      next as undefined as NextFunction,
    )

    // Then
    expect(next).toHaveBeenCalled()
    expect(req.session.pageFlowQueue).toEqual(expectedPageFlowQueue)
    expect(mockCurrentPageIndexSetter).toHaveBeenCalledWith(initialPageFlowQueue, '/second-page')
  })

  it('should not set the current page in page flow queue given there is no PageFlowQueue on the session', async () => {
    // Given
    req.session.pageFlowQueue = undefined

    // When
    await setCurrentPageInPageFlowQueue(
      req as undefined as Request,
      res as undefined as Response,
      next as undefined as NextFunction,
    )

    // Then
    expect(next).toHaveBeenCalled()
    expect(req.session.pageFlowQueue).toBeUndefined()
  })
})
