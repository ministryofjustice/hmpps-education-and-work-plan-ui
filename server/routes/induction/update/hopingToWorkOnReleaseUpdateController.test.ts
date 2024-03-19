import { NextFunction, Request, Response } from 'express'
import type { SessionData } from 'express-session'
import HopingToWorkOnReleaseUpdateController from './hopingToWorkOnReleaseUpdateController'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import { aLongQuestionSetInductionDto } from '../../../testsupport/inductionDtoTestDataBuilder'
import HopingToGetWorkValue from '../../../enums/hopingToGetWorkValue'

describe('hopingToWorkOnReleaseUpdateController', () => {
  const controller = new HopingToWorkOnReleaseUpdateController()

  const req = {
    session: {} as SessionData,
    body: {},
    user: {} as Express.User,
    params: {} as Record<string, string>,
    flash: jest.fn(),
  }
  const res = {
    redirect: jest.fn(),
    render: jest.fn(),
  }
  const next = jest.fn()

  let errors: Array<Record<string, string>>

  beforeEach(() => {
    jest.resetAllMocks()
    req.session = {} as SessionData
    req.body = {}
    req.user = {} as Express.User
    req.params = {} as Record<string, string>

    errors = []
  })

  describe('getHopingToWorkOnReleaseView', () => {
    it('should get the Hoping To Work On Release view given there is no HopingToWorkOnReleaseForm on the session', async () => {
      // Given
      const prisonNumber = 'A1234BC'
      req.params.prisonNumber = prisonNumber

      const prisonerSummary = aValidPrisonerSummary()
      req.session.prisonerSummary = prisonerSummary
      const inductionDto = aLongQuestionSetInductionDto()
      req.session.inductionDto = inductionDto
      req.session.hopingToWorkOnReleaseForm = undefined

      const expectedHopingToWorkOnReleaseForm = {
        hopingToGetWork: HopingToGetWorkValue.YES,
      }

      const expectedView = {
        prisonerSummary,
        form: expectedHopingToWorkOnReleaseForm,
        backLinkUrl: '/plan/A1234BC/view/work-and-interests',
        backLinkAriaText: `Back to Jimmy Lightfingers's learning and work progress`,
        errors,
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
      const prisonNumber = 'A1234BC'
      req.params.prisonNumber = prisonNumber

      const prisonerSummary = aValidPrisonerSummary()
      req.session.prisonerSummary = prisonerSummary
      const inductionDto = aLongQuestionSetInductionDto()
      req.session.inductionDto = inductionDto

      const expectedHopingToWorkOnReleaseForm = {
        hopingToGetWork: HopingToGetWorkValue.YES,
      }
      req.session.hopingToWorkOnReleaseForm = expectedHopingToWorkOnReleaseForm

      const expectedView = {
        prisonerSummary,
        form: expectedHopingToWorkOnReleaseForm,
        backLinkUrl: '/plan/A1234BC/view/work-and-interests',
        backLinkAriaText: `Back to Jimmy Lightfingers's learning and work progress`,
        errors,
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
