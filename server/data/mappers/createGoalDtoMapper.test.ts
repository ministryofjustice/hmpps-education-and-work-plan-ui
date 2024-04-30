import type { CreateGoalDto } from 'dto'
import toCreateGoalDtos from './createGoalDtoMapper'
import { simpleDateFromDate } from '../../validators/classValidatorTypes/SimpleDate'
import { CreateGoalsForm } from '../../routes/createGoal/validators/GoalForm'

describe('toCreateGoalDtos', () => {
  it('should map to toCreateGoalDtos', () => {
    // Given
    const prisonNumber = 'A1234BC'
    const prisonId = 'MDI'
    const createGoalsForm: CreateGoalsForm = {
      goals: [
        {
          title: 'Goal 1',
          targetCompletionDate: '2024-12-31',
          steps: [{ title: 'Goal 1, Step 1' }, { title: 'Goal 1, Step 2' }],
          note: 'Goal 1 notes',
        },
        {
          title: 'Goal 2',
          targetCompletionDate: 'another-date',
          anotherDate: simpleDateFromDate(new Date('2025-2-28')),
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
        targetCompletionDate: new Date('2024-12-31T00:00:00.000Z'),
        note: 'Goal 1 notes',
      },
      {
        prisonNumber,
        prisonId,
        title: 'Goal 2',
        steps: [{ title: 'Goal 2, Step 1', sequenceNumber: 1 }],
        targetCompletionDate: new Date('2025-02-28T00:00:00.000Z'),
        note: 'Goal 2 notes',
      },
    ]

    // When
    const actual = toCreateGoalDtos(createGoalsForm, prisonNumber, prisonId)

    // Then
    expect(actual).toEqual(expected)
  })

  it('should map to toCreateGoalDtos given CreateGoalsForm with no goals', () => {
    // Given
    const prisonNumber = 'A1234BC'
    const prisonId = 'MDI'
    const createGoalsForm: CreateGoalsForm = {
      goals: [],
    }

    const expected: Array<CreateGoalDto> = []

    // When
    const actual = toCreateGoalDtos(createGoalsForm, prisonNumber, prisonId)

    // Then
    expect(actual).toEqual(expected)
  })

  it('should map to toCreateGoalDtos given undefined CreateGoalsForm', () => {
    // Given
    const prisonNumber = 'A1234BC'
    const prisonId = 'MDI'
    const createGoalsForm: CreateGoalsForm = undefined

    const expected: Array<CreateGoalDto> = []

    // When
    const actual = toCreateGoalDtos(createGoalsForm, prisonNumber, prisonId)

    // Then
    expect(actual).toEqual(expected)
  })
})
