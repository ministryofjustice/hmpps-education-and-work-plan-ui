export default function formatIsAccreditedFilter(value: boolean): string {
  if (value === true) {
    return 'Accredited'
  }
  return 'Non-accredited'
}
