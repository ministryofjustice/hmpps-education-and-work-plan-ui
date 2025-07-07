import { Request, Response } from 'express'
import { validate } from '../../routerRequestHandlers/validationMiddleware'
import reviewNoteSchema from './reviewNoteSchema'
import type { Error } from '../../../filters/findErrorFilter'

describe('reviewNoteSchema', () => {
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
    req.originalUrl = '/plan/A1234BC/39e5a1a9-0f69-466c-8223-18a2e1cb2d78/review/notes'
  })

  it('happy path - validation passes', async () => {
    // Given
    const requestBody = { notes: 'Prisoner is progressing well.' }
    req.body = requestBody

    // When
    await validate(reviewNoteSchema)(req, res, next)

    // Then
    expect(req.body).toEqual(requestBody)
    expect(next).toHaveBeenCalled()
    expect(req.flash).not.toHaveBeenCalled()
    expect(res.redirectWithErrors).not.toHaveBeenCalled()
  })

  it('happy path - validation passes with multi line text', async () => {
    // Given
    const requestBody = {
      notes: `Edfdau's review went well and he has made good progress on his goals.
Working in the prison kitchen is suiting Edfdau well and is allowing him to focus on more productive uses of his time whilst in prison.

We have agreed and set a new goal, and the next review is 1 year from now.
`,
    }
    req.body = requestBody

    // When
    await validate(reviewNoteSchema)(req, res, next)

    // Then
    expect(req.body).toEqual(requestBody)
    expect(next).toHaveBeenCalled()
    expect(req.flash).not.toHaveBeenCalled()
    expect(res.redirectWithErrors).not.toHaveBeenCalled()
  })

  it.each([
    //
    { notes: null },
    { notes: undefined },
    { notes: '' },
    { notes: '     ' },
    {
      notes: `
`,
    },
    {
      notes: `


`,
    },
  ])('sad path - notes field validation fails - %s', async requestBody => {
    // Given
    req.body = requestBody

    const expectedErrors: Array<Error> = [
      {
        href: '#notes',
        text: `You must add a note to this review`,
      },
    ]
    const expectedInvalidForm = JSON.stringify(requestBody)

    // When
    await validate(reviewNoteSchema)(req, res, next)

    // Then
    expect(req.body).toEqual(requestBody)
    expect(next).not.toHaveBeenCalled()
    expect(req.flash).toHaveBeenCalledWith('invalidForm', expectedInvalidForm)
    expect(res.redirectWithErrors).toHaveBeenCalledWith(
      '/plan/A1234BC/39e5a1a9-0f69-466c-8223-18a2e1cb2d78/review/notes',
      expectedErrors,
    )
  })

  it('sad path - notes field length validation fails', async () => {
    // Given
    const requestBody = { notes: 'a'.repeat(513) }
    req.body = requestBody

    const expectedErrors: Array<Error> = [
      {
        href: '#notes',
        text: 'Review note must be 512 characters or less',
      },
    ]
    const expectedInvalidForm = JSON.stringify(requestBody)

    // When
    await validate(reviewNoteSchema)(req, res, next)

    // Then
    expect(req.body).toEqual(requestBody)
    expect(next).not.toHaveBeenCalled()
    expect(req.flash).toHaveBeenCalledWith('invalidForm', expectedInvalidForm)
    expect(res.redirectWithErrors).toHaveBeenCalledWith(
      '/plan/A1234BC/39e5a1a9-0f69-466c-8223-18a2e1cb2d78/review/notes',
      expectedErrors,
    )
  })
})
