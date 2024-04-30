import { IsNotEmpty, MaxLength, ValidateIf, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'
import { isAfter, isValid, startOfToday } from 'date-fns'
import SimpleDateValidator, { SimpleDate } from '../../../validators/classValidatorTypes/SimpleDate'

class StepInput {
  @IsNotEmpty({ message: 'Enter the step needed to work towards the goal' })
  @MaxLength(512, { message: 'The step description must be $constraint1 characters or less' })
  title: string
}

export class GoalForm {
  @IsNotEmpty({ message: 'Enter the goal description' })
  @MaxLength(512, { message: `The goal description must be $constraint1 characters or less` })
  title: string

  @IsNotEmpty({ message: 'Select when they are aiming to achieve this goal by' })
  targetCompletionDate?: string

  @ValidateIf(o => o.targetCompletionDate === 'another-date')
  @Type(() => SimpleDate)
  @SimpleDateValidator(simpleDate => isValid(simpleDate?.richDate), {
    message: 'Enter a valid date for when they are aiming to achieve this goal by',
  })
  @SimpleDateValidator(simpleDate => isAfter(simpleDate?.richDate, startOfToday()), {
    message: 'Enter a valid date. Date must be in the future',
  })
  anotherDate?: SimpleDate

  @ValidateNested()
  @Type(() => StepInput)
  steps: StepInput[]

  note?: string
}

export class CreateGoalsForm {
  action?: string

  @ValidateIf(o => o.action === 'submit-form')
  @ValidateNested({ each: true })
  @Type(() => GoalForm)
  goals: GoalForm[]
}
