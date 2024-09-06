import { Request, Response } from 'express'
import { Session } from 'express-session'
import type { EducationDto } from 'dto'
import getPrisonerContext from '../../data/session/prisonerContexts'
import createEmptyEducationDtoIfNotInPrisonerContext from './createEmptyEducationDtoIfNotInPrisonerContext'
import aValidEducationDto from '../../testsupport/educationDtoTestDataBuilder'

describe('createEmptyEducationDtoIfNotInPrisonerContext', () => {
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

  it('should create an empty EducationDto for the prisoner given there is not one in the prisoner context', async () => {
    // Given
    const prisonNumber = 'A1234BC'
    req.params.prisonNumber = prisonNumber

    getPrisonerContext(req.session, prisonNumber).educationDto = undefined

    const expectedEducationDto = { prisonNumber: 'A1234BC' } as EducationDto

    // When
    await createEmptyEducationDtoIfNotInPrisonerContext(req, res, next)

    // Then
    expect(next).toHaveBeenCalled()
    expect(getPrisonerContext(req.session, prisonNumber).educationDto).toEqual(expectedEducationDto)
  })

  it('should not create an EducationDto for the prisoner given there is already one in the prisoner context', async () => {
    // Given
    const prisonNumber = 'A1234BC'
    req.params.prisonNumber = prisonNumber

    const expectedEducationDto = aValidEducationDto({ prisonNumber })
    getPrisonerContext(req.session, prisonNumber).educationDto = expectedEducationDto

    // When
    await createEmptyEducationDtoIfNotInPrisonerContext(req, res, next)

    // Then
    expect(next).toHaveBeenCalled()
    expect(getPrisonerContext(req.session, prisonNumber).educationDto).toEqual(expectedEducationDto)
  })
})
