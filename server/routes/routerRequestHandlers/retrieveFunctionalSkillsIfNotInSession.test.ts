import { NextFunction, Request, Response } from 'express'
import { SessionData } from 'express-session'
import { CuriousService } from '../../services'
import {
  functionalSkillsWithProblemRetrievingData,
  validFunctionalSkills,
} from '../../testsupport/functionalSkillsTestDataBuilder'
import retrieveFunctionalSkillsIfNotInSession from './retrieveFunctionalSkillsIfNotInSession'

describe('retrieveFunctionalSkillsIfNotInSession', () => {
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

  const curiousService = {
    getPrisonerFunctionalSkills: jest.fn(),
  }

  const requestHandler = retrieveFunctionalSkillsIfNotInSession(curiousService as unknown as CuriousService)

  it('should retrieve prisoner functional skills and store in session given functional skills not in session', async () => {
    // Given
    const username = 'a-dps-user'
    req.user.username = username

    req.session.prisonerFunctionalSkills = undefined

    const prisonNumber = 'A1234GC'
    req.params.prisonNumber = prisonNumber
    const expectedFunctionalSkills = validFunctionalSkills({ prisonNumber })
    curiousService.getPrisonerFunctionalSkills.mockResolvedValue(expectedFunctionalSkills)

    // When
    await requestHandler(req as undefined as Request, res as undefined as Response, next as undefined as NextFunction)

    // Then
    expect(curiousService.getPrisonerFunctionalSkills).toHaveBeenCalledWith(prisonNumber, username)
    expect(req.session.prisonerFunctionalSkills).toEqual(expectedFunctionalSkills)
    expect(next).toHaveBeenCalled()
  })

  it('should retrieve prisoner functional skills and store in session given functional skills for a different prisoner already in session', async () => {
    // Given
    const username = 'a-dps-user'
    req.user.username = username

    req.session.prisonerFunctionalSkills = validFunctionalSkills({ prisonNumber: 'Z1234XY' })

    const prisonNumber = 'A1234GC'
    req.params.prisonNumber = prisonNumber
    const expectedFunctionalSkills = validFunctionalSkills({ prisonNumber })
    curiousService.getPrisonerFunctionalSkills.mockResolvedValue(expectedFunctionalSkills)

    // When
    await requestHandler(req as undefined as Request, res as undefined as Response, next as undefined as NextFunction)

    // Then
    expect(curiousService.getPrisonerFunctionalSkills).toHaveBeenCalledWith(prisonNumber, username)
    expect(req.session.prisonerFunctionalSkills).toEqual(expectedFunctionalSkills)
    expect(next).toHaveBeenCalled()
  })

  it('should not retrieve prisoner functional skills given functional skills for prisoner already in session', async () => {
    // Given
    const username = 'a-dps-user'
    req.user.username = username

    const prisonNumber = 'A1234GC'

    req.session.prisonerFunctionalSkills = validFunctionalSkills({ prisonNumber })

    req.params.prisonNumber = prisonNumber
    const expectedFunctionalSkills = validFunctionalSkills({ prisonNumber })

    // When
    await requestHandler(req as undefined as Request, res as undefined as Response, next as undefined as NextFunction)

    // Then
    expect(curiousService.getPrisonerFunctionalSkills).not.toHaveBeenCalled()
    expect(req.session.prisonerFunctionalSkills).toEqual(expectedFunctionalSkills)
    expect(next).toHaveBeenCalled()
  })

  it('should retrieve prisoner functional skills and store in session given functional skills with problem retrieving data already in session', async () => {
    // Given
    const username = 'a-dps-user'
    req.user.username = username

    const prisonNumber = 'A1234GC'
    req.params.prisonNumber = prisonNumber

    req.session.prisonerFunctionalSkills = functionalSkillsWithProblemRetrievingData({ prisonNumber })
    const expectedFunctionalSkills = validFunctionalSkills({ prisonNumber })
    curiousService.getPrisonerFunctionalSkills.mockResolvedValue(expectedFunctionalSkills)

    // When
    await requestHandler(req as undefined as Request, res as undefined as Response, next as undefined as NextFunction)

    // Then
    expect(curiousService.getPrisonerFunctionalSkills).toHaveBeenCalledWith(prisonNumber, username)
    expect(req.session.prisonerFunctionalSkills).toEqual(expectedFunctionalSkills)
    expect(next).toHaveBeenCalled()
  })
})
