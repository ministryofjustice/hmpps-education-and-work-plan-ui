import { Request, Response } from 'express'
import { v4 as uuidV4 } from 'uuid'
import type { InductionNoteForm } from 'inductionForms'
import InductionNoteCreateController from './inductionNoteCreateController'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import { aValidInductionDto } from '../../../testsupport/inductionDtoTestDataBuilder'

describe('inductionNoteController', () => {
  const controller = new InductionNoteCreateController()

  const journeyId = uuidV4()
  const prisonNumber = 'A1234BC'
  const prisonerSummary = aValidPrisonerSummary({ prisonNumber })

  const req = {
    session: {},
    journeyData: {},
    body: {},
    params: { prisonNumber, journeyId },
    originalUrl: `/prisoners/${prisonNumber}/create-induction/${journeyId}/notes`,
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

  describe('getInductionNoteView', () => {
    it(`should get 'induction note' view given there is no Induction form on res.locals.invalidForm`, async () => {
      // Given
      const inductionDto = {
        ...aValidInductionDto(),
        notes: 'Induction session went well and Chris is feeling quite positive about his future',
      }
      req.journeyData.inductionDto = inductionDto
      res.locals.invalidForm = undefined

      const expectedForm: InductionNoteForm = {
        notes: 'Induction session went well and Chris is feeling quite positive about his future',
      }

      const expectedView = {
        prisonerSummary,
        form: expectedForm,
      }

      // When
      await controller.getInductionNoteView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/induction/inductionNote/index', expectedView)
    })

    it(`should get 'induction note' view given form is already on res.locals.invalidForm`, async () => {
      // Given
      const expectedForm: InductionNoteForm = {
        notes: 'Induction session went well and Chris is feeling quite positive about his future',
      }

      res.locals.invalidForm = expectedForm

      const expectedView = {
        prisonerSummary,
        form: expectedForm,
      }

      // When
      await controller.getInductionNoteView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/induction/inductionNote/index', expectedView)
    })
  })

  describe('submitInductionNoteForm', () => {
    it('should redirect to check your answers page', async () => {
      // Given
      const inductionDto = {
        ...aValidInductionDto(),
        notes: undefined as string,
      }
      req.journeyData.inductionDto = inductionDto

      const validForm: InductionNoteForm = {
        notes: 'Induction session went well and Chris is feeling quite positive about his future',
      }
      req.body = validForm

      const expectedInductionDto = {
        ...req.journeyData.inductionDto,
        notes: 'Induction session went well and Chris is feeling quite positive about his future',
      }

      // When
      await controller.submitInductionNoteForm(req, res, next)

      // Then
      expect(res.redirect).toHaveBeenCalledWith(`/prisoners/A1234BC/create-induction/${journeyId}/check-your-answers`)
      expect(res.locals.invalidForm).toBeUndefined()
      expect(req.journeyData.inductionDto).toEqual(expectedInductionDto)
    })
  })
})
