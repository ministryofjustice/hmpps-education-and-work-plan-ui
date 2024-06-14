import { NextFunction, Request, Response } from 'express'
import type { SessionData } from 'express-session'
import type { InductionDto } from 'inductionDto'
import type { HopingToWorkOnReleaseForm } from 'inductionForms'
import HopingToWorkOnReleaseCreateController from './hopingToWorkOnReleaseCreateController'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import HopingToGetWorkValue from '../../../enums/hopingToGetWorkValue'
import YesNoValue from '../../../enums/yesNoValue'

describe('hopingToWorkOnReleaseCreateController', () => {
  const controller = new HopingToWorkOnReleaseCreateController()

  const prisonNumber = 'A1234BC'
  const prisonerSummary = aValidPrisonerSummary()

  const req = {
    session: {} as SessionData,
    body: {},
    user: {} as Express.User,
    params: {} as Record<string, string>,
    path: '',
  }
  const res = {
    redirect: jest.fn(),
    redirectWithErrors: jest.fn(),
    render: jest.fn(),
  }
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
    req.session = { prisonerSummary } as SessionData
    req.body = {}
    req.user = {} as Express.User
    req.params = { prisonNumber }
    req.path = `/prisoners/${prisonNumber}/induction/hoping-to-work-on-release`
  })

  describe('getHopingToWorkOnReleaseView', () => {
    it('should get the Hoping To Work On Release view given there is not a HopingToWorkOnReleaseForm already on the session', async () => {
      // Given
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

  describe('submitHopingToWorkOnReleaseForm', () => {
    it('should redisplay page given form is submitted with validation errors', async () => {
      // Given
      const inductionDto = { prisonNumber } as InductionDto
      req.session.inductionDto = inductionDto

      const invalidHopingToWorkOnReleaseForm = {
        hopingToGetWork: '',
      }
      req.body = invalidHopingToWorkOnReleaseForm
      req.session.hopingToWorkOnReleaseForm = undefined

      const expectedErrors = [
        {
          href: '#hopingToGetWork',
          text: `Select whether Jimmy Lightfingers is hoping to get work`,
        },
      ]

      // When
      await controller.submitHopingToWorkOnReleaseForm(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.redirectWithErrors).toHaveBeenCalledWith(
        '/prisoners/A1234BC/create-induction/hoping-to-work-on-release',
        expectedErrors,
      )
      expect(req.session.hopingToWorkOnReleaseForm).toEqual(invalidHopingToWorkOnReleaseForm)
      expect(req.session.inductionDto).toEqual(inductionDto)
    })

    it('should update Induction in session and redirect to Work Interest Types page given form is submitted with Hoping To Work as Yes', async () => {
      // Given
      const inductionDto = { prisonNumber } as InductionDto
      req.session.inductionDto = inductionDto

      const hopingToWorkOnReleaseForm = {
        hopingToGetWork: YesNoValue.YES,
      }
      req.body = hopingToWorkOnReleaseForm
      req.session.hopingToWorkOnReleaseForm = undefined

      const expectedInduction = {
        prisonNumber,
        workOnRelease: {
          hopingToWork: YesNoValue.YES,
        },
      }

      // When
      await controller.submitHopingToWorkOnReleaseForm(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.redirect).toHaveBeenCalledWith('/prisoners/A1234BC/create-induction/work-interest-types')
      expect(req.session.hopingToWorkOnReleaseForm).toBeUndefined()
      expect(req.session.inductionDto).toEqual(expectedInduction)
    })

    Array.of<HopingToGetWorkValue>(HopingToGetWorkValue.NO, HopingToGetWorkValue.NOT_SURE).forEach(
      hopingToGetWorkValue => {
        it(`should update Induction in session and redirect to factors affecting ability to work page given form is submitted with Hoping To Work as ${hopingToGetWorkValue}`, async () => {
          // Given
          const inductionDto = { prisonNumber } as InductionDto
          req.session.inductionDto = inductionDto

          const hopingToWorkOnReleaseForm = {
            hopingToGetWork: hopingToGetWorkValue,
          }
          req.body = hopingToWorkOnReleaseForm
          req.session.hopingToWorkOnReleaseForm = undefined

          const expectedInduction = {
            prisonNumber,
            workOnRelease: {
              hopingToWork: hopingToGetWorkValue,
            },
          }

          // When
          await controller.submitHopingToWorkOnReleaseForm(
            req as undefined as Request,
            res as undefined as Response,
            next as undefined as NextFunction,
          )

          // Then
          expect(res.redirect).toHaveBeenCalledWith('/prisoners/A1234BC/create-induction/affect-ability-to-work')
          expect(req.session.hopingToWorkOnReleaseForm).toBeUndefined()
          expect(req.session.inductionDto).toEqual(expectedInduction)
        })
      },
    )
  })
})
