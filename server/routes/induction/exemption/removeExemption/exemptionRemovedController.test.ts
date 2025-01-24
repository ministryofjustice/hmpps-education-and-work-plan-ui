import { Request, Response } from 'express'
import { startOfDay } from 'date-fns'
import aValidPrisonerSummary from '../../../../testsupport/prisonerSummaryTestDataBuilder'
import ExemptionRemovedController from './exemptionRemovedController'
import aValidInductionSchedule from '../../../../testsupport/inductionScheduleTestDataBuilder'
import InductionScheduleStatusValue from '../../../../enums/inductionScheduleStatusValue'

describe('exemptionRemovedController', () => {
  const controller = new ExemptionRemovedController()

  const prisonNumber = 'A1234BC'
  const prisonerSummary = aValidPrisonerSummary(prisonNumber)
  const inductionSchedule = aValidInductionSchedule({
    scheduleStatus: InductionScheduleStatusValue.SCHEDULED,
    deadlineDate: startOfDay('2024-12-03'),
  })

  let req: Request
  let res: Response
  let next: jest.Mock

  beforeEach(() => {
    req = {
      params: { prisonNumber },
      session: {},
    } as unknown as Request

    res = {
      render: jest.fn(),
      redirect: jest.fn(),
      redirectWithSuccess: jest.fn(),
      locals: { prisonerSummary, inductionSchedule },
    } as unknown as Response

    next = jest.fn()

    jest.clearAllMocks()
  })

  describe('getExemptionRemovedView', () => {
    it('should render the "Exemption Removed" page', async () => {
      // Given
      const expectedViewData = {
        prisonerSummary,
        inductionDueDate: startOfDay('2024-12-03'),
      }

      // When
      await controller.getExemptionRemovedView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith(
        'pages/induction/removeExemption/exemptionRemoved/index',
        expectedViewData,
      )
    })
  })

  describe('submitExemptionRemoved', () => {
    it('should redirect to the overview page with a success message', async () => {
      // Given

      // When
      await controller.submitExemptionRemoved(req, res, next)

      // Then
      expect(res.redirectWithSuccess).toHaveBeenCalledWith(`/plan/${prisonNumber}/view/overview`, 'Exemption removed.')
      expect(res.redirect).not.toHaveBeenCalled()
    })
  })
})
