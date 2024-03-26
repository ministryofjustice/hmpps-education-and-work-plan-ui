export default function formatCuriousCourseStatusFilter(value: string): string {
  const curiousCourseStatusValue = CuriousCourseStatusValues[value as keyof typeof CuriousCourseStatusValues]
  return curiousCourseStatusValue
}

enum CuriousCourseStatusValues {
  IN_PROGRESS = 'In progress',
  COMPLETED = 'Completed',
  WITHDRAWN = 'Withdrawn',
  TEMPORARILY_WITHDRAWN = 'Temporarily withdrawn',
}
