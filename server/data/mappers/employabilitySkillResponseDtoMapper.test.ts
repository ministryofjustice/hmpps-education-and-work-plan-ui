import { parseISO, startOfDay } from 'date-fns'
import { toEmployabilitySkillsList } from './employabilitySkillResponseDtoMapper'
import {
  aGetEmployabilitySkillResponses,
  aGetEmployabilitySkillsResponse,
} from '../../testsupport/getEmployabilitySkillResponsesTestDataBuilder'
import {
  anEmployabilitySkillResponseDto,
  anEmployabilitySkillsList,
} from '../../testsupport/employabilitySkillResponseDtoTestDataBuilder'
import EmployabilitySkillsValue from '../../enums/employabilitySkillsValue'
import EmployabilitySkillRatingValue from '../../enums/employabilitySkillRatingValue'

describe('employabilitySkillResponseDtoMapper', () => {
  it('should map GetEmployabilitySkillResponses to an EmployabilitySkillsList', () => {
    // Given
    const prisonNumber = 'A1234BC'
    const apiResponse = aGetEmployabilitySkillResponses({
      employabilitySkills: [
        aGetEmployabilitySkillsResponse({
          employabilitySkillType: EmployabilitySkillsValue.ORGANISATION,
          employabilitySkillRating: EmployabilitySkillRatingValue.QUITE_CONFIDENT,
          activityName: 'E Wing Servery',
          evidence: 'Supervisor has reported this',
          conversationDate: '2026-01-26',
          createdBy: 'asmith_gen',
          createdByDisplayName: 'Alex Smith',
          createdAt: '2023-06-19T09:39:44Z',
          createdAtPrison: 'MDI',
          updatedBy: 'asmith_gen',
          updatedByDisplayName: 'Alex Smith',
          updatedAt: '2023-06-19T09:39:44Z',
          updatedAtPrison: 'MDI',
        }),
      ],
    })

    const expected = anEmployabilitySkillsList({
      prisonNumber,
      employabilitySkills: [
        anEmployabilitySkillResponseDto({
          employabilitySkillType: EmployabilitySkillsValue.ORGANISATION,
          employabilitySkillRating: EmployabilitySkillRatingValue.QUITE_CONFIDENT,
          activityName: 'E Wing Servery',
          evidence: 'Supervisor has reported this',
          conversationDate: startOfDay('2026-01-26'),
          createdAt: parseISO('2023-06-19T09:39:44Z'),
          createdAtPrison: 'MDI',
          createdBy: 'asmith_gen',
          createdByDisplayName: 'Alex Smith',
          updatedAt: parseISO('2023-06-19T09:39:44Z'),
          updatedAtPrison: 'MDI',
          updatedBy: 'asmith_gen',
          updatedByDisplayName: 'Alex Smith',
        }),
      ],
    })

    // When
    const actual = toEmployabilitySkillsList(apiResponse, prisonNumber)

    // Then
    expect(actual).toEqual(expected)
  })

  it.each([null, undefined])(
    'should map %s GetEmployabilitySkillResponses to an empty EmployabilitySkillsList',
    getEmployabilitySkillResponses => {
      // Given
      const prisonNumber = 'A1234BC'
      const apiResponse = getEmployabilitySkillResponses

      const expected = anEmployabilitySkillsList({
        prisonNumber,
        employabilitySkills: [],
      })

      // When
      const actual = toEmployabilitySkillsList(apiResponse, prisonNumber)

      // Then
      expect(actual).toEqual(expected)
    },
  )
})
