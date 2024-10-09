import createError from 'http-errors'
import { Request, Response } from 'express'
import aValidPrisonerSummary from '../testsupport/prisonerSummaryTestDataBuilder'
import checkPrisonerInCaseload from './checkPrisonerInCaseloadMiddleware'

describe('checkPrisonerInCaseloadMiddleware', () => {
  const prisonNumber = 'A1234BC'
  const prisonersPrisonId = 'BXI'

  const req = {} as unknown as Request
  const res = {
    locals: {},
  } as unknown as Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
    res.locals.user = hmppsUser()
    res.locals.prisonerSummary = aValidPrisonerSummary(prisonNumber, prisonersPrisonId)
  })

  it('should return an error given no prisoner summary on res.locals', async () => {
    // Given
    const middleware = checkPrisonerInCaseload()
    res.locals.prisonerSummary = undefined

    const expectedError = createError(500, 'CheckPrisonerInCaseloadMiddleware: No PrisonerSummary found on res.locals')

    // When
    await middleware(req, res, next)

    // Then
    expect(next).toHaveBeenCalledWith(expectedError)
  })

  it('should call next given the prisoner is in one of the the users caseloads', async () => {
    // Given
    const middleware = checkPrisonerInCaseload()

    const user = hmppsUser({ activeCaseLoadId: 'LEI', caseLoadIds: ['LEI', 'BXI'] })
    res.locals.user = user

    // When
    await middleware(req, res, next)

    // Then
    expect(next).toHaveBeenCalledWith()
  })

  it('should return an error given the prisoner is not in one of the the users caseloads', async () => {
    // Given
    const middleware = checkPrisonerInCaseload()

    const user = hmppsUser({ activeCaseLoadId: 'LEI', caseLoadIds: ['LEI'] })
    res.locals.user = user

    const expectedError = createError(404, 'CheckPrisonerInCaseloadMiddleware: Prisoner not in caseloads')

    // When
    await middleware(req, res, next)

    // Then
    expect(next).toHaveBeenCalledWith(expectedError)
  })

  it('should call next given the prisoner is not in one of the the users caseloads but the user is a Global Search user and the middleware is configured with to allow global', async () => {
    // Given
    const middleware = checkPrisonerInCaseload({ allowGlobal: true })

    const user = hmppsUser({ activeCaseLoadId: 'LEI', caseLoadIds: ['LEI'], roles: ['ROLE_GLOBAL_SEARCH'] })
    res.locals.user = user

    // When
    await middleware(req, res, next)

    // Then
    expect(next).toHaveBeenCalledWith()
  })

  it('should call next given the prisoner is not in one of the the users caseloads but the user is both a Global Search and POM user and the middleware is configured with to allow global pom', async () => {
    // Given
    const middleware = checkPrisonerInCaseload({ allowGlobal: false, allowGlobalPom: true })

    const user = hmppsUser({
      activeCaseLoadId: 'LEI',
      caseLoadIds: ['LEI'],
      roles: ['ROLE_GLOBAL_SEARCH', 'ROLE_POM'],
    })
    res.locals.user = user

    // When
    await middleware(req, res, next)

    // Then
    expect(next).toHaveBeenCalledWith()
  })

  it('should return an error given middleware is configured for active caseload only and the prisoner is not in the users active caseload', async () => {
    // Given
    const middleware = checkPrisonerInCaseload({ activeCaseloadOnly: true })

    const user = hmppsUser({ activeCaseLoadId: 'LEI', caseLoadIds: ['LEI', 'BXI'] })
    res.locals.user = user

    const expectedError = createError(404, 'CheckPrisonerInCaseloadMiddleware: Prisoner not in active caseload')

    // When
    await middleware(req, res, next)

    // Then
    expect(next).toHaveBeenCalledWith(expectedError)
  })

  describe('restricted patients', () => {
    const middleware = checkPrisonerInCaseload()

    beforeEach(() => {
      const prisonerSummary = aValidPrisonerSummary(prisonNumber, prisonersPrisonId)
      prisonerSummary.restrictedPatient = true
      prisonerSummary.supportingPrisonId = 'LEI'
      res.locals.prisonerSummary = prisonerSummary
    })

    it('should call next given prisoner is a restricted patient and the user is a POM user and the prisoners supporting prison id is one of the users caseloads', async () => {
      // Given
      const user = hmppsUser({ activeCaseLoadId: 'BXI', caseLoadIds: ['LEI', 'BXI'], roles: ['ROLE_POM'] })
      res.locals.user = user

      // When
      await middleware(req, res, next)

      // Then
      expect(next).toHaveBeenCalledWith()
    })

    it('should call next given prisoner is a restricted patient and the user is an Inactive Bookings user and the prisoners supporting prison id is one of the users caseloads', async () => {
      // Given
      const user = hmppsUser({
        activeCaseLoadId: 'BXI',
        caseLoadIds: ['LEI', 'BXI'],
        roles: ['ROLE_INACTIVE_BOOKINGS'],
      })
      res.locals.user = user

      // When
      await middleware(req, res, next)

      // Then
      expect(next).toHaveBeenCalledWith()
    })

    it('should call next given prisoner is a restricted patient and the user is an Inactive Bookings user and the prisoners supporting prison id is not one of the users caseloads', async () => {
      // Given
      const user = hmppsUser({
        activeCaseLoadId: 'BXI',
        caseLoadIds: ['BXI'],
        roles: ['ROLE_INACTIVE_BOOKINGS'],
      })
      res.locals.user = user

      // When
      await middleware(req, res, next)

      // Then
      expect(next).toHaveBeenCalledWith()
    })

    it('should return an error given prisoner is a restricted patient and user is not a POM user', async () => {
      // Given
      const user = hmppsUser({ activeCaseLoadId: 'LEI', caseLoadIds: ['LEI'], roles: ['ROLE_NOT_A_POM_USER'] })
      res.locals.user = user

      const expectedError = createError(404, 'CheckPrisonerInCaseloadMiddleware: Prisoner is restricted patient')

      // When
      await middleware(req, res, next)

      // Then
      expect(next).toHaveBeenCalledWith(expectedError)
    })

    it('should return an error given prisoner is a restricted patient and user is a POM user but not for the prisoners supporting prison id', async () => {
      // Given
      const user = hmppsUser({ activeCaseLoadId: 'BXI', caseLoadIds: ['BXI'], roles: ['ROLE_POM'] })
      res.locals.user = user

      const expectedError = createError(404, 'CheckPrisonerInCaseloadMiddleware: Prisoner is restricted patient')

      // When
      await middleware(req, res, next)

      // Then
      expect(next).toHaveBeenCalledWith(expectedError)
    })
  })

  describe('prisoners with inactive bookings', () => {
    describe('prisoners with a prisonId of OUT', () => {
      beforeEach(() => {
        const prisonerSummary = aValidPrisonerSummary(prisonNumber, 'OUT')
        res.locals.prisonerSummary = prisonerSummary
      })

      describe('middleware is configured to allow inactive', () => {
        const middleware = checkPrisonerInCaseload({ allowInactive: true })

        it('should call next given prisoner has prisonId OUT and user is an Inactive Bookings user and middleware is configured to allow inactive', async () => {
          // Given
          const user = hmppsUser({ roles: ['ROLE_INACTIVE_BOOKINGS'] })
          res.locals.user = user

          // When
          await middleware(req, res, next)

          // Then
          expect(next).toHaveBeenCalledWith()
        })

        it('should return error given prisoner has prisonId OUT and user is not an Inactive Bookings user', async () => {
          // Given
          const user = hmppsUser()
          res.locals.user = user

          const expectedError = createError(404, 'CheckPrisonerInCaseloadMiddleware: Prisoner is inactive [OUT]')

          // When
          await middleware(req, res, next)

          // Then
          expect(next).toHaveBeenCalledWith(expectedError)
        })
      })

      describe('middleware is configured to not allow inactive', () => {
        const middleware = checkPrisonerInCaseload({ allowInactive: false })

        it('should return error given prisoner has prisonId OUT and user is Inactive Bookings user but middleware is configured to not allow inactive', async () => {
          // Given
          const user = hmppsUser({ roles: ['ROLE_INACTIVE_BOOKINGS'] })
          res.locals.user = user

          const expectedError = createError(404, 'CheckPrisonerInCaseloadMiddleware: Prisoner is inactive [OUT]')

          // When
          await middleware(req, res, next)

          // Then
          expect(next).toHaveBeenCalledWith(expectedError)
        })
      })
    })

    describe('prisoners with a prisonId of TRN', () => {
      beforeEach(() => {
        const prisonerSummary = aValidPrisonerSummary(prisonNumber, 'TRN')
        res.locals.prisonerSummary = prisonerSummary
      })

      describe('middleware is configured to allow inactive', () => {
        const middleware = checkPrisonerInCaseload({ allowInactive: true })

        it('should call next given prisoner has prisonId TRN and user is an Inactive Bookings user and middleware is configured to allow inactive', async () => {
          // Given
          const user = hmppsUser({ roles: ['ROLE_INACTIVE_BOOKINGS'] })
          res.locals.user = user

          // When
          await middleware(req, res, next)

          // Then
          expect(next).toHaveBeenCalledWith()
        })

        it('should call next given prisoner has prisonId TRN and user is a Global Search user and middleware is configured to allow inactive', async () => {
          // Given
          const user = hmppsUser({ roles: ['ROLE_GLOBAL_SEARCH'] })
          res.locals.user = user

          // When
          await middleware(req, res, next)

          // Then
          expect(next).toHaveBeenCalledWith()
        })

        it('should return error given prisoner has prisonId TRN and user is neither a Global Search or Inactive Bookings user and middleware is configured to allow inactive', async () => {
          // Given
          const user = hmppsUser()
          res.locals.user = user

          const expectedError = createError(404, 'CheckPrisonerInCaseloadMiddleware: Prisoner is inactive [TRN]')

          // When
          await middleware(req, res, next)

          // Then
          expect(next).toHaveBeenCalledWith(expectedError)
        })
      })

      describe('middleware is configured to not allow inactive', () => {
        const middleware = checkPrisonerInCaseload({ allowInactive: false })

        it('should return error given prisoner has prisonId OUT and user is Inactive Bookings user but middleware is configured to not allow inactive', async () => {
          // Given
          const user = hmppsUser({ roles: ['ROLE_INACTIVE_BOOKINGS'] })
          res.locals.user = user

          const expectedError = createError(404, 'CheckPrisonerInCaseloadMiddleware: Prisoner is inactive [TRN]')

          // When
          await middleware(req, res, next)

          // Then
          expect(next).toHaveBeenCalledWith(expectedError)
        })

        it('should return error given prisoner has prisonId OUT and user is Global Search user but middleware is configured to not allow inactive', async () => {
          // Given
          const user = hmppsUser({ roles: ['ROLE_GLOBAL_SEARCH'] })
          res.locals.user = user

          const expectedError = createError(404, 'CheckPrisonerInCaseloadMiddleware: Prisoner is inactive [TRN]')

          // When
          await middleware(req, res, next)

          // Then
          expect(next).toHaveBeenCalledWith(expectedError)
        })
      })
    })
  })
})

function hmppsUser(options?: {
  activeCaseLoadId?: string
  caseLoadIds?: Array<string>
  roles?: Array<string>
  authSource?: string
}) {
  return {
    activeCaseLoadId: options?.activeCaseLoadId || 'BXI',
    caseLoadIds: options?.caseLoadIds || ['BXI'],
    roles: options?.roles || ['SOME_ROLE'],
    authSource: options?.authSource || 'nomis',
  }
}
