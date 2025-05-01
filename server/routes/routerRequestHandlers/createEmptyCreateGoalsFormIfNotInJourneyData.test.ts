import { Request, Response } from 'express'
import type { CreateGoalsForm } from 'forms'
import createEmptyCreateGoalsFormIfNotInJourneyData from './createEmptyCreateGoalsFormIfNotInJourneyData'
import GoalTargetCompletionDateOption from '../../enums/goalTargetCompletionDateOption'

describe('createEmptyCreateGoalsFormIfNotInJourneyData', () => {
  const journeyId = '99bca142-9a5e-4a92-8087-0da925b9f331'
  const username = 'a-dps-user'

  const req = {
    user: { username },
    params: { journeyId },
    journeyData: {},
  } as unknown as Request
  const res = {} as unknown as Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
    req.journeyData = {}
  })

  it('should create an empty CreateGoalsForm for the prisoner given there is not one in the journeyData', async () => {
    // Given
    const prisonNumber = 'A1234BC'
    req.params.prisonNumber = prisonNumber

    req.journeyData.createGoalsForm = undefined

    const expectedCreateGoalsForm: CreateGoalsForm = { prisonNumber, goals: undefined }

    // When
    await createEmptyCreateGoalsFormIfNotInJourneyData(req, res, next)

    // Then
    expect(next).toHaveBeenCalled()
    expect(req.journeyData.createGoalsForm).toEqual(expectedCreateGoalsForm)
  })

  it('should not create an CreateGoalsForm for the prisoner given there is already one in the journeyData', async () => {
    // Given
    const prisonNumber = 'A1234BC'
    req.params.prisonNumber = prisonNumber

    const expectedCreateGoalsForm: CreateGoalsForm = {
      prisonNumber,
      goals: [
        {
          title: 'Learn French',
          targetCompletionDate: GoalTargetCompletionDateOption.SIX_MONTHS,
          steps: [{ title: 'Attend classes' }],
          note: 'Will likely need some support',
        },
      ],
    }
    req.journeyData.createGoalsForm = expectedCreateGoalsForm

    // When
    await createEmptyCreateGoalsFormIfNotInJourneyData(req, res, next)

    // Then
    expect(next).toHaveBeenCalled()
    expect(req.journeyData.createGoalsForm).toEqual(expectedCreateGoalsForm)
  })
})
