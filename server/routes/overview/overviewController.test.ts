import type { Prisoner } from 'prisonRegisterApiClient'
import type { PrisonerSummary } from 'viewModels'
import { SessionData } from 'express-session'
import { NextFunction, Request, Response } from 'express'
import OverviewController from './overviewController'
import OverviewView from './overviewView'
import aValidPrisonerSupportNeeds from '../../testsupport/supportNeedsTestDataBuilder'
import SupportNeedsView from './supportNeedsView'

describe('overviewController', () => {
  const controller = new OverviewController()

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

  beforeEach(() => {
    jest.resetAllMocks()
    req.session = {} as SessionData
    req.body = {}
    req.user = {} as Express.User
    req.params = {} as Record<string, string>
  })

  it('should get overview view', async () => {
    // Given
    const username = 'a-dps-user'
    req.user.username = username

    const expectedTab = 'overview'
    req.params.tab = expectedTab

    const prisonNumber = 'A1234GC'
    req.params.prisonNumber = prisonNumber

    req.session.prisonerSummary = { prisonNumber } as Prisoner

    const expectedPrisonerSummary = { prisonNumber } as PrisonerSummary
    const expectedView = new OverviewView(expectedPrisonerSummary, expectedTab, prisonNumber)

    // When
    await controller.getOverviewView(
      req as undefined as Request,
      res as undefined as Response,
      next as undefined as NextFunction,
    )

    // Then
    expect(res.render).toHaveBeenCalledWith('pages/overview/index', expectedView.renderArgs)
  })

  it('should get support needs view', async () => {
    // Given
    const username = 'a-dps-user'
    req.user.username = username

    const expectedTab = 'support-needs'
    req.params.tab = expectedTab

    const prisonNumber = 'A1234GC'
    req.params.prisonNumber = prisonNumber

    req.session.prisonerSummary = { prisonNumber } as Prisoner
    req.session.supportNeeds = aValidPrisonerSupportNeeds()

    const expectedPrisonerSummary = { prisonNumber } as PrisonerSummary
    const expectedSupportNeeds = req.session.supportNeeds
    const expectedView = new SupportNeedsView(expectedPrisonerSummary, expectedTab, prisonNumber, expectedSupportNeeds)

    // When
    await controller.getSupportNeedsView(
      req as undefined as Request,
      res as undefined as Response,
      next as undefined as NextFunction,
    )

    // Then
    expect(res.render).toHaveBeenCalledWith('pages/overview/index', expectedView.renderArgs)
  })
})
