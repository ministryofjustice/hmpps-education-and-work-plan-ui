import { Request, Response } from 'express'
import { validate } from '../../routerRequestHandlers/validationMiddleware'
import inductionNoteSchema from './inductionNoteSchema'
import type { Error } from '../../../filters/findErrorFilter'

describe('inductionNoteSchema', () => {
  const req = {
    originalUrl: '',
    body: {},
    flash: jest.fn(),
  } as unknown as Request
  const res = {
    redirectWithErrors: jest.fn(),
  } as unknown as Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
    req.originalUrl = '/prisoners/A1234BC/induction/39e5a1a9-0f69-466c-8223-18a2e1cb2d78/notes'
  })

  it('happy path - validation passes', async () => {
    // Given
    const requestBody = { notes: 'Prisoner is progressing well.' }
    req.body = requestBody

    // When
    await validate(inductionNoteSchema)(req, res, next)

    // Then
    expect(req.body).toEqual(requestBody)
    expect(next).toHaveBeenCalled()
    expect(req.flash).not.toHaveBeenCalled()
    expect(res.redirectWithErrors).not.toHaveBeenCalled()
  })

  it('sad path - notes field length validation fails', async () => {
    // Given
    const requestBody = { notes: 'a'.repeat(513) }
    req.body = requestBody

    const expectedErrors: Array<Error> = [
      {
        href: `#notes`,
        text: 'Induction note must be 512 characters or less',
      },
    ]
    const expectedInvalidForm = JSON.stringify(requestBody)

    // When
    await validate(inductionNoteSchema)(req, res, next)

    // Then
    expect(req.body).toEqual(requestBody)
    expect(next).not.toHaveBeenCalled()
    expect(req.flash).toHaveBeenCalledWith('invalidForm', expectedInvalidForm)
    expect(res.redirectWithErrors).toHaveBeenCalledWith(
      '/prisoners/A1234BC/induction/39e5a1a9-0f69-466c-8223-18a2e1cb2d78/notes',
      expectedErrors,
    )
  })
})
