/**
 * WiremockMatchedRequest - based heavily on the type defined in the (Wiremock openApi spec)[https://wiremock.org/assets/js/wiremock-admin-api.json]
 */
export default interface WiremockMatchedRequest {
  url?: string
  absoluteUrl?: string
  method?: string
  headers: Record<string, unknown>
  body?: string
  browserProxyRequest?: boolean
  loggedDate?: Date
  loggedDateString?: string
  queryParams?: Record<string, { key: string; values: Array<string> }>
}
