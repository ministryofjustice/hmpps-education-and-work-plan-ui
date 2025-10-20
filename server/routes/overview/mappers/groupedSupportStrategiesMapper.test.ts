import type { SupportStrategyResponseDto } from 'dto'
import { parseISO } from 'date-fns'
import toGroupedSupportStrategiesPromise from './groupedSupportStrategiesMapper'
import aValidSupportStrategyResponseDto from '../../../testsupport/supportStrategyResponseDtoTestDataBuilder'
import SupportStrategyType from '../../../enums/supportStrategyType'
import { Result } from '../../../utils/result/result'

describe('groupedSupportStrategyMapper', () => {
  const supportStrategies = [
    aValidSupportStrategyResponseDto({
      supportStrategyCategoryTypeCode: SupportStrategyType.SENSORY,
      updatedAt: parseISO('2021-01-01T00:00:00.000Z'),
      createdAt: parseISO('2021-01-01T00:00:00.000Z'),
      details: 'This is the oldest entry',
    }),
    aValidSupportStrategyResponseDto({
      supportStrategyCategoryTypeCode: SupportStrategyType.SENSORY,
      updatedAt: parseISO('2021-01-02T00:00:00.000Z'),
      createdAt: parseISO('2021-01-02T00:00:00.000Z'),
      details: 'This is the newer entry',
    }),
    aValidSupportStrategyResponseDto({
      supportStrategyCategoryTypeCode: SupportStrategyType.MEMORY,
    }),
    aValidSupportStrategyResponseDto({
      supportStrategyCategoryTypeCode: SupportStrategyType.GENERAL,
    }),
  ]

  const supportCategoriesPromise: Result<Array<SupportStrategyResponseDto>, Error> = Result.fulfilled(supportStrategies)

  describe('toGroupedSupportStrategiesPromise', () => {
    it('should map with the correct in group ordering for support strategies', () => {
      // Given
      const expectedGroupedSupportStrategies = {
        SENSORY: [
          aValidSupportStrategyResponseDto({
            supportStrategyCategoryTypeCode: SupportStrategyType.SENSORY,
            updatedAt: parseISO('2021-01-02'),
            createdAt: parseISO('2021-01-02'),
            details: 'This is the newer entry',
          }),
          aValidSupportStrategyResponseDto({
            supportStrategyCategoryTypeCode: SupportStrategyType.SENSORY,
            updatedAt: parseISO('2021-01-01'),
            createdAt: parseISO('2021-01-01'),
            details: 'This is the oldest entry',
          }),
        ],
        MEMORY: [
          aValidSupportStrategyResponseDto({
            supportStrategyCategoryTypeCode: SupportStrategyType.MEMORY,
          }),
        ],
        GENERAL: [
          aValidSupportStrategyResponseDto({
            supportStrategyCategoryTypeCode: SupportStrategyType.GENERAL,
          }),
        ],
      }

      // General is always returned as the last group
      const expectedCategoryOrder = ['MEMORY', 'SENSORY', 'GENERAL']
      const expected = expect.objectContaining({
        status: 'fulfilled',
        value: expectedGroupedSupportStrategies,
      })

      // When
      const actual = toGroupedSupportStrategiesPromise(supportCategoriesPromise)

      // Then
      expect(actual).toEqual(expected)
      const actualGroupedSupportStrategies = actual.getOrThrow()
      const actualCategoryOrder = Object.keys(actualGroupedSupportStrategies)
      expect(actualCategoryOrder).toEqual(expectedCategoryOrder)

      // Newest should be first in the list
      actualGroupedSupportStrategies.SENSORY[0].supportStrategyDetails = 'This is the newer entry'
      actualGroupedSupportStrategies.SENSORY[1].supportStrategyDetails = 'This is the oldest entry'
    })

    it('should map to GroupedSupportStrategies given the support strategy promise is not resolved', () => {
      // Given
      const rejectedSupportStrategiesPromise: Result<Array<SupportStrategyResponseDto>, Error> = Result.rejected(
        new Error('Some error retrieving support strategies'),
      )

      const expected = expect.objectContaining({
        status: 'rejected',
        reason: new Error('Some error retrieving support strategies'),
      })

      // When
      const actual = toGroupedSupportStrategiesPromise(rejectedSupportStrategiesPromise)

      // Then
      expect(actual).toEqual(expected)
    })
  })
})
