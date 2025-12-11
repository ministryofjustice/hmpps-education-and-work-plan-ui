import { NextFunction, Request, Response } from 'express'
import type { PageFlow } from 'viewModels'
import { SessionData } from 'express-session'
import removeFormDataFromSession from './removeFormDataFromSession'
import { aValidUpdateGoalForm } from '../../testsupport/updateGoalFormTestDataBuilder'
import { getPrisonerContext } from '../../data/session/prisonerContexts'

describe('removeFormDataFromSession', () => {
  const prisonNumber = 'A1234BC'

  const req = {
    session: {} as SessionData,
    params: { prisonNumber },
  }
  const res = {}
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
    req.session = {} as SessionData
  })

  it('should remove form and DTOs from the prisoner context and session', async () => {
    // Given
    getPrisonerContext(req.session, prisonNumber).updateGoalForm = aValidUpdateGoalForm()

    req.session.pageFlowQueue = {} as PageFlow

    // When
    await removeFormDataFromSession(
      req as undefined as Request,
      res as undefined as Response,
      next as undefined as NextFunction,
    )

    // Then
    expect(next).toHaveBeenCalled()
    expect(getPrisonerContext(req.session, prisonNumber)).toEqual({})
    expect(req.session.pageFlowQueue).toBeUndefined()
  })
})
