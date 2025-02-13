import { Request, Response } from 'express'
import type { InductionNoteForm } from 'inductionForms'
import InductionNoteCreateController from './inductionNoteCreateController'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import { getPrisonerContext } from '../../../data/session/prisonerContexts'
import { aValidInductionDto } from '../../../testsupport/inductionDtoTestDataBuilder'

describe('inductionNoteController', () => {
  const controller = new InductionNoteCreateController()

  const prisonNumber = 'A1234BC'
  const prisonerSummary = aValidPrisonerSummary({ prisonNumber })

  const req = {
    session: {},
    body: {},
    params: { prisonNumber },
    path: `/prisoners/${prisonNumber}/create-induction/notes`,
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

  describe('getInductionNoteView', () => {
    it(`should get 'induction note' view given form is not on the prisoner context, but DTO is on the context`, async () => {
      // Given
      const inductionDto = {
        ...aValidInductionDto(),
        notes: 'Induction session went well and Chris is feeling quite positive about his future',
      }
      req.session.inductionDto = inductionDto
      getPrisonerContext(req.session, prisonNumber).inductionNoteForm = undefined

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

    it(`should get 'induction note' view given form is already on the prisoner context`, async () => {
      // Given
      const expectedForm: InductionNoteForm = {
        notes: 'Induction session went well and Chris is feeling quite positive about his future',
      }

      getPrisonerContext(req.session, prisonNumber).inductionNoteForm = expectedForm

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
    it('should redirect to check your answers page given form submitted successfully', async () => {
      // Given
      const inductionDto = {
        ...aValidInductionDto(),
        notes: undefined as string,
      }
      req.session.inductionDto = inductionDto
      getPrisonerContext(req.session, prisonNumber).inductionNoteForm = undefined

      const validForm: InductionNoteForm = {
        notes: 'Induction session went well and Chris is feeling quite positive about his future',
      }
      req.body = validForm

      const expectedInductionDto = {
        ...req.session.inductionDto,
        notes: 'Induction session went well and Chris is feeling quite positive about his future',
      }

      // When
      await controller.submitInductionNoteForm(req, res, next)

      // Then
      expect(res.redirect).toHaveBeenCalledWith('/prisoners/A1234BC/create-induction/check-your-answers')
      expect(getPrisonerContext(req.session, prisonNumber).inductionNoteForm).toBeUndefined()
      expect(req.session.inductionDto).toEqual(expectedInductionDto)
    })
  })

  it('should redisplay page given form submitted with a note that exceeds maximum length', async () => {
    // Given
    const invalidForm: InductionNoteForm = {
      notes: 'a'.repeat(513),
    }
    getPrisonerContext(req.session, prisonNumber).inductionNoteForm = invalidForm

    req.body = invalidForm

    const expectedErrors = [{ href: '#notes', text: 'Induction note must be 512 characters or less' }]

    // When
    await controller.submitInductionNoteForm(req, res, next)

    // Then
    expect(res.redirectWithErrors).toHaveBeenCalledWith('/prisoners/A1234BC/create-induction/notes', expectedErrors)
    expect(getPrisonerContext(req.session, prisonNumber).inductionNoteForm).toEqual(invalidForm)
  })
})
