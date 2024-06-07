import { Request, Response } from 'express'
import type { SessionData } from 'express-session'
import type { ReasonsNotToGetWorkForm } from 'inductionForms'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import ReasonsNotToGetWorkCreateController from './reasonsNotToGetWorkCreateController'
import ReasonNotToGetWorkValue from '../../../enums/reasonNotToGetWorkValue'
import { aShortQuestionSetInductionDto } from '../../../testsupport/inductionDtoTestDataBuilder'

describe('reasonsNotToGetWorkCreateController', () => {
  const controller = new ReasonsNotToGetWorkCreateController()

  const prisonNumber = 'A1234BC'
  const prisonerSummary = aValidPrisonerSummary()

  let req: Request
  let res: Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
    req = {
      path: `/prisoners/${prisonNumber}/create-induction/reasons-not-to-get-work`,
      session: { prisonerSummary } as SessionData,
      body: {},
      user: {} as Express.User,
      params: { prisonNumber } as Record<string, string>,
    } as unknown as Request

    res = {
      redirect: jest.fn(),
      redirectWithErrors: jest.fn(),
      render: jest.fn(),
    } as unknown as Response
  })

  describe('getReasonsNotToGetWorkView', () => {
    it('should get the reasons not to get work view', async () => {
      // Given
      const inductionDto = aShortQuestionSetInductionDto()
      inductionDto.workOnRelease.notHopingToWorkReasons = undefined
      inductionDto.workOnRelease.notHopingToWorkOtherReason = undefined
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
      }

      // When
      await controller.getReasonsNotToGetWorkView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/induction/reasonsNotToGetWork/index', expectedView)
      expect(req.session.hopingToWorkOnReleaseForm).toBeUndefined()
      expect(req.session.inductionDto).toEqual(inductionDto)
    })

    it('should get the reasons not to get work view with form data', async () => {
      // Given
      const inductionDto = aShortQuestionSetInductionDto()
      inductionDto.workOnRelease.notHopingToWorkReasons = undefined
      inductionDto.workOnRelease.notHopingToWorkOtherReason = undefined
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
      }

      // When
      await controller.getReasonsNotToGetWorkView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/induction/reasonsNotToGetWork/index', expectedView)
      expect(req.session.hopingToWorkOnReleaseForm).toBeUndefined()
      expect(req.session.inductionDto).toEqual(inductionDto)
    })

    it('should get the reasons not to get work view given the previous page was Check Your Answers', async () => {
      // Given
      const inductionDto = aShortQuestionSetInductionDto()
      req.session.inductionDto = inductionDto

      req.session.pageFlowHistory = {
        pageUrls: ['/prisoners/A1234BC/create-induction/check-your-answers'],
        currentPageIndex: 0,
      }

      const expectedPageFlowHistory = {
        pageUrls: [
          '/prisoners/A1234BC/create-induction/check-your-answers',
          '/prisoners/A1234BC/create-induction/reasons-not-to-get-work',
        ],
        currentPageIndex: 1,
      }

      const expectedReasonsNotToGetWorkForm: ReasonsNotToGetWorkForm = {
        reasonsNotToGetWork: [ReasonNotToGetWorkValue.HEALTH, ReasonNotToGetWorkValue.OTHER],
        reasonsNotToGetWorkOther: 'Will be of retirement age at release',
      }

      const expectedView = {
        prisonerSummary,
        form: expectedReasonsNotToGetWorkForm,
        backLinkUrl: '/prisoners/A1234BC/create-induction/check-your-answers',
        backLinkAriaText: `Back to Check and save your answers before adding Jimmy Lightfingers's goals`,
      }

      // When
      await controller.getReasonsNotToGetWorkView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/induction/reasonsNotToGetWork/index', expectedView)
      expect(req.session.hopingToWorkOnReleaseForm).toBeUndefined()
      expect(req.session.inductionDto).toEqual(inductionDto)
      expect(req.session.pageFlowHistory).toEqual(expectedPageFlowHistory)
    })
  })

  describe('submitReasonsNotToGetWorkForm', () => {
    it('should redisplay page given form is submitted with validation errors', async () => {
      // Given
      const inductionDto = aShortQuestionSetInductionDto()
      inductionDto.workOnRelease.notHopingToWorkReasons = undefined
      inductionDto.workOnRelease.notHopingToWorkOtherReason = undefined
      req.session.inductionDto = inductionDto

      const invalidReasonsNotToGetWOrkForm: ReasonsNotToGetWorkForm = {
        reasonsNotToGetWork: [ReasonNotToGetWorkValue.NOT_SURE, ReasonNotToGetWorkValue.HEALTH],
      }
      req.body = invalidReasonsNotToGetWOrkForm
      req.session.reasonsNotToGetWorkForm = undefined

      const expectedErrors = [
        {
          href: '#reasonsNotToGetWork',
          text: `Select what could stop Jimmy Lightfingers getting work on release, or select 'Not sure'`,
        },
      ]

      // When
      await controller.submitReasonsNotToGetWorkForm(req, res, next)

      // Then
      expect(res.redirectWithErrors).toHaveBeenCalledWith(
        '/prisoners/A1234BC/create-induction/reasons-not-to-get-work',
        expectedErrors,
      )
      expect(req.session.reasonsNotToGetWorkForm).toEqual(invalidReasonsNotToGetWOrkForm)
      expect(req.session.inductionDto).toEqual(inductionDto)
    })

    it('should update induction DTO and redirect to highest level of education page', async () => {
      // Given
      const inductionDto = aShortQuestionSetInductionDto()
      inductionDto.workOnRelease.notHopingToWorkReasons = undefined
      inductionDto.workOnRelease.notHopingToWorkOtherReason = undefined
      inductionDto.previousQualifications = undefined
      req.session.inductionDto = inductionDto

      const reasonsNotToGetWorkForm: ReasonsNotToGetWorkForm = {
        reasonsNotToGetWork: ['FULL_TIME_CARER', 'LACKS_CONFIDENCE_OR_MOTIVATION', 'OTHER'],
        reasonsNotToGetWorkOther: 'Will be retired by the time he is released',
      }
      req.body = reasonsNotToGetWorkForm
      req.session.reasonsNotToGetWorkForm = undefined

      const expectedReasons = [
        ReasonNotToGetWorkValue.FULL_TIME_CARER,
        ReasonNotToGetWorkValue.LACKS_CONFIDENCE_OR_MOTIVATION,
        ReasonNotToGetWorkValue.OTHER,
      ]
      const expectedOtherReason = 'Will be retired by the time he is released'

      // When
      await controller.submitReasonsNotToGetWorkForm(req, res, next)

      // Then
      expect(res.redirect).toHaveBeenCalledWith('/prisoners/A1234BC/create-induction/highest-level-of-education')
      expect(req.session.reasonsNotToGetWorkForm).toBeUndefined()
      const updatedInduction = req.session.inductionDto
      expect(updatedInduction.workOnRelease.notHopingToWorkReasons).toEqual(expectedReasons)
      expect(updatedInduction.workOnRelease.notHopingToWorkOtherReason).toEqual(expectedOtherReason)
    })

    it('should update inductionDto and redirect to Check Your Answers given previous page was Check Your Answers', async () => {
      // Given
      const inductionDto = aShortQuestionSetInductionDto()
      req.session.inductionDto = inductionDto

      const reasonsNotToGetWorkForm: ReasonsNotToGetWorkForm = {
        reasonsNotToGetWork: ['FULL_TIME_CARER'],
      }
      req.body = reasonsNotToGetWorkForm
      req.session.reasonsNotToGetWorkForm = undefined

      const expectedReasons = [ReasonNotToGetWorkValue.FULL_TIME_CARER]

      req.session.pageFlowHistory = {
        pageUrls: [
          '/prisoners/A1234BC/create-induction/check-your-answers',
          '/prisoners/A1234BC/create-induction/reasons-not-to-get-work',
        ],
        currentPageIndex: 1,
      }

      // When
      await controller.submitReasonsNotToGetWorkForm(req, res, next)

      // Then
      const updatedInduction = req.session.inductionDto
      expect(updatedInduction.workOnRelease.notHopingToWorkReasons).toEqual(expectedReasons)
      expect(updatedInduction.workOnRelease.notHopingToWorkOtherReason).toBeUndefined()
      expect(res.redirect).toHaveBeenCalledWith('/prisoners/A1234BC/create-induction/check-your-answers')
      expect(req.session.reasonsNotToGetWorkForm).toBeUndefined()
    })
  })
})
