import { Request, Response } from 'express'
import { validate } from '../../routerRequestHandlers/validationMiddleware'
import employabilitySkillsSchema from './employabilitySkillsSchema'
import type { Error } from '../../../filters/findErrorFilter'

describe('employabilitySkillsSchema', () => {
  const req = {
    originalUrl: '',
    body: {},
    flash: jest.fn(),
  } as unknown as Request
  const res = {
    redirectWithErrors: jest.fn(),
  } as unknown as Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
    req.originalUrl = '/prisoners/A1234BC/create-induction/12345/employability-skills'
  })

  it.each([
    { employabilitySkills: ['ORGANISATION'], rating: { ORGANISATION: 'QUITE_CONFIDENT' } },
    { employabilitySkills: 'ORGANISATION', rating: { ORGANISATION: 'QUITE_CONFIDENT' } },
    {
      employabilitySkills: ['TEAMWORK', 'ORGANISATION'],
      rating: { ORGANISATION: 'QUITE_CONFIDENT', TEAMWORK: 'VERY_CONFIDENT' },
    },
    { employabilitySkills: ['NONE'], rating: null },
    { employabilitySkills: ['NONE'], rating: undefined },
    { employabilitySkills: ['NONE'], rating: {} },
  ])(
    'happy path - validation passes - employabilitySkills: $employabilitySkills, rating: $rating',
    async requestBody => {
      // Given
      req.body = requestBody

      const expectedTransformedRequestBody = {
        employabilitySkills: Array.isArray(requestBody.employabilitySkills)
          ? requestBody.employabilitySkills
          : [requestBody.employabilitySkills],
        rating: requestBody.rating,
      }

      // When
      await validate(employabilitySkillsSchema)(req, res, next)

      // Then
      expect(req.body).toEqual(expectedTransformedRequestBody)
      expect(next).toHaveBeenCalled()
      expect(req.flash).not.toHaveBeenCalled()
      expect(res.redirectWithErrors).not.toHaveBeenCalled()
    },
  )

  it.each([
    { employabilitySkills: '' },
    { employabilitySkills: null },
    { employabilitySkills: undefined },
    { employabilitySkills: [''] },
    { employabilitySkills: [null] },
    { employabilitySkills: [undefined] },
    { employabilitySkills: [] },
  ])(
    'sad path - mandatory employabilitySkills field fails - employabilitySkills: $employabilitySkills',
    async requestBody => {
      // Given
      req.body = requestBody

      const expectedErrors: Array<Error> = [
        {
          href: '#employabilitySkills',
          text: `Select a skill or 'none'`,
        },
      ]
      const expectedInvalidForm = JSON.stringify(requestBody)

      // When
      await validate(employabilitySkillsSchema)(req, res, next)

      // Then
      expect(req.body).toEqual(requestBody)
      expect(next).not.toHaveBeenCalled()
      expect(req.flash).toHaveBeenCalledWith('invalidForm', expectedInvalidForm)
      expect(res.redirectWithErrors).toHaveBeenCalledWith(
        '/prisoners/A1234BC/create-induction/12345/employability-skills',
        expectedErrors,
      )
    },
  )

  it.each([
    { employabilitySkills: 'not a valid value' },
    { employabilitySkills: ['an invalid value'] },
    { employabilitySkills: ['ORGANISATION', 'some other invalid value'] },
  ])(
    'sad path - invalid employabilitySkills field value - employabilitySkills: $employabilitySkills',
    async requestBody => {
      // Given
      req.body = requestBody

      const expectedErrors: Array<Error> = [
        {
          href: '#employabilitySkills',
          text: `Select a skill or 'none'`,
        },
      ]
      const expectedInvalidForm = JSON.stringify(requestBody)

      // When
      await validate(employabilitySkillsSchema)(req, res, next)

      // Then
      expect(req.body).toEqual(requestBody)
      expect(next).not.toHaveBeenCalled()
      expect(req.flash).toHaveBeenCalledWith('invalidForm', expectedInvalidForm)
      expect(res.redirectWithErrors).toHaveBeenCalledWith(
        '/prisoners/A1234BC/create-induction/12345/employability-skills',
        expectedErrors,
      )
    },
  )

  it('sad path - invalid employabilitySkills field combination fails - NONE selected with others', async () => {
    // Given
    const requestBody = { employabilitySkills: ['ORGANISATION', 'NONE'], rating: { ORGANISATION: 'QUITE_CONFIDENT' } }
    req.body = requestBody

    const expectedErrors: Array<Error> = [
      {
        href: '#employabilitySkills',
        text: `Select a skill or 'none'`,
      },
    ]
    const expectedInvalidForm = JSON.stringify(requestBody)

    // When
    await validate(employabilitySkillsSchema)(req, res, next)

    // Then
    expect(req.body).toEqual(requestBody)
    expect(next).not.toHaveBeenCalled()
    expect(req.flash).toHaveBeenCalledWith('invalidForm', expectedInvalidForm)
    expect(res.redirectWithErrors).toHaveBeenCalledWith(
      '/prisoners/A1234BC/create-induction/12345/employability-skills',
      expectedErrors,
    )
  })

  it('sad path - missing rating field when only one employability skill', async () => {
    // Given
    const requestBody = { employabilitySkills: ['ORGANISATION'] }
    req.body = requestBody

    const expectedErrors: Array<Error> = [
      {
        href: '#rating[ORGANISATION]',
        text: 'Select a confidence level for the chosen skill',
      },
    ]
    const expectedInvalidForm = JSON.stringify(requestBody)

    // When
    await validate(employabilitySkillsSchema)(req, res, next)

    // Then
    expect(req.body).toEqual(requestBody)
    expect(next).not.toHaveBeenCalled()
    expect(req.flash).toHaveBeenCalledWith('invalidForm', expectedInvalidForm)
    expect(res.redirectWithErrors).toHaveBeenCalledWith(
      '/prisoners/A1234BC/create-induction/12345/employability-skills',
      expectedErrors,
    )
  })

  it('sad path - missing rating field for all employability skills', async () => {
    // Given
    const requestBody = {
      employabilitySkills: [
        'TEAMWORK',
        'TIMEKEEPING',
        'COMMUNICATION',
        'PLANNING',
        'ORGANISATION',
        'PROBLEM_SOLVING',
        'INITIATIVE',
        'ADAPTABILITY',
        'RELIABILITY',
        'CREATIVITY',
      ],
    }
    req.body = requestBody

    const expectedErrors: Array<Error> = [
      {
        href: '#rating[TEAMWORK]',
        text: 'Select a confidence level for the chosen skill',
      },
      {
        href: '#rating[TIMEKEEPING]',
        text: 'Select a confidence level for the chosen skill',
      },
      {
        href: '#rating[COMMUNICATION]',
        text: 'Select a confidence level for the chosen skill',
      },
      {
        href: '#rating[PLANNING]',
        text: 'Select a confidence level for the chosen skill',
      },
      {
        href: '#rating[ORGANISATION]',
        text: 'Select a confidence level for the chosen skill',
      },
      {
        href: '#rating[PROBLEM_SOLVING]',
        text: 'Select a confidence level for the chosen skill',
      },
      {
        href: '#rating[INITIATIVE]',
        text: 'Select a confidence level for the chosen skill',
      },
      {
        href: '#rating[ADAPTABILITY]',
        text: 'Select a confidence level for the chosen skill',
      },
      {
        href: '#rating[RELIABILITY]',
        text: 'Select a confidence level for the chosen skill',
      },
      {
        href: '#rating[CREATIVITY]',
        text: 'Select a confidence level for the chosen skill',
      },
    ]
    const expectedInvalidForm = JSON.stringify(requestBody)

    // When
    await validate(employabilitySkillsSchema)(req, res, next)

    // Then
    expect(req.body).toEqual(requestBody)
    expect(next).not.toHaveBeenCalled()
    expect(req.flash).toHaveBeenCalledWith('invalidForm', expectedInvalidForm)
    expect(res.redirectWithErrors).toHaveBeenCalledWith(
      '/prisoners/A1234BC/create-induction/12345/employability-skills',
      expectedErrors,
    )
  })

  it('sad path - missing rating field for some employability skills', async () => {
    // Given
    const requestBody = {
      employabilitySkills: [
        //
        'TEAMWORK',
        'ORGANISATION',
        'PROBLEM_SOLVING',
        'INITIATIVE',
      ],
      rating: {
        //
        ORGANISATION: 'QUITE_CONFIDENT',
        INITIATIVE: 'QUITE_CONFIDENT',
      },
    }
    req.body = requestBody

    const expectedErrors: Array<Error> = [
      {
        href: '#rating[TEAMWORK]',
        text: 'Select a confidence level for the chosen skill',
      },
      {
        href: '#rating[PROBLEM_SOLVING]',
        text: 'Select a confidence level for the chosen skill',
      },
    ]
    const expectedInvalidForm = JSON.stringify(requestBody)

    // When
    await validate(employabilitySkillsSchema)(req, res, next)

    // Then
    expect(req.body).toEqual(requestBody)
    expect(next).not.toHaveBeenCalled()
    expect(req.flash).toHaveBeenCalledWith('invalidForm', expectedInvalidForm)
    expect(res.redirectWithErrors).toHaveBeenCalledWith(
      '/prisoners/A1234BC/create-induction/12345/employability-skills',
      expectedErrors,
    )
  })

  it('sad path - invalid rating field for some employability skills', async () => {
    // Given
    const requestBody = {
      employabilitySkills: [
        //
        'TEAMWORK',
        'ORGANISATION',
        'PROBLEM_SOLVING',
        'INITIATIVE',
      ],
      rating: {
        //
        TEAMWORK: 'not-a-valid-value',
        ORGANISATION: 'QUITE_CONFIDENT',
        INITIATIVE: 'QUITE_CONFIDENT',
        PROBLEM_SOLVING: '',
      },
    }
    req.body = requestBody

    const expectedErrors: Array<Error> = [
      {
        href: '#rating[TEAMWORK]',
        text: 'Select a confidence level for the chosen skill',
      },
      {
        href: '#rating[PROBLEM_SOLVING]',
        text: 'Select a confidence level for the chosen skill',
      },
    ]
    const expectedInvalidForm = JSON.stringify(requestBody)

    // When
    await validate(employabilitySkillsSchema)(req, res, next)

    // Then
    expect(req.body).toEqual(requestBody)
    expect(next).not.toHaveBeenCalled()
    expect(req.flash).toHaveBeenCalledWith('invalidForm', expectedInvalidForm)
    expect(res.redirectWithErrors).toHaveBeenCalledWith(
      '/prisoners/A1234BC/create-induction/12345/employability-skills',
      expectedErrors,
    )
  })
})
