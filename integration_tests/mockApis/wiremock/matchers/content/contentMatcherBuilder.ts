/**
 * Superclass for matcher builder classes for the request body content.
 */
export default abstract class ContentMatcherBuilder {
  abstract build(): Record<string, unknown>
}
