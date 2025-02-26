import { Request, Response } from 'express'
import checkWhetherToShowServiceOnboardingBanner from './checkWhetherToShowServiceOnboardingBanner'
import ApplicationRole from '../enums/applicationRole'

describe('checkWhetherToShowServiceOnboardingBanner', () => {
  const req = {} as unknown as Request
  const res = {
    locals: {},
  } as unknown as Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
  })

  let savedActiveAgencies: string
  beforeAll(() => {
    savedActiveAgencies = process.env.ACTIVE_AGENCIES
  })
  afterAll(() => {
    process.env.ACTIVE_AGENCIES = savedActiveAgencies
  })

  // The ONLY condition where the flag should be set is when the user does not have one of our service roles AND the active caseload ID is not an enabled prison
  it('should set the flag given the user does not have our role and the users active caseload ID is not of the active prisons', async () => {
    // Given
    res.locals.user = hmppsUser({ activeCaseLoadId: 'BXI', roles: ['SOME_ROLE'] })
    process.env.ACTIVE_AGENCIES = 'LFI, HCI'

    // When
    await checkWhetherToShowServiceOnboardingBanner(req, res, next)

    // Then
    expect(res.locals.showServiceOnboardingBanner).toEqual(true)
    expect(next).toHaveBeenCalled()
  })

  it.each(Object.keys(ApplicationRole))(
    'should not set the flag given the user has role %s and the users active caseload ID is one of the active prisons',
    async role => {
      // Given
      res.locals.user = hmppsUser({ activeCaseLoadId: 'BXI', roles: [role] })
      process.env.ACTIVE_AGENCIES = 'LFI, BXI, HCI'

      // When
      await checkWhetherToShowServiceOnboardingBanner(req, res, next)

      // Then
      expect(res.locals.showServiceOnboardingBanner).toEqual(false)
      expect(next).toHaveBeenCalled()
    },
  )

  it.each(Object.keys(ApplicationRole))(
    'should not set the flag given the user has role %s and the active prisons includes the all prison wildcard',
    async role => {
      // Given
      res.locals.user = hmppsUser({ activeCaseLoadId: 'BXI', roles: [role] })
      process.env.ACTIVE_AGENCIES = '***'

      // When
      await checkWhetherToShowServiceOnboardingBanner(req, res, next)

      // Then
      expect(res.locals.showServiceOnboardingBanner).toEqual(false)
      expect(next).toHaveBeenCalled()
    },
  )

  it('should not set the flag given the user does not have our role and the users active caseload ID is one of the active prisons', async () => {
    // Given
    res.locals.user = hmppsUser({ activeCaseLoadId: 'BXI', roles: ['SOME_OTHER_ROLE'] })
    process.env.ACTIVE_AGENCIES = 'LFI, BXI, HCI'

    // When
    await checkWhetherToShowServiceOnboardingBanner(req, res, next)

    // Then
    expect(res.locals.showServiceOnboardingBanner).toEqual(false)
    expect(next).toHaveBeenCalled()
  })

  it('should not set the flag given the user does not have our role and the active prisons includes the all prison wildcard', async () => {
    // Given
    res.locals.user = hmppsUser({ activeCaseLoadId: 'BXI', roles: ['SOME_OTHER_ROLE'] })
    process.env.ACTIVE_AGENCIES = '***'

    // When
    await checkWhetherToShowServiceOnboardingBanner(req, res, next)

    // Then
    expect(res.locals.showServiceOnboardingBanner).toEqual(false)
    expect(next).toHaveBeenCalled()
  })

  it.each(Object.keys(ApplicationRole))(
    'should not set the flag given the user has role %s and the users active caseload ID is not of the active prisons',
    async role => {
      // Given
      res.locals.user = hmppsUser({ activeCaseLoadId: 'BXI', roles: [role] })
      process.env.ACTIVE_AGENCIES = 'LFI, HCI'

      // When
      await checkWhetherToShowServiceOnboardingBanner(req, res, next)

      // Then
      expect(res.locals.showServiceOnboardingBanner).toEqual(false)
      expect(next).toHaveBeenCalled()
    },
  )
})

function hmppsUser(options?: { activeCaseLoadId?: string; roles?: Array<string> }) {
  return {
    activeCaseLoadId: options?.activeCaseLoadId || 'BXI',
    roles: options?.roles || ['SOME_ROLE'],
  }
}
