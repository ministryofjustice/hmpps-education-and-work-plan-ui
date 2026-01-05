import { Request, Response } from 'express'
import { checkRedirectAtEndOfJourneyIsNotPending } from './checkRedirectAtEndOfJourneyIsNotPending'

describe('checkRedirectAtEndOfJourneyIsNotPending', () => {
  const prisonNumber = 'A1234GC'
  const goalReference = 'af53926a-f24f-4baf-8b74-e3a2d473012f'

  const flash = jest.fn()
  const req = {
    params: { prisonNumber, goalReference },
    flash,
  } as unknown as Request
  const res = {
    redirect: jest.fn(),
  } as unknown as Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should redirect given flag is set on flash scope', async () => {
    // Given
    const requestHandler = checkRedirectAtEndOfJourneyIsNotPending({
      journey: 'Archive Goal',
      redirectTo: '/plan/:prisonNumber/view/overview',
    })

    flash.mockReturnValue(['true'])

    // When
    await requestHandler(req, res, next)

    // Then
    expect(res.redirect).toHaveBeenCalledWith('/plan/A1234GC/view/overview')
    expect(next).not.toHaveBeenCalled()
    expect(flash).toHaveBeenCalledWith('pendingRedirectAtEndOfJourney')
  })

  it('should redirect given flag is set on flash scope and redirectTo has multiple parameters to resolve', async () => {
    // Given
    const requestHandler = checkRedirectAtEndOfJourneyIsNotPending({
      journey: 'Edit Goal',
      redirectTo: '/plan/:prisonNumber/goals/:goalReference',
    })

    flash.mockReturnValue(['true'])

    // When
    await requestHandler(req, res, next)

    // Then
    expect(res.redirect).toHaveBeenCalledWith('/plan/A1234GC/goals/af53926a-f24f-4baf-8b74-e3a2d473012f')
    expect(next).not.toHaveBeenCalled()
    expect(flash).toHaveBeenCalledWith('pendingRedirectAtEndOfJourney')
  })

  it('should redirect given flag is set on flash scope but redirectTo parameters could not be resolved', async () => {
    // Given
    const requestHandler = checkRedirectAtEndOfJourneyIsNotPending({
      journey: 'Edit Goal',
      redirectTo: '/plan/:prisonerNumber/view/overview',
    })

    flash.mockReturnValue(['true'])

    // When
    await requestHandler(req, res, next)

    // Then
    expect(res.redirect).toHaveBeenCalledWith('/plan/:prisonerNumber/view/overview')
    expect(next).not.toHaveBeenCalled()
    expect(flash).toHaveBeenCalledWith('pendingRedirectAtEndOfJourney')
  })

  it.each([
    //
    null,
    undefined,
    [],
    '',
    [''],
  ])('should not redirect given flag is not set on flash scope', async flashValue => {
    // Given
    const requestHandler = checkRedirectAtEndOfJourneyIsNotPending({
      journey: 'Archive Goal',
      redirectTo: '/plan/:prisonNumber/view/overview',
    })

    flash.mockReturnValue(flashValue)

    // When
    await requestHandler(req, res, next)

    // Then
    expect(res.redirect).not.toHaveBeenCalled()
    expect(next).toHaveBeenCalled()
    expect(flash).toHaveBeenCalledWith('pendingRedirectAtEndOfJourney')
  })
})
