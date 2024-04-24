import { Request, Response } from 'express'
import type { SessionData } from 'express-session'
import type { InductionDto } from 'inductionDto'
import type { ReasonsNotToGetWorkForm } from 'inductionForms'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import ReasonsNotToGetWorkCreateController from './reasonsNotToGetWorkCreateController'
import ReasonNotToGetWorkValue from '../../../enums/reasonNotToGetWorkValue'
import QualificationLevelValue from '../../../enums/qualificationLevelValue'

describe('reasonsNotToGetWorkCreateController', () => {
  const controller = new ReasonsNotToGetWorkCreateController()

  const prisonNumber = 'A1234BC'

  let req: Request
  let res: Response
  const next = jest.fn()

  const noErrors: Array<Record<string, string>> = []

  beforeEach(() => {
    jest.resetAllMocks()
    req = {
      session: {} as SessionData,
      body: {},
      user: {} as Express.User,
      params: { prisonNumber } as Record<string, string>,
      flash: jest.fn(),
    } as unknown as Request

    res = {
      redirect: jest.fn(),
      render: jest.fn(),
    } as unknown as Response
  })

  describe('getReasonsNotToGetWorkView', () => {
    it('should get the reasons not to get work create view', async () => {
      // Given
      const prisonerSummary = aValidPrisonerSummary()
      req.session.prisonerSummary = prisonerSummary

      const inductionDto: InductionDto = undefined
      req.session.inductionDto = inductionDto

      req.session.reasonsNotToGetWorkForm = undefined

      const expectedReasonsNotToGetWorkForm: ReasonsNotToGetWorkForm = {
        reasonsNotToGetWork: [],
      }

      const expectedView = {
        prisonerSummary,
        form: expectedReasonsNotToGetWorkForm,
        backLinkUrl: '/prisoners/A1234BC/create-induction/hoping-to-work-on-release',
        backLinkAriaText: `Back to Is Jimmy Lightfingers hoping to get work when they're released?`,
        errors: noErrors,
      }

      // When
      await controller.getReasonsNotToGetWorkView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/induction/reasonsNotToGetWork/index', expectedView)
      expect(req.session.hopingToWorkOnReleaseForm).toBeUndefined()
      expect(req.session.inductionDto).toEqual(inductionDto)
    })

    it('should get the reasons not to get work create view with form data', async () => {
      // Given
      const prisonerSummary = aValidPrisonerSummary()
      req.session.prisonerSummary = prisonerSummary

      const inductionDto: InductionDto = undefined
      req.session.inductionDto = inductionDto

      const expectedReasonsNotToGetWorkForm: ReasonsNotToGetWorkForm = {
        reasonsNotToGetWork: [ReasonNotToGetWorkValue.HEALTH, ReasonNotToGetWorkValue.LIMIT_THEIR_ABILITY],
      }
      req.session.reasonsNotToGetWorkForm = expectedReasonsNotToGetWorkForm

      const expectedView = {
        prisonerSummary,
        form: expectedReasonsNotToGetWorkForm,
        backLinkUrl: '/prisoners/A1234BC/create-induction/hoping-to-work-on-release',
        backLinkAriaText: `Back to Is Jimmy Lightfingers hoping to get work when they're released?`,
        errors: noErrors,
      }

      // When
      await controller.getReasonsNotToGetWorkView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/induction/reasonsNotToGetWork/index', expectedView)
      expect(req.session.hopingToWorkOnReleaseForm).toBeUndefined()
      expect(req.session.inductionDto).toEqual(inductionDto)
    })
  })

  describe('submitReasonsNotToGetWorkForm', () => {
    it('should redisplay page given form is submitted with validation errors', async () => {
      // Given
      const prisonerSummary = aValidPrisonerSummary()
      req.session.prisonerSummary = prisonerSummary
      const inductionDto = { prisonNumber } as InductionDto
      req.session.inductionDto = inductionDto
      req.body = {}

      const expectedErrors = [
        {
          href: '#reasonsNotToGetWork',
          text: `Select what could stop Jimmy Lightfingers getting work on release, or select 'Not sure'`,
        },
      ]

      // When
      await controller.submitReasonsNotToGetWorkForm(req, res, next)

      // Then
      expect(res.redirect).toHaveBeenCalledWith('/prisoners/A1234BC/create-induction/reasons-not-to-get-work')
      expect(req.flash).toHaveBeenCalledWith('errors', expectedErrors)
      expect(req.session.hopingToWorkOnReleaseForm).toEqual(undefined)
      expect(req.session.inductionDto).toEqual(inductionDto)
    })

    it('should update induction DTO and redirect to want to add qualifcations page', async () => {
      // Given
      const prisonerSummary = aValidPrisonerSummary()
      req.session.prisonerSummary = prisonerSummary
      const inductionDto = { prisonNumber } as InductionDto
      req.session.inductionDto = inductionDto

      req.body = {
        reasonsNotToGetWork: ['FULL_TIME_CARER', 'LACKS_CONFIDENCE_OR_MOTIVATION'],
      }

      const expectedInduction = {
        prisonNumber,
        workOnRelease: {
          notHopingToWorkReasons: ['FULL_TIME_CARER', 'LACKS_CONFIDENCE_OR_MOTIVATION'],
        },
      } as InductionDto

      // When
      await controller.submitReasonsNotToGetWorkForm(req, res, next)

      // Then
      expect(res.redirect).toHaveBeenCalledWith('/prisoners/A1234BC/create-induction/want-to-add-qualifications')
      expect(req.flash).toHaveBeenCalledTimes(0)
      expect(req.session.hopingToWorkOnReleaseForm).toEqual(undefined)
      expect(req.session.inductionDto).toEqual(expectedInduction)
    })

    it('should update induction DTO and redirect to qualifcations page', async () => {
      // Given
      const prisonerSummary = aValidPrisonerSummary()
      req.session.prisonerSummary = prisonerSummary
      const inductionDto = {
        prisonNumber,
        previousQualifications: {
          qualifications: [
            {
              subject: 'Maths',
              level: QualificationLevelValue.LEVEL_1,
              grade: 'C',
            },
          ],
        },
      } as InductionDto
      req.session.inductionDto = inductionDto

      req.body = {
        reasonsNotToGetWork: ['FULL_TIME_CARER', 'LACKS_CONFIDENCE_OR_MOTIVATION'],
      }

      const expectedInduction = {
        prisonNumber,
        previousQualifications: {
          qualifications: [
            {
              subject: 'Maths',
              level: QualificationLevelValue.LEVEL_1,
              grade: 'C',
            },
          ],
        },
        workOnRelease: {
          notHopingToWorkReasons: ['FULL_TIME_CARER', 'LACKS_CONFIDENCE_OR_MOTIVATION'],
        },
      } as InductionDto

      // When
      await controller.submitReasonsNotToGetWorkForm(req, res, next)

      // Then
      expect(res.redirect).toHaveBeenCalledWith('/prisoners/A1234BC/create-induction/qualifications')
      expect(req.flash).toHaveBeenCalledTimes(0)
      expect(req.session.hopingToWorkOnReleaseForm).toEqual(undefined)
      expect(req.session.inductionDto).toEqual(expectedInduction)
    })
  })
})
