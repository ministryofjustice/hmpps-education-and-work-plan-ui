import { NextFunction, Request, Response } from 'express'
import type { SessionData } from 'express-session'
import type { InPrisonWorkForm } from 'inductionForms'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import { aShortQuestionSetInductionDto } from '../../../testsupport/inductionDtoTestDataBuilder'
import InPrisonWorkCreateController from './inPrisonWorkCreateController'

describe('inPrisonWorkCreateController', () => {
  const controller = new InPrisonWorkCreateController()

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
      path: `/prisoners/${prisonNumber}/create-induction/in-prison-work`,
    } as unknown as Request
    res = {
      redirect: jest.fn(),
      render: jest.fn(),
    } as unknown as Response
  })

  describe('getInPrisonWorkView', () => {
    it('should get the In Prison Work view given there is no InPrisonWork on the session', async () => {
      // Given
      const inductionDto = aShortQuestionSetInductionDto()
      inductionDto.inPrisonInterests.inPrisonWorkInterests = undefined
      req.session.inductionDto = inductionDto
      req.session.inPrisonWorkForm = undefined

      const expectedInPrisonWorkForm: InPrisonWorkForm = {
        inPrisonWork: [],
        inPrisonWorkOther: undefined,
      }

      const expectedView = {
        prisonerSummary,
        form: expectedInPrisonWorkForm,
        backLinkUrl: '/prisoners/A1234BC/create-induction/additional-training',
        backLinkAriaText: 'Back to Does Jimmy Lightfingers have any other training or vocational qualifications?',
        errors: noErrors,
      }

      // When
      await controller.getInPrisonWorkView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/induction/inPrisonWork/index', expectedView)
      expect(req.session.inPrisonWorkForm).toBeUndefined()
      expect(req.session.inductionDto).toEqual(inductionDto)
    })

    it('should get the In Prison Work view given there is an InPrisonWork already on the session', async () => {
      // Given
      const inductionDto = aShortQuestionSetInductionDto()
      inductionDto.inPrisonInterests.inPrisonWorkInterests = undefined
      req.session.inductionDto = inductionDto

      const expectedInPrisonWorkForm: InPrisonWorkForm = {
        inPrisonWork: ['PRISON_LIBRARY', 'WELDING_AND_METALWORK'],
        inPrisonWorkOther: '',
      }
      req.session.inPrisonWorkForm = expectedInPrisonWorkForm

      const expectedView = {
        prisonerSummary,
        form: expectedInPrisonWorkForm,
        backLinkUrl: '/prisoners/A1234BC/create-induction/additional-training',
        backLinkAriaText: 'Back to Does Jimmy Lightfingers have any other training or vocational qualifications?',
        errors: noErrors,
      }

      // When
      await controller.getInPrisonWorkView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/induction/inPrisonWork/index', expectedView)
      expect(req.session.inPrisonWorkForm).toBeUndefined()
      expect(req.session.inductionDto).toEqual(inductionDto)
    })
  })

  describe('submitInPrisonWorkForm', () => {
    it('should not update Induction given form is submitted with validation errors', async () => {
      // Given
      const inductionDto = aShortQuestionSetInductionDto()
      inductionDto.inPrisonInterests.inPrisonWorkInterests = undefined
      req.session.inductionDto = inductionDto

      const invalidInPrisonWorkForm = {
        inPrisonWork: ['OTHER'],
        inPrisonWorkOther: '',
      }
      req.body = invalidInPrisonWorkForm
      req.session.inPrisonWorkForm = undefined

      const expectedErrors = [
        { href: '#inPrisonWorkOther', text: 'Enter the type of work Jimmy Lightfingers would like to do in prison' },
      ]

      // When
      await controller.submitInPrisonWorkForm(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.redirect).toHaveBeenCalledWith('/prisoners/A1234BC/create-induction/in-prison-work')
      expect(req.flash).toHaveBeenCalledWith('errors', expectedErrors)
      expect(req.session.inPrisonWorkForm).toEqual(invalidInPrisonWorkForm)
      expect(req.session.inductionDto).toEqual(inductionDto)
    })
  })
})
