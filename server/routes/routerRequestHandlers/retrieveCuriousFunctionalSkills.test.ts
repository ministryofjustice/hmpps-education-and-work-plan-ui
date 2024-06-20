import { Request, Response } from 'express'
import CuriousService from '../../services/curiousService'
import { validFunctionalSkills } from '../../testsupport/functionalSkillsTestDataBuilder'
import retrieveCuriousFunctionalSkills from './retrieveCuriousFunctionalSkills'

jest.mock('../../services/curiousService')

describe('retrieveCuriousFunctionalSkills', () => {
  const curiousService = new CuriousService(null, null, null) as jest.Mocked<CuriousService>
  const requestHandler = retrieveCuriousFunctionalSkills(curiousService)

  const prisonNumber = 'A1234GC'
  const username = 'a-dps-user'

  let req: Request
  const res = {
    locals: {} as Record<string, unknown>,
  } as unknown as Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
    req = {
      user: { username },
      params: { prisonNumber },
    } as unknown as Request
  })

  it('should retrieve prisoner functional skills', async () => {
    // Given
    const expectedFunctionalSkills = validFunctionalSkills({ prisonNumber })
    curiousService.getPrisonerFunctionalSkills.mockResolvedValue(expectedFunctionalSkills)

    // When
    await requestHandler(req, res, next)

    // Then
    expect(curiousService.getPrisonerFunctionalSkills).toHaveBeenCalledWith(prisonNumber, username)
    expect(res.locals.prisonerFunctionalSkills).toEqual(expectedFunctionalSkills)
    expect(next).toHaveBeenCalled()
  })
})
