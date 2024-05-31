import { NextFunction, Request, Response } from 'express'
import type { SessionData } from 'express-session'
import type { WorkInterestTypesForm } from 'inductionForms'
import type { FutureWorkInterestDto } from 'inductionDto'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import { aLongQuestionSetInductionDto } from '../../../testsupport/inductionDtoTestDataBuilder'
import WorkInterestTypeValue from '../../../enums/workInterestTypeValue'
import WorkInterestTypesCreateController from './workInterestTypesCreateController'

describe('workInterestTypesCreateController', () => {
  const controller = new WorkInterestTypesCreateController()

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
    req.user = { token: 'some-token' } as Express.User
    req.params = { prisonNumber }
    req.path = `/prisoners/${prisonNumber}/create-induction/work-interest-types`
  })

  describe('getWorkInterestTypesView', () => {
    it('should get the Work Interest Types view given there is no WorkInterestTypesForm on the session', async () => {
      // Given
      const inductionDto = aLongQuestionSetInductionDto()
      inductionDto.futureWorkInterests = undefined
      req.session.inductionDto = inductionDto
      req.session.workInterestTypesForm = undefined

      const expectedWorkInterestTypesForm: WorkInterestTypesForm = {
        workInterestTypes: [],
        workInterestTypesOther: undefined,
      }

      const expectedView = {
        prisonerSummary,
        form: expectedWorkInterestTypesForm,
        backLinkUrl: '/prisoners/A1234BC/create-induction/hoping-to-work-on-release',
        backLinkAriaText: `Back to Is Jimmy Lightfingers hoping to get work when they're released?`,
      }

      // When
      await controller.getWorkInterestTypesView(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/induction/workInterests/workInterestTypes', expectedView)
      expect(req.session.workInterestTypesForm).toBeUndefined()
      expect(req.session.inductionDto).toEqual(inductionDto)
    })

    it('should get the Work Interest Types view given there is an WorkInterestTypesForm already on the session', async () => {
      // Given
      const inductionDto = aLongQuestionSetInductionDto()
      inductionDto.futureWorkInterests = undefined
      req.session.inductionDto = inductionDto

      const expectedWorkInterestTypesForm = {
        workInterestTypes: [
          WorkInterestTypeValue.RETAIL,
          WorkInterestTypeValue.CONSTRUCTION,
          WorkInterestTypeValue.OTHER,
        ],
        workInterestTypesOther: 'Film, TV and media',
      }
      req.session.workInterestTypesForm = expectedWorkInterestTypesForm

      const expectedView = {
        prisonerSummary,
        form: expectedWorkInterestTypesForm,
        backLinkUrl: '/prisoners/A1234BC/create-induction/hoping-to-work-on-release',
        backLinkAriaText: `Back to Is Jimmy Lightfingers hoping to get work when they're released?`,
      }

      // When
      await controller.getWorkInterestTypesView(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/induction/workInterests/workInterestTypes', expectedView)
      expect(req.session.workInterestTypesForm).toBeUndefined()
      expect(req.session.inductionDto).toEqual(inductionDto)
    })

    it('should get the Work Interest Types view given the previous page was Check Your Answers', async () => {
      // Given
      const inductionDto = aLongQuestionSetInductionDto()
      inductionDto.futureWorkInterests = undefined
      req.session.inductionDto = inductionDto
      req.session.workInterestTypesForm = undefined

      req.session.pageFlowHistory = {
        pageUrls: ['/prisoners/A1234BC/create-induction/check-your-answers'],
        currentPageIndex: 0,
      }

      const expectedPageFlowHistory = {
        pageUrls: [
          '/prisoners/A1234BC/create-induction/check-your-answers',
          '/prisoners/A1234BC/create-induction/work-interest-types',
        ],
        currentPageIndex: 1,
      }

      const expectedWorkInterestTypesForm: WorkInterestTypesForm = {
        workInterestTypes: [],
        workInterestTypesOther: undefined,
      }

      const expectedView = {
        prisonerSummary,
        form: expectedWorkInterestTypesForm,
        backLinkUrl: '/prisoners/A1234BC/create-induction/check-your-answers',
        backLinkAriaText: `Back to Check and save your answers before adding Jimmy Lightfingers's goals`,
      }

      // When
      await controller.getWorkInterestTypesView(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/induction/workInterests/workInterestTypes', expectedView)
      expect(req.session.workInterestTypesForm).toBeUndefined()
      expect(req.session.inductionDto).toEqual(inductionDto)
      expect(req.session.pageFlowHistory).toEqual(expectedPageFlowHistory)
    })
  })

  describe('submitWorkInterestTypesForm', () => {
    it('should not update Induction given form is submitted with validation errors', async () => {
      // Given
      const inductionDto = aLongQuestionSetInductionDto()
      inductionDto.futureWorkInterests = undefined
      req.session.inductionDto = inductionDto

      const invalidWorkInterestTypesForm = {
        workInterestTypes: [WorkInterestTypeValue.OTHER],
        workInterestTypesOther: '',
      }
      req.body = invalidWorkInterestTypesForm
      req.session.workInterestTypesForm = undefined

      const expectedErrors = [
        {
          href: '#workInterestTypesOther',
          text: 'Enter the type of work Jimmy Lightfingers is interested in',
        },
      ]

      // When
      await controller.submitWorkInterestTypesForm(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.redirectWithErrors).toHaveBeenCalledWith(
        '/prisoners/A1234BC/create-induction/work-interest-types',
        expectedErrors,
      )
      expect(req.session.workInterestTypesForm).toEqual(invalidWorkInterestTypesForm)
      expect(req.session.inductionDto).toEqual(inductionDto)
    })

    it('should update InductionDto and redirect to Work Interests Details', async () => {
      // Given
      const inductionDto = aLongQuestionSetInductionDto()
      inductionDto.futureWorkInterests = undefined
      req.session.inductionDto = inductionDto

      const workInterestTypesForm = {
        workInterestTypes: [WorkInterestTypeValue.DRIVING, WorkInterestTypeValue.OTHER],
        workInterestTypesOther: 'Natural world',
      }
      req.body = workInterestTypesForm
      req.session.workInterestTypesForm = undefined

      const expectedNextPage = '/prisoners/A1234BC/create-induction/work-interest-roles'

      const expectedFutureWorkInterests: Array<FutureWorkInterestDto> = [
        { workType: WorkInterestTypeValue.DRIVING, workTypeOther: undefined, role: undefined },
        { workType: WorkInterestTypeValue.OTHER, workTypeOther: 'Natural world', role: undefined },
      ]

      // When
      await controller.submitWorkInterestTypesForm(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      const futureWorkInterestsOnInduction: Array<FutureWorkInterestDto> =
        req.session.inductionDto.futureWorkInterests.interests
      expect(futureWorkInterestsOnInduction).toEqual(expectedFutureWorkInterests)
      expect(res.redirect).toHaveBeenCalledWith(expectedNextPage)
      expect(req.session.workInterestTypesForm).toBeUndefined()
    })

    it('should update inductionDto and redirect to Check Your Answers given previous page was Check Your Answers', async () => {
      // Given
      const inductionDto = aLongQuestionSetInductionDto()
      inductionDto.futureWorkInterests = undefined
      req.session.inductionDto = inductionDto

      const workInterestTypesForm = {
        workInterestTypes: [WorkInterestTypeValue.DRIVING, WorkInterestTypeValue.OTHER],
        workInterestTypesOther: 'Natural world',
      }
      req.body = workInterestTypesForm
      req.session.workInterestTypesForm = undefined

      const expectedFutureWorkInterests: Array<FutureWorkInterestDto> = [
        { workType: WorkInterestTypeValue.DRIVING, workTypeOther: undefined, role: undefined },
        { workType: WorkInterestTypeValue.OTHER, workTypeOther: 'Natural world', role: undefined },
      ]

      req.session.pageFlowHistory = {
        pageUrls: [
          '/prisoners/A1234BC/create-induction/check-your-answers',
          '/prisoners/A1234BC/create-induction/work-interest-types',
        ],
        currentPageIndex: 1,
      }

      // When
      await controller.submitWorkInterestTypesForm(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      const futureWorkInterestsOnInduction: Array<FutureWorkInterestDto> =
        req.session.inductionDto.futureWorkInterests.interests
      expect(futureWorkInterestsOnInduction).toEqual(expectedFutureWorkInterests)
      expect(res.redirect).toHaveBeenCalledWith('/prisoners/A1234BC/create-induction/check-your-answers')
      expect(req.session.workInterestTypesForm).toBeUndefined()
    })
  })
})
