import { Request, Response } from 'express'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import wantToAddQualificationsSchema from './wantToAddQualificationsSchema'
import { validate } from '../../routerRequestHandlers/validationMiddleware'
import type { Error } from '../../../filters/findErrorFilter'

describe('wantToAddQualificationsSchema', () => {
  const prisonerSummary = aValidPrisonerSummary()

  const req = {
    originalUrl: '',
    body: {},
    flash: jest.fn(),
  } as unknown as Request
  const res = {
    locals: { prisonerSummary },
    redirectWithErrors: jest.fn(),
  } as unknown as Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
    req.originalUrl = '/prisoners/A1234BC/create-induction/12345/want-to-add-qualifications'
  })

  it.each([
    //
    { wantToAddQualifications: 'YES' },
    { wantToAddQualifications: 'NO' },
  ])('happy path - validation passes - wantToAddQualifications: $wantToAddQualifications', async requestBody => {
    // Given
    req.body = requestBody

    const expectedTransformedRequestBody = {
      wantToAddQualifications: requestBody.wantToAddQualifications,
    }

    // When
    await validate(wantToAddQualificationsSchema)(req, res, next)

    // Then
    expect(req.body).toEqual(expectedTransformedRequestBody)
    expect(next).toHaveBeenCalled()
    expect(req.flash).not.toHaveBeenCalled()
    expect(res.redirectWithErrors).not.toHaveBeenCalled()
  })

  it.each([
    { wantToAddQualifications: '' },
    { wantToAddQualifications: undefined },
    { wantToAddQualifications: null },
    { wantToAddQualifications: 'a-non-supported-value' },
    { wantToAddQualifications: 'Y' },
    { wantToAddQualifications: 'Yes' },
    { wantToAddQualifications: 'N' },
    { wantToAddQualifications: 'No' },
    { wantToAddQualifications: 'true' },
    { wantToAddQualifications: 'false' },
  ])(
    'sad path - validation of wantToAddQualifications field fails - wantToAddQualifications: $wantToAddQualifications',
    async requestBody => {
      // Given
      req.body = requestBody

      const expectedErrors: Array<Error> = [
        {
          href: '#wantToAddQualifications',
          text: 'Select whether Ifereeca Peigh wants to record any other educational qualifications',
        },
      ]
      const expectedInvalidForm = JSON.stringify(requestBody)

      // When
      await validate(wantToAddQualificationsSchema)(req, res, next)

      // Then
      expect(req.body).toEqual(requestBody)
      expect(next).not.toHaveBeenCalled()
      expect(req.flash).toHaveBeenCalledWith('invalidForm', expectedInvalidForm)
      expect(res.redirectWithErrors).toHaveBeenCalledWith(
        '/prisoners/A1234BC/create-induction/12345/want-to-add-qualifications',
        expectedErrors,
      )
    },
  )
})
