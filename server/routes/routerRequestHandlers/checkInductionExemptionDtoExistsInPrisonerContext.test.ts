import { Request, Response } from 'express'
import { Session } from 'express-session'
import { getPrisonerContext } from '../../data/session/prisonerContexts'
import checkInductionExemptionDtoExistsInPrisonerContext from './checkInductionExemptionDtoExistsInPrisonerContext'
import aValidInductionExemptionDto from '../../testsupport/inductionExemptionDtoTestDataBuilder'

describe('checkInductionExemptionDtoExistsInPrisonerContext', () => {
  const req = {
    session: {} as Session,
    params: {} as Record<string, string>,
  } as unknown as Request
  const res = {
    redirect: jest.fn(),
  } as unknown as Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
    req.session = {} as Session
    req.params = {} as Record<string, string>
  })

  it(`should invoke next handler given InductionExemptionDto exists in prisoner context`, async () => {
    // Given
    const prisonNumber = 'A1234BC'
    req.params.prisonNumber = prisonNumber
    getPrisonerContext(req.session, prisonNumber).inductionExemptionDto = aValidInductionExemptionDto()

    // When
    await checkInductionExemptionDtoExistsInPrisonerContext(req, res, next)

    // Then
    expect(next).toHaveBeenCalled()
    expect(res.redirect).not.toHaveBeenCalled()
  })

  it(`should redirect to Overview page given no InductionExemptionDto exists in prisoner context`, async () => {
    // Given
    const prisonNumber = 'A1234BC'
    req.params.prisonNumber = prisonNumber

    getPrisonerContext(req.session, prisonNumber).inductionExemptionDto = undefined

    // When
    await checkInductionExemptionDtoExistsInPrisonerContext(req, res, next)

    // Then
    expect(res.redirect).toHaveBeenCalledWith(`/plan/${prisonNumber}/view/overview`)
    expect(next).not.toHaveBeenCalled()
  })
})
