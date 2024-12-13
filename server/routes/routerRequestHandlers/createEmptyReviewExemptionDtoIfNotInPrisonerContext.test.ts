import { Request, Response } from 'express'
import { Session } from 'express-session'
import type { ReviewExemptionDto } from 'dto'
import { getPrisonerContext } from '../../data/session/prisonerContexts'
import createEmptyReviewExemptionDtoIfNotInPrisonerContext from './createEmptyReviewExemptionDtoIfNotInPrisonerContext'
import aValidReviewExemptionDto from '../../testsupport/reviewExemptionDtoTestDataBuilder'

describe('createEmptyReviewExemptionDtoIfNotInPrisonerContext', () => {
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

  it('should create an empty ReviewExemptionDto for the prisoner given there is not one in the prisoner context', async () => {
    // Given
    const prisonNumber = 'A1234BC'
    req.params.prisonNumber = prisonNumber

    getPrisonerContext(req.session, prisonNumber).reviewExemptionDto = undefined

    const expectedReviewExemptionDto = { prisonNumber } as ReviewExemptionDto

    // When
    await createEmptyReviewExemptionDtoIfNotInPrisonerContext(req, res, next)

    // Then
    expect(next).toHaveBeenCalled()
    expect(getPrisonerContext(req.session, prisonNumber).reviewExemptionDto).toEqual(expectedReviewExemptionDto)
  })

  it('should not create an ReviewExemptionDto for the prisoner given there is already one in the prisoner context', async () => {
    // Given
    const prisonNumber = 'A1234BC'
    req.params.prisonNumber = prisonNumber

    const expectedReviewExemptionDto = aValidReviewExemptionDto()
    getPrisonerContext(req.session, prisonNumber).reviewExemptionDto = expectedReviewExemptionDto

    // When
    await createEmptyReviewExemptionDtoIfNotInPrisonerContext(req, res, next)

    // Then
    expect(next).toHaveBeenCalled()
    expect(getPrisonerContext(req.session, prisonNumber).reviewExemptionDto).toEqual(expectedReviewExemptionDto)
  })
})
