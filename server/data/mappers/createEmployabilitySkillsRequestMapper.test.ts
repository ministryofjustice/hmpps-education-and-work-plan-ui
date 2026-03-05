import type { CreateEmployabilitySkillDto } from 'dto'
import toCreateEmployabilitySkillsRequest from './createEmployabilitySkillsRequestMapper'
import {
  aCreateEmployabilitySkillRequest,
  aCreateEmployabilitySkillsRequest,
} from '../../testsupport/createEmployabilitySkillsRequestTestDataBuilder'
import aCreateEmployabilitySkillDto from '../../testsupport/ createEmployabilitySkillDtoTestDataBuilder'
import EmployabilitySkillsValue from '../../enums/employabilitySkillsValue'
import EmployabilitySkillRatingValue from '../../enums/employabilitySkillRatingValue'
import EmployabilitySkillSessionType from '../../enums/employabilitySkillSessionType'

describe('createEmployabilitySkillsRequestMapper', () => {
  it('should map CreateEmployabilitySkillDtos to a CreateEmployabilitySkillsRequest', () => {
    // Given
    const employabilitySkillDtos = [
      aCreateEmployabilitySkillDto({
        prisonId: 'BXI',
        employabilitySkillType: EmployabilitySkillsValue.ORGANISATION,
        employabilitySkillRating: EmployabilitySkillRatingValue.QUITE_CONFIDENT,
        evidence: 'Supervisor has reported this',
        sessionType: EmployabilitySkillSessionType.CIAG_INDUCTION,
        sessionTypeDescription: null,
      }),
      aCreateEmployabilitySkillDto({
        prisonId: 'MDI',
        employabilitySkillType: EmployabilitySkillsValue.RELIABILITY,
        employabilitySkillRating: EmployabilitySkillRatingValue.LITTLE_CONFIDENCE,
        evidence: 'Could not be relied upon to turn up on time',
        sessionType: EmployabilitySkillSessionType.INDUSTRIES_REVIEW,
        sessionTypeDescription: 'Woodwork workshop',
      }),
    ]

    const expected = aCreateEmployabilitySkillsRequest({
      employabilitySkills: [
        aCreateEmployabilitySkillRequest({
          prisonId: 'BXI',
          employabilitySkillType: EmployabilitySkillsValue.ORGANISATION,
          employabilitySkillRating: EmployabilitySkillRatingValue.QUITE_CONFIDENT,
          evidence: 'Supervisor has reported this',
          sessionType: EmployabilitySkillSessionType.CIAG_INDUCTION,
          sessionTypeDescription: null,
        }),
        aCreateEmployabilitySkillRequest({
          prisonId: 'MDI',
          employabilitySkillType: EmployabilitySkillsValue.RELIABILITY,
          employabilitySkillRating: EmployabilitySkillRatingValue.LITTLE_CONFIDENCE,
          evidence: 'Could not be relied upon to turn up on time',
          sessionType: EmployabilitySkillSessionType.INDUSTRIES_REVIEW,
          sessionTypeDescription: 'Woodwork workshop',
        }),
      ],
    })

    // When
    const actual = toCreateEmployabilitySkillsRequest(employabilitySkillDtos)

    // Then
    expect(actual).toEqual(expected)
  })

  it('should map null CreateEmployabilitySkillDtos to an empty CreateEmployabilitySkillsRequest', () => {
    // Given
    const employabilitySkillDtos: Array<CreateEmployabilitySkillDto> = null

    const expected = aCreateEmployabilitySkillsRequest({
      employabilitySkills: [],
    })

    // When
    const actual = toCreateEmployabilitySkillsRequest(employabilitySkillDtos)

    // Then
    expect(actual).toEqual(expected)
  })
})
