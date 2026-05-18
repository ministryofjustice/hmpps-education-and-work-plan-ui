import { Request, Response } from 'express'
import { addDays, format, startOfToday, subDays } from 'date-fns'
import { validate } from '../../routerRequestHandlers/validationMiddleware'
import updateGoalSchema from './updateGoalSchema'
import type { Error } from '../../../filters/findErrorFilter'

describe('updateGoalSchema', () => {
  const today = startOfToday()
  const tomorrow = addDays(today, 1)
  const yesterday = subDays(today, 1)

  const req = {
    originalUrl: '',
    body: {},
    flash: jest.fn(),
  } as unknown as Request
  const res = {
    redirectWithErrors: jest.fn(),
  } as unknown as Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
    req.originalUrl = '/plan/A1234BC/goals/12345/update'
  })

  it.each([
    { targetCompletionDate: format(today, 'd/M/yyyy'), manuallyEnteredTargetCompletionDate: null },
    { targetCompletionDate: format(addDays(today, 1), 'd/M/yyyy'), manuallyEnteredTargetCompletionDate: null },
    { targetCompletionDate: 'another-date', manuallyEnteredTargetCompletionDate: format(today, 'd/M/yyyy') },
    {
      targetCompletionDate: 'another-date',
      manuallyEnteredTargetCompletionDate: format(tomorrow, 'd/M/yyyy'),
    },
  ])('happy path - validation passes - targetCompletionDate: $targetCompletionDate', async spec => {
    // Given
    const requestBody = {
      ...spec,
      title: 'A goal title',
      note: 'Goal notes',
      steps: [
        {
          title: 'Step 1',
          status: 'NOT_STARTED',
          stepNumber: 1,
          reference: 'a2d30c9f-8b1e-46d8-8a19-42620e7d38e0',
        },
        {
          title: 'Step 2',
          status: 'ACTIVE',
          stepNumber: 2,
          reference: 'f7b4f5c5-9f54-49e5-8709-05b7cf2dbb7c',
        },
        {
          title: 'Step 3',
          status: 'COMPLETE',
          stepNumber: 3,
          reference: 'db6a2c5d-8e68-46ad-a7e2-d9ecfb793149',
        },
      ],
      reference: '0856e8cc-a7e8-49df-941e-8dc9c51f8c77',
      createdAt: '2025-10-22T08:17:13Z',
      originalTargetCompletionDate: '22/1/2026',
      status: 'ACTIVE',
      action: 'submit-form',
    }
    req.body = requestBody

    // When
    await validate(updateGoalSchema)(req, res, next)

    // Then
    expect(req.body).toEqual(requestBody)
    expect(next).toHaveBeenCalled()
    expect(req.flash).not.toHaveBeenCalled()
    expect(res.redirectWithErrors).not.toHaveBeenCalled()
  })

  it.each([{ title: undefined }, { title: null }, { title: '' }, { title: '   ' }])(
    'sad path - mandatory title field validation fails - title: $title',
    async spec => {
      // Given
      const requestBody = {
        title: spec.title,
        targetCompletionDate: format(today, 'd/M/yyyy'),
        note: 'Goal notes',
        steps: [
          {
            title: 'Step 1',
            status: 'NOT_STARTED',
            stepNumber: 1,
            reference: 'a2d30c9f-8b1e-46d8-8a19-42620e7d38e0',
          },
        ],
        reference: '0856e8cc-a7e8-49df-941e-8dc9c51f8c77',
        createdAt: '2025-10-22T08:17:13Z',
        originalTargetCompletionDate: '22/1/2026',
        status: 'ACTIVE',
        action: 'submit-form',
      }
      req.body = requestBody

      const expectedErrors: Array<Error> = [
        {
          href: '#title',
          text: 'Enter the goal description',
        },
      ]
      const expectedInvalidForm = JSON.stringify(requestBody)

      // When
      await validate(updateGoalSchema)(req, res, next)

      // Then
      expect(req.body).toEqual(requestBody)
      expect(next).not.toHaveBeenCalled()
      expect(req.flash).toHaveBeenCalledWith('invalidForm', expectedInvalidForm)
      expect(res.redirectWithErrors).toHaveBeenCalledWith('/plan/A1234BC/goals/12345/update', expectedErrors)
    },
  )

  it('sad path - title field fails max length', async () => {
    // Given
    const requestBody = {
      title: 'a'.repeat(513),
      targetCompletionDate: format(today, 'd/M/yyyy'),
      note: 'Goal notes',
      steps: [
        {
          title: 'Step 1',
          status: 'NOT_STARTED',
          stepNumber: 1,
          reference: 'a2d30c9f-8b1e-46d8-8a19-42620e7d38e0',
        },
      ],
      reference: '0856e8cc-a7e8-49df-941e-8dc9c51f8c77',
      createdAt: '2025-10-22T08:17:13Z',
      originalTargetCompletionDate: '22/1/2026',
      status: 'ACTIVE',
      action: 'submit-form',
    }
    req.body = requestBody

    const expectedErrors: Array<Error> = [
      {
        href: '#title',
        text: 'The goal description must be 512 characters or less',
      },
    ]
    const expectedInvalidForm = JSON.stringify(requestBody)

    // When
    await validate(updateGoalSchema)(req, res, next)

    // Then
    expect(req.body).toEqual(requestBody)
    expect(next).not.toHaveBeenCalled()
    expect(req.flash).toHaveBeenCalledWith('invalidForm', expectedInvalidForm)
    expect(res.redirectWithErrors).toHaveBeenCalledWith('/plan/A1234BC/goals/12345/update', expectedErrors)
  })

  it.each([
    { targetCompletionDate: 'not-a-valid-value' },
    { targetCompletionDate: 'another_date' },
    { targetCompletionDate: 'anotherDate' },
    { targetCompletionDate: 'ANOTHER-DATE' },
    { targetCompletionDate: '2025-12-30' },
    { targetCompletionDate: '99/99/9999' },
    { targetCompletionDate: '1/10/26' },
    { targetCompletionDate: '' },
    { targetCompletionDate: '   ' },
    { targetCompletionDate: null },
    { targetCompletionDate: undefined },
  ])(
    'sad path - targetCompletionDate field fails validation - targetCompletionDate: $targetCompletionDate',
    async spec => {
      // Given
      const requestBody = {
        targetCompletionDate: spec.targetCompletionDate,
        title: 'Goal title',
        note: 'Goal notes',
        steps: [
          {
            title: 'Step 1',
            status: 'NOT_STARTED',
            stepNumber: 1,
            reference: 'a2d30c9f-8b1e-46d8-8a19-42620e7d38e0',
          },
        ],
        reference: '0856e8cc-a7e8-49df-941e-8dc9c51f8c77',
        createdAt: '2025-10-22T08:17:13Z',
        originalTargetCompletionDate: '22/1/2026',
        status: 'ACTIVE',
        action: 'submit-form',
      }
      req.body = requestBody

      const expectedErrors: Array<Error> = [
        {
          href: '#targetCompletionDate',
          text: 'Select the target completion date or set another date',
        },
      ]
      const expectedInvalidForm = JSON.stringify(requestBody)

      // When
      await validate(updateGoalSchema)(req, res, next)

      // Then
      expect(req.body).toEqual(requestBody)
      expect(next).not.toHaveBeenCalled()
      expect(req.flash).toHaveBeenCalledWith('invalidForm', expectedInvalidForm)
      expect(res.redirectWithErrors).toHaveBeenCalledWith('/plan/A1234BC/goals/12345/update', expectedErrors)
    },
  )

  it.each([
    { manuallyEnteredTargetCompletionDate: 'not-a-valid-value' },
    { manuallyEnteredTargetCompletionDate: '2025-12-30' },
    { manuallyEnteredTargetCompletionDate: '99/99/9999' },
    { manuallyEnteredTargetCompletionDate: '1/10/26' },
    { manuallyEnteredTargetCompletionDate: '' },
    { manuallyEnteredTargetCompletionDate: '   ' },
    { manuallyEnteredTargetCompletionDate: null },
    { manuallyEnteredTargetCompletionDate: undefined },
  ])(
    'sad path - targetCompletionDate field fails validation - manuallyEnteredTargetCompletionDate: manuallyEnteredTargetCompletionDate',
    async spec => {
      // Given
      const requestBody = {
        manuallyEnteredTargetCompletionDate: spec.manuallyEnteredTargetCompletionDate,
        targetCompletionDate: 'another-date',
        title: 'Goal title',
        note: 'Goal notes',
        steps: [
          {
            title: 'Step 1',
            status: 'NOT_STARTED',
            stepNumber: 1,
            reference: 'a2d30c9f-8b1e-46d8-8a19-42620e7d38e0',
          },
        ],
        reference: '0856e8cc-a7e8-49df-941e-8dc9c51f8c77',
        createdAt: '2025-10-22T08:17:13Z',
        originalTargetCompletionDate: '22/1/2026',
        status: 'ACTIVE',
        action: 'submit-form',
      }
      req.body = requestBody

      const expectedErrors: Array<Error> = [
        {
          href: '#targetCompletionDate',
          text: 'Enter a valid date for when they are aiming to achieve this goal by',
        },
      ]
      const expectedInvalidForm = JSON.stringify(requestBody)

      // When
      await validate(updateGoalSchema)(req, res, next)

      // Then
      expect(req.body).toEqual(requestBody)
      expect(next).not.toHaveBeenCalled()
      expect(req.flash).toHaveBeenCalledWith('invalidForm', expectedInvalidForm)
      expect(res.redirectWithErrors).toHaveBeenCalledWith('/plan/A1234BC/goals/12345/update', expectedErrors)
    },
  )

  it('sad path - targetCompletionDate field fails date not in past validation', async () => {
    // Given
    const requestBody = {
      manuallyEnteredTargetCompletionDate: format(yesterday, 'd/M/yyyy'),
      targetCompletionDate: 'another-date',
      title: 'Goal title',
      note: 'Goal notes',
      steps: [
        {
          title: 'Step 1',
          status: 'NOT_STARTED',
          stepNumber: 1,
          reference: 'a2d30c9f-8b1e-46d8-8a19-42620e7d38e0',
        },
      ],
      reference: '0856e8cc-a7e8-49df-941e-8dc9c51f8c77',
      createdAt: '2025-10-22T08:17:13Z',
      originalTargetCompletionDate: '22/1/2026',
      status: 'ACTIVE',
      action: 'submit-form',
    }
    req.body = requestBody

    const expectedErrors: Array<Error> = [
      {
        href: '#targetCompletionDate',
        text: 'Enter a valid date. Date must be in the future',
      },
    ]
    const expectedInvalidForm = JSON.stringify(requestBody)

    // When
    await validate(updateGoalSchema)(req, res, next)

    // Then
    expect(req.body).toEqual(requestBody)
    expect(next).not.toHaveBeenCalled()
    expect(req.flash).toHaveBeenCalledWith('invalidForm', expectedInvalidForm)
    expect(res.redirectWithErrors).toHaveBeenCalledWith('/plan/A1234BC/goals/12345/update', expectedErrors)
  })

  it.each([
    //
    { steps: undefined },
    { steps: null },
    { steps: [] },
  ])('sad path - entire steps array field fails validation - steps: $steps', async spec => {
    // Given
    const requestBody = {
      targetCompletionDate: format(tomorrow, 'd/M/yyyy'),
      title: 'Goal title',
      note: 'Goal notes',
      steps: spec.steps,
      reference: '0856e8cc-a7e8-49df-941e-8dc9c51f8c77',
      createdAt: '2025-10-22T08:17:13Z',
      originalTargetCompletionDate: '22/1/2026',
      status: 'ACTIVE',
      action: 'submit-form',
    }
    req.body = requestBody

    const expectedErrors: Array<Error> = [
      {
        href: '#steps',
        text: 'Too small: expected array to have >=1 items',
      },
    ]

    // When
    await validate(updateGoalSchema)(req, res, next)

    // Then
    expect(req.body).toEqual(requestBody)
    expect(next).not.toHaveBeenCalled()
    expect(res.redirectWithErrors).toHaveBeenCalledWith('/plan/A1234BC/goals/12345/update', expectedErrors)
  })

  it.each([
    //
    { title: undefined },
    { title: null },
    { title: '' },
    { title: '   ' },
  ])('sad path - mandatory step title field fails validation - title: title', async spec => {
    // Given
    const requestBody = {
      title: 'Goal title',
      targetCompletionDate: format(tomorrow, 'd/M/yyyy'),
      note: 'Goal notes',
      steps: [
        {
          title: spec.title,
          status: 'NOT_STARTED',
          stepNumber: 1,
          reference: 'a2d30c9f-8b1e-46d8-8a19-42620e7d38e0',
        },
      ],
      reference: '0856e8cc-a7e8-49df-941e-8dc9c51f8c77',
      createdAt: '2025-10-22T08:17:13Z',
      originalTargetCompletionDate: '22/1/2026',
      status: 'ACTIVE',
      action: 'submit-form',
    }
    req.body = requestBody

    const expectedErrors: Array<Error> = [
      {
        href: '#steps[0].title',
        text: 'Enter the step needed to work towards the goal',
      },
    ]
    const expectedInvalidForm = JSON.stringify(requestBody)

    // When
    await validate(updateGoalSchema)(req, res, next)

    // Then
    expect(req.body).toEqual(requestBody)
    expect(next).not.toHaveBeenCalled()
    expect(req.flash).toHaveBeenCalledWith('invalidForm', expectedInvalidForm)
    expect(res.redirectWithErrors).toHaveBeenCalledWith('/plan/A1234BC/goals/12345/update', expectedErrors)
  })

  it('sad path - step title field fails validation', async () => {
    // Given
    const requestBody = {
      title: 'Goal title',
      targetCompletionDate: format(tomorrow, 'd/M/yyyy'),
      note: 'Goal notes',
      steps: [
        {
          title: 'A valid step title',
          status: 'NOT_STARTED',
          stepNumber: 1,
          reference: 'a2d30c9f-8b1e-46d8-8a19-42620e7d38e0',
        },
        {
          title: '',
          status: 'NOT_STARTED',
          stepNumber: 2,
          reference: 'f7b4f5c5-9f54-49e5-8709-05b7cf2dbb7c',
        }, // expect this step to be in error due to missing title
        {
          title: 'a'.repeat(513),
          status: 'ACTIVE',
          stepNumber: 3,
          reference: 'db6a2c5d-8e68-46ad-a7e2-d9ecfb793149',
        }, // expect this step to be in error due to title exceeding max length
        {
          title: 'A completed step',
          status: 'COMPLETE',
          stepNumber: 4,
          reference: 'b0dd655c-2df9-46e7-adb5-fde5b4cdf853',
        },
      ],
      reference: '0856e8cc-a7e8-49df-941e-8dc9c51f8c77',
      createdAt: '2025-10-22T08:17:13Z',
      originalTargetCompletionDate: '22/1/2026',
      status: 'ACTIVE',
      action: 'submit-form',
    }
    req.body = requestBody

    const expectedErrors: Array<Error> = [
      {
        href: '#steps[1].title',
        text: 'Enter the step needed to work towards the goal',
      },
      {
        href: '#steps[2].title',
        text: 'The step description must be 512 characters or less',
      },
    ]
    const expectedInvalidForm = JSON.stringify(requestBody)

    // When
    await validate(updateGoalSchema)(req, res, next)

    // Then
    expect(req.body).toEqual(requestBody)
    expect(next).not.toHaveBeenCalled()
    expect(req.flash).toHaveBeenCalledWith('invalidForm', expectedInvalidForm)
    expect(res.redirectWithErrors).toHaveBeenCalledWith('/plan/A1234BC/goals/12345/update', expectedErrors)
  })
})
