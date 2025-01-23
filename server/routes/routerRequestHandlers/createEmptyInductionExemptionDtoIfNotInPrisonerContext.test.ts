import { Request, Response } from 'express'
import { Session } from 'express-session'
import type { InductionExemptionDto } from 'inductionDto'
import { getPrisonerContext } from '../../data/session/prisonerContexts'
import createEmptyInductionExemptionDtoIfNotInPrisonerContext from './createEmptyInductionExemptionDtoIfNotInPrisonerContext'
import aValidInductionExemptionDto from '../../testsupport/inductionExemptionDtoTestDataBuilder'

describe('createEmptyInductionExemptionDtoIfNotInPrisonerContext', () => {
  const req = {
    session: {} as Session,
    params: {} as Record<string, string>,
  } as unknown as Request
  const res = {} as unknown as Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
    req.session = {} as Session
    req.params = {} as Record<string, string>
  })

  it('should create an empty InductionExemptionDto for the prisoner given there is not one in the prisoner context', async () => {
    // Given
    const prisonNumber = 'A1234BC'
    req.params.prisonNumber = prisonNumber

    getPrisonerContext(req.session, prisonNumber).inductionExemptionDto = undefined

    const expectedInductionExemptionDto = { prisonNumber } as InductionExemptionDto

    // When
    await createEmptyInductionExemptionDtoIfNotInPrisonerContext(req, res, next)

    // Then
    expect(next).toHaveBeenCalled()
    expect(getPrisonerContext(req.session, prisonNumber).inductionExemptionDto).toEqual(expectedInductionExemptionDto)
  })

  it('should not create an InductionExemptionDto for the prisoner given there is already one in the prisoner context', async () => {
    // Given
    const prisonNumber = 'A1234BC'
    req.params.prisonNumber = prisonNumber

    const expectedInductionExemptionDto = aValidInductionExemptionDto()
    getPrisonerContext(req.session, prisonNumber).inductionExemptionDto = expectedInductionExemptionDto

    // When
    await createEmptyInductionExemptionDtoIfNotInPrisonerContext(req, res, next)

    // Then
    expect(next).toHaveBeenCalled()
    expect(getPrisonerContext(req.session, prisonNumber).inductionExemptionDto).toEqual(expectedInductionExemptionDto)
  })
})
