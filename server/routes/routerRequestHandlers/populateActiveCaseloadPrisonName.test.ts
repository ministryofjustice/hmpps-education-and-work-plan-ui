import { Request, Response } from 'express'
import PrisonService from '../../services/prisonService'
import populateActiveCaseloadPrisonName from './populateActiveCaseloadPrisonName'
import { PrisonUser } from '../../interfaces/hmppsUser'

jest.mock('../../services/prisonService')

describe('populateActiveCaseloadPrisonName', () => {
  const prisonService = new PrisonService(null, null) as jest.Mocked<PrisonService>
  const requestHandler = populateActiveCaseloadPrisonName(prisonService)

  const username = 'a-dps-user'
  const activeCaseLoadId = 'BXI'

  const prisonNamesById = {
    BXI: 'Brixton (HMP)',
    WDI: 'Wakefield (HMP)',
    BLI: 'Bristol (HMP)',
  }

  const req = {} as unknown as Request
  const res = {
    render: jest.fn(),
    locals: {
      user: {
        username,
        activeCaseLoadId,
      },
      activeCaseloadPrisonName: undefined,
    },
  } as unknown as Response
  const next = jest.fn()

  beforeEach(() => {
    res.locals.activeCaseloadPrisonName = undefined
    jest.resetAllMocks()
  })

  it('should store prison name on res.locals given prison name lookup is successful', async () => {
    // Given
    prisonService.getAllPrisonNamesById.mockResolvedValue(prisonNamesById)
    res.locals.user = { username, activeCaseLoadId: 'BXI' } as PrisonUser

    const expected = 'Brixton (HMP)'

    // When
    await requestHandler(req, res, next)

    // Then
    expect(res.locals.activeCaseloadPrisonName).toEqual(expected)
    expect(prisonService.getAllPrisonNamesById).toHaveBeenCalledWith(username)
  })

  it('should store prisonId on res.locals given prison is not in returned map', async () => {
    // Given
    prisonService.getAllPrisonNamesById.mockResolvedValue(prisonNamesById)
    res.locals.user = { username, activeCaseLoadId: 'LEI' } as PrisonUser

    const expected = 'LEI'

    // When
    await requestHandler(req, res, next)

    // Then
    expect(res.locals.activeCaseloadPrisonName).toEqual(expected)
    expect(prisonService.getAllPrisonNamesById).toHaveBeenCalledWith(username)
  })

  it('should store prisonId on res.locals given prison name lookup returns empty object', async () => {
    // Given
    prisonService.getAllPrisonNamesById.mockResolvedValue({})
    res.locals.user = { username, activeCaseLoadId: 'BXI' } as PrisonUser

    const expected = 'BXI'

    // When
    await requestHandler(req, res, next)

    // Then
    expect(res.locals.activeCaseloadPrisonName).toEqual(expected)
    expect(prisonService.getAllPrisonNamesById).toHaveBeenCalledWith(username)
  })
})
