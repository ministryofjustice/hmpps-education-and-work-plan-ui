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
  timeout: number

  constructor(timeout = 8000) {
    this.timeout = timeout
  }
}

export interface ApiConfig {
  url: string
  timeout: {
    response: number
    deadline: number
  }
  agent: AgentConfig
}

export default {
  buildNumber: get('BUILD_NUMBER', '1_0_0', requiredInProduction),
  gitRef: get('GIT_REF', 'xxxxxxxxxxxxxxxxxxx', requiredInProduction),
  production,
  https: production,
  staticResourceCacheDuration: '1h',
  redis: {
    host: get('REDIS_HOST', 'localhost', requiredInProduction),
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
    password: process.env.REDIS_AUTH_TOKEN,
    tls_enabled: get('REDIS_TLS_ENABLED', 'false'),
  },
  session: {
    secret: get('SESSION_SECRET', 'app-insecure-default-session', requiredInProduction),
    expiryMinutes: Number(get('WEB_SESSION_TIMEOUT_IN_MINUTES', 120)),
  },
  apis: {
    hmppsAuth: {
      url: get('HMPPS_AUTH_URL', 'http://localhost:9090/auth', requiredInProduction),
      externalUrl: get('HMPPS_AUTH_EXTERNAL_URL', get('HMPPS_AUTH_URL', 'http://localhost:9090/auth')),
      timeout: {
        response: Number(get('HMPPS_AUTH_TIMEOUT_RESPONSE', 10000)),
        deadline: Number(get('HMPPS_AUTH_TIMEOUT_DEADLINE', 10000)),
      },
      agent: new AgentConfig(Number(get('HMPPS_AUTH_TIMEOUT_RESPONSE', 10000))),
      apiClientId: get('API_CLIENT_ID', 'clientid', requiredInProduction),
      apiClientSecret: get('API_CLIENT_SECRET', 'clientsecret', requiredInProduction),
      systemClientId: get('SYSTEM_CLIENT_ID', 'clientid', requiredInProduction),
      systemClientSecret: get('SYSTEM_CLIENT_SECRET', 'clientsecret', requiredInProduction),
    },
    tokenVerification: {
      url: get('TOKEN_VERIFICATION_API_URL', 'http://localhost:8100', requiredInProduction),
      timeout: {
        response: Number(get('TOKEN_VERIFICATION_API_TIMEOUT_RESPONSE', 5000)),
        deadline: Number(get('TOKEN_VERIFICATION_API_TIMEOUT_DEADLINE', 5000)),
      },
      agent: new AgentConfig(Number(get('TOKEN_VERIFICATION_API_TIMEOUT_RESPONSE', 5000))),
      enabled: get('TOKEN_VERIFICATION_ENABLED', 'false') === 'true',
    },
    educationAndWorkPlan: {
      url: get('EDUCATION_AND_WORK_PLAN_API_URL', 'http://localhost:8083', requiredInProduction),
      timeout: {
        response: Number(get('EDUCATION_AND_WORK_PLAN_API_TIMEOUT_RESPONSE', 10000)),
        deadline: Number(get('EDUCATION_AND_WORK_PLAN_API_TIMEOUT_DEADLINE', 10000)),
      },
      agent: new AgentConfig(Number(get('EDUCATION_AND_WORK_PLAN_API_TIMEOUT_RESPONSE', 10000))),
    },
    prisonerSearch: {
      url: get('PRISONER_SEARCH_API_URL', 'http://localhost:8083', requiredInProduction),
      timeout: {
        response: Number(get('PRISONER_SEARCH_API_TIMEOUT_RESPONSE', 10000)),
        deadline: Number(get('PRISONER_SEARCH_API_TIMEOUT_DEADLINE', 10000)),
      },
      agent: new AgentConfig(Number(get('PRISONER_SEARCH_API_TIMEOUT_RESPONSE', 10000))),
      defaultPageSize: Number(get('PRISONER_SEARCH_API_DEFAULT_PAGE_SIZE', 9999, requiredInProduction)),
    },
    prisonRegister: {
      url: get('PRISON_REGISTER_API_URL', 'http://localhost:8083', requiredInProduction),
      timeout: {
        response: Number(get('PRISON_REGISTER_API_TIMEOUT_RESPONSE', 10000)),
        deadline: Number(get('PRISON_REGISTER_API_TIMEOUT_DEADLINE', 10000)),
      },
      agent: new AgentConfig(Number(get('PRISON_REGISTER_API_TIMEOUT_RESPONSE', 10000))),
    },
    curious: {
      url: get('CURIOUS_API_URL', 'http://localhost:8083', requiredInProduction),
      timeout: {
        response: Number(get('CURIOUS_API_TIMEOUT_RESPONSE', 10000)),
        deadline: Number(get('CURIOUS_API_TIMEOUT_DEADLINE', 10000)),
      },
      agent: new AgentConfig(Number(get('CURIOUS_API_TIMEOUT_RESPONSE', 10000))),
    },
    ciagInduction: {
      url: get('CIAG_INDUCTION_API_URL', 'http://localhost:8083', requiredInProduction),
      timeout: {
        response: Number(get('CIAG_INDUCTION_API_TIMEOUT_RESPONSE', 10000)),
        deadline: Number(get('CIAG_INDUCTION_API_TIMEOUT_DEADLINE', 10000)),
      },
      agent: new AgentConfig(Number(get('CIAG_INDUCTION_API_TIMEOUT_RESPONSE', 10000))),
    },
    frontendComponents: {
      url: get('FRONTEND_COMPONENT_API_URL', 'http://localhost:8083', requiredInProduction),
      timeout: {
        response: Number(get('FRONTEND_COMPONENT_API_TIMEOUT_RESPONSE', 5000)),
        deadline: Number(get('FRONTEND_COMPONENT_API_TIMEOUT_DEADLINE', 5000)),
      },
      agent: new AgentConfig(Number(get('FRONTEND_COMPONENT_API_TIMEOUT_RESPONSE', 5000))),
    },
  },
  domain: get('INGRESS_URL', 'http://localhost:3000', requiredInProduction),
  environmentName: get('ENVIRONMENT_NAME', ''),
  dpsHomeUrl: get('DPS_URL', 'http://localhost:3000/', requiredInProduction),
  ciagInductionUrl: get('CIAG_INDUCTION_UI_URL', 'http://localhost:3000', requiredInProduction),
  applicationInsights: {
    connectionString: get('APPLICATIONINSIGHTS_CONNECTION_STRING', null),
  },
  feedbackUrl: get('FEEDBACK_URL', requiredInProduction),
  prisonerListUiDefaultPaginationPageSize: Number(
    get('PRISONER_LIST_UI_DEFAULT_PAGINATION_PAGE_SIZE', 50, requiredInProduction),
  ),
  featureToggles: {
    // someToggleEnabled: toBoolean(get('SOME_TOGGLE_ENABLED', false)),
    frontendComponentsApiToggleEnabled: toBoolean(
      get('FRONTEND_COMPONENTS_API_FEATURE_TOGGLE_ENABLED', true, requiredInProduction),
    ),
    plpPrisonerListAndOverviewPagesEnabled: toBoolean(
      get('PLP_PRISONER_LIST_AND_OVERVIEW_PAGES_ENABLED', false, requiredInProduction),
    ),
    timelinePageEnabled: toBoolean(get('TIMELINE_PAGE_ENABLED', false, requiredInProduction)),
    newCreateGoalRoutesEnabled: toBoolean(get('NEW_CREATE_GOAL_ROUTES_ENABLED', false, requiredInProduction)),
    createGoalsWithoutInductionEnabled: toBoolean(
      get('CREATE_GOALS_WITHOUT_INDUCTION_ENABLED', false, requiredInProduction),
    ),
    useNewInductionApiEnabled: toBoolean(get('USE_NEW_INDUCTION_API_ENABLED', false, requiredInProduction)),
  },
}
