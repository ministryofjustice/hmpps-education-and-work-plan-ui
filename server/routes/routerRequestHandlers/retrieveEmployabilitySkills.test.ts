import { Request, Response } from 'express'
import EmployabilitySkillsService from '../../services/employabilitySkillsService'
import retrieveEmployabilitySkills from './retrieveEmployabilitySkills'
import { anEmployabilitySkillsList } from '../../testsupport/employabilitySkillResponseDtoTestDataBuilder'

jest.mock('../../services/employabilitySkillsService')

describe('retrieveEmployabilitySkills', () => {
  const employabilitySkillsService = new EmployabilitySkillsService(null) as jest.Mocked<EmployabilitySkillsService>
  const requestHandler = retrieveEmployabilitySkills(employabilitySkillsService)
  const prisonNumber = 'A1234BC'
  const username = 'a-dps-user'

  const apiErrorCallback = jest.fn()
  const req = {
    user: { username },
    params: { prisonNumber },
  } as unknown as Request
  const res = {
    render: jest.fn(),
    locals: {},
  } as unknown as Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
    res.locals = { user: undefined, apiErrorCallback }
  })

  it('should retrieve employability skills and store in res.locals', async () => {
    // Given
    const expectedEmployabilitySkills = anEmployabilitySkillsList()
    employabilitySkillsService.getEmployabilitySkills.mockResolvedValue(expectedEmployabilitySkills)

    // When
    await requestHandler(req, res, next)

    // Then
    expect(res.locals.employabilitySkills.isFulfilled()).toEqual(true)
    expect(res.locals.employabilitySkills.value).toEqual(expectedEmployabilitySkills)
    expect(employabilitySkillsService.getEmployabilitySkills).toHaveBeenCalled()
    expect(next).toHaveBeenCalled()
    expect(apiErrorCallback).not.toHaveBeenCalled()
  })

  it('should store unfulfilled result on res.locals given service returns an error', async () => {
    // Given
    const error = new Error('An error occurred')
    employabilitySkillsService.getEmployabilitySkills.mockRejectedValue(error)

    // When
    await requestHandler(req, res, next)

    // Then
    expect(res.locals.employabilitySkills.isFulfilled()).toEqual(false)
    expect(employabilitySkillsService.getEmployabilitySkills).toHaveBeenCalledWith(username, prisonNumber)
    expect(next).toHaveBeenCalled()
    expect(apiErrorCallback).toHaveBeenCalledWith(error)
  })
})
