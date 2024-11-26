const production = process.env.NODE_ENV === 'production'

const toBoolean = (value: unknown): boolean => {
  return value === 'true'
}

function get<T>(name: string, fallback: T, options = { requireInProduction: false }): T | string {
  if (process.env[name]) {
    return process.env[name]
  }
  if (fallback !== undefined && (!production || !options.requireInProduction)) {
    return fallback
  }
  throw new Error(`Missing env var ${name}`)
}

const requiredInProduction = { requireInProduction: true }

export class AgentConfig {
  // Sets the working socket to timeout after timeout milliseconds of inactivity on the working socket.
  timeout: number

  constructor(timeout = 8000) {
    this.timeout = timeout
  }
}

export interface ApiConfig {
  url: string
  timeout: {
    // sets maximum time to wait for the first byte to arrive from the server, but it does not limit how long the
    // entire download can take.
    response: number
    // sets a deadline for the entire request (including all uploads, redirects, server processing time) to complete.
    // If the response isn't fully downloaded within that time, the request will be aborted.
    deadline: number
  }
  agent: AgentConfig
}

const auditConfig = () => {
  const auditEnabled = toBoolean(get('AUDIT_ENABLED', false))
  return {
    enabled: auditEnabled,
    queueUrl: get(
      'AUDIT_SQS_QUEUE_URL',
      'http://localhost:4566/000000000000/mainQueue',
      auditEnabled && requiredInProduction,
    ),
    serviceName: get('AUDIT_SERVICE_NAME', 'UNASSIGNED', auditEnabled && requiredInProduction),
    region: get('AUDIT_SQS_REGION', 'eu-west-2'),
  }
}

