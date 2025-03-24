import { Request, Response } from 'express'
import { startOfDay } from 'date-fns'
import type { WhoCompletedInductionForm } from 'inductionForms'
import WhoCompletedInductionCreateController from './whoCompletedInductionCreateController'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import { getPrisonerContext } from '../../../data/session/prisonerContexts'
import SessionCompletedByValue from '../../../enums/sessionCompletedByValue'
import { aValidInductionDto } from '../../../testsupport/inductionDtoTestDataBuilder'

describe('whoCompletedInductionController', () => {
  const controller = new WhoCompletedInductionCreateController()

  const prisonNumber = 'A1234BC'
  const prisonerSummary = aValidPrisonerSummary({ prisonNumber })

  const req = {
    session: {},
    body: {},
    params: { prisonNumber },
    path: `/prisoners/${prisonNumber}/create-induction/who-completed-induction`,
  } as unknown as Request
  const res = {
    redirect: jest.fn(),
    redirectWithErrors: jest.fn(),
    render: jest.fn(),
    locals: { prisonerSummary },
  } as unknown as Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
    req.session.pageFlowHistory = undefined
    req.body = {}
  })

  describe('getWhoCompletedInductionView', () => {
    it(`should get 'who completed induction' view given form is not on the prisoner context, but DTO is on the context`, async () => {
      // Given
      const inductionDto = {
        ...aValidInductionDto(),
        completedBy: SessionCompletedByValue.MYSELF,
        completedByOtherFullName: undefined as string,
        completedByOtherJobRole: undefined as string,
        inductionDate: startOfDay('2024-03-09'),
      }
      getPrisonerContext(req.session, prisonNumber).inductionDto = inductionDto
      getPrisonerContext(req.session, prisonNumber).whoCompletedInductionForm = undefined

      const expectedForm: WhoCompletedInductionForm = {
        completedBy: SessionCompletedByValue.MYSELF,
        completedByOtherFullName: undefined,
        completedByOtherJobRole: undefined,
        'inductionDate-day': '09',
        'inductionDate-month': '03',
        'inductionDate-year': '2024',
      }

      const expectedView = {
        prisonerSummary,
        form: expectedForm,
      }

      // When
      await controller.getWhoCompletedInductionView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/induction/whoCompletedInduction/index', expectedView)
    })

    it(`should get 'who completed induction' view given form is already on the prisoner context`, async () => {
      // Given
      const expectedForm: WhoCompletedInductionForm = {
        completedBy: SessionCompletedByValue.MYSELF,
        'inductionDate-day': '20',
        'inductionDate-month': '3',
        'inductionDate-year': '2024',
      }

      getPrisonerContext(req.session, prisonNumber).whoCompletedInductionForm = expectedForm

      const expectedView = {
        prisonerSummary,
        form: expectedForm,
      }

      // When
      await controller.getWhoCompletedInductionView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/induction/whoCompletedInduction/index', expectedView)
    })
  })

  describe('submitWhoCompletedInductionForm', () => {
    it('should redisplay page given form submitted with validation errors', async () => {
      // Given
      getPrisonerContext(req.session, prisonNumber).whoCompletedInductionForm = undefined

      const invalidForm: WhoCompletedInductionForm = {
        completedBy: SessionCompletedByValue.SOMEBODY_ELSE,
        'inductionDate-day': '20',
        'inductionDate-month': '3',
        'inductionDate-year': '2024',
      }
      req.body = invalidForm

      const expectedErrors = [
        { href: '#completedByOtherFullName', text: 'Enter the full name of the person who completed the induction' },
        { href: '#completedByOtherJobRole', text: 'Enter the job title of the person who completed the induction' },
      ]

      // When
      await controller.submitWhoCompletedInductionForm(req, res, next)

      // Then
      expect(res.redirectWithErrors).toHaveBeenCalledWith(
        '/prisoners/A1234BC/create-induction/who-completed-induction',
        expectedErrors,
      )
      expect(getPrisonerContext(req.session, prisonNumber).whoCompletedInductionForm).toEqual(invalidForm)
    })

    it('should redirect to induction notes page given form submitted successfully and previous page was not check-your-answers', async () => {
      // Given
      const inductionDto = {
        ...aValidInductionDto(),
        completedBy: undefined as SessionCompletedByValue,
        completedByOtherFullName: undefined as string,
        completedByOtherJobRole: undefined as string,
        inductionDate: undefined as Date,
      }
      getPrisonerContext(req.session, prisonNumber).inductionDto = inductionDto

      req.session.pageFlowHistory = undefined
      getPrisonerContext(req.session, prisonNumber).whoCompletedInductionForm = undefined

      const validForm: WhoCompletedInductionForm = {
        completedBy: SessionCompletedByValue.SOMEBODY_ELSE,
        completedByOtherFullName: 'Joe Bloggs',
        completedByOtherJobRole: 'Peer mentor',
        'inductionDate-day': '9',
        'inductionDate-month': '3',
        'inductionDate-year': '2024',
      }
      req.body = validForm

      const expectedInductionDto = {
        ...getPrisonerContext(req.session, prisonNumber).inductionDto,
        completedBy: SessionCompletedByValue.SOMEBODY_ELSE,
        completedByOtherFullName: 'Joe Bloggs',
        completedByOtherJobRole: 'Peer mentor',
        inductionDate: startOfDay('2024-03-09'),
      }

      // When
      await controller.submitWhoCompletedInductionForm(req, res, next)

      // Then
      expect(res.redirect).toHaveBeenCalledWith('/prisoners/A1234BC/create-induction/notes')
      expect(getPrisonerContext(req.session, prisonNumber).whoCompletedInductionForm).toBeUndefined()
      expect(getPrisonerContext(req.session, prisonNumber).inductionDto).toEqual(expectedInductionDto)
    })

    it('should redirect to induction check-your-answers page given form submitted successfully and previous page was check-your-answers', async () => {
      // Given
      req.session.pageFlowHistory = {
        pageUrls: [
          '/prisoners/A1234BC/create-induction/check-your-answers',
          '/prisoners/A1234BC/create-induction/who-completed-induction',
        ],
        currentPageIndex: 1,
      }
      getPrisonerContext(req.session, prisonNumber).whoCompletedInductionForm = undefined

      const inductionDto = {
        ...aValidInductionDto(),
        completedBy: SessionCompletedByValue.MYSELF,
        completedByOtherFullName: undefined as string,
        completedByOtherJobRole: undefined as string,
        inductionDate: startOfDay('2024-03-07'),
      }
      getPrisonerContext(req.session, prisonNumber).inductionDto = inductionDto

      const validForm: WhoCompletedInductionForm = {
        completedBy: SessionCompletedByValue.SOMEBODY_ELSE,
        completedByOtherFullName: 'Joe Bloggs',
        completedByOtherJobRole: 'Peer mentor',
        'inductionDate-day': '9',
        'inductionDate-month': '3',
        'inductionDate-year': '2024',
      }
      req.body = validForm

      const expectedInductionDto = {
        ...getPrisonerContext(req.session, prisonNumber).inductionDto,
        completedBy: SessionCompletedByValue.SOMEBODY_ELSE,
        completedByOtherFullName: 'Joe Bloggs',
        completedByOtherJobRole: 'Peer mentor',
        inductionDate: startOfDay('2024-03-09'),
      }

      // When
      await controller.submitWhoCompletedInductionForm(req, res, next)

      // Then
      expect(res.redirect).toHaveBeenCalledWith('/prisoners/A1234BC/create-induction/check-your-answers')
      expect(getPrisonerContext(req.session, prisonNumber).whoCompletedInductionForm).toBeUndefined()
      expect(getPrisonerContext(req.session, prisonNumber).inductionDto).toEqual(expectedInductionDto)
    })
  })
})
