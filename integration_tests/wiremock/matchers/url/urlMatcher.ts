export default abstract class UrlMatcher {
  abstract build(): Record<string, unknown>
}
