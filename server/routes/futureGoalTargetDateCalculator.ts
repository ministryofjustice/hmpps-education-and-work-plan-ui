import { add, format } from 'date-fns'

export default function futureGoalTargetDate(
  startDate: Date,
  additionalMonths: number,
): { text: string; value: string } {
  const futureDate = add(startDate, { months: additionalMonths })
  return {
    value: format(futureDate, 'yyyy-MM-dd'),
    text: `in ${additionalMonths} months (by ${format(futureDate, 'd MMMM yyyy')})`,
  }
}
