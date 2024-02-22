import type { SessionData } from 'express-session'
import { NextFunction, Request, Response } from 'express'
import InPrisonWorkUpdateController from './inPrisonWorkUpdateController'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import { aShortQuestionSetInductionDto } from '../../../testsupport/inductionDtoTestDataBuilder'
import validateInPrisonWorkForm from './inPrisonWorkFormValidator'

jest.mock('./inPrisonWorkFormValidator')

describe('inPrisonWorkUpdateController', () => {
  const mockedFormValidator = validateInPrisonWorkForm as jest.MockedFunction<typeof validateInPrisonWorkForm>

  const controller = new InPrisonWorkUpdateController()

  const req = {
    session: {} as SessionData,
    body: {},
    user: {} as Express.User,
    params: {} as Record<string, string>,
    flash: jest.fn(),
  }
  const res = {
    redirect: jest.fn(),
    render: jest.fn(),
  }
  const next = jest.fn()

  let errors: Array<Record<string, string>>

  beforeEach(() => {
    jest.resetAllMocks()
    req.session = {} as SessionData
    req.body = {}
    req.user = {} as Express.User
    req.params = {} as Record<string, string>

    errors = []
  })

  describe('getInPrisonWorkView', () => {
    it('should get the In Prison Work view given there is no InPrisonWorkForm on the session', async () => {
      // Given
      const prisonNumber = 'A1234BC'
      req.params.prisonNumber = prisonNumber

      const prisonerSummary = aValidPrisonerSummary()
      req.session.prisonerSummary = prisonerSummary
      const inductionDto = aShortQuestionSetInductionDto()
      req.session.inductionDto = inductionDto
      req.session.inPrisonWorkForm = undefined

      const expectedInPrisonWorkForm = {
        inPrisonWork: ['CLEANING_AND_HYGIENE', 'OTHER'],
        inPrisonWorkOther: 'Gardening and grounds keeping',
      }

      const expectedView = {
        prisonerSummary,
        form: expectedInPrisonWorkForm,
        backLinkUrl: '/plan/A1234BC/view/education-and-training',
        backLinkAriaText: 'Back to <TODO - check what CIAG UI does here>',
        errors,
      }

      // When
      await controller.getInPrisonWorkView(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/induction/inPrisonWork/index', expectedView)
      expect(req.session.inPrisonWorkForm).toBeUndefined()
      expect(req.session.inductionDto).toEqual(inductionDto)
    })

    it('should get the In Prison Work view given there is an InPrisonWorkForm already on the session', async () => {
      // Given
      const prisonNumber = 'A1234BC'
      req.params.prisonNumber = prisonNumber

      const prisonerSummary = aValidPrisonerSummary()
      req.session.prisonerSummary = prisonerSummary
      const inductionDto = aShortQuestionSetInductionDto()
      req.session.inductionDto = inductionDto

      const expectedInPrisonWorkForm = {
        inPrisonWork: ['TEXTILES_AND_SEWING', 'WELDING_AND_METALWORK', 'WOODWORK_AND_JOINERY'],
        inPrisonWorkOther: '',
      }
      req.session.inPrisonWorkForm = expectedInPrisonWorkForm

      const expectedView = {
        prisonerSummary,
        form: expectedInPrisonWorkForm,
        backLinkUrl: '/plan/A1234BC/view/education-and-training',
        backLinkAriaText: 'Back to <TODO - check what CIAG UI does here>',
        errors,
      }

      // When
      await controller.getInPrisonWorkView(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/induction/inPrisonWork/index', expectedView)
      expect(req.session.inPrisonWorkForm).toBeUndefined()
      expect(req.session.inductionDto).toEqual(inductionDto)
    })
  })

  describe('submitInPrisonWorkView', () => {
    it('should not update Induction given form is submitted with validation errors', async () => {
      // Given
      const prisonNumber = 'A1234BC'
      req.params.prisonNumber = prisonNumber

      const prisonerSummary = aValidPrisonerSummary()
      req.session.prisonerSummary = prisonerSummary
      const inductionDto = aShortQuestionSetInductionDto()
      req.session.inductionDto = inductionDto

      const invalidInPrisonWorkForm = {
        inPrisonWork: ['OTHER'],
        inPrisonWorkOther: '',
      }
      req.body = invalidInPrisonWorkForm
      req.session.inPrisonWorkForm = undefined

      errors = [
        { href: '#inPrisonWorkOther', text: 'Enter the type of work Jimmy Lightfingers would like to do in prison' },
      ]
      mockedFormValidator.mockReturnValue(errors)

      // When
      await controller.submitInPrisonWorkForm(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.redirect).toHaveBeenCalledWith('/prisoners/A1234BC/induction/in-prison-work')
      expect(req.flash).toHaveBeenCalledWith('errors', errors)
      expect(req.session.inPrisonWorkForm).toEqual(invalidInPrisonWorkForm)
      expect(req.session.inductionDto).toEqual(inductionDto)
    })
  })
})
