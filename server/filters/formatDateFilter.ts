import { format } from 'date-fns'

export default function formatDateFilter(value?: Date, pattern?: string): string {
  try {
    if (value) {
      return pattern
        ? format(value, replaceMomentPatternTokensWithDateFnsPatternTokens(pattern))
        : format(value, `yyyy-MM-dd'T'HH:mm:ssxxx`)
    }
  } catch {
    // noop
  }
  return undefined
}

const replaceMomentPatternTokensWithDateFnsPatternTokens = (pattern: string): string =>
  pattern //
    .replaceAll(/D/g, 'd') // replace moment 'D' token with date-fns 'd' equivalent
    .replaceAll(/Y/g, 'y') // replace moment 'Y' token with date-fns 'y' equivalent
