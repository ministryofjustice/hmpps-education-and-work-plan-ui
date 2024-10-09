import { Request, Response } from 'express'
import type { WorkedBeforeForm } from 'inductionForms'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import { aValidInductionDto } from '../../../testsupport/inductionDtoTestDataBuilder'
import WorkedBeforeCreateController from './workedBeforeCreateController'
import HasWorkedBeforeValue from '../../../enums/hasWorkedBeforeValue'

describe('workedBeforeCreateController', () => {
  const controller = new WorkedBeforeCreateController()

  const prisonNumber = 'A1234BC'
  const prisonerSummary = aValidPrisonerSummary()

  const req = {
    session: {},
    body: {},
    params: { prisonNumber },
    path: `/prisoners/${prisonNumber}/create-induction/has-worked-before`,
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

  describe('getWorkedBeforeView', () => {
    it('should get the WorkedBefore view given there is no WorkedBeforeForm on the session', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      inductionDto.previousWorkExperiences = undefined
      req.session.inductionDto = inductionDto
      req.session.workedBeforeForm = undefined

      const expectedWorkedBeforeForm: WorkedBeforeForm = {
        hasWorkedBefore: undefined,
      }

      const expectedView = {
        prisonerSummary,
        form: expectedWorkedBeforeForm,
        backLinkUrl: '/prisoners/A1234BC/create-induction/additional-training',
        backLinkAriaText: 'Back to Does Jimmy Lightfingers have any other training or vocational qualifications?',
      }

      // When
      await controller.getWorkedBeforeView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/induction/workedBefore/index', expectedView)
      expect(req.session.workedBeforeForm).toBeUndefined()
      expect(req.session.inductionDto).toEqual(inductionDto)
    })

    it('should get the WorkedBefore view given there is an WorkedBeforeForm already on the session', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      inductionDto.previousWorkExperiences = undefined
      req.session.inductionDto = inductionDto

      const expectedWorkedBeforeForm = {
        hasWorkedBefore: HasWorkedBeforeValue.NO,
      }
      req.session.workedBeforeForm = expectedWorkedBeforeForm

      const expectedView = {
        prisonerSummary,
        form: expectedWorkedBeforeForm,
        backLinkUrl: '/prisoners/A1234BC/create-induction/additional-training',
        backLinkAriaText: 'Back to Does Jimmy Lightfingers have any other training or vocational qualifications?',
      }

      // When
      await controller.getWorkedBeforeView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/induction/workedBefore/index', expectedView)
      expect(req.session.workedBeforeForm).toBeUndefined()
      expect(req.session.inductionDto).toEqual(inductionDto)
    })

    it('should get the WorkedBefore view given the previous page was Check Your Answers', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      inductionDto.previousWorkExperiences = undefined
      req.session.inductionDto = inductionDto

      req.session.pageFlowHistory = {
        pageUrls: ['/prisoners/A1234BC/create-induction/check-your-answers'],
        currentPageIndex: 0,
      }

      const expectedPageFlowHistory = {
        pageUrls: [
          '/prisoners/A1234BC/create-induction/check-your-answers',
          '/prisoners/A1234BC/create-induction/has-worked-before',
        ],
        currentPageIndex: 1,
      }

      const expectedWorkedBeforeForm = {
        hasWorkedBefore: HasWorkedBeforeValue.NO,
      }
      req.session.workedBeforeForm = expectedWorkedBeforeForm

      const expectedView = {
        prisonerSummary,
        form: expectedWorkedBeforeForm,
        backLinkUrl: '/prisoners/A1234BC/create-induction/check-your-answers',
        backLinkAriaText: `Back to Check and save your answers before adding Jimmy Lightfingers's goals`,
      }

      // When
      await controller.getWorkedBeforeView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/induction/workedBefore/index', expectedView)
      expect(req.session.workedBeforeForm).toBeUndefined()
      expect(req.session.inductionDto).toEqual(inductionDto)
      expect(req.session.pageFlowHistory).toEqual(expectedPageFlowHistory)
    })
  })

  describe('submitWorkedBeforeForm', () => {
    it('should not update Induction given form is submitted with validation errors', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      inductionDto.previousWorkExperiences = undefined
      req.session.inductionDto = inductionDto

      const invalidWorkedBeforeForm: WorkedBeforeForm = {
        hasWorkedBefore: undefined,
      }
      req.body = invalidWorkedBeforeForm
      req.session.workedBeforeForm = undefined

      const expectedErrors = [
        { href: '#hasWorkedBefore', text: 'Select whether Jimmy Lightfingers has worked before or not' },
      ]

      // When
      await controller.submitWorkedBeforeForm(req, res, next)

      // Then
      expect(res.redirectWithErrors).toHaveBeenCalledWith(
        '/prisoners/A1234BC/create-induction/has-worked-before',
        expectedErrors,
      )
      expect(req.session.workedBeforeForm).toEqual(invalidWorkedBeforeForm)
      expect(req.session.inductionDto).toEqual(inductionDto)
    })

    it('should update InductionDto and display Previous Work Experience page given form is submitted with worked before YES', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      inductionDto.previousWorkExperiences = undefined
      req.session.inductionDto = inductionDto

      const workedBeforeForm: WorkedBeforeForm = {
        hasWorkedBefore: HasWorkedBeforeValue.YES,
        hasWorkedBeforeNotRelevantReason: undefined,
      }
      req.body = workedBeforeForm
      req.session.workedBeforeForm = undefined

      // When
      await controller.submitWorkedBeforeForm(req, res, next)

      // Then
      expect(res.redirect).toHaveBeenCalledWith('/prisoners/A1234BC/create-induction/previous-work-experience')
      expect(req.session.workedBeforeForm).toBeUndefined()
      const updatedInduction = req.session.inductionDto
      expect(updatedInduction.previousWorkExperiences.hasWorkedBefore).toEqual('YES')
      expect(updatedInduction.previousWorkExperiences.hasWorkedBeforeNotRelevantReason).toBeUndefined()
    })

    it('should update InductionDto and display Skills page given form is submitted with worked before NO', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      inductionDto.previousWorkExperiences = undefined
      req.session.inductionDto = inductionDto

      const workedBeforeForm: WorkedBeforeForm = {
        hasWorkedBefore: HasWorkedBeforeValue.NO,
        hasWorkedBeforeNotRelevantReason: undefined,
      }
      req.body = workedBeforeForm
      req.session.workedBeforeForm = undefined

      // When
      await controller.submitWorkedBeforeForm(req, res, next)

      // Then
      expect(res.redirect).toHaveBeenCalledWith('/prisoners/A1234BC/create-induction/skills')
      expect(req.session.workedBeforeForm).toBeUndefined()
      const updatedInduction = req.session.inductionDto
      expect(updatedInduction.previousWorkExperiences.hasWorkedBefore).toEqual('NO')
      expect(updatedInduction.previousWorkExperiences.hasWorkedBeforeNotRelevantReason).toBeUndefined()
    })

    it('should update InductionDto and display Skills page given form is submitted with worked before NOT_RELEVANT', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      inductionDto.previousWorkExperiences = undefined
      req.session.inductionDto = inductionDto

      const workedBeforeForm: WorkedBeforeForm = {
        hasWorkedBefore: HasWorkedBeforeValue.NOT_RELEVANT,
        hasWorkedBeforeNotRelevantReason:
          'Chris feels his previous work experience is not relevant as he is not planning on working upon release.',
      }
      req.body = workedBeforeForm
      req.session.workedBeforeForm = undefined

      // When
      await controller.submitWorkedBeforeForm(req, res, next)

      // Then
      expect(res.redirect).toHaveBeenCalledWith('/prisoners/A1234BC/create-induction/skills')
      expect(req.session.workedBeforeForm).toBeUndefined()
      const updatedInduction = req.session.inductionDto
      expect(updatedInduction.previousWorkExperiences.hasWorkedBefore).toEqual('NOT_RELEVANT')
      expect(updatedInduction.previousWorkExperiences.hasWorkedBeforeNotRelevantReason).toEqual(
        'Chris feels his previous work experience is not relevant as he is not planning on working upon release.',
      )
    })

    it('should update inductionDto and redirect to Previous Work Experience given previous page was Check Your Answers and worked before is changed to NO', async () => {
      // Given
      const inductionDto = aValidInductionDto({ hasWorkedBefore: HasWorkedBeforeValue.YES })
      req.session.inductionDto = inductionDto

      const workedBeforeForm: WorkedBeforeForm = {
        hasWorkedBefore: HasWorkedBeforeValue.NO,
        hasWorkedBeforeNotRelevantReason: undefined,
      }
      req.body = workedBeforeForm
      req.session.workedBeforeForm = undefined

      req.session.pageFlowHistory = {
        pageUrls: [
          '/prisoners/A1234BC/create-induction/check-your-answers',
          '/prisoners/A1234BC/create-induction/has-worked-before',
        ],
        currentPageIndex: 1,
      }

      // When
      await controller.submitWorkedBeforeForm(req, res, next)

      // Then
      const updatedInduction = req.session.inductionDto
      expect(updatedInduction.previousWorkExperiences.hasWorkedBefore).toEqual('NO')
      expect(updatedInduction.previousWorkExperiences.hasWorkedBeforeNotRelevantReason).toBeUndefined()
      expect(res.redirect).toHaveBeenCalledWith('/prisoners/A1234BC/create-induction/check-your-answers')
      expect(req.session.workedBeforeForm).toBeUndefined()
    })

    it('should update inductionDto and redirect to Previous Work Experience given previous page was Check Your Answers and worked before is changed to NOT_RELEVANT', async () => {
      // Given
      const inductionDto = aValidInductionDto({ hasWorkedBefore: HasWorkedBeforeValue.YES })
      req.session.inductionDto = inductionDto

      const workedBeforeForm: WorkedBeforeForm = {
        hasWorkedBefore: HasWorkedBeforeValue.NOT_RELEVANT,
        hasWorkedBeforeNotRelevantReason:
          'Chris feels his previous work experience is not relevant as he is not planning on working upon release.',
      }
      req.body = workedBeforeForm
      req.session.workedBeforeForm = undefined

      req.session.pageFlowHistory = {
        pageUrls: [
          '/prisoners/A1234BC/create-induction/check-your-answers',
          '/prisoners/A1234BC/create-induction/has-worked-before',
        ],
        currentPageIndex: 1,
      }

      // When
      await controller.submitWorkedBeforeForm(req, res, next)

      // Then
      const updatedInduction = req.session.inductionDto
      expect(updatedInduction.previousWorkExperiences.hasWorkedBefore).toEqual('NOT_RELEVANT')
      expect(updatedInduction.previousWorkExperiences.hasWorkedBeforeNotRelevantReason).toEqual(
        'Chris feels his previous work experience is not relevant as he is not planning on working upon release.',
      )
      expect(res.redirect).toHaveBeenCalledWith('/prisoners/A1234BC/create-induction/check-your-answers')
      expect(req.session.workedBeforeForm).toBeUndefined()
    })

    it('should update inductionDto and redirect to Previous Work Experience given previous page was Check Your Answers and worked before is changed to YES', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      inductionDto.previousWorkExperiences.hasWorkedBefore = 'NOT_RELEVANT'
      inductionDto.previousWorkExperiences.hasWorkedBeforeNotRelevantReason =
        'Chris feels his previous work experience is not relevant as he is not planning on working upon release.'
      inductionDto.previousWorkExperiences.experiences = []
      req.session.inductionDto = inductionDto

      const workedBeforeForm: WorkedBeforeForm = {
        hasWorkedBefore: HasWorkedBeforeValue.YES,
        hasWorkedBeforeNotRelevantReason: undefined,
      }
      req.body = workedBeforeForm
      req.session.workedBeforeForm = undefined

      req.session.pageFlowHistory = {
        pageUrls: [
          '/prisoners/A1234BC/create-induction/check-your-answers',
          '/prisoners/A1234BC/create-induction/has-worked-before',
        ],
        currentPageIndex: 1,
      }

      // When
      await controller.submitWorkedBeforeForm(req, res, next)

      // Then
      const updatedInduction = req.session.inductionDto
      expect(updatedInduction.previousWorkExperiences.hasWorkedBefore).toEqual('YES')
      expect(updatedInduction.previousWorkExperiences.hasWorkedBeforeNotRelevantReason).toBeUndefined()
      expect(updatedInduction.previousWorkExperiences.experiences).toEqual([])
      expect(res.redirect).toHaveBeenCalledWith('/prisoners/A1234BC/create-induction/previous-work-experience')
      expect(req.session.workedBeforeForm).toBeUndefined()
    })
  })
})