export default {
  buildNumber: get('BUILD_NUMBER', '1_0_0', requiredInProduction),
  productId: get('PRODUCT_ID', 'UNASSIGNED', requiredInProduction),
  gitRef: get('GIT_REF', 'xxxxxxxxxxxxxxxxxxx', requiredInProduction),
  branchName: get('GIT_BRANCH', 'xxxxxxxxxxxxxxxxxxx', requiredInProduction),
  production,
  https: production,
  staticResourceCacheDuration: '1h',
  redis: {
    enabled: get('REDIS_ENABLED', 'false', requiredInProduction) === 'true',
    host: get('REDIS_HOST', 'localhost', requiredInProduction),
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
    password: process.env.REDIS_AUTH_TOKEN,
    tls_enabled: get('REDIS_TLS_ENABLED', 'false'),
  },
  session: {
    secret: get('SESSION_SECRET', 'app-insecure-default-session', requiredInProduction),
    expiryMinutes: Number(get('WEB_SESSION_TIMEOUT_IN_MINUTES', 120)),
  },
  activeAgencies: get('ACTIVE_AGENCIES', '', requiredInProduction),
  apis: {
    hmppsAuth: {
      url: get('HMPPS_AUTH_URL', 'http://localhost:9090/auth', requiredInProduction),
      externalUrl: get('HMPPS_AUTH_EXTERNAL_URL', get('HMPPS_AUTH_URL', 'http://localhost:9090/auth')),
      timeout: {
        response: Number(get('HMPPS_AUTH_TIMEOUT_RESPONSE', 5000)),
        deadline: Number(get('HMPPS_AUTH_TIMEOUT_DEADLINE', 5000)),
      },
      agent: new AgentConfig(Number(get('HMPPS_AUTH_TIMEOUT_RESPONSE', 5000))),
      apiClientId: get('API_CLIENT_ID', 'clientid', requiredInProduction),
      apiClientSecret: get('API_CLIENT_SECRET', 'clientsecret', requiredInProduction),
      systemClientId: get('SYSTEM_CLIENT_ID', 'clientid', requiredInProduction),
      systemClientSecret: get('SYSTEM_CLIENT_SECRET', 'clientsecret', requiredInProduction),
      includeInHealthCheck: true,
    },
    manageUsersApi: {
      url: get('MANAGE_USERS_API_URL', 'http://localhost:9091', requiredInProduction),
      timeout: {
        response: Number(get('MANAGE_USERS_API_TIMEOUT_RESPONSE', 5000)),
        deadline: Number(get('MANAGE_USERS_API_TIMEOUT_DEADLINE', 5000)),
      },
      agent: new AgentConfig(Number(get('MANAGE_USERS_API_TIMEOUT_RESPONSE', 5000))),
      includeInHealthCheck: true,
    },
    tokenVerification: {
      url: get('TOKEN_VERIFICATION_API_URL', 'http://localhost:8100', requiredInProduction),
      timeout: {
        response: Number(get('TOKEN_VERIFICATION_API_TIMEOUT_RESPONSE', 5000)),
        deadline: Number(get('TOKEN_VERIFICATION_API_TIMEOUT_DEADLINE', 5000)),
      },
      agent: new AgentConfig(Number(get('TOKEN_VERIFICATION_API_TIMEOUT_RESPONSE', 5000))),
      enabled: get('TOKEN_VERIFICATION_ENABLED', 'false') === 'true',
      includeInHealthCheck: get('TOKEN_VERIFICATION_ENABLED', 'false') === 'true',
    },
    educationAndWorkPlan: {
      url: get('EDUCATION_AND_WORK_PLAN_API_URL', 'http://localhost:8083', requiredInProduction),
      timeout: {
        response: Number(get('EDUCATION_AND_WORK_PLAN_API_TIMEOUT_RESPONSE', 5000)),
        deadline: Number(get('EDUCATION_AND_WORK_PLAN_API_TIMEOUT_DEADLINE', 5000)),
      },
      agent: new AgentConfig(Number(get('EDUCATION_AND_WORK_PLAN_API_TIMEOUT_RESPONSE', 5000))),
      includeInHealthCheck: true,
    },
    prisonerSearch: {
      url: get('PRISONER_SEARCH_API_URL', 'http://localhost:8083', requiredInProduction),
      timeout: {
        response: Number(get('PRISONER_SEARCH_API_TIMEOUT_RESPONSE', 5000)),
        deadline: Number(get('PRISONER_SEARCH_API_TIMEOUT_DEADLINE', 5000)),
      },
      agent: new AgentConfig(Number(get('PRISONER_SEARCH_API_TIMEOUT_RESPONSE', 5000))),
      defaultPageSize: Number(get('PRISONER_SEARCH_API_DEFAULT_PAGE_SIZE', 9999, requiredInProduction)),
      includeInHealthCheck: true,
    },
    prisonRegister: {
      url: get('PRISON_REGISTER_API_URL', 'http://localhost:8083', requiredInProduction),
      timeout: {
        response: Number(get('PRISON_REGISTER_API_TIMEOUT_RESPONSE', 5000)),
        deadline: Number(get('PRISON_REGISTER_API_TIMEOUT_DEADLINE', 5000)),
      },
      agent: new AgentConfig(Number(get('PRISON_REGISTER_API_TIMEOUT_RESPONSE', 5000))),
      includeInHealthCheck: true,
    },
    curious: {
      url: get('CURIOUS_API_URL', 'http://localhost:8083', requiredInProduction),
      timeout: {
        response: Number(get('CURIOUS_API_TIMEOUT_RESPONSE', 3000)),
        deadline: Number(get('CURIOUS_API_TIMEOUT_DEADLINE', 3000)),
      },
      agent: new AgentConfig(Number(get('CURIOUS_API_TIMEOUT_RESPONSE', 3000))),
      includeInHealthCheck: false,
    },
    frontendComponents: {
      url: get('FRONTEND_COMPONENT_API_URL', 'http://localhost:8083', requiredInProduction),
      timeout: {
        response: Number(get('FRONTEND_COMPONENT_API_TIMEOUT_RESPONSE', 5000)),
        deadline: Number(get('FRONTEND_COMPONENT_API_TIMEOUT_DEADLINE', 5000)),
      },
      agent: new AgentConfig(Number(get('FRONTEND_COMPONENT_API_TIMEOUT_RESPONSE', 5000))),
      includeInHealthCheck: false,
    },
    activities: {
      url: get('ACTIVITIES_API_URL', 'http://localhost:8083', requiredInProduction),
      timeout: {
        response: Number(get('ACTIVITIES_AND_WORK_PLAN_API_TIMEOUT_RESPONSE', 5000)),
        deadline: Number(get('ACTIVITIES_AND_WORK_PLAN_API_TIMEOUT_DEADLINE', 5000)),
      },
      agent: new AgentConfig(Number(get('ACTIVITIES_AND_WORK_PLAN_API_TIMEOUT_RESPONSE', 5000))),
      includeInHealthCheck: false,
    },
  },
  sqs: {
    audit: auditConfig(),
  },
  domain: get('INGRESS_URL', 'http://localhost:3000', requiredInProduction),
  environmentName: get('ENVIRONMENT_NAME', ''),
  dpsHomeUrl: get('DPS_URL', 'http://localhost:3000/', requiredInProduction),
  applicationInsights: {
    connectionString: get('APPLICATIONINSIGHTS_CONNECTION_STRING', null),
  },
  feedbackUrl: get('FEEDBACK_URL', requiredInProduction),
  prisonerListUiDefaultPaginationPageSize: Number(
    get('PRISONER_LIST_UI_DEFAULT_PAGINATION_PAGE_SIZE', 50, requiredInProduction),
  ),
  featureToggles: {
    // someToggleEnabled: toBoolean(get('SOME_TOGGLE_ENABLED', false)),
    completedGoalsEnabled: toBoolean(get('COMPLETED_GOALS_ENABLED', false)),
    archiveGoalNotesEnabled: toBoolean(get('ARCHIVE_GOAL_NOTES_ENABLED', false)),
    reviewJourneyEnabledForPrison: (prisonId: string): boolean => {
      const reviewsPrisonsEnabled = get('REVIEWS_PRISONS_ENABLED', '')
        .split(',')
        .map(id => id.trim())
      return reviewsPrisonsEnabled.includes(prisonId) || reviewsPrisonsEnabled.includes('***')
    },
    prisonIsEnabledForService: (prisonId: string): boolean => {
      const enabledPrisons = get('ACTIVE_AGENCIES', '', requiredInProduction)
        .split(',')
        .map(id => id.trim())
      return enabledPrisons.includes(prisonId) || enabledPrisons.includes('***')
    },
  },
}
