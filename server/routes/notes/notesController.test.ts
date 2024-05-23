import { Request, Response } from 'express'
import aValidPrisonerSummary from '../../testsupport/prisonerSummaryTestDataBuilder'
import NotesController from './notesController'

describe('notesController', () => {
  const controller = new NotesController()

  let req: Request
  const res = {
    redirect: jest.fn(),
    render: jest.fn(),
  } as unknown as Response
  const next = jest.fn()

  const prisonNumber = 'A1234BC'
  const expectedPrisonId = 'MDI'
  const prisonerSummary = aValidPrisonerSummary(prisonNumber, expectedPrisonId)

  beforeEach(() => {
    jest.resetAllMocks()

    req = {
      session: { prisonerSummary },
      body: {},
      user: {},
      params: { prisonNumber },
      query: {},
    } as unknown as Request
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
