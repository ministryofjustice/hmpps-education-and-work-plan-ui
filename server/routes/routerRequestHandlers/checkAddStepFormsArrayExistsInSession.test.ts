import { NextFunction, Request, Response } from 'express'
import { SessionData } from 'express-session'
import type { NewGoal } from 'compositeForms'
import { aValidAddStepForm } from '../../testsupport/addStepFormTestDataBuilder'
import checkAddStepFormsArrayExistsInSession from './checkAddStepFormsArrayExistsInSession'

describe('checkAddStepFormsArrayExistsInSession', () => {
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

  it(`should invoke next handler given forms array exists in session and contains at least 1 element`, async () => {
    // Given
    const prisonNumber = 'A1234BC'
    req.params.prisonNumber = prisonNumber

    req.session.newGoal = {
      addStepForms: [aValidAddStepForm()],
    } as NewGoal

    // When
    await checkAddStepFormsArrayExistsInSession(
      req as undefined as Request,
      res as undefined as Response,
      next as undefined as NextFunction,
    )

    // Then
    expect(next).toHaveBeenCalled()
    expect(res.redirect).not.toHaveBeenCalled()
  })

  it(`should redirect to Create Goal screen given no forms array exists in session`, async () => {
    // Given
    const prisonNumber = 'A1234BC'
    req.params.prisonNumber = prisonNumber

    req.session.newGoal = {
      addStepForms: undefined,
    } as NewGoal

    // When
    await checkAddStepFormsArrayExistsInSession(
      req as undefined as Request,
      res as undefined as Response,
      next as undefined as NextFunction,
    )

    // Then
    expect(res.redirect).toHaveBeenCalledWith(`/plan/${prisonNumber}/goals/1/create`)
    expect(next).not.toHaveBeenCalled()
  })

  it(`should redirect to Add Step screen given empty forms array exists in session`, async () => {
    // Given
    const prisonNumber = 'A1234BC'
    req.params.prisonNumber = prisonNumber

    req.session.newGoal = {
      addStepForms: [],
    } as NewGoal

    // When
    await checkAddStepFormsArrayExistsInSession(
      req as undefined as Request,
      res as undefined as Response,
      next as undefined as NextFunction,
    )

    // Then
    expect(res.redirect).toHaveBeenCalledWith(`/plan/${prisonNumber}/goals/1/add-step/1`)
    expect(next).not.toHaveBeenCalled()
  })
})
