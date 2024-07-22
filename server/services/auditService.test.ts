import AuditService, { BaseAuditData, Page } from './auditService'
import HmppsAuditClient from '../data/hmppsAuditClient'

jest.mock('../data/hmppsAuditClient')

describe('Audit service', () => {
  let hmppsAuditClient: jest.Mocked<HmppsAuditClient>
  let auditService: AuditService

  beforeEach(() => {
    hmppsAuditClient = new HmppsAuditClient(null) as jest.Mocked<HmppsAuditClient>
    auditService = new AuditService(hmppsAuditClient)
  })

  describe('logAuditEvent', () => {
    it('sends audit message using audit client', async () => {
      await auditService.logAuditEvent({
        what: 'AUDIT_EVENT',
        who: 'user1',
        subjectId: 'subject123',
        subjectType: 'exampleType',
        correlationId: 'request123',
        details: { extraDetails: 'example' },
      })

      expect(hmppsAuditClient.sendMessage).toHaveBeenCalledWith({
        what: 'AUDIT_EVENT',
        who: 'user1',
        subjectId: 'subject123',
        subjectType: 'exampleType',
        correlationId: 'request123',
        details: { extraDetails: 'example' },
      })
    })
  })

  describe('logPageViewAttempt', () => {
    it('sends page view event audit message using audit client', async () => {
      await auditService.logPageViewAttempt(Page.PRISONER_LIST, {
        who: 'user1',
        subjectId: 'subject123',
        subjectType: 'exampleType',
        correlationId: 'request123',
        details: { extraDetails: 'example' },
      })

      expect(hmppsAuditClient.sendMessage).toHaveBeenCalledWith({
        what: 'PAGE_VIEW_ATTEMPT_PRISONER_LIST',
        who: 'user1',
        subjectId: 'subject123',
        subjectType: 'exampleType',
        correlationId: 'request123',
        details: { extraDetails: 'example' },
      })
    })
  })

  describe('logPageView', () => {
    it('sends page view event audit message using audit client', async () => {
      await auditService.logPageView(Page.PRISONER_LIST, {
        who: 'user1',
        subjectId: 'subject123',
        subjectType: 'exampleType',
        correlationId: 'request123',
        details: { extraDetails: 'example' },
      })

      expect(hmppsAuditClient.sendMessage).toHaveBeenCalledWith({
        what: 'PAGE_VIEW_PRISONER_LIST',
        who: 'user1',
        subjectId: 'subject123',
        subjectType: 'exampleType',
        correlationId: 'request123',
        details: { extraDetails: 'example' },
      })
    })
  })

  describe('logUpdateGoal', () => {
    it('sends update goal event audit message using audit client', async () => {
      // Given
      const baseArchiveAuditData: BaseAuditData = {
        correlationId: '49380145-d73d-4ad2-8460-f26b039249cc',
        details: { goalReference: 'a4c91b69-a075-4095-8a12-eccadf7c3d7b' },
        subjectId: 'A1234BC',
        subjectType: 'PRISONER_ID',
        who: 'a-dps-user',
      }

      // When
      await auditService.logUpdateGoal(baseArchiveAuditData)

      // Then
      expect(hmppsAuditClient.sendMessage).toHaveBeenCalledWith({
        what: 'UPDATE_PRISONER_GOAL',
        correlationId: '49380145-d73d-4ad2-8460-f26b039249cc',
        details: { goalReference: 'a4c91b69-a075-4095-8a12-eccadf7c3d7b' },
        subjectId: 'A1234BC',
        subjectType: 'PRISONER_ID',
        who: 'a-dps-user',
      })
    })
  })

  describe('logArchiveGoal', () => {
    it('sends archive goal event audit message using audit client', async () => {
      // Given
      const baseArchiveAuditData: BaseAuditData = {
        correlationId: '49380145-d73d-4ad2-8460-f26b039249cc',
        details: { goalReference: 'a4c91b69-a075-4095-8a12-eccadf7c3d7b' },
        subjectId: 'A1234BC',
        subjectType: 'PRISONER_ID',
        who: 'a-dps-user',
      }

      // When
      await auditService.logArchiveGoal(baseArchiveAuditData)

      // Then
      expect(hmppsAuditClient.sendMessage).toHaveBeenCalledWith({
        what: 'ARCHIVE_PRISONER_GOAL',
        correlationId: '49380145-d73d-4ad2-8460-f26b039249cc',
        details: { goalReference: 'a4c91b69-a075-4095-8a12-eccadf7c3d7b' },
        subjectId: 'A1234BC',
        subjectType: 'PRISONER_ID',
        who: 'a-dps-user',
      })
    })
  })

  describe('logUnarchiveGoal', () => {
    it('sends unarchive goal event audit message using audit client', async () => {
      // Given
      const baseArchiveAuditData: BaseAuditData = {
        correlationId: '49380145-d73d-4ad2-8460-f26b039249cc',
        details: { goalReference: 'a4c91b69-a075-4095-8a12-eccadf7c3d7b' },
        subjectId: 'A1234BC',
        subjectType: 'PRISONER_ID',
        who: 'a-dps-user',
      }

      // When
      await auditService.logUnarchiveGoal(baseArchiveAuditData)

      // Then
      expect(hmppsAuditClient.sendMessage).toHaveBeenCalledWith({
        what: 'UNARCHIVE_PRISONER_GOAL',
        correlationId: '49380145-d73d-4ad2-8460-f26b039249cc',
        details: { goalReference: 'a4c91b69-a075-4095-8a12-eccadf7c3d7b' },
        subjectId: 'A1234BC',
        subjectType: 'PRISONER_ID',
        who: 'a-dps-user',
      })
    })
  })
})
