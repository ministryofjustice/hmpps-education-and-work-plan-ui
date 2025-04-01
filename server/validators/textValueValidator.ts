/**
 * Simple validator function that validates a string value against a maximum length, but taking into account the fact that
 * a new line (CRLF) in the supplied value is 2 characters.
 * Before comparing the length, all instances of CRLF (2 characters - '\r\n') are replaced with a single '\n' character.
 * This is non-destructive and does not change the source value itself.
 */
const textValueExceedsLength = (value: string, maxLength: number): boolean =>
  value.replaceAll(/\r\n/g, '\n').length > maxLength

/**
 * Simple validator function that validates that a string value is not considered empty by removing any whitespace (full
 * trim) before checking its length.
 */
const isEmpty = (value: string): boolean => (value || '').trim().length === 0

export { isEmpty, textValueExceedsLength }
