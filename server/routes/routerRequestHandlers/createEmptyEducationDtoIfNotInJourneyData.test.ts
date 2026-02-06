import { Request, Response } from 'express'
import type { EducationDto } from 'dto'
import createEmptyEducationDtoIfNotInJourneyData from './createEmptyEducationDtoIfNotInJourneyData'
import aValidEducationDto from '../../testsupport/educationDtoTestDataBuilder'

describe('createEmptyEducationDtoIfNotInJourneyData', () => {
  const req = {
    journeyData: {},
    params: {},
  } as unknown as Request
  const res = {} as unknown as Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
    req.journeyData = {}
    req.params = {}
  })

  it('should create an empty EducationDto for the prisoner given there is not one in the journeyData', async () => {
    // Given
    const prisonNumber = 'A1234BC'
    req.params.prisonNumber = prisonNumber

    req.journeyData.educationDto = undefined

    const expectedEducationDto = { prisonNumber: 'A1234BC', qualifications: [] } as EducationDto

    // When
    await createEmptyEducationDtoIfNotInJourneyData(req, res, next)

    // Then
    expect(next).toHaveBeenCalled()
    expect(req.journeyData.educationDto).toEqual(expectedEducationDto)
  })

  it('should not create an EducationDto for the prisoner given there is already one in the journeyData', async () => {
    // Given
    const prisonNumber = 'A1234BC'
    req.params.prisonNumber = prisonNumber

    const expectedEducationDto = aValidEducationDto({ prisonNumber })
    req.journeyData.educationDto = expectedEducationDto

    // When
    await createEmptyEducationDtoIfNotInJourneyData(req, res, next)

    // Then
    expect(next).toHaveBeenCalled()
    expect(req.journeyData.educationDto).toEqual(expectedEducationDto)
  })
})
