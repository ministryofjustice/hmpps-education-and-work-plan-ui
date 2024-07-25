import { PrisonerContext, PrisonerContexts, SessionData } from 'express-session'

export default function getPrisonerContext(session: Partial<SessionData>, prisonNumber: string): PrisonerContext {
  if (!session.prisonerContexts) {
    // eslint-disable-next-line no-param-reassign
    session.prisonerContexts = {} as PrisonerContexts
  }
  const contexts = session.prisonerContexts
  if (!contexts[prisonNumber]) {
    contexts[prisonNumber] = {} as PrisonerContext
  }
  return contexts[prisonNumber]
}
