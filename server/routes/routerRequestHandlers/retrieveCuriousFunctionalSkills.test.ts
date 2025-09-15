import { Request, Response } from 'express'
import CuriousService from '../../services/curiousService'
import validFunctionalSkills from '../../testsupport/functionalSkillsTestDataBuilder'
import retrieveCuriousFunctionalSkills from './retrieveCuriousFunctionalSkills'

jest.mock('../../services/curiousService')

describe('retrieveCuriousFunctionalSkills', () => {
  const curiousService = new CuriousService(null) as jest.Mocked<CuriousService>

  const prisonNumber = 'A1234GC'

  let req: Request
  const res = {
    locals: {} as Record<string, unknown>,
  } as unknown as Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
    req = {
      params: { prisonNumber },
    } as unknown as Request
  })

  it('should retrieve prisoner functional skills from Curious 1 and Curious 2', async () => {
    // Given
    const requestHandler = retrieveCuriousFunctionalSkills(curiousService, { useCurious1ApiForFunctionalSkills: true })

    const expectedFunctionalSkills = validFunctionalSkills()
    curiousService.getPrisonerFunctionalSkills.mockResolvedValue(expectedFunctionalSkills)

    // When
    await requestHandler(req, res, next)

    // Then
    expect(res.locals.prisonerFunctionalSkills.isFulfilled()).toEqual(true)
    expect(res.locals.prisonerFunctionalSkills.value).toEqual(expectedFunctionalSkills)
    expect(curiousService.getPrisonerFunctionalSkills).toHaveBeenCalledWith(prisonNumber, {
      useCurious1ApiForFunctionalSkills: true,
    })
    expect(next).toHaveBeenCalled()
  })

  it('should retrieve prisoner functional skills only from Curious 2', async () => {
    // Given
    const requestHandler = retrieveCuriousFunctionalSkills(curiousService, { useCurious1ApiForFunctionalSkills: false })

    const expectedFunctionalSkills = validFunctionalSkills()
    curiousService.getPrisonerFunctionalSkills.mockResolvedValue(expectedFunctionalSkills)

    // When
    await requestHandler(req, res, next)

    // Then
    expect(res.locals.prisonerFunctionalSkills.isFulfilled()).toEqual(true)
    expect(res.locals.prisonerFunctionalSkills.value).toEqual(expectedFunctionalSkills)
    expect(curiousService.getPrisonerFunctionalSkills).toHaveBeenCalledWith(prisonNumber, {
      useCurious1ApiForFunctionalSkills: false,
    })
    expect(next).toHaveBeenCalled()
  })
})
