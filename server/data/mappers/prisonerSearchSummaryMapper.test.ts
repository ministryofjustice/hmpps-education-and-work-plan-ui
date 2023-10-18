import type { PrisonerSearchSummary } from 'viewModels'
import aValidPrisoner from '../../testsupport/prisonerTestDataBuilder'
import aValidPrisonerSummary from '../../testsupport/prisonerSummaryTestDataBuilder'
import toPrisonerSearchSummary from './prisonerSearchSummaryMapper'
import toPrisonerSummary from './prisonerSummaryMapper'

jest.mock('./prisonerSummaryMapper')

describe('prisonerSearchSummaryMapper', () => {
  const mockedPrisonerSummaryMapper = toPrisonerSummary as jest.MockedFunction<typeof toPrisonerSummary>

  it('should map to Prisoner Search Summary', () => {
    // Given
    const prisoner = aValidPrisoner()
    const prisonerSummary = aValidPrisonerSummary()
    mockedPrisonerSummaryMapper.mockReturnValue(prisonerSummary)

    const hasCiagInduction = true
    const hasActionPlan = false

    const expected: PrisonerSearchSummary = {
      ...prisonerSummary,
      hasCiagInduction,
      hasActionPlan,
    }

    // When
    const actual = toPrisonerSearchSummary(prisoner, hasCiagInduction, hasActionPlan)

    // Then
    expect(actual).toEqual(expected)
    expect(mockedPrisonerSummaryMapper).toHaveBeenCalledWith(prisoner)
  })
})
