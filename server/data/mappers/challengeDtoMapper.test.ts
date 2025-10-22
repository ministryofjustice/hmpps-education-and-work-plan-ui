import { parseISO } from 'date-fns'

import type { ChallengeListResponse } from 'supportAdditionalNeedsApiClient'
import type { ChallengeResponseDto } from 'dto'
import { toChallengeDto } from './challengeDtoMapper'

describe('toChallengeDto', () => {
  it('should map a single challenge correctly', () => {
    const testRef = 'abcdef'
    const apiResponse: ChallengeListResponse = {
      challenges: [
        {
          reference: testRef,
          id: 'CH001',
          createdAtPrison: 'PR001',
          categoryCode: 'CC001',
          detail: 'Test detail',
          challengeType: { code: 'TYPE001', categoryCode: 'EMOTIONS_FEELINGS' },
          createdAt: '2025-07-25T12:00:00.000Z',
          createdBy: 'user1',
          createdByDisplayName: 'Bob Martin',
          updatedAt: '2025-07-26T12:00:00.000Z',
          updatedBy: 'user2',
          updatedByDisplayName: 'Dave Davidson',
          active: true,
          fromALNScreener: false,
          howIdentified: ['EDUCATION_SKILLS_WORK'],
          howIdentifiedOther: '',
          symptoms: 'Some varying symptoms',
          updatedAtPrison: 'BXI',
          alnScreenerDate: '2025-07-23T12:00:00.000Z',
        },
      ],
    }

    const result = toChallengeDto(apiResponse)

    expect(result).toHaveLength(1)
    expect(result[0]).toEqual<ChallengeResponseDto>({
      createdAtPrison: 'PR001',
      challengeCategory: 'EMOTIONS_FEELINGS',
      createdAt: parseISO('2025-07-25T12:00:00.000Z'),
      createdBy: 'user1',
      updatedAt: parseISO('2025-07-26T12:00:00.000Z'),
      updatedBy: 'user2',
      updatedAtPrison: 'BXI',
      reference: testRef,
      fromALNScreener: false,
      active: true,
      createdByDisplayName: 'Bob Martin',
      updatedByDisplayName: 'Dave Davidson',
      howIdentified: ['EDUCATION_SKILLS_WORK'],
      howIdentifiedOther: '',
      symptoms: 'Some varying symptoms',
      alnScreenerDate: parseISO('2025-07-23T12:00:00.000Z'),
      challengeTypeCode: 'TYPE001',
    })
  })

  it('should map a multiple challenges correctly', () => {
    const testRef1 = 'abcdef'
    const testRef2 = 'xyz789'
    const apiResponse: ChallengeListResponse = {
      challenges: [
        {
          reference: testRef1,
          id: 'CH001',
          createdAtPrison: 'PR001',
          categoryCode: 'CC001',
          detail: 'Test detail',
          challengeType: { code: 'TYPE001', categoryCode: 'EMOTIONS_FEELINGS' },
          createdAt: '2025-07-25T12:00:00.000Z',
          createdBy: 'user1',
          createdByDisplayName: 'Bob Martin',
          updatedAt: '2025-07-26T12:00:00.000Z',
          updatedBy: 'user2',
          updatedByDisplayName: 'Dave Davidson',
          active: true,
          fromALNScreener: false,
          howIdentified: ['EDUCATION_SKILLS_WORK'],
          howIdentifiedOther: '',
          symptoms: 'Some varying symptoms',
          updatedAtPrison: 'BXI',
          alnScreenerDate: '2025-07-23T12:00:00.000Z',
        },
        {
          reference: testRef2,
          id: 'CH002',
          createdAtPrison: 'PR001',
          categoryCode: 'CC001',
          detail: 'Test detail',
          challengeType: { code: 'TYPE001', categoryCode: 'EMOTIONS_FEELINGS' },
          createdAt: '2025-07-25T12:00:00.000Z',
          createdBy: 'user1',
          createdByDisplayName: 'Bob Martin 2',
          updatedAt: '2025-07-26T12:00:00.000Z',
          updatedBy: 'user2',
          updatedByDisplayName: 'Dave Davidson 2',
          active: true,
          fromALNScreener: true,
          howIdentified: ['WIDER_PRISON'],
          howIdentifiedOther: '',
          symptoms: 'Some varying symptoms',
          updatedAtPrison: 'BXI',
          alnScreenerDate: '2025-07-23T12:00:00.000Z',
        },
      ],
    }

    const result = toChallengeDto(apiResponse)

    expect(result).toHaveLength(2)
    expect(result[0]).toEqual<ChallengeResponseDto>({
      createdAtPrison: 'PR001',
      challengeCategory: 'EMOTIONS_FEELINGS',
      createdAt: parseISO('2025-07-25T12:00:00.000Z'),
      createdBy: 'user1',
      updatedAt: parseISO('2025-07-26T12:00:00.000Z'),
      updatedBy: 'user2',
      updatedAtPrison: 'BXI',
      reference: testRef1,
      fromALNScreener: false,
      active: true,
      createdByDisplayName: 'Bob Martin',
      updatedByDisplayName: 'Dave Davidson',
      howIdentified: ['EDUCATION_SKILLS_WORK'],
      howIdentifiedOther: '',
      symptoms: 'Some varying symptoms',
      alnScreenerDate: parseISO('2025-07-23T12:00:00.000Z'),
      challengeTypeCode: 'TYPE001',
    })
    expect(result[1]).toEqual<ChallengeResponseDto>({
      createdAtPrison: 'PR001',
      challengeCategory: 'EMOTIONS_FEELINGS',
      createdAt: parseISO('2025-07-25T12:00:00.000Z'),
      createdBy: 'user1',
      updatedAt: parseISO('2025-07-26T12:00:00.000Z'),
      updatedBy: 'user2',
      updatedAtPrison: 'BXI',
      reference: testRef2,
      fromALNScreener: true,
      active: true,
      createdByDisplayName: 'Bob Martin 2',
      updatedByDisplayName: 'Dave Davidson 2',
      howIdentified: ['WIDER_PRISON'],
      howIdentifiedOther: '',
      symptoms: 'Some varying symptoms',
      alnScreenerDate: parseISO('2025-07-23T12:00:00.000Z'),
      challengeTypeCode: 'TYPE001',
    })
  })

  it('should handle empty `challenges` array', () => {
    const apiResponse: ChallengeListResponse = { challenges: [] }
    const result = toChallengeDto(apiResponse)

    expect(result).toHaveLength(0)
  })
})
