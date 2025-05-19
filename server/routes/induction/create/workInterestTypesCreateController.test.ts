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
    req.session.pageFlowHistory = undefined
    req.body = {}
    req.journeyData = {}
  })

  describe('getWorkInterestTypesView', () => {
    it('should get the Work Interest Types view given there is no WorkInterestTypesForm on the session', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      inductionDto.futureWorkInterests = undefined
      req.journeyData.inductionDto = inductionDto
      req.session.workInterestTypesForm = undefined

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
      expect(req.session.workInterestTypesForm).toBeUndefined()
      expect(req.journeyData.inductionDto).toEqual(inductionDto)
    })

    it('should get the Work Interest Types view given there is an WorkInterestTypesForm already on the session', async () => {
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
      req.session.workInterestTypesForm = expectedWorkInterestTypesForm

      const expectedView = {
        prisonerSummary,
        form: expectedWorkInterestTypesForm,
      }

      // When
      await controller.getWorkInterestTypesView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/induction/workInterests/workInterestTypes', expectedView)
      expect(req.session.workInterestTypesForm).toBeUndefined()
      expect(req.journeyData.inductionDto).toEqual(inductionDto)
    })
  })

  describe('submitWorkInterestTypesForm', () => {
    it('should not update Induction given form is submitted with validation errors', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      inductionDto.futureWorkInterests = undefined
      req.journeyData.inductionDto = inductionDto

      const invalidWorkInterestTypesForm = {
        workInterestTypes: [WorkInterestTypeValue.OTHER],
        workInterestTypesOther: '',
      }
      req.body = invalidWorkInterestTypesForm
      req.session.workInterestTypesForm = undefined

      const expectedErrors = [
        {
          href: '#workInterestTypesOther',
          text: 'Enter the type of work Ifereeca Peigh is interested in',
        },
      ]

      // When
      await controller.submitWorkInterestTypesForm(req, res, next)

      // Then
      expect(res.redirectWithErrors).toHaveBeenCalledWith(
        `/prisoners/A1234BC/create-induction/${journeyId}/work-interest-types`,
        expectedErrors,
      )
      expect(req.session.workInterestTypesForm).toEqual(invalidWorkInterestTypesForm)
      expect(req.journeyData.inductionDto).toEqual(inductionDto)
    })

    it('should update InductionDto and redirect to Work Interests Details', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      inductionDto.futureWorkInterests = undefined
      req.journeyData.inductionDto = inductionDto

      const workInterestTypesForm = {
        workInterestTypes: [WorkInterestTypeValue.DRIVING, WorkInterestTypeValue.OTHER],
        workInterestTypesOther: 'Natural world',
      }
      req.body = workInterestTypesForm
      req.session.workInterestTypesForm = undefined

      const expectedNextPage = `/prisoners/A1234BC/create-induction/${journeyId}/work-interest-roles`

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
      expect(req.session.workInterestTypesForm).toBeUndefined()
    })

    it('should update inductionDto and redirect to Check Your Answers given previous page was Check Your Answers', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      inductionDto.futureWorkInterests = undefined
      req.journeyData.inductionDto = inductionDto

      const workInterestTypesForm = {
        workInterestTypes: [WorkInterestTypeValue.DRIVING, WorkInterestTypeValue.OTHER],
        workInterestTypesOther: 'Natural world',
      }
      req.body = workInterestTypesForm
      req.session.workInterestTypesForm = undefined

      const expectedFutureWorkInterests: Array<FutureWorkInterestDto> = [
        { workType: WorkInterestTypeValue.DRIVING, workTypeOther: undefined, role: undefined },
        { workType: WorkInterestTypeValue.OTHER, workTypeOther: 'Natural world', role: undefined },
      ]

      req.session.pageFlowHistory = {
        pageUrls: [
          `/prisoners/A1234BC/create-induction/${journeyId}/check-your-answers`,
          `/prisoners/A1234BC/create-induction/${journeyId}/work-interest-types`,
        ],
        currentPageIndex: 1,
      }

      // When
      await controller.submitWorkInterestTypesForm(req, res, next)

      // Then
      const futureWorkInterestsOnInduction: Array<FutureWorkInterestDto> =
        req.journeyData.inductionDto.futureWorkInterests.interests
      expect(futureWorkInterestsOnInduction).toEqual(expectedFutureWorkInterests)
      expect(res.redirect).toHaveBeenCalledWith(`/prisoners/A1234BC/create-induction/${journeyId}/check-your-answers`)
      expect(req.session.workInterestTypesForm).toBeUndefined()
    })
  })
})
