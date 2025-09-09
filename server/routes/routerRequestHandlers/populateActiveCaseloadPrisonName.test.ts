import { Request, Response } from 'express'
import PrisonService from '../../services/prisonService'
import populateActiveCaseloadPrisonName from './populateActiveCaseloadPrisonName'

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

  let req: Request
  let res: Response
  const next = jest.fn()

  beforeEach(() => {
    req = {} as unknown as Request
    res = {
      render: jest.fn(),
      locals: {
        user: {
          username,
          activeCaseLoadId,
        },
        activeCaseloadPrisonName: undefined,
      },
    } as unknown as Response
    jest.resetAllMocks()
  })

  it('should store prison name on res.locals given prison name lookup is successful', async () => {
    // Given
    prisonService.getAllPrisonNamesById.mockResolvedValue(prisonNamesById)
    res.locals.user.activeCaseLoadId = 'BXI'

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
    res.locals.user.activeCaseLoadId = 'LEI'

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
    res.locals.user.activeCaseLoadId = 'BXI'

    const expected = 'BXI'

    // When
    await requestHandler(req, res, next)

    // Then
    expect(res.locals.activeCaseloadPrisonName).toEqual(expected)
    expect(prisonService.getAllPrisonNamesById).toHaveBeenCalledWith(username)
  })
})
