import { parseISO } from 'date-fns'
import { toStrengthsList } from './strengthResponseDtoMapper'
import { aValidStrengthListResponse } from '../../testsupport/strengthResponseTestDataBuilder'
import { aValidStrengthsList } from '../../testsupport/strengthResponseDtoTestDataBuilder'
import StrengthType from '../../enums/strengthType'
import StrengthIdentificationSource from '../../enums/strengthIdentificationSource'
import StrengthCategory from '../../enums/strengthCategory'

describe('strengthDtoMapper', () => {
  it('should map StrengthListResponse to a StrengthsList', () => {
    // Given
    const prisonNumber = 'A1234BC'
    const apiResponse = aValidStrengthListResponse({
      strengths: [
        {
          active: true,
          fromALNScreener: false,
          symptoms: 'John can read and understand very well.',
          strengthType: { code: 'READING_COMPREHENSION', categoryCode: 'LITERACY_SKILLS' },
          howIdentified: ['CONVERSATIONS'],
          howIdentifiedOther: 'I have spoken to the person',
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
        {
          active: true,
          fromALNScreener: true,
          alnScreenerDate: '2023-06-19',
          symptoms: null,
          strengthType: { code: 'LITERACY_SKILLS_DEFAULT', categoryCode: 'LITERACY_SKILLS' },
          howIdentified: null,
          howIdentifiedOther: null,
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

    const expected = aValidStrengthsList({
      prisonNumber,
      strengths: [
        {
          active: true,
          fromALNScreener: false,
          alnScreenerDate: null,
          symptoms: 'John can read and understand very well.',
          strengthTypeCode: StrengthType.READING_COMPREHENSION,
          strengthCategory: StrengthCategory.LITERACY_SKILLS,
          howIdentified: [StrengthIdentificationSource.CONVERSATIONS],
          howIdentifiedOther: 'I have spoken to the person',
          createdAt: parseISO('2023-06-19T09:39:44Z'),
          createdAtPrison: 'MDI',
          createdBy: 'asmith_gen',
          createdByDisplayName: 'Alex Smith',
          reference: 'c88a6c48-97e2-4c04-93b5-98619966447b',
          updatedAt: parseISO('2023-06-19T09:39:44Z'),
          updatedAtPrison: 'MDI',
          updatedBy: 'asmith_gen',
          updatedByDisplayName: 'Alex Smith',
        },
        {
          active: true,
          fromALNScreener: true,
          alnScreenerDate: parseISO('2023-06-19'),
          symptoms: null,
          strengthTypeCode: StrengthType.LITERACY_SKILLS_DEFAULT,
          strengthCategory: StrengthCategory.LITERACY_SKILLS,
          howIdentified: null,
          howIdentifiedOther: null,
          createdAt: parseISO('2023-06-19T09:39:44Z'),
          createdAtPrison: 'MDI',
          createdBy: 'asmith_gen',
          createdByDisplayName: 'Alex Smith',
          reference: 'c88a6c48-97e2-4c04-93b5-98619966447b',
          updatedAt: parseISO('2023-06-19T09:39:44Z'),
          updatedAtPrison: 'MDI',
          updatedBy: 'asmith_gen',
          updatedByDisplayName: 'Alex Smith',
        },
      ],
    })

    // When
    const actual = toStrengthsList(apiResponse, prisonNumber)

    // Then
    expect(actual).toEqual(expected)
  })

  it.each([null, undefined])('should map %s StrengthListResponse to an empty StrengthsList', strengthsList => {
    // Given
    const prisonNumber = 'A1234BC'
    const apiResponse = strengthsList

    const expected = aValidStrengthsList({
      prisonNumber,
      strengths: [],
    })

    // When
    const actual = toStrengthsList(apiResponse, prisonNumber)

    // Then
    expect(actual).toEqual(expected)
  })
})
