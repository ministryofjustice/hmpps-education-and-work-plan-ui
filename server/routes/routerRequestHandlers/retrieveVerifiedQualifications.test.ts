import { Request, Response } from 'express'
import retrieveVerifiedQualifications from './retrieveVerifiedQualifications'
import LearnerRecordsService from '../../services/learnerRecordsService'
import { verifiedQualifications } from '../../testsupport/verifiedQualificationsTestDataBuilder'

jest.mock('../../services/learnerRecordsService')

describe('retrieveVerifiedQualifications', () => {
  const learnerRecordsService = new LearnerRecordsService(null) as jest.Mocked<LearnerRecordsService>
  const requestHandler = retrieveVerifiedQualifications(learnerRecordsService)
  const prisonNumber = 'A1234BC'
  const username = 'a-dps-user'

  const apiErrorCallback = jest.fn()
  const req = {
    user: { username },
    params: { prisonNumber },
  } as unknown as Request
  const res = {
    render: jest.fn(),
    locals: {},
  } as unknown as Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
    res.locals = { user: undefined, apiErrorCallback }
  })

  it('should retrieve verified qualifications and store in res.locals', async () => {
    // Given
    const expectedVerifiedQualifications = verifiedQualifications()
    learnerRecordsService.getVerifiedQualifications.mockResolvedValue(expectedVerifiedQualifications)

    // When
    await requestHandler(req, res, next)

    // Then
    expect(res.locals.verifiedQualifications.isFulfilled()).toEqual(true)
    expect(res.locals.verifiedQualifications.value).toEqual(expectedVerifiedQualifications)
    expect(learnerRecordsService.getVerifiedQualifications).toHaveBeenCalled()
    expect(next).toHaveBeenCalled()
    expect(apiErrorCallback).not.toHaveBeenCalled()
  })

  it('should store unfulfilled result on res.locals given service returns an error', async () => {
    // Given
    const error = new Error('An error occurred')
    learnerRecordsService.getVerifiedQualifications.mockRejectedValue(error)

    // When
    await requestHandler(req, res, next)

    // Then
    expect(res.locals.verifiedQualifications.isFulfilled()).toEqual(false)
    expect(learnerRecordsService.getVerifiedQualifications).toHaveBeenCalledWith(username, prisonNumber)
    expect(next).toHaveBeenCalled()
    expect(apiErrorCallback).toHaveBeenCalledWith(error)
  })
})
