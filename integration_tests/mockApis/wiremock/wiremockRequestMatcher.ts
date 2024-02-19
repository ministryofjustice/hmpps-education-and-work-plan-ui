/**
 * WiremockRequestMatcher - based heavily on the type defined in the (Wiremock openApi spec)[https://wiremock.org/assets/js/wiremock-admin-api.json]
 */
export default interface WiremockRequestMatcher {
  method?: string
  url?: string
  urlPath?: string
  urlPathPattern?: string
  urlPattern?: string
  queryParameters?: Record<string, unknown>
  headers?: Record<string, unknown>
  basicAuthCredentials?: {
    password: string
    username: string
  }
  cookies?: Record<string, unknown>
  bodyPatterns?: Record<string, unknown>[]
}
