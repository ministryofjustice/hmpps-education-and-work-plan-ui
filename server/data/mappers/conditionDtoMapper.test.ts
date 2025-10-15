import { parseISO } from 'date-fns'
import { toConditionsList } from './conditionDtoMapper'
import { aValidConditionListResponse } from '../../testsupport/conditionResponseTestDataBuilder'
import { aValidConditionsList } from '../../testsupport/conditionDtoTestDataBuilder'
import ConditionType from '../../enums/conditionType'
import ConditionSource from '../../enums/conditionSource'

describe('conditionDtoMapper', () => {
  it('should map ConditionListResponse to a ConditionsList', () => {
    // Given
    const prisonNumber = 'A1234BC'
    const apiResponse = aValidConditionListResponse({
      conditionResponses: [
        {
          active: true,
          source: 'SELF_DECLARED',
          conditionDetails: 'John says he was diagnosed with dyslexia as a child, but this has not yet been evidenced.',
          conditionType: { code: 'DYSLEXIA' },
          conditionName: 'Phonological dyslexia',
          reference: 'c88a6c48-97e2-4c04-93b5-98619966447b',
          createdBy: 'asmith_gen',
          createdByDisplayName: 'Alex Smith',
          createdAt: '2023-06-19T09:39:44Z',
          createdAtPrison: 'MDI',
          updatedBy: 'asmith_gen',
          updatedByDisplayName: 'Alex Smith',
          updatedAt: '2023-06-19T09:39:44Z',
          updatedAtPrison: 'MDI',
        },
      ],
    })

    const expected = aValidConditionsList({
      prisonNumber,
      conditions: [
        {
          active: true,
          conditionDetails: 'John says he was diagnosed with dyslexia as a child, but this has not yet been evidenced.',
          conditionName: 'Phonological dyslexia',
          conditionTypeCode: ConditionType.DYSLEXIA,
          createdAt: parseISO('2023-06-19T09:39:44Z'),
          createdAtPrison: 'MDI',
          createdBy: 'asmith_gen',
          createdByDisplayName: 'Alex Smith',
          reference: 'c88a6c48-97e2-4c04-93b5-98619966447b',
          source: ConditionSource.SELF_DECLARED,
          updatedAt: parseISO('2023-06-19T09:39:44Z'),
          updatedAtPrison: 'MDI',
          updatedBy: 'asmith_gen',
          updatedByDisplayName: 'Alex Smith',
        },
      ],
    })

    // When
    const actual = toConditionsList(apiResponse, prisonNumber)

    // Then
    expect(actual).toEqual(expected)
  })

  it.each([null, undefined])('should map %s ConditionListResponse to an empty ConditionsList', conditionsList => {
    // Given
    const prisonNumber = 'A1234BC'
    const apiResponse = conditionsList

    const expected = aValidConditionsList({
      prisonNumber,
      conditions: [],
    })

    // When
    const actual = toConditionsList(apiResponse, prisonNumber)

    // Then
    expect(actual).toEqual(expected)
  })
})
