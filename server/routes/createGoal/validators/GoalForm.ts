import { ArrayMinSize, IsEnum, IsNotEmpty, MaxLength, ValidateIf, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'
import { isAfter, isValid, startOfToday } from 'date-fns'
import SimpleDateValidator, { SimpleDate } from '../../../validators/classValidatorTypes/SimpleDate'

export enum CreateGoalFormAction {
  REMOVE_STEP = 'REMOVE_STEP',
  REMOVE_GOAL = 'REMOVE_GOAL',
  ADD_STEP = 'ADD_STEP',
  ADD_GOAL = 'ADD_GOAL',
}

export enum GoalCompleteDateOptions {
  THREE_MONTHS = 'THREE_MONTHS',
  SIX_MONTHS = 'SIX_MONTHS',
  TWELVE_MONTHS = 'TWELVE_MONTHS',
  ANOTHER_DATE = 'ANOTHER_DATE',
}

export class StepInput {
  @IsNotEmpty({ message: 'Enter the step needed to work towards the goal' })
  @MaxLength(512, { message: 'The step description must be $constraint1 characters or less' })
  title: string
}

export class GoalForm {
  @IsNotEmpty({ message: 'Enter the goal description' })
  @MaxLength(512, { message: `The goal description must be $constraint1 characters or less` })
  title: string

  @IsEnum(GoalCompleteDateOptions, { message: 'Select when they are aiming to achieve this goal by' })
  targetCompletionDateOption?: GoalCompleteDateOptions

  @Type(() => SimpleDate)
  @ValidateIf(o => o.targetCompletionDateOption === GoalCompleteDateOptions.ANOTHER_DATE)
  @SimpleDateValidator(simpleDate => isValid(simpleDate?.richDate), {
    message: 'Enter a valid date for when they are aiming to achieve this goal by',
  })
  @SimpleDateValidator(simpleDate => isAfter(simpleDate?.richDate, startOfToday()), {
    message: 'Enter a valid date. Date must be in the future',
  })
  anotherDate?: SimpleDate

  @ValidateNested()
  @ArrayMinSize(1, { message: 'At least one step required' })
  @Type(() => StepInput)
  steps: Array<StepInput>

  note?: string
}

export class CreateGoalsForm {
  @ValidateNested({ each: true })
  @ArrayMinSize(1, { message: 'At least one goal required' })
  @Type(() => GoalForm)
  goals: Array<GoalForm>
}

/* Types for partial form submits (eg, form action submissions piror to submiting the complete form) */
export class PartialGoalsForm {
  @ArrayMinSize(1, { message: 'At least one step required' })
  steps: Array<unknown>
}

export class PartialCreateGoalsForm {
  @ValidateNested({ each: true })
  @ArrayMinSize(1, { message: 'At least one goal required' })
  goals: Array<PartialGoalsForm>
}
