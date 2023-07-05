import authorisationMiddleware from './authorisationMiddleware'

const hasEditAuthority = () => authorisationMiddleware(['ROLE_EDUCATION_WORK_PLAN_EDITOR'])

const hasViewAuthority = () =>
  authorisationMiddleware(['ROLE_EDUCATION_WORK_PLAN_EDITOR', 'ROLE_EDUCATION_WORK_PLAN_VIEWER'])

export { hasEditAuthority, hasViewAuthority }
