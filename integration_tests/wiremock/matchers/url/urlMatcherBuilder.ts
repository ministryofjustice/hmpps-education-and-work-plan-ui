/**
 * Superclass for matcher builder classes for the request URL.
 */
export default abstract class UrlMatcherBuilder {
  abstract build(): Record<string, unknown>
}
