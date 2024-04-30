import { Expose, Transform, Type, plainToInstance } from 'class-transformer'
import { IsInt, Max, Min, ValidationOptions, registerDecorator } from 'class-validator'
import { getDate, getMonth, getYear, isValid, parse, startOfToday } from 'date-fns'

const DAY_MESSAGE = 'Enter a valid day'
const MONTH_MESSAGE = 'Enter a valid month'
const YEAR_MESSAGE = 'Enter a valid year'

export class SimpleDate {
  @Type(() => Number)
  @IsInt({ message: DAY_MESSAGE })
  @Min(1, { message: DAY_MESSAGE })
  @Max(31, { message: DAY_MESSAGE })
  day: string

  @Type(() => Number)
  @IsInt({ message: MONTH_MESSAGE })
  @Min(1, { message: MONTH_MESSAGE })
  @Max(12, { message: MONTH_MESSAGE })
  month: string

  @Type(() => Number)
  @IsInt({ message: YEAR_MESSAGE })
  @Min(1, { message: YEAR_MESSAGE })
  @Min(1000, { message: 'Year must be entered in the format YYYY' })
  year: string

  @Expose()
  @Transform(({ obj }) => parse(`${obj.year}-${obj.month}-${obj.day}`, 'yyyy-MM-dd', startOfToday()))
  richDate: Date
}

export default function SimpleDateValidator(
  validator: (simpleDate: SimpleDate) => boolean,
  validationOptions?: ValidationOptions,
) {
  return (object: unknown, propertyName: string) => {
    registerDecorator({
      name: 'SimpleDateValidator',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate: (simpleDate: SimpleDate) => validator(simpleDate),
      },
    })
  }
}

export const simpleDateFromDate = (date: Date) => {
  if (!date || !isValid(date)) return null
  return plainToInstance(SimpleDate, {
    day: getDate(date),
    month: getMonth(date) + 1, // Translate zero indexed month to one indexed
    year: getYear(date),
  })
}
