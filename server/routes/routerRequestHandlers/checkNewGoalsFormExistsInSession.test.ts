import { NextFunction, Request, Response } from 'express'
import { SessionData } from 'express-session'
import type { NewGoal } from 'compositeForms'
import { aValidCreateGoalForm } from '../../testsupport/createGoalFormTestDataBuilder'
import { aValidAddStepForm } from '../../testsupport/addStepFormTestDataBuilder'
import aValidAddNoteForm from '../../testsupport/addNoteFormTestDataBuilder'
import checkNewGoalsFormExistsInSession from './checkNewGoalsFormExistsInSession'

describe('checkNewGoalsFormExistsInSession', () => {
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

  it(`should invoke next handler given NewGoal array exists in session with at least 1 element`, async () => {
    // Given
    req.session.newGoals = [
      {
        createGoalForm: aValidCreateGoalForm(),
        addStepForms: [aValidAddStepForm()],
        addNoteForm: aValidAddNoteForm(),
      },
    ] as Array<NewGoal>

    // When
    await checkNewGoalsFormExistsInSession(
      req as undefined as Request,
      res as undefined as Response,
      next as undefined as NextFunction,
    )

    // Then
    expect(next).toHaveBeenCalled()
    expect(res.redirect).not.toHaveBeenCalled()
  })

  it(`should redirect to Create Goal screen given no NewGoal array exists in session`, async () => {
    // Given
    const prisonNumber = 'A1234BC'
    req.params.prisonNumber = prisonNumber

    req.session.newGoals = undefined

    // When
    await checkNewGoalsFormExistsInSession(
      req as undefined as Request,
      res as undefined as Response,
      next as undefined as NextFunction,
    )

    // Then
    expect(res.redirect).toHaveBeenCalledWith(`/plan/${prisonNumber}/goals/1/create`)
    expect(next).not.toHaveBeenCalled()
  })

  it(`should redirect to Add Note screen given an empty NewGoal array exists in session`, async () => {
    // Given
    const prisonNumber = 'A1234BC'
    req.params.prisonNumber = prisonNumber

    req.session.newGoals = []

    // When
    await checkNewGoalsFormExistsInSession(
      req as undefined as Request,
      res as undefined as Response,
      next as undefined as NextFunction,
    )

    // Then
    expect(res.redirect).toHaveBeenCalledWith(`/plan/${prisonNumber}/goals/1/add-note`)
    expect(next).not.toHaveBeenCalled()
  })

  it(`should redirect to Add Note screen given NewGoal array exists in session with at least 1 element that has no AddNoteForm`, async () => {
    // Given
    const prisonNumber = 'A1234BC'
    req.params.prisonNumber = prisonNumber

    req.session.newGoals = [
      {
        createGoalForm: aValidCreateGoalForm(),
        addStepForms: [aValidAddStepForm()],
        addNoteForm: undefined,
      },
    ] as Array<NewGoal>

    // When
    await checkNewGoalsFormExistsInSession(
      req as undefined as Request,
      res as undefined as Response,
      next as undefined as NextFunction,
    )

    // Then
    expect(res.redirect).toHaveBeenCalledWith(`/plan/${prisonNumber}/goals/1/add-note`)
    expect(next).not.toHaveBeenCalled()
  })
})
