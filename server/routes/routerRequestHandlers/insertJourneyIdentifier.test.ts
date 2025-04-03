import { Request, Response } from 'express'
import { validate } from 'uuid'
import insertJourneyIdentifier from './insertJourneyIdentifier'

describe('insertJourneyIdentifier', () => {
  const redirectFunction = jest.fn()
  const req = {} as unknown as Request
  const res = {
    redirect: redirectFunction,
  } as unknown as Response
  const next = jest.fn()

  beforeEach(() => {
    req.originalUrl = ''
    req.query = {}
    res.redirect = redirectFunction
    jest.resetAllMocks()
  })

  it('should insert journey ID and redirect given request url does not contain journey ID at specified position', async () => {
    // Given
    const requestHandler = insertJourneyIdentifier({ insertIdAfterElement: 3 })
    req.originalUrl = '/prisoners/A1234BC/create-induction/hoping-to-work-on-release'

    // When
    await requestHandler(req, res, next)

    // Then
    expect(res.redirect).toHaveBeenCalled()
    const actualRedirectUrl: string = redirectFunction.mock.calls[0][0]
    expect(actualRedirectUrl).toMatch(/^\/prisoners\/A1234BC\/create-induction\/.*\/hoping-to-work-on-release$/)
    const journeyId = actualRedirectUrl.split('/')[4]
    expect(validate(journeyId)).toBe(true)
    expect(next).not.toHaveBeenCalled()
  })

  it('should not insert journey ID and redirect given request url already contains a journey ID at specified position', async () => {
    // Given
    const requestHandler = insertJourneyIdentifier({ insertIdAfterElement: 3 })
    req.originalUrl =
      '/prisoners/A1234BC/create-induction/473e9ee4-37d6-4afb-92a2-5729b10cc60f/hoping-to-work-on-release'

    // When
    await requestHandler(req, res, next)

    // Then
    expect(redirectFunction).not.toHaveBeenCalled()
    expect(next).toHaveBeenCalled()
  })
})
