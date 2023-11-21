import type { Prison } from 'viewModels'
import toPrison from './prisonMapper'
import aValidPrisonResponse from '../../testsupport/prisonResponseTestDataBuilder'

describe('prisonMapper', () => {
  it('should map a PrisonResponse to a Prison', () => {
    // Given
    const prisonResponse = aValidPrisonResponse({
      prisonId: 'MDI',
      prisonName: 'Moorland (HMP & YOI)',
    })

    const expectedPrison: Prison = {
      prisonId: 'MDI',
      prisonName: 'Moorland (HMP & YOI)',
    }

    // When
    const actual = toPrison(prisonResponse)

    // Then
    expect(actual).toEqual(expectedPrison)
  })
})
