import { NextFunction, Request, Response } from 'express'
import type { InPrisonWorkForm } from 'inductionForms'
import type { InPrisonWorkInterestDto } from 'inductionDto'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import { aValidInductionDto } from '../../../testsupport/inductionDtoTestDataBuilder'
import InPrisonWorkCreateController from './inPrisonWorkCreateController'
import InPrisonWorkValue from '../../../enums/inPrisonWorkValue'
import { getPrisonerContext } from '../../../data/session/prisonerContexts'

describe('inPrisonWorkCreateController', () => {
  const controller = new InPrisonWorkCreateController()

  const prisonNumber = 'A1234BC'
  const prisonerSummary = aValidPrisonerSummary()

  const req = {
    session: {},
    body: {},
    params: { prisonNumber },
    path: `/prisoners/${prisonNumber}/create-induction/in-prison-work`,
  } as unknown as Request
  const res = {
    redirect: jest.fn(),
    redirectWithErrors: jest.fn(),
    render: jest.fn(),
    locals: { prisonerSummary },
  } as unknown as Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
    req.session.pageFlowHistory = undefined
    req.body = {}
  })

  describe('getInPrisonWorkView', () => {
    it('should get the In Prison Work view given no InPrisonWork on the session', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      inductionDto.inPrisonInterests.inPrisonWorkInterests = undefined
      getPrisonerContext(req.session, prisonNumber).inductionDto = inductionDto
      getPrisonerContext(req.session, prisonNumber).inPrisonWorkForm = undefined

      const expectedInPrisonWorkForm: InPrisonWorkForm = {
        inPrisonWork: [],
        inPrisonWorkOther: undefined,
      }

      const expectedView = {
        prisonerSummary,
        form: expectedInPrisonWorkForm,
      }

      // When
      await controller.getInPrisonWorkView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/induction/inPrisonWork/index', expectedView)
      expect(getPrisonerContext(req.session, prisonNumber).inPrisonWorkForm).toBeUndefined()
      expect(getPrisonerContext(req.session, prisonNumber).inductionDto).toEqual(inductionDto)
    })

    it('should get the In Prison Work view given there is an InPrisonWork already on the session', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      inductionDto.inPrisonInterests.inPrisonWorkInterests = undefined
      getPrisonerContext(req.session, prisonNumber).inductionDto = inductionDto

      const expectedInPrisonWorkForm: InPrisonWorkForm = {
        inPrisonWork: ['PRISON_LIBRARY', 'WELDING_AND_METALWORK'],
        inPrisonWorkOther: '',
      }
      getPrisonerContext(req.session, prisonNumber).inPrisonWorkForm = expectedInPrisonWorkForm

      const expectedView = {
        prisonerSummary,
        form: expectedInPrisonWorkForm,
      }

      // When
      await controller.getInPrisonWorkView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/induction/inPrisonWork/index', expectedView)
      expect(getPrisonerContext(req.session, prisonNumber).inPrisonWorkForm).toBeUndefined()
      expect(getPrisonerContext(req.session, prisonNumber).inductionDto).toEqual(inductionDto)
    })
  })

  describe('submitInPrisonWorkForm', () => {
    it('should not update Induction given form is submitted with validation errors', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      inductionDto.inPrisonInterests.inPrisonWorkInterests = undefined
      getPrisonerContext(req.session, prisonNumber).inductionDto = inductionDto

      const invalidInPrisonWorkForm: InPrisonWorkForm = {
        inPrisonWork: ['OTHER'],
        inPrisonWorkOther: '',
      }
      req.body = invalidInPrisonWorkForm
      getPrisonerContext(req.session, prisonNumber).inPrisonWorkForm = undefined

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
      expect(getPrisonerContext(req.session, prisonNumber).inPrisonWorkForm).toEqual(invalidInPrisonWorkForm)
      expect(getPrisonerContext(req.session, prisonNumber).inductionDto).toEqual(inductionDto)
    })

    it('should update inductionDto and redirect to in-prison training interests page', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      inductionDto.inPrisonInterests.inPrisonWorkInterests = undefined
      getPrisonerContext(req.session, prisonNumber).inductionDto = inductionDto

      const inPrisonWorkForm: InPrisonWorkForm = {
        inPrisonWork: ['KITCHENS_AND_COOKING', 'OTHER'],
        inPrisonWorkOther: 'Any odd-jobs I can pick up to pass the time',
      }
      req.body = inPrisonWorkForm
      getPrisonerContext(req.session, prisonNumber).inPrisonWorkForm = undefined

      const expectedInPrisonWorkInterests: Array<InPrisonWorkInterestDto> = [
        { workType: InPrisonWorkValue.KITCHENS_AND_COOKING, workTypeOther: undefined },
        { workType: InPrisonWorkValue.OTHER, workTypeOther: 'Any odd-jobs I can pick up to pass the time' },
      ]

      // When
      await controller.submitInPrisonWorkForm(req, res, next)

      // Then
      const updatedInduction = getPrisonerContext(req.session, prisonNumber).inductionDto
      expect(updatedInduction.inPrisonInterests.inPrisonWorkInterests).toEqual(expectedInPrisonWorkInterests)
      expect(res.redirect).toHaveBeenCalledWith('/prisoners/A1234BC/create-induction/in-prison-training')
      expect(getPrisonerContext(req.session, prisonNumber).inPrisonWorkForm).toBeUndefined()
    })

    it('should update inductionDto and redirect to Check Your Answers given previous page was Check Your Answers', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      getPrisonerContext(req.session, prisonNumber).inductionDto = inductionDto

      const inPrisonWorkForm: InPrisonWorkForm = {
        inPrisonWork: ['KITCHENS_AND_COOKING', 'OTHER'],
        inPrisonWorkOther: 'Any odd-jobs I can pick up to pass the time',
      }
      req.body = inPrisonWorkForm
      getPrisonerContext(req.session, prisonNumber).inPrisonWorkForm = undefined

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
      const updatedInduction = getPrisonerContext(req.session, prisonNumber).inductionDto
      expect(updatedInduction.inPrisonInterests.inPrisonWorkInterests).toEqual(expectedInPrisonWorkInterests)
      expect(res.redirect).toHaveBeenCalledWith('/prisoners/A1234BC/create-induction/check-your-answers')
      expect(getPrisonerContext(req.session, prisonNumber).inPrisonWorkForm).toBeUndefined()
    })
  })
})
