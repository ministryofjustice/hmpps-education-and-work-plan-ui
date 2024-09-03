import type { WorkInterestRolesForm } from 'inductionForms'
import WorkInterestTypeValue from '../../../enums/workInterestTypeValue'
import validateWorkInterestRolesForm from './workInterestRolesFormValidator'

describe('workInterestRolesFormValidator', () => {
  describe('happy path - validation passes', () => {
    it.each([
      {
        workInterestRoles: [],
        workInterestTypesOther: undefined,
      },
      {
        workInterestRoles: [[WorkInterestTypeValue.RETAIL, undefined]],
        workInterestTypesOther: undefined,
      },
      {
        workInterestRoles: [
          [WorkInterestTypeValue.RETAIL, undefined],
          [WorkInterestTypeValue.OTHER, 'TV Producer'],
        ],
        workInterestTypesOther: 'Film, TV and media',
      },
    ] as Array<WorkInterestRolesForm>)(`form data: ${JSON.stringify('%s')}`, (form: WorkInterestRolesForm) => {
      // Given
      const expected: Array<Record<string, string>> = []

      // When
      const actual = validateWorkInterestRolesForm(form)

      // Then
      expect(actual).toEqual(expected)
    })
  })

  it('sad path - job role value exceeds length', () => {
    // Given
    const form: WorkInterestRolesForm = {
      workInterestRoles: [
        [WorkInterestTypeValue.RETAIL, undefined], // expect to pass as job type value is optional
        [WorkInterestTypeValue.CONSTRUCTION, 'a'.repeat(513)], // expect to fail as job type value exceeds length
        [WorkInterestTypeValue.SPORTS, 'Fitness instructor'], // expect to pass as job type value is within length
        [WorkInterestTypeValue.OTHER, 'a'.repeat(513)], // expect to fail as job type value exceeds length
      ],
      workInterestTypesOther: 'Film, TV and media',
    }

    const expected = [
      { href: '#CONSTRUCTION', text: 'The Construction and trade job role must be 512 characters or less' },
      { href: '#OTHER', text: 'The Film, TV and media job role must be 512 characters or less' },
    ]

    // When
    const actual = validateWorkInterestRolesForm(form)

    // Then
    expect(actual).toEqual(expected)
  })
})
