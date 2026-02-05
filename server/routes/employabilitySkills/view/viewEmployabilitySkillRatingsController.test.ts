import { Request, Response } from 'express'
import ViewEmployabilitySkillRatingsController from './viewEmployabilitySkillRatingsController'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import { anEmployabilitySkillsList } from '../../../testsupport/employabilitySkillResponseDtoTestDataBuilder'
import EmployabilitySkillsValue from '../../../enums/employabilitySkillsValue'
import { Result } from '../../../utils/result/result'

describe('viewEmployabilitySkillRatingsController', () => {
  const controller = new ViewEmployabilitySkillRatingsController()

  const prisonNumber = 'A1234GC'
  const prisonerSummary = aValidPrisonerSummary({ prisonNumber })
  const employabilitySkills = Result.fulfilled(anEmployabilitySkillsList())
  const prisonNamesById = Result.fulfilled({ MDI: 'Moorland (HMP & YOI)', WDI: 'Wakefield (HMP)' })
  const skillType = EmployabilitySkillsValue.RELIABILITY

  const req = {
    params: { prisonNumber, skillType },
  } as unknown as Request
  const res = {
    render: jest.fn(),
    locals: { prisonerSummary, employabilitySkills, prisonNamesById },
  } as unknown as Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('getEmployabilitySkillRatingsView', () => {
    it('should get Employability Skills Ratings view', async () => {
      // Given
      const expectedView = {
        prisonerSummary,
        employabilitySkills,
        skillType,
        prisonNamesById,
      }

      // When
      await controller.getEmployabilitySkillRatingsView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith(
        'pages/employabilitySkills/view/employability-skill-ratings.njk',
        expectedView,
      )
    })
  })
})
