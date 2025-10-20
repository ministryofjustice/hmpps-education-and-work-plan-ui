import { parseISO } from 'date-fns'

import type { SupportStrategyListResponse } from 'supportAdditionalNeedsApiClient'
import type { SupportStrategyResponseDto } from 'dto'
import SupportStrategyType from '../../enums/supportStrategyType'
import { toSupportStrategyResponseDtos } from './supportStrategyResponseDtoMapper'
import SupportStrategyCategory from '../../enums/supportStrategyCategory'

describe('Support Strategy Response Mapper Test', () => {
  it('should map a single support strategy correctly', () => {
    const testRef = 'abcdef'
    const apiResponse: SupportStrategyListResponse = {
      supportStrategies: [
        {
          supportStrategyType: { categoryCode: SupportStrategyCategory.MEMORY, code: SupportStrategyType.MEMORY },
          detail: 'Make sure to repeat things 3 times',
          createdAt: '2025-07-25T12:00:00.000Z',
          createdBy: 'user1',
          createdAtPrison: 'BXI',
          createdByDisplayName: 'Bob Martin',
          updatedByDisplayName: 'Dave Davidson',
          updatedAt: '2025-07-26T12:00:00.000Z',
          updatedBy: 'user2',
          updatedAtPrison: 'BXI',
          reference: testRef,
          active: true,
        },
      ],
    }

    const result = toSupportStrategyResponseDtos(apiResponse)

    expect(result).toHaveLength(1)
    expect(result[0]).toEqual<SupportStrategyResponseDto>({
      createdAtPrison: 'BXI',
      supportStrategyCategory: SupportStrategyCategory.MEMORY,
      supportStrategyTypeCode: SupportStrategyType.MEMORY,
      createdAt: parseISO('2025-07-25T12:00:00.000Z'),
      createdBy: 'user1',
      updatedAt: parseISO('2025-07-26T12:00:00.000Z'),
      updatedBy: 'user2',
      updatedAtPrison: 'BXI',
      reference: testRef,
      active: true,
      createdByDisplayName: 'Bob Martin',
      updatedByDisplayName: 'Dave Davidson',
      supportStrategyDetails: 'Make sure to repeat things 3 times',
    })
  })

  it('should map a multiple support strategies correctly', () => {
    const testRef1 = 'abcdef'
    const testRef2 = 'xyz789'

    const apiResponse: SupportStrategyListResponse = {
      supportStrategies: [
        {
          supportStrategyType: { categoryCode: SupportStrategyCategory.MEMORY, code: SupportStrategyType.MEMORY },
          detail: 'Make sure to repeat things 3 times',
          createdAt: '2025-07-25T12:00:00.000Z',
          createdBy: 'user1',
          createdAtPrison: 'BXI',
          createdByDisplayName: 'Bob Martin',
          updatedByDisplayName: 'Dave Davidson',
          updatedAt: '2025-07-26T12:00:00.000Z',
          updatedBy: 'user2',
          updatedAtPrison: 'BXI',
          reference: testRef1,
          active: true,
        },
        {
          supportStrategyType: {
            categoryCode: SupportStrategyCategory.ATTENTION_ORGANISING_TIME,
            code: SupportStrategyType.GENERAL,
          },
          detail: 'Make the work engaging',
          createdAt: '2025-07-25T12:00:00.000Z',
          createdBy: 'user1',
          createdAtPrison: 'BXI',
          createdByDisplayName: 'Bob Martin',
          updatedByDisplayName: 'Dave Davidson',
          updatedAt: '2025-07-26T12:00:00.000Z',
          updatedBy: 'user2',
          updatedAtPrison: 'BXI',
          reference: testRef2,
          active: true,
        },
      ],
    }

    const result = toSupportStrategyResponseDtos(apiResponse)

    expect(result).toHaveLength(2)
    expect(result[0]).toEqual<SupportStrategyResponseDto>({
      createdAtPrison: 'BXI',
      supportStrategyCategory: SupportStrategyCategory.MEMORY,
      supportStrategyTypeCode: SupportStrategyType.MEMORY,
      createdAt: parseISO('2025-07-25T12:00:00.000Z'),
      createdBy: 'user1',
      updatedAt: parseISO('2025-07-26T12:00:00.000Z'),
      updatedBy: 'user2',
      updatedAtPrison: 'BXI',
      reference: testRef1,
      active: true,
      createdByDisplayName: 'Bob Martin',
      updatedByDisplayName: 'Dave Davidson',
      supportStrategyDetails: 'Make sure to repeat things 3 times',
    })
    expect(result[1]).toEqual<SupportStrategyResponseDto>({
      createdAtPrison: 'BXI',
      supportStrategyCategory: SupportStrategyCategory.ATTENTION_ORGANISING_TIME,
      supportStrategyTypeCode: SupportStrategyType.GENERAL,
      createdAt: parseISO('2025-07-25T12:00:00.000Z'),
      createdBy: 'user1',
      updatedAt: parseISO('2025-07-26T12:00:00.000Z'),
      updatedBy: 'user2',
      updatedAtPrison: 'BXI',
      reference: testRef2,
      active: true,
      createdByDisplayName: 'Bob Martin',
      updatedByDisplayName: 'Dave Davidson',
      supportStrategyDetails: 'Make the work engaging',
    })
  })

  it('should handle empty `support strategies` array', () => {
    const apiResponse: SupportStrategyListResponse = { supportStrategies: [] }
    const result = toSupportStrategyResponseDtos(apiResponse)

    expect(result).toHaveLength(0)
  })
})
