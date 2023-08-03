import type { UpdateGoalForm } from 'forms'
import validateGoalTitle from '../../validators/goalTitleValidator'
import validateGoalStatus from '../../validators/goalStatusValidator'
import validateStepTitle from '../../validators/stepTitleValidator'
import validateStepTargetDateRange from '../../validators/stepTargetDateRangeValidator'
import validateStepStatus from '../../validators/stepStatusValidator'
import validateUpdateGoalForm from './updateGoalFormValidator'
import aValidUpdateGoalForm from '../../testsupport/updateGoalFormTestDataBuilder'

jest.mock('../../validators/goalTitleValidator')
jest.mock('../../validators/stepStatusValidator')
jest.mock('../../validators/stepTitleValidator')
jest.mock('../../validators/stepTargetDateRangeValidator')
jest.mock('../../validators/goalStatusValidator')

describe('updateGoalFormValidator', () => {
  const mockedValidateGoalTitle = validateGoalTitle as jest.MockedFunction<typeof validateGoalTitle>
  const mockedValidateGoalStatus = validateGoalStatus as jest.MockedFunction<typeof validateGoalStatus>
  const mockedValidateStepTitle = validateStepTitle as jest.MockedFunction<typeof validateStepTitle>
  const mockedValidateStepTargetDateRange = validateStepTargetDateRange as jest.MockedFunction<
    typeof validateStepTargetDateRange
  >
  const mockedValidateStepStatus = validateStepStatus as jest.MockedFunction<typeof validateStepStatus>

  it('should validate given no errors', () => {
    // Given
    const form: UpdateGoalForm = aValidUpdateGoalForm()

    mockedValidateGoalTitle.mockReturnValue([])
    mockedValidateGoalStatus.mockReturnValue([])
    mockedValidateStepTitle.mockReturnValue([])
    mockedValidateStepTargetDateRange.mockReturnValue([])
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
      reviewDate: undefined,
      status: 'ACTIVE',
      note: 'Prisoner is not good at listening',
      steps: [
        {
          reference: 'c77cd2fb-40e0-4354-982a-5c8017e92b26',
          title: 'Book course',
          targetDateRange: 'ZERO_TO_THREE_MONTHS',
          stepNumber: 1,
          status: 'ACTIVE',
        },
      ],
    }

    mockedValidateGoalTitle.mockReturnValue(['some-title-error'])
    mockedValidateGoalStatus.mockReturnValue([])
    mockedValidateStepTitle.mockReturnValue([])
    mockedValidateStepTargetDateRange.mockReturnValue([])
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
      reviewDate: undefined,
      status: undefined,
      note: 'Prisoner is not good at listening',
      steps: [
        {
          reference: 'c77cd2fb-40e0-4354-982a-5c8017e92b26',
          title: 'Book course',
          targetDateRange: 'ZERO_TO_THREE_MONTHS',
          stepNumber: 1,
          status: 'ACTIVE',
        },
      ],
    }

    mockedValidateGoalTitle.mockReturnValue([])
    mockedValidateGoalStatus.mockReturnValue(['some-status-error'])
    mockedValidateStepTitle.mockReturnValue([])
    mockedValidateStepTargetDateRange.mockReturnValue([])
    mockedValidateStepStatus.mockReturnValue([])

    // When
    const errors = validateUpdateGoalForm(form)

    // Then
    expect(errors).toEqual([{ href: '#status', text: 'some-status-error' }])
  })

  it('should validate given step title errors', () => {
    const form: UpdateGoalForm = {
      reference: '95b18362-fe56-4234-9ad2-11ef98b974a3',
      title: 'Learn Spanish',
      reviewDate: undefined,
      status: 'ACTIVE',
      note: 'Prisoner is not good at listening',
      steps: [
        {
          reference: 'c77cd2fb-40e0-4354-982a-5c8017e92b26',
          title: undefined,
          targetDateRange: 'ZERO_TO_THREE_MONTHS',
          stepNumber: 1,
          status: 'ACTIVE',
        },
      ],
    }

    mockedValidateGoalTitle.mockReturnValue([])
    mockedValidateGoalStatus.mockReturnValue([])
    mockedValidateStepTitle.mockReturnValue(['some-title-error'])
    mockedValidateStepTargetDateRange.mockReturnValue([])
    mockedValidateStepStatus.mockReturnValue([])

    // When
    const errors = validateUpdateGoalForm(form)

    // Then
    expect(errors).toEqual([{ href: '#steps[0].title', text: 'some-title-error' }])
  })

  it('should validate given step title errors', () => {
    const form: UpdateGoalForm = {
      reference: '95b18362-fe56-4234-9ad2-11ef98b974a3',
      title: 'Learn Spanish',
      reviewDate: undefined,
      status: 'ACTIVE',
      note: 'Prisoner is not good at listening',
      steps: [
        {
          reference: 'c77cd2fb-40e0-4354-982a-5c8017e92b26',
          title: 'Book course',
          targetDateRange: 'ZERO_TO_THREE_MONTHS',
          stepNumber: 1,
          status: undefined,
        },
      ],
    }

    mockedValidateGoalTitle.mockReturnValue([])
    mockedValidateGoalStatus.mockReturnValue([])
    mockedValidateStepTitle.mockReturnValue([])
    mockedValidateStepTargetDateRange.mockReturnValue([])
    mockedValidateStepStatus.mockReturnValue(['some-status-error'])

    // When
    const errors = validateUpdateGoalForm(form)

    // Then
    expect(errors).toEqual([{ href: '#steps[0].status', text: 'some-status-error' }])
  })

  it('should validate given step title errors', () => {
    const form: UpdateGoalForm = {
      reference: '95b18362-fe56-4234-9ad2-11ef98b974a3',
      title: 'Learn Spanish',
      reviewDate: undefined,
      status: 'ACTIVE',
      note: 'Prisoner is not good at listening',
      steps: [
        {
          reference: 'c77cd2fb-40e0-4354-982a-5c8017e92b26',
          title: 'Book course',
          targetDateRange: undefined,
          stepNumber: 1,
          status: 'ACTIVE',
        },
      ],
    }

    mockedValidateGoalTitle.mockReturnValue([])
    mockedValidateGoalStatus.mockReturnValue([])
    mockedValidateStepTitle.mockReturnValue([])
    mockedValidateStepTargetDateRange.mockReturnValue(['some-date-range-error'])
    mockedValidateStepStatus.mockReturnValue([])

    // When
    const errors = validateUpdateGoalForm(form)

    // Then
    expect(errors).toEqual([{ href: '#steps[0].targetDateRange', text: 'some-date-range-error' }])
  })
})
