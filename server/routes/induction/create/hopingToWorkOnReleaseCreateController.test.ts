import { NextFunction, Request, Response } from 'express'
import type { SessionData } from 'express-session'
import type { InductionDto } from 'inductionDto'
import type { HopingToWorkOnReleaseForm } from 'inductionForms'
import HopingToWorkOnReleaseCreateController from './hopingToWorkOnReleaseCreateController'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import HopingToGetWorkValue from '../../../enums/hopingToGetWorkValue'

describe('hopingToWorkOnReleaseCreateController', () => {
  const controller = new HopingToWorkOnReleaseCreateController()

  const prisonNumber = 'A1234BC'

  const req = {
    session: {} as SessionData,
    body: {},
    user: {} as Express.User,
    params: {} as Record<string, string>,
    flash: jest.fn(),
    path: '',
  }
  const res = {
    redirect: jest.fn(),
    render: jest.fn(),
  }
  const next = jest.fn()

  const noErrors: Array<Record<string, string>> = []

  beforeEach(() => {
    jest.resetAllMocks()
    req.session = {} as SessionData
    req.body = {}
    req.user = {} as Express.User
    req.params = {} as Record<string, string>
    req.params.prisonNumber = prisonNumber
    req.path = `/prisoners/${prisonNumber}/induction/hoping-to-work-on-release`
  })

  describe('getHopingToWorkOnReleaseView', () => {
    it('should get the Hoping To Work On Release view given there is not a HopingToWorkOnReleaseForm already on the session', async () => {
      // Given
      const prisonerSummary = aValidPrisonerSummary()
      req.session.prisonerSummary = prisonerSummary

      const inductionDto: InductionDto = undefined
      req.session.inductionDto = inductionDto

      req.session.hopingToWorkOnReleaseForm = undefined

      const expectedHopingToWorkOnReleaseForm: HopingToWorkOnReleaseForm = {
        hopingToGetWork: undefined,
      }

      const expectedView = {
        prisonerSummary,
        form: expectedHopingToWorkOnReleaseForm,
        backLinkUrl: '/plan/A1234BC/view/overview',
        backLinkAriaText: `Back to Jimmy Lightfingers's learning and work progress`,
        errors: noErrors,
      }

      // When
      await controller.getHopingToWorkOnReleaseView(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/induction/hopingToWorkOnRelease/index', expectedView)
      expect(req.session.hopingToWorkOnReleaseForm).toBeUndefined()
      expect(req.session.inductionDto).toEqual(inductionDto)
    })

    it('should get the Hoping To Work On Release view given there is a HopingToWorkOnReleaseForm already on the session', async () => {
      // Given
      const prisonerSummary = aValidPrisonerSummary()
      req.session.prisonerSummary = prisonerSummary

      const inductionDto: InductionDto = undefined
      req.session.inductionDto = inductionDto

      const expectedHopingToWorkOnReleaseForm = {
        hopingToGetWork: HopingToGetWorkValue.YES,
      }
      req.session.hopingToWorkOnReleaseForm = expectedHopingToWorkOnReleaseForm

      const expectedView = {
        prisonerSummary,
        form: expectedHopingToWorkOnReleaseForm,
        backLinkUrl: '/plan/A1234BC/view/overview',
        backLinkAriaText: `Back to Jimmy Lightfingers's learning and work progress`,
        errors: noErrors,
      }

      // When
      await controller.getHopingToWorkOnReleaseView(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/induction/hopingToWorkOnRelease/index', expectedView)
      expect(req.session.hopingToWorkOnReleaseForm).toBeUndefined()
      expect(req.session.inductionDto).toEqual(inductionDto)
    })
  })
})
