import { Request, Response } from 'express'
import { v4 as uuidV4 } from 'uuid'
import { startOfDay } from 'date-fns'
import type { WhoCompletedInductionForm } from 'inductionForms'
import WhoCompletedInductionCreateController from './whoCompletedInductionCreateController'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import SessionCompletedByValue from '../../../enums/sessionCompletedByValue'
import { aValidInductionDto } from '../../../testsupport/inductionDtoTestDataBuilder'

describe('whoCompletedInductionController', () => {
  const controller = new WhoCompletedInductionCreateController()

  const journeyId = uuidV4()
  const prisonNumber = 'A1234BC'
  const prisonerSummary = aValidPrisonerSummary({ prisonNumber })

  const req = {
    session: {},
    journeyData: {},
    body: {},
    params: { prisonNumber, journeyId },
    originalUrl: `/prisoners/${prisonNumber}/create-induction/${journeyId}/who-completed-induction`,
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

  describe('getWhoCompletedInductionView', () => {
    it(`should get 'who completed induction' view given form is not res.locals.invalidForm, but DTO is on the context`, async () => {
      // Given
      const inductionDto = {
        ...aValidInductionDto(),
        completedBy: SessionCompletedByValue.MYSELF,
        completedByOtherFullName: undefined as string,
        completedByOtherJobRole: undefined as string,
        inductionDate: startOfDay('2024-03-09'),
      }
      req.journeyData.inductionDto = inductionDto
      res.locals.invalidForm = undefined

      const expectedForm: WhoCompletedInductionForm = {
        completedBy: SessionCompletedByValue.MYSELF,
        completedByOtherFullName: undefined,
        completedByOtherJobRole: undefined,
        inductionDate: '9/3/2024',
      }

      const expectedView = {
        prisonerSummary,
        form: expectedForm,
      }

      // When
      await controller.getWhoCompletedInductionView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/induction/whoCompletedInduction/index', expectedView)
    })

    it(`should get 'who completed induction' view given form is on res.locals.invalidForm`, async () => {
      // Given
      const expectedForm: WhoCompletedInductionForm = {
        completedBy: SessionCompletedByValue.MYSELF,
        inductionDate: '20/3/2024',
      }

      res.locals.invalidForm = expectedForm

      const expectedView = {
        prisonerSummary,
        form: expectedForm,
      }

      // When
      await controller.getWhoCompletedInductionView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/induction/whoCompletedInduction/index', expectedView)
    })
  })

  describe('submitWhoCompletedInductionForm', () => {
    it('should redirect to induction notes page given form submitted successfully and previous page was not check-your-answers', async () => {
      // Given
      req.query = {}

      const inductionDto = {
        ...aValidInductionDto(),
        completedBy: undefined as SessionCompletedByValue,
        completedByOtherFullName: undefined as string,
        completedByOtherJobRole: undefined as string,
        inductionDate: undefined as Date,
      }
      req.journeyData.inductionDto = inductionDto

      res.locals.invalidForm = undefined

      const validForm: WhoCompletedInductionForm = {
        completedBy: SessionCompletedByValue.SOMEBODY_ELSE,
        completedByOtherFullName: 'Joe Bloggs',
        completedByOtherJobRole: 'Peer mentor',
        inductionDate: '9/3/2024',
      }
      req.body = validForm

      const expectedInductionDto = {
        ...req.journeyData.inductionDto,
        completedBy: SessionCompletedByValue.SOMEBODY_ELSE,
        completedByOtherFullName: 'Joe Bloggs',
        completedByOtherJobRole: 'Peer mentor',
        inductionDate: startOfDay('2024-03-09'),
      }

      // When
      await controller.submitWhoCompletedInductionForm(req, res, next)

      // Then
      expect(res.redirect).toHaveBeenCalledWith(`/prisoners/A1234BC/create-induction/${journeyId}/notes`)
      expect(res.locals.invalidForm).toBeUndefined()
      expect(req.journeyData.inductionDto).toEqual(expectedInductionDto)
    })

    it('should redirect to induction check-your-answers page given form submitted successfully and previous page was check-your-answers', async () => {
      // Given
      req.query = { submitToCheckAnswers: 'true' }

      res.locals.invalidForm = undefined

      const inductionDto = {
        ...aValidInductionDto(),
        completedBy: SessionCompletedByValue.MYSELF,
        completedByOtherFullName: undefined as string,
        completedByOtherJobRole: undefined as string,
        inductionDate: startOfDay('2024-03-07'),
      }
      req.journeyData.inductionDto = inductionDto

      const validForm: WhoCompletedInductionForm = {
        completedBy: SessionCompletedByValue.SOMEBODY_ELSE,
        completedByOtherFullName: 'Joe Bloggs',
        completedByOtherJobRole: 'Peer mentor',
        inductionDate: '9/3/2024',
      }
      req.body = validForm

      const expectedInductionDto = {
        ...req.journeyData.inductionDto,
        completedBy: SessionCompletedByValue.SOMEBODY_ELSE,
        completedByOtherFullName: 'Joe Bloggs',
        completedByOtherJobRole: 'Peer mentor',
        inductionDate: startOfDay('2024-03-09'),
      }

      // When
      await controller.submitWhoCompletedInductionForm(req, res, next)

      // Then
      expect(res.redirect).toHaveBeenCalledWith(`/prisoners/A1234BC/create-induction/${journeyId}/check-your-answers`)
      expect(res.locals.invalidForm).toBeUndefined()
      expect(req.journeyData.inductionDto).toEqual(expectedInductionDto)
    })
  })
})
