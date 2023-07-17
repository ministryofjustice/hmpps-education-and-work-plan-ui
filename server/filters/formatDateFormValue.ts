export default function formatDateFormValue(value: string): string {
  const dateRange = DateRange[value as keyof typeof DateRange]
  return dateRange
}

export enum DateRange {
  ZERO_TO_THREE_MONTHS = '0 to 3 months',
  THREE_TO_SIX_MONTHS = '3 to 6 months',
  SIX_TO_TWELVE_MONTHS = '6 to 12 months',
  MORE_THAN_TWELVE_MONTHS = 'More than 12 months',
}
