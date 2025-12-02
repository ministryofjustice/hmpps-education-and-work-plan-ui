import { Request, Response } from 'express'
import LrsQualificationsController from './lrsQualificationsController'
import aValidPrisonerSummary from '../../testsupport/prisonerSummaryTestDataBuilder'
import { Result } from '../../utils/result/result'
import { verifiedQualifications } from '../../testsupport/verifiedQualificationsTestDataBuilder'

describe('lrsQualificationsController', () => {
  const controller = new LrsQualificationsController()

  const prisonNumber = 'A1234BC'
  const prisonerSummary = aValidPrisonerSummary({ prisonNumber })
  const verifiedQualificationsPromise = Result.fulfilled(verifiedQualifications())

  const req = {
    params: { prisonNumber },
  } as unknown as Request
  const res = {
    render: jest.fn(),
    locals: { prisonerSummary, verifiedQualifications: verifiedQualificationsPromise },
  } as unknown as Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('getLrsQualificationsView', () => {
    it('should get LRS Qualifications view', async () => {
      // Given
      const expectedView = {
        prisonerSummary,
        verifiedQualifications: verifiedQualificationsPromise,
      }

      // When
      await controller.getLrsQualificationsView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/lrsQualifications/index', expectedView)
    })
  })
})
