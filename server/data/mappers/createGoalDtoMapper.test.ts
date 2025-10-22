import { addMonths, parse, startOfToday } from 'date-fns'
import type { CreateGoalsForm } from 'forms'
import type { CreateGoalDto } from 'dto'
import toCreateGoalDtos from './createGoalDtoMapper'
import GoalTargetCompletionDateOption from '../../enums/goalTargetCompletionDateOption'

describe('toCreateGoalDtos', () => {
  it('should map to toCreateGoalDtos', () => {
    // Given
    const prisonNumber = 'A1234BC'
    const prisonId = 'MDI'
    const createGoalsForm: CreateGoalsForm = {
      prisonNumber,
      goals: [
        {
          title: 'Goal 1',
          targetCompletionDate: GoalTargetCompletionDateOption.THREE_MONTHS,
          steps: [{ title: 'Goal 1, Step 1' }, { title: 'Goal 1, Step 2' }],
          note: 'Goal 1 notes',
        },
        {
          title: 'Goal 2',
          targetCompletionDate: GoalTargetCompletionDateOption.ANOTHER_DATE,
          manuallyEnteredTargetCompletionDate: '28/2/2025',
          steps: [{ title: 'Goal 2, Step 1' }],
          note: 'Goal 2 notes',
        },
      ],
    }

    const expected: Array<CreateGoalDto> = [
      {
        prisonNumber,
        prisonId,
        title: 'Goal 1',
        steps: [
          { title: 'Goal 1, Step 1', sequenceNumber: 1 },
          { title: 'Goal 1, Step 2', sequenceNumber: 2 },
        ],
        targetCompletionDate: addMonths(startOfToday(), 3),
        note: 'Goal 1 notes',
      },
      {
        prisonNumber,
        prisonId,
        title: 'Goal 2',
        steps: [{ title: 'Goal 2, Step 1', sequenceNumber: 1 }],
        targetCompletionDate: parse('2025-02-28', 'yyyy-MM-dd', startOfToday()),
        note: 'Goal 2 notes',
      },
    ]

    // When
    const actual = toCreateGoalDtos(createGoalsForm, prisonId)

    // Then
    expect(actual).toEqual(expected)
  })

  it('should map to toCreateGoalDtos given CreateGoalsForm with no goals', () => {
    // Given
    const prisonNumber = 'A1234BC'
    const prisonId = 'MDI'
    const createGoalsForm: CreateGoalsForm = {
      prisonNumber,
      goals: [],
    }

    const expected: Array<CreateGoalDto> = []

    // When
    const actual = toCreateGoalDtos(createGoalsForm, prisonId)

    // Then
    expect(actual).toEqual(expected)
  })

  it('should map to toCreateGoalDtos given undefined CreateGoalsForm', () => {
    // Given
    const prisonId = 'MDI'
    const createGoalsForm: CreateGoalsForm = undefined

    const expected: Array<CreateGoalDto> = []

    // When
    const actual = toCreateGoalDtos(createGoalsForm, prisonId)

    // Then
    expect(actual).toEqual(expected)
  })

  it.each([
    null,
    undefined,
    '',
    '    ',
    `

  `,
  ])('should map to toCreateGoalDtos given notes field value %s', notesFieldValue => {
    // Given
    const prisonNumber = 'A1234BC'
    const prisonId = 'MDI'
    const createGoalsForm: CreateGoalsForm = {
      prisonNumber,
      goals: [
        {
          title: 'Goal 1',
          targetCompletionDate: GoalTargetCompletionDateOption.THREE_MONTHS,
          steps: [{ title: 'Goal 1, Step 1' }, { title: 'Goal 1, Step 2' }],
          note: notesFieldValue,
        },
      ],
    }

    const expected: Array<CreateGoalDto> = [
      {
        prisonNumber,
        prisonId,
        title: 'Goal 1',
        steps: [
          { title: 'Goal 1, Step 1', sequenceNumber: 1 },
          { title: 'Goal 1, Step 2', sequenceNumber: 2 },
        ],
        targetCompletionDate: addMonths(startOfToday(), 3),
        note: null,
      },
    ]

    // When
    const actual = toCreateGoalDtos(createGoalsForm, prisonId)

    // Then
    expect(actual).toEqual(expected)
  })
})
