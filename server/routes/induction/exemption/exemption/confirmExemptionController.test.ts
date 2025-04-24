import createError from 'http-errors'
import { Request, Response } from 'express'
import { v4 as uuidV4 } from 'uuid'
import { getPrisonerContext } from '../../../../data/session/prisonerContexts'
import aValidPrisonerSummary from '../../../../testsupport/prisonerSummaryTestDataBuilder'
import ConfirmExemptionController from './confirmExemptionController'
import aValidInductionExemptionDto from '../../../../testsupport/inductionExemptionDtoTestDataBuilder'
import InductionService from '../../../../services/inductionService'
import AuditService from '../../../../services/auditService'

jest.mock('../../../../services/auditService')
jest.mock('../../../../services/inductionService')

describe('ConfirmExemptionController', () => {
  const inductionService = new InductionService(null, null) as jest.Mocked<InductionService>
  const auditService = new AuditService(null) as jest.Mocked<AuditService>
  const controller = new ConfirmExemptionController(inductionService, auditService)

  const journeyId = uuidV4()
  const prisonNumber = 'A1234BC'
  const prisonerSummary = aValidPrisonerSummary({ prisonNumber })

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
      locals: { prisonerSummary },
    } as unknown as Response

    getPrisonerContext(req.session, prisonNumber).inductionExemptionDto = undefined

    jest.clearAllMocks()
  })

  describe('getConfirmExemptionView', () => {
    it('should render the "Are you sure you want to put induction on hold" page', async () => {
      // Given
      const inductionExemptionDto = aValidInductionExemptionDto()
      getPrisonerContext(req.session, prisonNumber).inductionExemptionDto = inductionExemptionDto

      const expectedViewData = { prisonerSummary, inductionExemptionDto }

      // When
      await controller.getConfirmExemptionView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/induction/exemption/confirmExemption/index', expectedViewData)
    })
  })

  describe('submitConfirmException', () => {
    it(`should redirect to 'Exemption recorded' page given successful service call`, async () => {
      // Given
      const inductionExemptionDto = aValidInductionExemptionDto()
      getPrisonerContext(req.session, prisonNumber).inductionExemptionDto = inductionExemptionDto

      inductionService.updateInductionScheduleStatus.mockResolvedValue(undefined)

      // When
      await controller.submitConfirmExemption(req, res, next)

      // Then
      expect(res.redirect).toHaveBeenCalledWith(`/prisoners/A1234BC/induction/${journeyId}/exemption/recorded`)
      expect(inductionService.updateInductionScheduleStatus).toHaveBeenCalledWith(inductionExemptionDto, 'a-dps-user')
      expect(getPrisonerContext(req.session, prisonNumber).inductionExemptionDto).toEqual(inductionExemptionDto)
      expect(auditService.logExemptInduction).toHaveBeenCalled()
    })

    it('should not redirect to induction complete page given service throws an error', async () => {
      // Given
      const inductionExemptionDto = aValidInductionExemptionDto()
      getPrisonerContext(req.session, prisonNumber).inductionExemptionDto = inductionExemptionDto

      inductionService.updateInductionScheduleStatus.mockRejectedValue(new Error('Service failure'))

      // When
      await controller.submitConfirmExemption(req, res, next)

      // Then
      expect(next).toHaveBeenCalledWith(createError(500, 'Error exempting Induction for prisoner A1234BC'))
      expect(inductionService.updateInductionScheduleStatus).toHaveBeenCalledWith(inductionExemptionDto, 'a-dps-user')
      expect(getPrisonerContext(req.session, prisonNumber).inductionExemptionDto).toEqual(inductionExemptionDto)
      expect(auditService.logExemptInduction).not.toHaveBeenCalled()
    })
  })
})
