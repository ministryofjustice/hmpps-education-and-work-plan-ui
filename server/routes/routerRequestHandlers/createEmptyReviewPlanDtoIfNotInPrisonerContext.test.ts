import { Request, Response } from 'express'
import { Session } from 'express-session'
import type { ReviewPlanDto } from 'dto'
import { getPrisonerContext } from '../../data/session/prisonerContexts'
import createEmptyReviewPlanDtoIfNotInPrisonerContext from './createEmptyReviewPlanDtoIfNotInPrisonerContext'
import aValidReviewPlanDto from '../../testsupport/reviewPlanDtoTestDataBuilder'

describe('createEmptyReviewPlanDtoIfNotInPrisonerContext', () => {
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

  it('should create an empty ReviewPlanDto for the prisoner given there is not one in the prisoner context', async () => {
    // Given
    const prisonNumber = 'A1234BC'
    req.params.prisonNumber = prisonNumber

    getPrisonerContext(req.session, prisonNumber).reviewPlanDto = undefined

    const expectedReviewPlanDto = {} as ReviewPlanDto

    // When
    await createEmptyReviewPlanDtoIfNotInPrisonerContext(req, res, next)

    // Then
    expect(next).toHaveBeenCalled()
    expect(getPrisonerContext(req.session, prisonNumber).reviewPlanDto).toEqual(expectedReviewPlanDto)
  })

  it('should not create an ReviewPlanDto for the prisoner given there is already one in the prisoner context', async () => {
    // Given
    const prisonNumber = 'A1234BC'
    req.params.prisonNumber = prisonNumber

    const expectedReviewPlanDto = aValidReviewPlanDto()
    getPrisonerContext(req.session, prisonNumber).reviewPlanDto = expectedReviewPlanDto

    // When
    await createEmptyReviewPlanDtoIfNotInPrisonerContext(req, res, next)

    // Then
    expect(next).toHaveBeenCalled()
    expect(getPrisonerContext(req.session, prisonNumber).reviewPlanDto).toEqual(expectedReviewPlanDto)
  })
})
