import { Request, Response } from 'express'
import { forAllGetRequests, forMatchingGetRequests } from './requestMatchers'

describe('requestMatchers', () => {
  const request = {
    method: '',
    path: '/education-support-plan/A1234BC/create/88236df8-b1b3-46bf-9111-a568d017d6e9/who-created-the-plan',
  } as unknown as Request
  const response = {} as unknown as Response
  const next = jest.fn()

  const middleware = jest.fn()

  beforeEach(() => {
    request.method = ''
    jest.resetAllMocks()
  })

  describe('forAllGetRequests', () => {
    it('should execute the middleware given the request method is GET', () => {
      // Given
      request.method = 'GET'

      // When
      forAllGetRequests(middleware)(request, response, next)

      // Then
      expect(middleware).toHaveBeenCalledTimes(1)
      expect(middleware).toHaveBeenCalledWith(request, response, next)
      expect(next).not.toHaveBeenCalled()
    })

    it.each(['POST', 'PUT', 'DELETE', 'HEAD', 'TRACE'])(
      'should not execute the middleware given the request method is %s',
      method => {
        // Given
        request.method = method

        // When
        forAllGetRequests(middleware)(request, response, next)

        // Then
        expect(middleware).not.toHaveBeenCalled()
        expect(next).toHaveBeenCalledTimes(1)
      },
    )
  })

  describe('forMatchingGetRequests', () => {
    describe('at least one matching route supplied', () => {
      it('should execute the middleware given one of the routes matches and the request method is GET', () => {
        // Given
        request.method = 'GET'

        const routes = [
          '/education-support-plan/:prisonNumber/create/:journeyId/who-created-the-plan', // matching route
          '/education-support-plan/:prisonNumber/create', // non-matching route
          '/profile/:prisonNumber/challenges-and-support', // non-matching route
          '/search', // non-matching route
        ]

        // When
        forMatchingGetRequests(middleware, routes)(request, response, next)

        // Then
        expect(middleware).toHaveBeenCalledTimes(1)
        expect(middleware).toHaveBeenCalledWith(request, response, next)
        expect(next).not.toHaveBeenCalled()
      })

      it.each(['POST', 'PUT', 'DELETE', 'HEAD', 'TRACE'])(
        'should not execute the middleware given one of the routes matches and the request method is %s',
        method => {
          // Given
          request.method = method

          const routes = [
            '/education-support-plan/:prisonNumber/create/:journeyId/who-created-the-plan', // matching route
            '/education-support-plan/:prisonNumber/create', // non-matching route
            '/profile/:prisonNumber/challenges-and-support', // non-matching route
            '/search', // non-matching route
          ]

          // When
          forMatchingGetRequests(middleware, routes)(request, response, next)

          // Then
          expect(middleware).not.toHaveBeenCalled()
          expect(next).toHaveBeenCalledTimes(1)
        },
      )
    })

    describe('no matching route supplied', () => {
      it('should not execute the middleware given none of the routes match and the request method is GET', () => {
        // Given
        request.method = 'GET'

        const routes = [
          '/profile/:prisonNumber/challenges-and-support', // non-matching route
          '/education-support-plan/:prisonNumber/create', // non-matching route
          '/search', // non-matching route
        ]

        // When
        forMatchingGetRequests(middleware, routes)(request, response, next)

        // Then
        expect(middleware).not.toHaveBeenCalled()
        expect(next).toHaveBeenCalledTimes(1)
      })

      it.each(['POST', 'PUT', 'DELETE', 'HEAD', 'TRACE'])(
        'should not execute the middleware given none of the routes matches and the request method is %s',
        method => {
          // Given
          request.method = method

          const routes = [
            '/profile/:prisonNumber/challenges-and-support', // non-matching route
            '/education-support-plan/:prisonNumber/create', // non-matching route
            '/search', // non-matching route
          ]

          // When
          forMatchingGetRequests(middleware, routes)(request, response, next)

          // Then
          expect(middleware).not.toHaveBeenCalled()
          expect(next).toHaveBeenCalledTimes(1)
        },
      )
    })

    describe('no routes supplied', () => {
      it('should execute the middleware given the request method is GET', () => {
        // Given
        request.method = 'GET'

        // When
        forMatchingGetRequests(middleware)(request, response, next)

        // Then
        expect(middleware).toHaveBeenCalledTimes(1)
        expect(middleware).toHaveBeenCalledWith(request, response, next)
        expect(next).not.toHaveBeenCalled()
      })

      it.each(['POST', 'PUT', 'DELETE', 'HEAD', 'TRACE'])(
        'should not execute the middleware given the request method is %s',
        method => {
          // Given
          request.method = method

          // When
          forMatchingGetRequests(middleware)(request, response, next)

          // Then
          expect(middleware).not.toHaveBeenCalled()
          expect(next).toHaveBeenCalledTimes(1)
        },
      )
    })
  })
})
