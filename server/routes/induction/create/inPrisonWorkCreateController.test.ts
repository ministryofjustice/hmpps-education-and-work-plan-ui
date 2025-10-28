import { Request, Response } from 'express'
import { v4 as uuidV4 } from 'uuid'
import type { InPrisonWorkForm } from 'inductionForms'
import type { InPrisonWorkInterestDto } from 'inductionDto'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import { aValidInductionDto } from '../../../testsupport/inductionDtoTestDataBuilder'
import InPrisonWorkCreateController from './inPrisonWorkCreateController'
import InPrisonWorkValue from '../../../enums/inPrisonWorkValue'

describe('inPrisonWorkCreateController', () => {
  const controller = new InPrisonWorkCreateController()

  const journeyId = uuidV4()
  const prisonNumber = 'A1234BC'
  const prisonerSummary = aValidPrisonerSummary()

  const req = {
    session: {},
    journeyData: {},
    body: {},
    params: { prisonNumber, journeyId },
    originalUrl: `/prisoners/${prisonNumber}/create-induction/${journeyId}/in-prison-work`,
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
    req.body = {}
    req.journeyData = {}
    req.query = {}
    res.locals.invalidForm = undefined
  })

  describe('getInPrisonWorkView', () => {
    it('should get the In Prison Work view given no InPrisonWork on res.locals.invalidForm', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      inductionDto.inPrisonInterests.inPrisonWorkInterests = undefined
      req.journeyData.inductionDto = inductionDto
      res.locals.invalidForm = undefined

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
      expect(req.journeyData.inductionDto).toEqual(inductionDto)
    })

    it('should get the In Prison Work view given there is an InPrisonWork already on res.locals.invalidForm', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      inductionDto.inPrisonInterests.inPrisonWorkInterests = undefined
      req.journeyData.inductionDto = inductionDto

      const expectedInPrisonWorkForm: InPrisonWorkForm = {
        inPrisonWork: ['PRISON_LIBRARY', 'WELDING_AND_METALWORK'],
        inPrisonWorkOther: '',
      }
      res.locals.invalidForm = expectedInPrisonWorkForm

      const expectedView = {
        prisonerSummary,
        form: expectedInPrisonWorkForm,
      }

      // When
      await controller.getInPrisonWorkView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/induction/inPrisonWork/index', expectedView)
      expect(req.journeyData.inductionDto).toEqual(inductionDto)
    })
  })

  describe('submitInPrisonWorkForm', () => {
    it('should update inductionDto and redirect to in-prison training interests page given previous page was not Check Your Answers', async () => {
      // Given
      req.query = {}

      const inductionDto = aValidInductionDto()
      inductionDto.inPrisonInterests.inPrisonWorkInterests = undefined
      req.journeyData.inductionDto = inductionDto

      const inPrisonWorkForm: InPrisonWorkForm = {
        inPrisonWork: ['KITCHENS_AND_COOKING', 'OTHER'],
        inPrisonWorkOther: 'Any odd-jobs I can pick up to pass the time',
      }
      req.body = inPrisonWorkForm

      const expectedInPrisonWorkInterests: Array<InPrisonWorkInterestDto> = [
        { workType: InPrisonWorkValue.KITCHENS_AND_COOKING, workTypeOther: undefined },
        { workType: InPrisonWorkValue.OTHER, workTypeOther: 'Any odd-jobs I can pick up to pass the time' },
      ]

      // When
      await controller.submitInPrisonWorkForm(req, res, next)

      // Then
      const updatedInduction = req.journeyData.inductionDto
      expect(updatedInduction.inPrisonInterests.inPrisonWorkInterests).toEqual(expectedInPrisonWorkInterests)
      expect(res.redirect).toHaveBeenCalledWith(`/prisoners/A1234BC/create-induction/${journeyId}/in-prison-training`)
    })

    it('should update inductionDto and redirect to Check Your Answers given previous page was Check Your Answers', async () => {
      // Given
      req.query = { submitToCheckAnswers: 'true' }

      const inductionDto = aValidInductionDto()
      req.journeyData.inductionDto = inductionDto

      const inPrisonWorkForm: InPrisonWorkForm = {
        inPrisonWork: ['KITCHENS_AND_COOKING', 'OTHER'],
        inPrisonWorkOther: 'Any odd-jobs I can pick up to pass the time',
      }
      req.body = inPrisonWorkForm

      const expectedInPrisonWorkInterests: Array<InPrisonWorkInterestDto> = [
        { workType: InPrisonWorkValue.KITCHENS_AND_COOKING, workTypeOther: undefined },
        { workType: InPrisonWorkValue.OTHER, workTypeOther: 'Any odd-jobs I can pick up to pass the time' },
      ]

      // When
      await controller.submitInPrisonWorkForm(req, res, next)

      // Then
      const updatedInduction = req.journeyData.inductionDto
      expect(updatedInduction.inPrisonInterests.inPrisonWorkInterests).toEqual(expectedInPrisonWorkInterests)
      expect(res.redirect).toHaveBeenCalledWith(`/prisoners/A1234BC/create-induction/${journeyId}/check-your-answers`)
    })
  })
})
