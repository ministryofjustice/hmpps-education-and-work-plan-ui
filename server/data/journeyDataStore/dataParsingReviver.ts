import { isValid, parseISO } from 'date-fns'

/**
 * JSON Parse reviver function that identifies fields that should be parsed as real Date objects rather than string
 * values. (The JSON parse function does not natively parse values into Date objects, so it needs help via a function
 * such as this)
 */
const dataParsingReviver = (dateFields: Array<string>) => {
  return (key: string, value: never) => {
    if (typeof value !== 'string') {
      return value
    }
    const dateObj = parseISO(value)
    return dateFields.includes(key) && isValid(dateObj) ? dateObj : value
  }
}

export default dataParsingReviver
