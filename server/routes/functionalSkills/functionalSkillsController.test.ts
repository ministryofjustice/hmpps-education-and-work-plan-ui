import { Request, Response } from 'express'
import FunctionalSkillsController from './functionalSkillsController'
import aValidPrisonerSummary from '../../testsupport/prisonerSummaryTestDataBuilder'
import validFunctionalSkills from '../../testsupport/functionalSkillsTestDataBuilder'
import { Result } from '../../utils/result/result'

describe('functionalSkillsController', () => {
  const controller = new FunctionalSkillsController()

  const prisonNumber = 'A1234GC'
  const prisonerSummary = aValidPrisonerSummary({ prisonNumber })
  const prisonNamesById = Result.fulfilled({
    MDI: 'Moorland (HMP & YOI)',
    LFI: 'Lancaster Farms (HMP)',
    WMI: 'Wymott (HMP & YOI)',
  })
  const prisonerFunctionalSkills = Result.fulfilled(validFunctionalSkills())

  const req = {
    params: { prisonNumber },
    user: { username: 'AUSER_GEN', token: 'some-token' } as Express.User,
  } as unknown as Request
  const res = {
    render: jest.fn(),
    locals: { prisonerSummary, prisonNamesById, prisonerFunctionalSkills },
  } as unknown as Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('getFunctionalSkillsView', () => {
    it('should get functional skills view given curious service returns functional skills data for the prisoner', async () => {
      // Given
      const expectedView = {
        prisonerSummary,
        prisonNamesById,
        prisonerFunctionalSkills,
      }

      // When
      await controller.getFunctionalSkillsView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/functionalSkills/index', expectedView)
    })
  })
})
