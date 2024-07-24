import AuditService, { BaseAuditData, Page } from './auditService'
import HmppsAuditClient from '../data/hmppsAuditClient'

jest.mock('../data/hmppsAuditClient')

describe('Audit service', () => {
  const hmppsAuditClient = new HmppsAuditClient(null) as jest.Mocked<HmppsAuditClient>
  const auditService = new AuditService(hmppsAuditClient)

  const expectedHmppsAuditClientToThrowOnError = false
  const expectedSqsMessageResponse = { $metadata: {}, MessageId: '2fd4aebb-b20d-4e20-aac8-16d3c06c2464' }

  beforeEach(() => {
    jest.resetAllMocks()
    hmppsAuditClient.sendMessage.mockResolvedValue(expectedSqsMessageResponse)
  })

  describe('logPageViewAttempt', () => {
    it('should send page view event audit message', async () => {
      // Given

      // When
      const actual = await auditService.logPageViewAttempt(Page.PRISONER_LIST, {
        who: 'user1',
        subjectId: 'subject123',
        subjectType: 'exampleType',
        correlationId: 'request123',
        details: { extraDetails: 'example' },
      })

      // Then
      expect(actual).toEqual(expectedSqsMessageResponse)
      expect(hmppsAuditClient.sendMessage).toHaveBeenCalledWith(
        {
          what: 'PAGE_VIEW_ATTEMPT_PRISONER_LIST',
          who: 'user1',
          subjectId: 'subject123',
          subjectType: 'exampleType',
          correlationId: 'request123',
          details: { extraDetails: 'example' },
        },
        expectedHmppsAuditClientToThrowOnError,
      )
    })
  })

  describe('logPageView', () => {
    it('should send page view event audit message', async () => {
      // Given

      // When
      const actual = await auditService.logPageView(Page.PRISONER_LIST, {
        who: 'user1',
        subjectId: 'subject123',
        subjectType: 'exampleType',
        correlationId: 'request123',
        details: { extraDetails: 'example' },
      })

      // Then
      expect(actual).toEqual(expectedSqsMessageResponse)
      expect(hmppsAuditClient.sendMessage).toHaveBeenCalledWith(
        {
          what: 'PAGE_VIEW_PRISONER_LIST',
          who: 'user1',
          subjectId: 'subject123',
          subjectType: 'exampleType',
          correlationId: 'request123',
          details: { extraDetails: 'example' },
        },
        expectedHmppsAuditClientToThrowOnError,
      )
    })
  })

  describe('logCreateGoal', () => {
    it('should send create goal event audit message', async () => {
      // Given

      const baseArchiveAuditData: BaseAuditData = {
        correlationId: '49380145-d73d-4ad2-8460-f26b039249cc',
        details: {
          goalNumber: 1,
          ofGoalsCreatedInThisRequest: 2,
        },
        subjectId: 'A1234BC',
        subjectType: 'PRISONER_ID',
        who: 'a-dps-user',
      }

      // When
      const actual = await auditService.logCreateGoal(baseArchiveAuditData)

      // Then
      expect(actual).toEqual(expectedSqsMessageResponse)
      expect(hmppsAuditClient.sendMessage).toHaveBeenCalledWith(
        {
          what: 'CREATE_PRISONER_GOAL',
          correlationId: '49380145-d73d-4ad2-8460-f26b039249cc',
          details: {
            goalNumber: 1,
            ofGoalsCreatedInThisRequest: 2,
          },
          subjectId: 'A1234BC',
          subjectType: 'PRISONER_ID',
          who: 'a-dps-user',
        },
        expectedHmppsAuditClientToThrowOnError,
      )
    })
  })

  describe('logUpdateGoal', () => {
    it('should send update goal event audit message', async () => {
      // Given

      const baseArchiveAuditData: BaseAuditData = {
        correlationId: '49380145-d73d-4ad2-8460-f26b039249cc',
        details: { goalReference: 'a4c91b69-a075-4095-8a12-eccadf7c3d7b' },
        subjectId: 'A1234BC',
        subjectType: 'PRISONER_ID',
        who: 'a-dps-user',
      }

      // When
      const actual = await auditService.logUpdateGoal(baseArchiveAuditData)

      // Then
      expect(actual).toEqual(expectedSqsMessageResponse)
      expect(hmppsAuditClient.sendMessage).toHaveBeenCalledWith(
        {
          what: 'UPDATE_PRISONER_GOAL',
          correlationId: '49380145-d73d-4ad2-8460-f26b039249cc',
          details: { goalReference: 'a4c91b69-a075-4095-8a12-eccadf7c3d7b' },
          subjectId: 'A1234BC',
          subjectType: 'PRISONER_ID',
          who: 'a-dps-user',
        },
        expectedHmppsAuditClientToThrowOnError,
      )
    })
  })

  describe('logArchiveGoal', () => {
    it('should send archive goal event audit message', async () => {
      // Given

      const baseArchiveAuditData: BaseAuditData = {
        correlationId: '49380145-d73d-4ad2-8460-f26b039249cc',
        details: { goalReference: 'a4c91b69-a075-4095-8a12-eccadf7c3d7b' },
        subjectId: 'A1234BC',
        subjectType: 'PRISONER_ID',
        who: 'a-dps-user',
      }

      // When
      const actual = await auditService.logArchiveGoal(baseArchiveAuditData)

      // Then
      expect(actual).toEqual(expectedSqsMessageResponse)
      expect(hmppsAuditClient.sendMessage).toHaveBeenCalledWith(
        {
          what: 'ARCHIVE_PRISONER_GOAL',
          correlationId: '49380145-d73d-4ad2-8460-f26b039249cc',
          details: { goalReference: 'a4c91b69-a075-4095-8a12-eccadf7c3d7b' },
          subjectId: 'A1234BC',
          subjectType: 'PRISONER_ID',
          who: 'a-dps-user',
        },
        expectedHmppsAuditClientToThrowOnError,
      )
    })
  })

  describe('logUnarchiveGoal', () => {
    it('should send unarchive goal event audit message', async () => {
      // Given

      const baseArchiveAuditData: BaseAuditData = {
        correlationId: '49380145-d73d-4ad2-8460-f26b039249cc',
        details: { goalReference: 'a4c91b69-a075-4095-8a12-eccadf7c3d7b' },
        subjectId: 'A1234BC',
        subjectType: 'PRISONER_ID',
        who: 'a-dps-user',
      }

      // When
      const actual = await auditService.logUnarchiveGoal(baseArchiveAuditData)

      // Then
      expect(actual).toEqual(expectedSqsMessageResponse)
      expect(hmppsAuditClient.sendMessage).toHaveBeenCalledWith(
        {
          what: 'UNARCHIVE_PRISONER_GOAL',
          correlationId: '49380145-d73d-4ad2-8460-f26b039249cc',
          details: { goalReference: 'a4c91b69-a075-4095-8a12-eccadf7c3d7b' },
          subjectId: 'A1234BC',
          subjectType: 'PRISONER_ID',
          who: 'a-dps-user',
        },
        expectedHmppsAuditClientToThrowOnError,
      )
    })
  })
})
