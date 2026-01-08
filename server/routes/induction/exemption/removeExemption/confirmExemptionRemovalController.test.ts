import { Request, Response } from 'express'
import { v4 as uuidV4 } from 'uuid'
import createError from 'http-errors'
import InductionService from '../../../../services/inductionService'
import AuditService from '../../../../services/auditService'
import aValidPrisonerSummary from '../../../../testsupport/prisonerSummaryTestDataBuilder'
import ConfirmExemptionRemovalController from './confirmExemptionRemovalController'
import aValidInductionSchedule from '../../../../testsupport/inductionScheduleTestDataBuilder'
import InductionScheduleStatusValue from '../../../../enums/inductionScheduleStatusValue'

jest.mock('../../../../services/auditService')
jest.mock('../../../../services/inductionService')

describe('confirmExemptionRemovalController', () => {
  const inductionService = new InductionService(null) as jest.Mocked<InductionService>
  const auditService = new AuditService(null) as jest.Mocked<AuditService>
  const controller = new ConfirmExemptionRemovalController(inductionService, auditService)

  const journeyId = uuidV4()
  const prisonNumber = 'A1234BC'
  const prisonerSummary = aValidPrisonerSummary({ prisonNumber })
  const inductionSchedule = aValidInductionSchedule({
    scheduleStatus: InductionScheduleStatusValue.EXEMPT_PRISON_STAFF_REDEPLOYMENT,
  })

  let req: Request
  let res: Response
  const next = jest.fn()

  beforeEach(() => {
    req = {
      user: { username: 'a-dps-user' },
      params: { prisonNumber, journeyId },
      session: {},
    } as unknown as Request
    res = {
      render: jest.fn(),
      redirect: jest.fn(),
      locals: { prisonerSummary, inductionSchedule },
    } as unknown as Response

    jest.clearAllMocks()
  })

  describe('getConfirmExemptionRemovalView', () => {
    it('should render the "Are you sure you want to remove the exemption" page', async () => {
      // Given
      const expectedViewData = {
        prisonerSummary,
        exemptionReason: InductionScheduleStatusValue.EXEMPT_PRISON_STAFF_REDEPLOYMENT,
      }

      // When
      await controller.getConfirmExemptionRemovalView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/induction/removeExemption/confirmRemoval/index', expectedViewData)
    })
  })

  describe('submitConfirmExemptionRemoval', () => {
    it(`should redirect to 'Exemption Removed' page given successful service call`, async () => {
      // Given
      inductionService.updateInductionScheduleStatus.mockResolvedValue(undefined)

      const expectedDto = {
        prisonNumber,
        prisonId: 'BXI',
        exemptionReason: InductionScheduleStatusValue.SCHEDULED,
        exemptionReasonDetails: undefined as string,
      }

      // When
      await controller.submitConfirmExemptionRemoval(req, res, next)

      // Then
      expect(res.redirect).toHaveBeenCalledWith(`/prisoners/A1234BC/induction/${journeyId}/exemption/removed`)
      expect(inductionService.updateInductionScheduleStatus).toHaveBeenCalledWith(expectedDto, 'a-dps-user')
      expect(auditService.logRemoveExemptionInduction).toHaveBeenCalled()
    })

    it('should not redirect to Exemption Removed page given service throws an error', async () => {
      // Given
      inductionService.updateInductionScheduleStatus.mockRejectedValue(new Error('Service failure'))

      const expectedDtp = {
        prisonNumber,
        prisonId: 'BXI',
        exemptionReason: InductionScheduleStatusValue.SCHEDULED,
        exemptionReasonDetails: undefined as string,
      }

      // When
      await controller.submitConfirmExemptionRemoval(req, res, next)

      // Then
      expect(next).toHaveBeenCalledWith(createError(500, 'Error removing exemption for Induction for prisoner A1234BC'))
      expect(inductionService.updateInductionScheduleStatus).toHaveBeenCalledWith(expectedDtp, 'a-dps-user')
      expect(auditService.logRemoveExemptionInduction).not.toHaveBeenCalled()
    })
  })
})
