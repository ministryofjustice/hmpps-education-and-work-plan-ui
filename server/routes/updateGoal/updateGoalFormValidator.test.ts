import type { UpdateGoalForm } from 'forms'
import validateGoalTitle from '../../validators/goalTitleValidator'
import validateGoalStatus from '../../validators/goalStatusValidator'
import validateStepTitle from '../../validators/stepTitleValidator'
import validateStepStatus from '../../validators/stepStatusValidator'
import goalTargetCompletionDateValidator from '../../validators/goalTargetCompletionDateValidator'
import validateUpdateGoalForm from './updateGoalFormValidator'
import { aValidUpdateGoalForm } from '../../testsupport/updateGoalFormTestDataBuilder'

jest.mock('../../validators/goalTitleValidator')
jest.mock('../../validators/stepStatusValidator')
jest.mock('../../validators/stepTitleValidator')
jest.mock('../../validators/goalStatusValidator')
jest.mock('../../validators/goalTargetCompletionDateValidator')

describe('updateGoalFormValidator', () => {
  const mockedValidateGoalTitle = validateGoalTitle as jest.MockedFunction<typeof validateGoalTitle>
  const mockedValidateGoalStatus = validateGoalStatus as jest.MockedFunction<typeof validateGoalStatus>
  const mockedValidateGoalTargetCompletionDate = goalTargetCompletionDateValidator as jest.MockedFunction<
    typeof goalTargetCompletionDateValidator
  >
  const mockedValidateStepTitle = validateStepTitle as jest.MockedFunction<typeof validateStepTitle>
  const mockedValidateStepStatus = validateStepStatus as jest.MockedFunction<typeof validateStepStatus>

  it('should validate given no errors', () => {
    // Given
    const form: UpdateGoalForm = aValidUpdateGoalForm()

    mockedValidateGoalTitle.mockReturnValue([])
    mockedValidateGoalStatus.mockReturnValue([])
    mockedValidateGoalTargetCompletionDate.mockReturnValue([])
    mockedValidateStepTitle.mockReturnValue([])
    mockedValidateStepStatus.mockReturnValue([])

    // When
    const errors = validateUpdateGoalForm(form)

    // Then
    expect(errors).toEqual([])
  })

  it('should validate given goal title errors', () => {
    const form: UpdateGoalForm = {
      reference: '95b18362-fe56-4234-9ad2-11ef98b974a3',
      title: undefined,
      createdAt: '2023-01-16',
      targetCompletionDate: '2024-02-29',
      'targetCompletionDate-day': null,
      'targetCompletionDate-month': null,
      'targetCompletionDate-year': null,
      status: 'ACTIVE',
      note: 'Prisoner is not good at listening',
      steps: [
        {
          reference: 'c77cd2fb-40e0-4354-982a-5c8017e92b26',
          title: 'Book course',
          stepNumber: 1,
          status: 'ACTIVE',
        },
      ],
      originalTargetCompletionDate: '2024-02-29',
    }

    mockedValidateGoalTitle.mockReturnValue(['some-title-error'])
    mockedValidateGoalStatus.mockReturnValue([])
    mockedValidateGoalTargetCompletionDate.mockReturnValue([])
    mockedValidateStepTitle.mockReturnValue([])
    mockedValidateStepStatus.mockReturnValue([])

    // When
    const errors = validateUpdateGoalForm(form)

    // Then
    expect(errors).toEqual([{ href: '#title', text: 'some-title-error' }])
  })

  it('should validate given goal status errors', () => {
    const form: UpdateGoalForm = {
      reference: '95b18362-fe56-4234-9ad2-11ef98b974a3',
      title: 'Learn Spanish',
      createdAt: '2023-01-16',
      targetCompletionDate: '2024-02-29',
      'targetCompletionDate-day': null,
      'targetCompletionDate-month': null,
      'targetCompletionDate-year': null,
      status: undefined,
      note: 'Prisoner is not good at listening',
      steps: [
        {
          reference: 'c77cd2fb-40e0-4354-982a-5c8017e92b26',
          title: 'Book course',
          stepNumber: 1,
          status: 'ACTIVE',
        },
      ],
      originalTargetCompletionDate: '2024-02-29',
    }

    mockedValidateGoalTitle.mockReturnValue([])
    mockedValidateGoalStatus.mockReturnValue(['some-status-error'])
    mockedValidateGoalTargetCompletionDate.mockReturnValue([])
    mockedValidateStepTitle.mockReturnValue([])
    mockedValidateStepStatus.mockReturnValue([])

    // When
    const errors = validateUpdateGoalForm(form)

    // Then
    expect(errors).toEqual([{ href: '#status', text: 'some-status-error' }])
  })

  it('should validate given goal target completion date errors', () => {
    const form: UpdateGoalForm = {
      reference: '95b18362-fe56-4234-9ad2-11ef98b974a3',
      title: 'Learn Spanish',
      createdAt: '2023-01-16',
      targetCompletionDate: 'another-date',
      'targetCompletionDate-day': null,
      'targetCompletionDate-month': null,
      'targetCompletionDate-year': null,
      status: 'ACTIVE',
      note: 'Prisoner is not good at listening',
      steps: [
        {
          reference: 'c77cd2fb-40e0-4354-982a-5c8017e92b26',
          title: 'Book course',
          stepNumber: 1,
          status: 'ACTIVE',
        },
      ],
      originalTargetCompletionDate: '2024-02-29',
    }

    mockedValidateGoalTitle.mockReturnValue([])
    mockedValidateGoalStatus.mockReturnValue([])
    mockedValidateGoalTargetCompletionDate.mockReturnValue(['some-target-completion-date-error'])
    mockedValidateStepTitle.mockReturnValue([])
    mockedValidateStepStatus.mockReturnValue([])

    // When
    const errors = validateUpdateGoalForm(form)

    // Then
    expect(errors).toEqual([{ href: '#targetCompletionDate', text: 'some-target-completion-date-error' }])
  })

  it('should validate given step title errors', () => {
    const form: UpdateGoalForm = {
      reference: '95b18362-fe56-4234-9ad2-11ef98b974a3',
      title: 'Learn Spanish',
      createdAt: '2023-01-16',
      targetCompletionDate: '2024-02-29',
      'targetCompletionDate-day': null,
      'targetCompletionDate-month': null,
      'targetCompletionDate-year': null,
      status: 'ACTIVE',
      note: 'Prisoner is not good at listening',
      steps: [
        {
          reference: 'c77cd2fb-40e0-4354-982a-5c8017e92b26',
          title: undefined,
          stepNumber: 1,
          status: 'ACTIVE',
        },
      ],
      originalTargetCompletionDate: '2024-02-29',
    }

    mockedValidateGoalTitle.mockReturnValue([])
    mockedValidateGoalStatus.mockReturnValue([])
    mockedValidateGoalTargetCompletionDate.mockReturnValue([])
    mockedValidateStepTitle.mockReturnValue(['some-title-error'])
    mockedValidateStepStatus.mockReturnValue([])

    // When
    const errors = validateUpdateGoalForm(form)

    // Then
    expect(errors).toEqual([{ href: '#steps[0][title]', text: 'some-title-error' }])
  })

  it('should validate given step title errors', () => {
    const form: UpdateGoalForm = {
      reference: '95b18362-fe56-4234-9ad2-11ef98b974a3',
      title: 'Learn Spanish',
      createdAt: '2023-01-16',
      targetCompletionDate: '2024-02-29',
      'targetCompletionDate-day': null,
      'targetCompletionDate-month': null,
      'targetCompletionDate-year': null,
      status: 'ACTIVE',
      note: 'Prisoner is not good at listening',
      steps: [
        {
          reference: 'c77cd2fb-40e0-4354-982a-5c8017e92b26',
          title: 'Book course',
          stepNumber: 1,
          status: undefined,
        },
      ],
      originalTargetCompletionDate: '2024-02-29',
    }

    mockedValidateGoalTitle.mockReturnValue([])
    mockedValidateGoalStatus.mockReturnValue([])
    mockedValidateGoalTargetCompletionDate.mockReturnValue([])
    mockedValidateStepTitle.mockReturnValue([])
    mockedValidateStepStatus.mockReturnValue(['some-status-error'])

    // When
    const errors = validateUpdateGoalForm(form)

    // Then
    expect(errors).toEqual([{ href: '#steps[0][status]', text: 'some-status-error' }])
  })
})
