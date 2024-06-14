import { NextFunction, Request, Response } from 'express'
import type { SessionData } from 'express-session'
import type { InPrisonWorkForm } from 'inductionForms'
import type { InPrisonWorkInterestDto } from 'inductionDto'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import { aShortQuestionSetInductionDto } from '../../../testsupport/inductionDtoTestDataBuilder'
import InPrisonWorkCreateController from './inPrisonWorkCreateController'
import InPrisonWorkValue from '../../../enums/inPrisonWorkValue'

describe('inPrisonWorkCreateController', () => {
  const controller = new InPrisonWorkCreateController()

  const prisonNumber = 'A1234BC'
  const prisonerSummary = aValidPrisonerSummary()

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
      path: `/prisoners/${prisonNumber}/create-induction/in-prison-work`,
    } as unknown as Request
    res = {
      redirect: jest.fn(),
      redirectWithErrors: jest.fn(),
      render: jest.fn(),
    } as unknown as Response
  })

  describe('getInPrisonWorkView', () => {
    it('should get the In Prison Work view given no InPrisonWork on the session', async () => {
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
        backLinkUrl: '/prisoners/A1234BC/create-induction/personal-interests',
        backLinkAriaText: `Back to What are Jimmy Lightfingers's interests?`,
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
        backLinkUrl: '/prisoners/A1234BC/create-induction/personal-interests',
        backLinkAriaText: `Back to What are Jimmy Lightfingers's interests?`,
      }

      // When
      await controller.getInPrisonWorkView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/induction/inPrisonWork/index', expectedView)
      expect(req.session.inPrisonWorkForm).toBeUndefined()
      expect(req.session.inductionDto).toEqual(inductionDto)
    })

    it('should get the In Prison Work view given the previous page was Check Your Answers', async () => {
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
          '/prisoners/A1234BC/create-induction/in-prison-work',
        ],
        currentPageIndex: 1,
      }

      const expectedInPrisonWorkForm: InPrisonWorkForm = {
        inPrisonWork: ['PRISON_LIBRARY', 'WELDING_AND_METALWORK'],
        inPrisonWorkOther: '',
      }
      req.session.inPrisonWorkForm = expectedInPrisonWorkForm

      const expectedView = {
        prisonerSummary,
        form: expectedInPrisonWorkForm,
        backLinkUrl: '/prisoners/A1234BC/create-induction/check-your-answers',
        backLinkAriaText: `Back to Check and save your answers before adding Jimmy Lightfingers's goals`,
      }

      // When
      await controller.getInPrisonWorkView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/induction/inPrisonWork/index', expectedView)
      expect(req.session.inPrisonWorkForm).toBeUndefined()
      expect(req.session.inductionDto).toEqual(inductionDto)
      expect(req.session.pageFlowHistory).toEqual(expectedPageFlowHistory)
    })
  })

  describe('submitInPrisonWorkForm', () => {
    it('should not update Induction given form is submitted with validation errors', async () => {
      // Given
      const inductionDto = aShortQuestionSetInductionDto()
      inductionDto.inPrisonInterests.inPrisonWorkInterests = undefined
      req.session.inductionDto = inductionDto

      const invalidInPrisonWorkForm: InPrisonWorkForm = {
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
      expect(res.redirectWithErrors).toHaveBeenCalledWith(
        '/prisoners/A1234BC/create-induction/in-prison-work',
        expectedErrors,
      )
      expect(req.session.inPrisonWorkForm).toEqual(invalidInPrisonWorkForm)
      expect(req.session.inductionDto).toEqual(inductionDto)
    })

    it('should update inductionDto and redirect to in-prison training interests page', async () => {
      // Given
      const inductionDto = aShortQuestionSetInductionDto()
      inductionDto.inPrisonInterests.inPrisonWorkInterests = undefined
      req.session.inductionDto = inductionDto

      const inPrisonWorkForm: InPrisonWorkForm = {
        inPrisonWork: ['KITCHENS_AND_COOKING', 'OTHER'],
        inPrisonWorkOther: 'Any odd-jobs I can pick up to pass the time',
      }
      req.body = inPrisonWorkForm
      req.session.inPrisonWorkForm = undefined

      const expectedInPrisonWorkInterests: Array<InPrisonWorkInterestDto> = [
        { workType: InPrisonWorkValue.KITCHENS_AND_COOKING, workTypeOther: undefined },
        { workType: InPrisonWorkValue.OTHER, workTypeOther: 'Any odd-jobs I can pick up to pass the time' },
      ]

      // When
      await controller.submitInPrisonWorkForm(req, res, next)

      // Then
      const updatedInduction = req.session.inductionDto
      expect(updatedInduction.inPrisonInterests.inPrisonWorkInterests).toEqual(expectedInPrisonWorkInterests)
      expect(res.redirect).toHaveBeenCalledWith('/prisoners/A1234BC/create-induction/in-prison-training')
      expect(req.session.inPrisonWorkForm).toBeUndefined()
    })

    it('should update inductionDto and redirect to Check Your Answers given previous page was Check Your Answers', async () => {
      // Given
      const inductionDto = aShortQuestionSetInductionDto()
      req.session.inductionDto = inductionDto

      const inPrisonWorkForm: InPrisonWorkForm = {
        inPrisonWork: ['KITCHENS_AND_COOKING', 'OTHER'],
        inPrisonWorkOther: 'Any odd-jobs I can pick up to pass the time',
      }
      req.body = inPrisonWorkForm
      req.session.inPrisonWorkForm = undefined

      const expectedInPrisonWorkInterests: Array<InPrisonWorkInterestDto> = [
        { workType: InPrisonWorkValue.KITCHENS_AND_COOKING, workTypeOther: undefined },
        { workType: InPrisonWorkValue.OTHER, workTypeOther: 'Any odd-jobs I can pick up to pass the time' },
      ]

      req.session.pageFlowHistory = {
        pageUrls: [
          '/prisoners/A1234BC/create-induction/check-your-answers',
          '/prisoners/A1234BC/create-induction/in-prison-work',
        ],
        currentPageIndex: 1,
      }

      // When
      await controller.submitInPrisonWorkForm(req, res, next)

      // Then
      const updatedInduction = req.session.inductionDto
      expect(updatedInduction.inPrisonInterests.inPrisonWorkInterests).toEqual(expectedInPrisonWorkInterests)
      expect(res.redirect).toHaveBeenCalledWith('/prisoners/A1234BC/create-induction/check-your-answers')
      expect(req.session.skillsForm).toBeUndefined()
    })
  })
})
