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

  describe('submitWorkedBeforeForm', () => {
    it('should not update Induction given form is submitted with validation errors', async () => {
      // Given
      const inductionDto = aLongQuestionSetInductionDto()
      inductionDto.previousWorkExperiences = undefined
      req.session.inductionDto = inductionDto

      const invalidWorkedBeforeForm: WorkedBeforeForm = {
        hasWorkedBefore: undefined,
      }
      req.body = invalidWorkedBeforeForm
      req.session.workedBeforeForm = undefined

      const expectedErrors = [
        { href: '#hasWorkedBefore', text: 'Select whether Jimmy Lightfingers has worked before or not' },
      ]

      // When
      await controller.submitWorkedBeforeForm(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.redirect).toHaveBeenCalledWith('/prisoners/A1234BC/create-induction/has-worked-before')
      expect(req.flash).toHaveBeenCalledWith('errors', expectedErrors)
      expect(req.session.workedBeforeForm).toEqual(invalidWorkedBeforeForm)
      expect(req.session.inductionDto).toEqual(inductionDto)
    })

    it('should update InductionDto and display Previous Work Experience page given form is submitted with worked before YES', async () => {
      // Given
      const inductionDto = aLongQuestionSetInductionDto()
      inductionDto.previousWorkExperiences = undefined
      req.session.inductionDto = inductionDto

      const workedBeforeForm: WorkedBeforeForm = {
        hasWorkedBefore: YesNoValue.YES,
      }
      req.body = workedBeforeForm
      req.session.workedBeforeForm = undefined

      // When
      await controller.submitWorkedBeforeForm(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.redirect).toHaveBeenCalledWith('/prisoners/A1234BC/create-induction/previous-work-experience')
      expect(req.session.workedBeforeForm).toBeUndefined()
      const updatedInduction = req.session.inductionDto
      expect(updatedInduction.previousWorkExperiences.hasWorkedBefore).toEqual(true)
    })

    it('should update InductionDto and display Work Interest Types page given form is submitted with worked before NO', async () => {
      // Given
      const inductionDto = aLongQuestionSetInductionDto()
      inductionDto.previousWorkExperiences = undefined
      req.session.inductionDto = inductionDto

      const workedBeforeForm: WorkedBeforeForm = {
        hasWorkedBefore: YesNoValue.NO,
      }
      req.body = workedBeforeForm
      req.session.workedBeforeForm = undefined

      // When
      await controller.submitWorkedBeforeForm(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.redirect).toHaveBeenCalledWith('/prisoners/A1234BC/create-induction/work-interest-types')
      expect(req.session.workedBeforeForm).toBeUndefined()
      const updatedInduction = req.session.inductionDto
      expect(updatedInduction.previousWorkExperiences.hasWorkedBefore).toEqual(false)
    })
  })
})
