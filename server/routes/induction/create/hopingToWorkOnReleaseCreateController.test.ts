import { NextFunction, Request, Response } from 'express'
import type { SessionData } from 'express-session'
import type { InductionDto } from 'inductionDto'
import type { HopingToWorkOnReleaseForm } from 'inductionForms'
import HopingToWorkOnReleaseCreateController from './hopingToWorkOnReleaseCreateController'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import HopingToGetWorkValue from '../../../enums/hopingToGetWorkValue'
import validateHopingToWorkOnReleaseForm from '../../validators/induction/hopingToWorkOnReleaseFormValidator'
import YesNoValue from '../../../enums/yesNoValue'

jest.mock('../../validators/induction/hopingToWorkOnReleaseFormValidator')

describe('hopingToWorkOnReleaseCreateController', () => {
  const mockedFormValidator = validateHopingToWorkOnReleaseForm as jest.MockedFunction<
    typeof validateHopingToWorkOnReleaseForm
  >

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

  describe('submitHopingToWorkOnReleaseForm', () => {
    it('should redisplay page given form is submitted with validation errors', async () => {
      // Given
      const prisonerSummary = aValidPrisonerSummary()
      req.session.prisonerSummary = prisonerSummary
      const inductionDto = { prisonNumber }
      req.session.inductionDto = inductionDto

      const invalidHopingToWorkOnReleaseForm = {
        hopingToGetWork: '',
      }
      req.body = invalidHopingToWorkOnReleaseForm
      req.session.hopingToWorkOnReleaseForm = undefined

      const errors = [
        {
          href: '#hopingToGetWork',
          text: `Select whether Jimmy Lightfingers is hoping to get work`,
        },
      ]
      mockedFormValidator.mockReturnValue(errors)

      // When
      await controller.submitHopingToWorkOnReleaseForm(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.redirect).toHaveBeenCalledWith('/prisoners/A1234BC/create-induction/hoping-to-work-on-release')
      expect(req.flash).toHaveBeenCalledWith('errors', errors)
      expect(req.session.hopingToWorkOnReleaseForm).toEqual(invalidHopingToWorkOnReleaseForm)
      expect(req.session.inductionDto).toEqual(inductionDto)
    })

    it('should update Induction in session and redirect to qualifications page given form is submitted with Hoping To Work as Yes', async () => {
      // Given
      const prisonerSummary = aValidPrisonerSummary()
      req.session.prisonerSummary = prisonerSummary
      const inductionDto = { prisonNumber }
      req.session.inductionDto = inductionDto

      const hopingToWorkOnReleaseForm = {
        hopingToGetWork: YesNoValue.YES,
      }
      req.body = hopingToWorkOnReleaseForm
      req.session.hopingToWorkOnReleaseForm = undefined

      mockedFormValidator.mockReturnValue(noErrors)

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
      expect(res.redirect).toHaveBeenCalledWith('/prisoners/A1234BC/create-induction/qualifications')
      expect(req.session.hopingToWorkOnReleaseForm).toBeUndefined()
      expect(req.session.inductionDto).toEqual(expectedInduction)
    })

    Array.of<HopingToGetWorkValue>(HopingToGetWorkValue.NO, HopingToGetWorkValue.NOT_SURE).forEach(
      hopingToGetWorkValue => {
        it(`should update Induction in session and redirect to reasons not to get work page given form is submitted with Hoping To Work as ${hopingToGetWorkValue}`, async () => {
          // Given
          const prisonerSummary = aValidPrisonerSummary()
          req.session.prisonerSummary = prisonerSummary
          const inductionDto = { prisonNumber }
          req.session.inductionDto = inductionDto

          const hopingToWorkOnReleaseForm = {
            hopingToGetWork: hopingToGetWorkValue,
          }
          req.body = hopingToWorkOnReleaseForm
          req.session.hopingToWorkOnReleaseForm = undefined

          mockedFormValidator.mockReturnValue(noErrors)

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
          expect(res.redirect).toHaveBeenCalledWith('/prisoners/A1234BC/create-induction/reasons-not-to-get-work')
          expect(req.session.hopingToWorkOnReleaseForm).toBeUndefined()
          expect(req.session.inductionDto).toEqual(expectedInduction)
        })
      },
    )
  })
})
