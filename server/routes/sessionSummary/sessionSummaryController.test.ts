import { Request, Response } from 'express'
import SessionSummaryController from './sessionSummaryController'
import aValidSessionsSummary from '../../testsupport/sessionsSummaryTestDataBuilder'

describe('sessionSummaryController', () => {
  const controller = new SessionSummaryController()

  const username = 'a-dps-user'
  const activeCaseLoadId = 'BXI'
  const activeCaseloadPrisonName = 'Brixton (HMP)'

  const req = {} as unknown as Request
  const res = {
    render: jest.fn(),
    locals: {
      user: {
        username,
        activeCaseLoadId,
      },
      activeCaseloadPrisonName,
    },
  } as unknown as Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should get session summary view', async () => {
    // Given
    res.locals.sessionsSummary = aValidSessionsSummary()
    const expectedView = {
      sessionsSummary: {
        onHoldSessionCount: 6,
        dueSessionCount: 107,
        overdueSessionCount: 19,
        problemRetrievingData: false,
      },
    }

    // When
    await controller.getSessionSummaryView(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith('pages/sessionSummary/index', expectedView)
  })
})
