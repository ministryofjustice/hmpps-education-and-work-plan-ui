import { Request, Response } from 'express'
import { startOfDay } from 'date-fns'
import aValidPrisonerSummary from '../../../../testsupport/prisonerSummaryTestDataBuilder'
import ExemptionRecordedController from './exemptionRecordedController'
import { getPrisonerContext } from '../../../../data/session/prisonerContexts'
import aValidInductionExemptionDto from '../../../../testsupport/inductionExemptionDtoTestDataBuilder'
import InductionScheduleStatusValue from '../../../../enums/inductionScheduleStatusValue'
import aValidInductionSchedule from '../../../../testsupport/inductionScheduleTestDataBuilder'

describe('ExemptionRecordedController', () => {
  const controller = new ExemptionRecordedController()

  const prisonNumber = 'A1234BC'
  const prisonerSummary = aValidPrisonerSummary({ prisonNumber })
  const inductionSchedule = aValidInductionSchedule({
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

  describe('getExemptionRecordedView', () => {
    it('should render the "Exemption Recorded" page given the exemption reason is not system technical issue', async () => {
      // Given
      const inductionExemptionDto = aValidInductionExemptionDto({
        exemptionReason: InductionScheduleStatusValue.EXEMPT_PRISONER_DRUG_OR_ALCOHOL_DEPENDENCY,
      })
      getPrisonerContext(req.session, prisonNumber).inductionExemptionDto = inductionExemptionDto

      const expectedViewData = {
        prisonerSummary,
        inductionDueDate: startOfDay('2024-12-03'),
        exemptionDueToTechnicalIssue: false,
      }

      // When
      await controller.getExemptionRecordedView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/induction/exemption/exemptionRecorded/index', expectedViewData)
    })

    it('should render the "Exemption Recorded" page given the exemption reason is system technical issue', async () => {
      // Given
      const inductionExemptionDto = aValidInductionExemptionDto({
        exemptionReason: InductionScheduleStatusValue.EXEMPT_SYSTEM_TECHNICAL_ISSUE,
      })
      getPrisonerContext(req.session, prisonNumber).inductionExemptionDto = inductionExemptionDto

      const expectedViewData = {
        prisonerSummary,
        inductionDueDate: startOfDay('2024-12-03'),
        exemptionDueToTechnicalIssue: true,
      }

      // When
      await controller.getExemptionRecordedView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/induction/exemption/exemptionRecorded/index', expectedViewData)
    })
  })

  describe('submitExemptionRecorded', () => {
    it('should redirect to the overview page with a success message given the exemption reason was not system issue', async () => {
      // Given
      const inductionExemptionDto = aValidInductionExemptionDto({
        exemptionReason: InductionScheduleStatusValue.EXEMPT_PRISON_OPERATION_OR_SECURITY_ISSUE,
      })
      getPrisonerContext(req.session, prisonNumber).inductionExemptionDto = inductionExemptionDto

      // When
      await controller.submitExemptionRecorded(req, res, next)

      // Then
      expect(res.redirectWithSuccess).toHaveBeenCalledWith(
        `/plan/${prisonNumber}/view/overview`,
        'Exemption recorded. <b>You must remove this exemption when the reason no longer applies.</b>',
      )
      expect(res.redirect).not.toHaveBeenCalled()
    })

    it('should redirect to the overview page with a success message given the exemption reason was system issue', async () => {
      // Given
      const inductionExemptionDto = aValidInductionExemptionDto({
        exemptionReason: InductionScheduleStatusValue.EXEMPT_SYSTEM_TECHNICAL_ISSUE,
      })
      getPrisonerContext(req.session, prisonNumber).inductionExemptionDto = inductionExemptionDto

      // When
      await controller.submitExemptionRecorded(req, res, next)

      // Then
      expect(res.redirectWithSuccess).toHaveBeenCalledWith(`/plan/${prisonNumber}/view/overview`, 'Exemption recorded.')
      expect(res.redirect).not.toHaveBeenCalled()
    })
  })
})
