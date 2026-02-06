import { Request, Response } from 'express'
import checkCreateEmployabilitySkillDtoExistsInJourneyData from './checkCreateEmployabilitySkillDtoExistsInJourneyData'
import aCreateEmployabilitySkillDto from '../../testsupport/ createEmployabilitySkillDtoTestDataBuilder'

describe('checkCreateEmployabilitySkillDtoExistsInJourneyData', () => {
  const prisonNumber = 'A1234BC'

  const req = {
    journeyData: {},
    params: {},
  } as unknown as Request
  const res = {
    redirect: jest.fn(),
  } as unknown as Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
    req.journeyData = {}
    req.params = { prisonNumber }
  })

  it(`should invoke next handler given CreateEmployabilitySkillDto exists in journeyData`, async () => {
    // Given
    req.journeyData.createEmployabilitySkillDto = aCreateEmployabilitySkillDto()

    // When
    await checkCreateEmployabilitySkillDtoExistsInJourneyData(req, res, next)

    // Then
    expect(next).toHaveBeenCalled()
    expect(res.redirect).not.toHaveBeenCalled()
  })

  it(`should redirect to Employability Skills Overview page given no CreateEmployabilitySkillDto exists in journeyData`, async () => {
    // Given
    req.journeyData.createEmployabilitySkillDto = undefined

    // When
    await checkCreateEmployabilitySkillDtoExistsInJourneyData(req, res, next)

    // Then
    expect(res.redirect).toHaveBeenCalledWith(`/plan/${prisonNumber}/view/employability-skills`)
    expect(next).not.toHaveBeenCalled()
  })

  it(`should redirect to Employability Skills  Overview page given no journeyData exists`, async () => {
    // Given
    req.journeyData = undefined

    // When
    await checkCreateEmployabilitySkillDtoExistsInJourneyData(req, res, next)

    // Then
    expect(res.redirect).toHaveBeenCalledWith(`/plan/${prisonNumber}/view/employability-skills`)
    expect(next).not.toHaveBeenCalled()
  })
})
