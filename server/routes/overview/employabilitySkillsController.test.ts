import { Request, Response } from 'express'
import aValidPrisonerSummary from '../../testsupport/prisonerSummaryTestDataBuilder'
import { anEmployabilitySkillsList } from '../../testsupport/employabilitySkillResponseDtoTestDataBuilder'
import { Result } from '../../utils/result/result'
import EmployabilitySkillsController from './employabilitySkillsController'

describe('employabilitySkillsController', () => {
  const controller = new EmployabilitySkillsController()

  const prisonNumber = 'A1234GC'
  const prisonerSummary = aValidPrisonerSummary({ prisonNumber })
  const employabilitySkills = Result.fulfilled(anEmployabilitySkillsList())

  const req = {
    params: { prisonNumber },
  } as unknown as Request
  const res = {
    render: jest.fn(),
    locals: { prisonerSummary, employabilitySkills },
  } as unknown as Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('getEmployabilitySkillsView', () => {
    it('should get Employability Skills view', async () => {
      // Given
      const expectedView = {
        tab: 'employability-skills',
        prisonerSummary,
        employabilitySkills,
      }

      // When
      await controller.getEmployabilitySkillsView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/overview/index', expectedView)
    })
  })
})
