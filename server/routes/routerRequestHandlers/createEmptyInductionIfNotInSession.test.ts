import { SessionData } from 'express-session'
import { NextFunction, Request, Response } from 'express'
import type { InductionDto } from 'inductionDto'
import createEmptyInductionIfNotInSession from './createEmptyInductionIfNotInSession'

describe('createEmptyInductionIfNotInSession', () => {
  const req = {
    session: {} as SessionData,
    params: {} as Record<string, string>,
  }
  const res = {}
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
    req.session = {} as SessionData
    req.params = {} as Record<string, string>
  })

  it('should create an empty induction for the prisoner given there is no induction on the session', async () => {
    // Given
    req.params.prisonNumber = 'A1234BC'

    req.session.inductionDto = undefined

    const expectedInduction = { prisonNumber: 'A1234BC' }

    // When
    await createEmptyInductionIfNotInSession(
      req as undefined as Request,
      res as undefined as Response,
      next as undefined as NextFunction,
    )

    // Then
    expect(next).toHaveBeenCalled()
    expect(req.session.inductionDto).toEqual(expectedInduction)
  })

  it('should create an empty induction for the prisoner given there is an induction on the session for a different prisoner', async () => {
    // Given
    req.params.prisonNumber = 'A1234BC'

    req.session.inductionDto = { prisonNumber: 'Z1234ZZ' } as InductionDto

    const expectedInduction = { prisonNumber: 'A1234BC' }

    // When
    await createEmptyInductionIfNotInSession(
      req as undefined as Request,
      res as undefined as Response,
      next as undefined as NextFunction,
    )

    // Then
    expect(next).toHaveBeenCalled()
    expect(req.session.inductionDto).toEqual(expectedInduction)
  })

  it('should not create an empty induction for the prisoner given there is already an induction on the session for the prisoner', async () => {
    // Given
    req.params.prisonNumber = 'A1234BC'

    const expectedInduction = {
      prisonNumber: 'A1234BC',
      workOnRelease: {
        hopingToWork: true,
      },
    } as InductionDto

    req.session.inductionDto = expectedInduction

    // When
    await createEmptyInductionIfNotInSession(
      req as undefined as Request,
      res as undefined as Response,
      next as undefined as NextFunction,
    )

    // Then
    expect(next).toHaveBeenCalled()
    expect(req.session.inductionDto).toEqual(expectedInduction)
  })
})
