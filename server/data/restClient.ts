import superagent, { Response, ResponseError } from 'superagent'
import Agent, { HttpsAgent } from 'agentkeepalive'
import { Readable } from 'stream'

import logger from '../../logger'
import sanitiseError from '../sanitisedError'
import { ApiConfig } from '../config'
import type { UnsanitisedError } from '../sanitisedError'
import { restClientMetricsMiddleware } from './restClientMetricsMiddleware'

interface GetRequest {
  path?: string
  query?: Record<string, string>
  headers?: Record<string, string>
  responseType?: string
  raw?: boolean
  retry?: boolean
}

interface PostRequest {
  path?: string
  headers?: Record<string, string>
  responseType?: string
  data?: Record<string, unknown>
  raw?: boolean
  retry?: boolean
}

interface PutRequest {
  path?: string
  headers?: Record<string, string>
  responseType?: string
  data?: Record<string, unknown>
  raw?: boolean
  retry?: boolean
}

interface DeleteRequest {
  path?: string
  query?: Record<string, string>
  headers?: Record<string, string>
  responseType?: string
  raw?: boolean
  retry?: boolean
}

interface StreamRequest {
  path?: string
  headers?: Record<string, string>
  errorLogger?: (e: UnsanitisedError) => void
}

export default class RestClient {
  agent: Agent

  constructor(
    private readonly name: string,
    private readonly config: ApiConfig,
    private readonly token: string,
  ) {
    this.agent = config.url.startsWith('https') ? new HttpsAgent(config.agent) : new Agent(config.agent)
  }

  private apiUrl() {
    return this.config.url
  }

  private timeoutConfig() {
    return this.config.timeout
  }

  private logRequest(method: string, path: string, query = {}) {
    if (this.token) {
      const queryString = this.queryString(query)
      logger.info(`${method.toUpperCase()} request using user credentials: calling ${this.name}: ${path}${queryString}`)
    } else {
      logger.info(`Anonymous ${method.toUpperCase()} request: calling ${this.name}: ${path} ${query}`)
    }
  }

  private queryString(query?: Record<string, string>): string {
    if (query && Object.keys(query).length > 0) {
      const queryString = Object.keys(query).map((key, idx) => {
        let delimiter = `&`
        if (idx === Object.keys(query).length - 1) {
          delimiter = ''
        }
        return `${key}=${encodeURI(query[key])}${delimiter}`
      })
      return `?${queryString}`
    }
    return ''
  }

  async get({
    path = null,
    query = {},
    headers = {},
    responseType = '',
    raw = false,
    retry = false,
  }: GetRequest): Promise<unknown> {
    return this.processRequest({ path, headers, responseType, query, raw, retry, method: 'get' })
  }

  async post({
    path = null,
    headers = {},
    responseType = '',
    data = {},
    raw = false,
    retry = false,
  }: PostRequest = {}): Promise<unknown> {
    return this.processRequest({ path, headers, responseType, data, raw, retry, method: 'post' })
  }

  async put({
    path = null,
    headers = {},
    responseType = '',
    data = {},
    raw = false,
    retry = false,
  }: PutRequest = {}): Promise<unknown> {
    return this.processRequest({ path, headers, responseType, data, raw, retry, method: 'put' })
  }

  async delete({
    path = null,
    query = {},
    headers = {},
    responseType = '',
    raw = false,
    retry = false,
  }: DeleteRequest = {}): Promise<unknown> {
    return this.processRequest({ path, headers, responseType, query, raw, retry, method: 'delete' })
  }

  private async processRequest({
    path = null,
    headers = {},
    responseType = '',
    query = undefined,
    data = undefined,
    retry = false,
    raw = false,
    method = undefined as 'get' | 'post' | 'put' | 'delete',
  } = {}): Promise<unknown> {
    this.logRequest(method, path, query)

    const request = superagent[method](`${this.apiUrl()}${path}`)
    request
      .agent(this.agent)
      .retry(2, (err: ResponseError) => {
        if (retry === false) {
          return false
        }
        if (err) logger.info(`Retry handler found API error with ${err.status} ${err.message}`)
        return undefined // retry handler only for logging retries, not to influence retry logic
      })
      .set(headers)
      .responseType(responseType)
      .timeout(this.timeoutConfig())
      .use(restClientMetricsMiddleware)

    if (data) {
      request.send(data)
    }
    if (query) {
      request.query(query)
    }

    if (this.token) {
      request.auth(this.token, { type: 'bearer' })
    }

    return request
      .then((result: Response) => (raw ? result : result.body))
      .catch((error: ResponseError): void => {
        const sanitisedError = sanitiseError(error)
        logger.warn({ ...sanitisedError }, `Error calling ${this.name}, path: '${path}', verb: ${method.toUpperCase()}`)
        throw sanitisedError
      })
  }

  async stream({ path = null, headers = {} }: StreamRequest = {}): Promise<unknown> {
    logger.info(`Get using user credentials: calling ${this.name}: ${path}`)
    return new Promise((resolve, reject) => {
      superagent
        .get(`${this.apiUrl()}${path}`)
        .agent(this.agent)
        .auth(this.token, { type: 'bearer' })
        .use(restClientMetricsMiddleware)
        .retry(2, (err, res) => {
          if (err) logger.info(`Retry handler found API error with ${err.code} ${err.message}`)
          return undefined // retry handler only for logging retries, not to influence retry logic
        })
        .timeout(this.timeoutConfig())
        .set(headers)
        .end((error, response) => {
          if (error) {
            logger.warn(sanitiseError(error), `Error calling ${this.name}`)
            reject(error)
          } else if (response) {
            const s = new Readable()
            // eslint-disable-next-line no-underscore-dangle,@typescript-eslint/no-empty-function
            s._read = () => {}
            s.push(response.body)
            s.push(null)
            resolve(s)
          }
        })
    })
  }
}
