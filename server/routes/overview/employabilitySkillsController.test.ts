import { Request, Response } from 'express'
import aValidPrisonerSummary from '../../testsupport/prisonerSummaryTestDataBuilder'
import { Result } from '../../utils/result/result'
import EmployabilitySkillsController from './employabilitySkillsController'
import { aValidInductionDto } from '../../testsupport/inductionDtoTestDataBuilder'
import aValidInductionSchedule from '../../testsupport/inductionScheduleTestDataBuilder'

describe('employabilitySkillsController', () => {
  const controller = new EmployabilitySkillsController()

  const prisonNumber = 'A1234GC'
  const prisonerSummary = aValidPrisonerSummary({ prisonNumber })
  const induction = aValidInductionDto()
  const inductionSchedule = aValidInductionSchedule()

  const req = {
    params: { prisonNumber },
  } as unknown as Request
  const res = {
    render: jest.fn(),
    locals: { prisonerSummary },
  } as unknown as Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
    res.locals.induction = Result.fulfilled(induction)
    res.locals.inductionSchedule = Result.fulfilled(inductionSchedule)
  })

  describe('getEmployabilitySkillsView', () => {
    it('should get Employability Skills view given induction and induction schedule promises are resolved', async () => {
      // Given
      res.locals.indution = Result.fulfilled(induction)
      res.locals.inductionSchedule = Result.fulfilled(inductionSchedule)

      const expectedInductionStatus = 'GOALS_OVERDUE'
      const expectedView = expect.objectContaining({
        tab: 'employability-skills',
        prisonerSummary,
        induction: expect.objectContaining({
          status: 'fulfilled',
          value: induction,
        }),
        inductionStatus: expect.objectContaining({
          status: 'fulfilled',
          value: expectedInductionStatus,
        }),
      })

      // When
      await controller.getEmployabilitySkillsView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/overview/index', expectedView)
    })

    it('should get Employability Skills view given induction promise is not resolved', async () => {
      // Given
      res.locals.induction = Result.rejected('Error getting induction')
      res.locals.inductionSchedule = Result.fulfilled(aValidInductionSchedule())

      const expectedView = expect.objectContaining({
        tab: 'employability-skills',
        prisonerSummary,
        induction: expect.objectContaining({
          status: 'rejected',
          reason: 'Error getting induction',
        }),
        inductionStatus: expect.objectContaining({
          status: 'rejected',
          reason: new Error('Error getting induction'),
        }),
      })

      // When
      await controller.getEmployabilitySkillsView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/overview/index', expectedView)
    })

    it('should get Employability Skills view given both induction and induction schedule promises are not resolved', async () => {
      // Given
      res.locals.induction = Result.rejected('Error getting induction')
      res.locals.inductionSchedule = Result.rejected('Error getting induction schedule')

      const expectedView = expect.objectContaining({
        tab: 'employability-skills',
        prisonerSummary,
        induction: expect.objectContaining({
          status: 'rejected',
          reason: 'Error getting induction',
        }),
        inductionStatus: expect.objectContaining({
          status: 'rejected',
          reason: new Error('Error getting induction, Error getting induction schedule'),
        }),
      })

      // When
      await controller.getEmployabilitySkillsView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/overview/index', expectedView)
    })
  })
})
