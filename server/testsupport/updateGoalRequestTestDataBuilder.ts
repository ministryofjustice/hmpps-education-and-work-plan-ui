import type { UpdateGoalRequest, UpdateStepRequest } from 'educationAndWorkPlanApiClient'

const aValidUpdateGoalRequestWithOneUpdatedStep = (
  goalReference = '95b18362-fe56-4234-9ad2-11ef98b974a3',
): UpdateGoalRequest => {
  const updateStepRequest: UpdateStepRequest = {
    stepReference: 'c77cd2fb-40e0-4354-982a-5c8017e92b26',
    title: 'Book course',
    targetDateRange: 'ZERO_TO_THREE_MONTHS',
    sequenceNumber: 1,
    status: 'ACTIVE',
  }
  return {
    goalReference,
    title: 'Learn Spanish',
    reviewDate: undefined,
    status: 'ACTIVE',
    steps: [updateStepRequest],
    notes: 'Prisoner is not good at listening',
  }
}

const aValidUpdateGoalRequestWithMultipleUpdatedSteps = (
  goalReference = '95b18362-fe56-4234-9ad2-11ef98b974a3',
): UpdateGoalRequest => {
  const updateStepRequest1: UpdateStepRequest = {
    stepReference: 'c77cd2fb-40e0-4354-982a-5c8017e92b26',
    title: 'Book course',
    targetDateRange: 'ZERO_TO_THREE_MONTHS',
    sequenceNumber: 1,
    status: 'ACTIVE',
  }
  const updateStepRequest2: UpdateStepRequest = {
    stepReference: 'f2bf8af7-dd89-4305-b312-3a7fbe2d41a3',
    title: 'Attend course',
    targetDateRange: 'SIX_TO_TWELVE_MONTHS',
    sequenceNumber: 2,
    status: 'NOT_STARTED',
  }
  return {
    goalReference,
    title: 'Learn Spanish',
    reviewDate: undefined,
    status: 'ACTIVE',
    steps: [updateStepRequest1, updateStepRequest2],
    notes: 'Prisoner is not good at listening',
  }
}

const aValidUpdateGoalRequestWithOneUpdatedStepAndOneNewStep = (
  goalReference = '95b18362-fe56-4234-9ad2-11ef98b974a3',
): UpdateGoalRequest => {
  const updateStepRequest1: UpdateStepRequest = {
    stepReference: 'c77cd2fb-40e0-4354-982a-5c8017e92b26',
    title: 'Book course',
    targetDateRange: 'ZERO_TO_THREE_MONTHS',
    sequenceNumber: 1,
    status: 'ACTIVE',
  }
  const updateStepRequest2: UpdateStepRequest = {
    stepReference: undefined,
    title: 'Attend course and pass exam',
    targetDateRange: 'SIX_TO_TWELVE_MONTHS',
    sequenceNumber: 2,
    status: 'NOT_STARTED',
  }
  return {
    goalReference,
    title: 'Learn Spanish',
    reviewDate: undefined,
    status: 'ACTIVE',
    steps: [updateStepRequest1, updateStepRequest2],
    notes: 'Prisoner is not good at listening',
  }
}

export {
  aValidUpdateGoalRequestWithOneUpdatedStep,
  aValidUpdateGoalRequestWithMultipleUpdatedSteps,
  aValidUpdateGoalRequestWithOneUpdatedStepAndOneNewStep,
}
