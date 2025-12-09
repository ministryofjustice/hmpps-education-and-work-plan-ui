import { Request, Response } from 'express'
import { v4 as uuidV4 } from 'uuid'
import type { WorkInterestTypesForm } from 'inductionForms'
import type { FutureWorkInterestDto } from 'inductionDto'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import { aValidInductionDto } from '../../../testsupport/inductionDtoTestDataBuilder'
import WorkInterestTypeValue from '../../../enums/workInterestTypeValue'
import WorkInterestTypesCreateController from './workInterestTypesCreateController'

describe('workInterestTypesCreateController', () => {
  const controller = new WorkInterestTypesCreateController()

  const journeyId = uuidV4()
  const prisonNumber = 'A1234BC'
  const prisonerSummary = aValidPrisonerSummary()

  const req = {
    session: {},
    journeyData: {},
    body: {},
    params: { prisonNumber, journeyId },
    originalUrl: `/prisoners/${prisonNumber}/create-induction/${journeyId}/work-interest-types`,
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
    res.locals.invalidForm = undefined
  })

  describe('getWorkInterestTypesView', () => {
    it('should get the Work Interest Types view given there is no WorkInterestTypesForm on res.locals.invalidForm', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      inductionDto.futureWorkInterests = undefined
      req.journeyData.inductionDto = inductionDto
      res.locals.invalidForm = undefined

      const expectedWorkInterestTypesForm: WorkInterestTypesForm = {
        workInterestTypes: [],
        workInterestTypesOther: undefined,
      }

      const expectedView = {
        prisonerSummary,
        form: expectedWorkInterestTypesForm,
      }

      // When
      await controller.getWorkInterestTypesView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/induction/workInterests/workInterestTypes', expectedView)
      expect(req.journeyData.inductionDto).toEqual(inductionDto)
    })

    it('should get the Work Interest Types view given there is an WorkInterestTypesForm already on res.locals.invalidForm', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      inductionDto.futureWorkInterests = undefined
      req.journeyData.inductionDto = inductionDto

      const expectedWorkInterestTypesForm = {
        workInterestTypes: [
          WorkInterestTypeValue.RETAIL,
          WorkInterestTypeValue.CONSTRUCTION,
          WorkInterestTypeValue.OTHER,
        ],
        workInterestTypesOther: 'Film, TV and media',
      }
      res.locals.invalidForm = expectedWorkInterestTypesForm

      const expectedView = {
        prisonerSummary,
        form: expectedWorkInterestTypesForm,
      }

      // When
      await controller.getWorkInterestTypesView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/induction/workInterests/workInterestTypes', expectedView)
      expect(req.journeyData.inductionDto).toEqual(inductionDto)
    })
  })

  describe('submitWorkInterestTypesForm', () => {
    it('should update InductionDto and redirect to Work Interests Details given previous page was not Check Your Answers', async () => {
      // Given
      req.query = {}

      const inductionDto = aValidInductionDto()
      inductionDto.futureWorkInterests = undefined
      req.journeyData.inductionDto = inductionDto

      const workInterestTypesForm = {
        workInterestTypes: [WorkInterestTypeValue.DRIVING, WorkInterestTypeValue.OTHER],
        workInterestTypesOther: 'Natural world',
      }
      req.body = workInterestTypesForm

      const expectedNextPage = 'work-interest-roles'
      const expectedFutureWorkInterests: Array<FutureWorkInterestDto> = [
        { workType: WorkInterestTypeValue.DRIVING, workTypeOther: undefined, role: undefined },
        { workType: WorkInterestTypeValue.OTHER, workTypeOther: 'Natural world', role: undefined },
      ]

      // When
      await controller.submitWorkInterestTypesForm(req, res, next)

      // Then
      const futureWorkInterestsOnInduction: Array<FutureWorkInterestDto> =
        req.journeyData.inductionDto.futureWorkInterests.interests
      expect(futureWorkInterestsOnInduction).toEqual(expectedFutureWorkInterests)
      expect(res.redirect).toHaveBeenCalledWith(expectedNextPage)
    })

    it('should update inductionDto and redirect to Check Your Answers given previous page was Check Your Answers', async () => {
      // Given
      req.query = { submitToCheckAnswers: 'true' }

      const inductionDto = aValidInductionDto()
      inductionDto.futureWorkInterests = undefined
      req.journeyData.inductionDto = inductionDto

      const workInterestTypesForm = {
        workInterestTypes: [WorkInterestTypeValue.DRIVING, WorkInterestTypeValue.OTHER],
        workInterestTypesOther: 'Natural world',
      }
      req.body = workInterestTypesForm

      const expectedNextPage = 'check-your-answers'
      const expectedFutureWorkInterests: Array<FutureWorkInterestDto> = [
        { workType: WorkInterestTypeValue.DRIVING, workTypeOther: undefined, role: undefined },
        { workType: WorkInterestTypeValue.OTHER, workTypeOther: 'Natural world', role: undefined },
      ]

      // When
      await controller.submitWorkInterestTypesForm(req, res, next)

      // Then
      const futureWorkInterestsOnInduction: Array<FutureWorkInterestDto> =
        req.journeyData.inductionDto.futureWorkInterests.interests
      expect(futureWorkInterestsOnInduction).toEqual(expectedFutureWorkInterests)
      expect(res.redirect).toHaveBeenCalledWith(expectedNextPage)
    })
  })
})
