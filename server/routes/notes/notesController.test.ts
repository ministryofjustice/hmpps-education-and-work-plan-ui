import { Request, Response } from 'express'
import aValidPrisonerSummary from '../../testsupport/prisonerSummaryTestDataBuilder'
import NotesController from './notesController'

describe('notesController', () => {
  const controller = new NotesController()

  const prisonNumber = 'A1234BC'
  const expectedPrisonId = 'MDI'
  const prisonerSummary = aValidPrisonerSummary(prisonNumber, expectedPrisonId)

  const req = {
    params: { prisonNumber },
  } as unknown as Request
  const res = {
    redirect: jest.fn(),
    render: jest.fn(),
    locals: { prisonerSummary },
  } as unknown as Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should get prisoner notes view', async () => {
    // Given
    const expectedView = { prisonerSummary }
    // When
    await controller.getPrisonerNotesView(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith('pages/notes/prisonerNotesList/index', expectedView)
  })
})
