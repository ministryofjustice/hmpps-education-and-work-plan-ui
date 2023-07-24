import moment from 'moment'
import type { Prisoner } from 'prisonRegisterApiClient'
import type { PrisonerSummary, FunctionalSkills } from 'viewModels'
import { SessionData } from 'express-session'
import { NextFunction, Request, Response } from 'express'
import OverviewController from './overviewController'
import aValidPrisonerSupportNeeds from '../../testsupport/supportNeedsTestDataBuilder'
import { CuriousService } from '../../services'

describe('overviewController', () => {
  const curiousService = {
    getPrisonerSupportNeeds: jest.fn(),
    getPrisonerFunctionalSkills: jest.fn(),
  }

  const controller = new OverviewController(curiousService as unknown as CuriousService)

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

  describe('getOverviewView', () => {
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
      const expectedView = {
        prisonerSummary: expectedPrisonerSummary,
        tab: expectedTab,
        prisonNumber,
      }

      // When
      await controller.getOverviewView(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/overview/index', expectedView)
    })
  })

  describe('getSupportNeedsView', () => {
    it('should get support needs view', async () => {
      // Given
      const username = 'a-dps-user'
      req.user.username = username

      const expectedTab = 'support-needs'
      req.params.tab = expectedTab

      const prisonNumber = 'A1234GC'
      req.params.prisonNumber = prisonNumber

      req.session.prisonerSummary = { prisonNumber } as Prisoner

      const expectedPrisonerSummary = { prisonNumber } as PrisonerSummary
      const expectedSupportNeeds = aValidPrisonerSupportNeeds()
      curiousService.getPrisonerSupportNeeds.mockResolvedValue(expectedSupportNeeds)
      const expectedView = {
        prisonerSummary: expectedPrisonerSummary,
        tab: expectedTab,
        supportNeeds: expectedSupportNeeds,
      }

      // When
      await controller.getSupportNeedsView(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/overview/index', expectedView)
    })
  })

  describe('getEducationAndTrainingView', () => {
    it('should get eduction and training view', async () => {
      // Given
      const username = 'a-dps-user'
      req.user.username = username

      const expectedTab = 'education-and-training'
      req.params.tab = expectedTab

      const prisonNumber = 'A1234GC'
      req.params.prisonNumber = prisonNumber

      req.session.prisonerSummary = { prisonNumber } as Prisoner

      const expectedFunctionalSkills = {
        problemRetrievingData: false,
        assessments: [
          {
            assessmentDate: moment('2012-02-16').toDate(),
            grade: 'Level 1',
            prisonId: 'MDI',
            prisonName: 'MOORLAND (HMP & YOI)',
            type: 'ENGLISH',
          },
        ],
      } as FunctionalSkills
      curiousService.getPrisonerFunctionalSkills.mockResolvedValue(expectedFunctionalSkills)

      const expectedPrisonerSummary = { prisonNumber } as PrisonerSummary
      const expectedView = {
        prisonerSummary: expectedPrisonerSummary,
        tab: expectedTab,
        functionalSkills: expectedFunctionalSkills,
      }

      // When
      await controller.getEducationAndTrainingView(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/overview/index', expectedView)
    })
  })
})
