import { NextFunction, Request, Response } from 'express'
import type { SessionData } from 'express-session'
import type { WorkedBeforeForm } from 'inductionForms'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import { aLongQuestionSetInductionDto } from '../../../testsupport/inductionDtoTestDataBuilder'
import YesNoValue from '../../../enums/yesNoValue'
import WorkedBeforeCreateController from './workedBeforeCreateController'

describe('workedBeforeCreateController', () => {
  const controller = new WorkedBeforeCreateController()

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
    req.user = {} as Express.User
    req.params = { prisonNumber }
    req.path = `/prisoners/${prisonNumber}/create-induction/has-worked-before`
  })

  describe('getWorkedBeforeView', () => {
    it('should get the WorkedBefore view given there is no WorkedBeforeForm on the session', async () => {
      // Given
      const inductionDto = aLongQuestionSetInductionDto()
      inductionDto.previousWorkExperiences = undefined
      req.session.inductionDto = inductionDto
      req.session.workedBeforeForm = undefined

      const expectedWorkedBeforeForm: WorkedBeforeForm = {
        hasWorkedBefore: undefined,
      }

      req.session.pageFlowHistory = {
        pageUrls: [
          `/prisoners/${prisonNumber}/create-induction/additional-training`,
          `/prisoners/${prisonNumber}/create-induction/has-worked-before`,
        ],
        currentPageIndex: 1,
      }

      const expectedView = {
        prisonerSummary,
        form: expectedWorkedBeforeForm,
        backLinkUrl: '/prisoners/A1234BC/create-induction/additional-training',
        backLinkAriaText: 'Back to Does Jimmy Lightfingers have any other training or vocational qualifications?',
        errors: noErrors,
      }

      // When
      await controller.getWorkedBeforeView(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/induction/workedBefore/index', expectedView)
      expect(req.session.workedBeforeForm).toBeUndefined()
      expect(req.session.inductionDto).toEqual(inductionDto)
    })

    it('should get the WorkedBefore view given there is an WorkedBeforeForm already on the session', async () => {
      // Given
      const inductionDto = aLongQuestionSetInductionDto()
      inductionDto.previousWorkExperiences = undefined
      req.session.inductionDto = inductionDto

      const expectedWorkedBeforeForm = {
        hasWorkedBefore: YesNoValue.NO,
      }
      req.session.workedBeforeForm = expectedWorkedBeforeForm

      req.session.pageFlowHistory = {
        pageUrls: [
          `/prisoners/${prisonNumber}/create-induction/additional-training`,
          `/prisoners/${prisonNumber}/create-induction/has-worked-before`,
        ],
        currentPageIndex: 1,
      }

      const expectedView = {
        prisonerSummary,
        form: expectedWorkedBeforeForm,
        backLinkUrl: '/prisoners/A1234BC/create-induction/additional-training',
        backLinkAriaText: 'Back to Does Jimmy Lightfingers have any other training or vocational qualifications?',
        errors: noErrors,
      }

      // When
      await controller.getWorkedBeforeView(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/induction/workedBefore/index', expectedView)
      expect(req.session.workedBeforeForm).toBeUndefined()
      expect(req.session.inductionDto).toEqual(inductionDto)
    })
  })
})
