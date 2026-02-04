import { startOfDay } from 'date-fns'
import type { CreateEmployabilitySkillDto } from 'dto'
import toCreateEmployabilitySkillsRequest from './createEmployabilitySkillsRequestMapper'
import {
  aCreateEmployabilitySkillRequest,
  aCreateEmployabilitySkillsRequest,
} from '../../testsupport/createEmployabilitySkillsRequestTestDataBuilder'
import aCreateEmployabilitySkillDto from '../../testsupport/ createEmployabilitySkillDtoTestDataBuilder'
import EmployabilitySkillsValue from '../../enums/employabilitySkillsValue'
import EmployabilitySkillRatingValue from '../../enums/employabilitySkillRatingValue'

describe('createEmployabilitySkillsRequestMapper', () => {
  it('should map CreateEmployabilitySkillDtos to a CreateEmployabilitySkillsRequest', () => {
    // Given
    const employabilitySkillDtos = [
      aCreateEmployabilitySkillDto({
        prisonId: 'BXI',
        employabilitySkillType: EmployabilitySkillsValue.ORGANISATION,
        employabilitySkillRating: EmployabilitySkillRatingValue.QUITE_CONFIDENT,
        activityName: 'E Wing Servery',
        evidence: 'Supervisor has reported this',
        conversationDate: startOfDay('2026-01-26'),
      }),
      aCreateEmployabilitySkillDto({
        prisonId: 'MDI',
        employabilitySkillType: EmployabilitySkillsValue.RELIABILITY,
        employabilitySkillRating: EmployabilitySkillRatingValue.LITTLE_CONFIDENCE,
        activityName: 'B Wing Cleaning',
        evidence: 'Could not be relied upon to turn up on time',
        conversationDate: null,
      }),
    ]

    const expected = aCreateEmployabilitySkillsRequest({
      employabilitySkills: [
        aCreateEmployabilitySkillRequest({
          prisonId: 'BXI',
          employabilitySkillType: EmployabilitySkillsValue.ORGANISATION,
          employabilitySkillRating: EmployabilitySkillRatingValue.QUITE_CONFIDENT,
          activityName: 'E Wing Servery',
          evidence: 'Supervisor has reported this',
          conversationDate: '2026-01-26',
        }),
        aCreateEmployabilitySkillRequest({
          prisonId: 'MDI',
          employabilitySkillType: EmployabilitySkillsValue.RELIABILITY,
          employabilitySkillRating: EmployabilitySkillRatingValue.LITTLE_CONFIDENCE,
          activityName: 'B Wing Cleaning',
          evidence: 'Could not be relied upon to turn up on time',
          conversationDate: null,
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
