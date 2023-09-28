import moment from 'moment'

export default function futureGoalTargetDate(
  startDate: Date,
  additionalMonths: number,
): { text: string; value: string } {
  const futureDate = moment(startDate).add(additionalMonths, 'months')
  return {
    value: futureDate.format('YYYY-MM-DD'),
    text: `in ${additionalMonths} months (${futureDate.format('D MMMM YYYY')})`,
  }
}
