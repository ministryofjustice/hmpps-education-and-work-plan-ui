import type { PrisonerContext, PrisonerContexts, SessionData } from 'express-session'
import { clearPrisonerContext, getPrisonerContext } from './prisonerContexts'
import { aValidUpdateGoalForm } from '../../testsupport/updateGoalFormTestDataBuilder'

describe('prisonerContexts', () => {
  const prisonNumber = 'A1234BC'

  describe('getPrisonerContext', () => {
    it('should initialise prisoner contexts record if there is not one in the session', () => {
      const session = {} as SessionData

      const context = getPrisonerContext(session, prisonNumber)

      expect(session.prisonerContexts).toBeDefined()
      expect(context).toBeDefined()
      expect(session.prisonerContexts[prisonNumber]).toBe(context)
    })

    it('should keep existing prisoner contexts record if there is one in the session but create missing prisoner specific context', () => {
      const anotherPrisonerContext = { updateGoalForm: aValidUpdateGoalForm() }
      const anotherPrisonNumber = 'B9999BB'
      const prisonerContexts = {
        B9999BB: anotherPrisonerContext,
      } as PrisonerContexts
      const session = { prisonerContexts } as SessionData

      const context = getPrisonerContext(session, prisonNumber)

      expect(session.prisonerContexts).toBeDefined()
      expect(context).toBeDefined()
      expect(session.prisonerContexts[prisonNumber]).toBe(context)
      expect(session.prisonerContexts[anotherPrisonNumber]).toBe(anotherPrisonerContext)
    })

    it('should keep existing prisoner specific context', () => {
      const prisonerContexts = {} as PrisonerContexts
      const preExistingContext = { updateGoalForm: aValidUpdateGoalForm() } as PrisonerContext
      prisonerContexts[prisonNumber] = preExistingContext
      const session = { prisonerContexts } as SessionData

      const context = getPrisonerContext(session, prisonNumber)

      expect(session.prisonerContexts).toBeDefined()
      expect(context).toBe(preExistingContext)
      expect(session.prisonerContexts[prisonNumber]).toBe(context)
      expect(session.prisonerContexts[prisonNumber]).toBe(preExistingContext)
    })
  })

  describe('clearPrisonerContext', () => {
    it('should clear the context from the session for a given prisoner', () => {
      // Given
      const aPrisonerContext: PrisonerContext = { updateGoalForm: aValidUpdateGoalForm() }
      const prisonerContexts: PrisonerContexts = {}
      prisonerContexts[prisonNumber] = aPrisonerContext
      const session = { prisonerContexts } as SessionData

      expect(getPrisonerContext(session, prisonNumber)).toEqual(aPrisonerContext)

      // When
      clearPrisonerContext(session, prisonNumber)

      // Then
      expect(getPrisonerContext(session, prisonNumber)).toEqual({})
    })
  })
})
