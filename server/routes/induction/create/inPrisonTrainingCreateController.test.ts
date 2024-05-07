import { NextFunction, Request, Response } from 'express'
import type { SessionData } from 'express-session'
import type { InPrisonTrainingForm } from 'inductionForms'
import type { InPrisonTrainingInterestDto } from 'inductionDto'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import { aShortQuestionSetInductionDto } from '../../../testsupport/inductionDtoTestDataBuilder'
import InPrisonTrainingCreateController from './inPrisonTrainingCreateController'
import InPrisonTrainingValue from '../../../enums/inPrisonTrainingValue'

describe('inPrisonTrainingCreateController', () => {
  const controller = new InPrisonTrainingCreateController()

  const prisonNumber = 'A1234BC'
  const prisonerSummary = aValidPrisonerSummary()

  const noErrors: Array<Record<string, string>> = []

  let req: Request
  let res: Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
    req = {
      session: { prisonerSummary } as SessionData,
      body: {},
      user: {} as Express.User,
      params: { prisonNumber } as Record<string, string>,
      flash: jest.fn(),
      path: `/prisoners/${prisonNumber}/create-induction/in-prison-training`,
    } as unknown as Request
    res = {
      redirect: jest.fn(),
      render: jest.fn(),
    } as unknown as Response
  })

  describe('getInPrisonTrainingView', () => {
    it('should get the In Prison Training view given there is no InPrisonTraining on the session', async () => {
      // Given
      const inductionDto = aShortQuestionSetInductionDto()
      inductionDto.inPrisonInterests.inPrisonTrainingInterests = undefined
      req.session.inductionDto = inductionDto
      req.session.inPrisonTrainingForm = undefined

      const expectedInPrisonTrainingForm: InPrisonTrainingForm = {
        inPrisonTraining: [],
        inPrisonTrainingOther: undefined,
      }

      const expectedView = {
        prisonerSummary,
        form: expectedInPrisonTrainingForm,
        backLinkUrl: '/prisoners/A1234BC/create-induction/in-prison-work',
        backLinkAriaText: 'Back to What type of work would Jimmy Lightfingers like to do in prison?',
        errors: noErrors,
      }

      // When
      await controller.getInPrisonTrainingView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/induction/inPrisonTraining/index', expectedView)
      expect(req.session.inPrisonTrainingForm).toBeUndefined()
      expect(req.session.inductionDto).toEqual(inductionDto)
    })

    it('should get the In Prison Training view given there is an InPrisonTraining already on the session', async () => {
      // Given
      const inductionDto = aShortQuestionSetInductionDto()
      inductionDto.inPrisonInterests.inPrisonTrainingInterests = undefined
      req.session.inductionDto = inductionDto

      const expectedInPrisonTrainingForm: InPrisonTrainingForm = {
        inPrisonTraining: ['CATERING', 'FORKLIFT_DRIVING'],
        inPrisonTrainingOther: '',
      }
      req.session.inPrisonTrainingForm = expectedInPrisonTrainingForm

      const expectedView = {
        prisonerSummary,
        form: expectedInPrisonTrainingForm,
        backLinkUrl: '/prisoners/A1234BC/create-induction/in-prison-work',
        backLinkAriaText: 'Back to What type of work would Jimmy Lightfingers like to do in prison?',
        errors: noErrors,
      }

      // When
      await controller.getInPrisonTrainingView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/induction/inPrisonTraining/index', expectedView)
      expect(req.session.inPrisonTrainingForm).toBeUndefined()
      expect(req.session.inductionDto).toEqual(inductionDto)
    })
  })

  describe('submitInPrisonTrainingForm', () => {
    it('should not update Induction given form is submitted with validation errors', async () => {
      // Given
      const inductionDto = aShortQuestionSetInductionDto()
      inductionDto.inPrisonInterests.inPrisonTrainingInterests = undefined
      req.session.inductionDto = inductionDto

      const invalidInPrisonTrainingForm: InPrisonTrainingForm = {
        inPrisonTraining: [InPrisonTrainingValue.OTHER],
        inPrisonTrainingOther: '',
      }
      req.body = invalidInPrisonTrainingForm
      req.session.inPrisonTrainingForm = undefined

      const expectedErrors = [
        {
          href: '#inPrisonTrainingOther',
          text: 'Enter the type of type of training Jimmy Lightfingers would like to do in prison',
        },
      ]

      // When
      await controller.submitInPrisonTrainingForm(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.redirect).toHaveBeenCalledWith('/prisoners/A1234BC/create-induction/in-prison-training')
      expect(req.flash).toHaveBeenCalledWith('errors', expectedErrors)
      expect(req.session.inPrisonTrainingForm).toEqual(invalidInPrisonTrainingForm)
      expect(req.session.inductionDto).toEqual(inductionDto)
    })

    it('should update inductionDto and redirect to Check Your Answers page', async () => {
      // Given
      const inductionDto = aShortQuestionSetInductionDto()
      inductionDto.inPrisonInterests.inPrisonTrainingInterests = undefined
      req.session.inductionDto = inductionDto

      const inPrisonTrainingForm: InPrisonTrainingForm = {
        inPrisonTraining: [InPrisonTrainingValue.CATERING, InPrisonTrainingValue.OTHER],
        inPrisonTrainingOther: 'Fence building for beginners',
      }
      req.body = inPrisonTrainingForm
      req.session.inPrisonTrainingForm = undefined

      const expectedInPrisonTrainingInterests: Array<InPrisonTrainingInterestDto> = [
        { trainingType: InPrisonTrainingValue.CATERING, trainingTypeOther: undefined },
        { trainingType: InPrisonTrainingValue.OTHER, trainingTypeOther: 'Fence building for beginners' },
      ]

      // When
      await controller.submitInPrisonTrainingForm(req, res, next)

      // Then
      const updatedInduction = req.session.inductionDto
      expect(updatedInduction.inPrisonInterests.inPrisonTrainingInterests).toEqual(expectedInPrisonTrainingInterests)
      expect(res.redirect).toHaveBeenCalledWith('/prisoners/A1234BC/create-induction/check-your-answers')
      expect(req.session.inPrisonTrainingForm).toBeUndefined()
    })
  })
})
