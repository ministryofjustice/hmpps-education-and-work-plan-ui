import { NextFunction, Request, Response } from 'express'
import type { SessionData } from 'express-session'
import type { WorkInterestTypesForm } from 'inductionForms'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import { aLongQuestionSetInductionDto } from '../../../testsupport/inductionDtoTestDataBuilder'
import WorkInterestTypeValue from '../../../enums/workInterestTypeValue'
import WorkInterestTypesCreateController from './workInterestTypesCreateController'

describe('workInterestTypesCreateController', () => {
  const controller = new WorkInterestTypesCreateController()

  const prisonNumber = 'A1234BC'
  const prisonerSummary = aValidPrisonerSummary()

  const noErrors: Array<Record<string, string>> = []

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

      req.session.pageFlowHistory = {
        pageUrls: [
          `/prisoners/${prisonNumber}/create-induction/previous-work-experience`,
          `/prisoners/${prisonNumber}/create-induction/work-interest-types`,
        ],
        currentPageIndex: 1,
      }

      const expectedView = {
        prisonerSummary,
        form: expectedWorkInterestTypesForm,
        backLinkUrl: '/prisoners/A1234BC/create-induction/previous-work-experience',
        backLinkAriaText: 'Back to What type of work has Jimmy Lightfingers done before?',
        errors: noErrors,
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

      req.session.pageFlowHistory = {
        pageUrls: [
          `/prisoners/${prisonNumber}/create-induction/previous-work-experience`,
          `/prisoners/${prisonNumber}/create-induction/work-interest-types`,
        ],
        currentPageIndex: 1,
      }

      const expectedView = {
        prisonerSummary,
        form: expectedWorkInterestTypesForm,
        backLinkUrl: '/prisoners/A1234BC/create-induction/previous-work-experience',
        backLinkAriaText: 'Back to What type of work has Jimmy Lightfingers done before?',
        errors: noErrors,
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
  })
})
