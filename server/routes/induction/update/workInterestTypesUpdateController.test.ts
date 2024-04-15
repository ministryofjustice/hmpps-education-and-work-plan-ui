import createError from 'http-errors'
import type { SessionData } from 'express-session'
import type { FutureWorkInterestDto } from 'inductionDto'
import type { PageFlow } from 'viewModels'
import { NextFunction, Request, Response } from 'express'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import { aLongQuestionSetInductionDto } from '../../../testsupport/inductionDtoTestDataBuilder'
import validateWorkInterestTypesForm from './workInterestTypesFormValidator'
import toCreateOrUpdateInductionDto from '../../../data/mappers/createOrUpdateInductionDtoMapper'
import InductionService from '../../../services/inductionService'
import { aLongQuestionSetUpdateInductionRequest } from '../../../testsupport/updateInductionRequestTestDataBuilder'
import WorkInterestTypesUpdateController from './workInterestTypesUpdateController'
import WorkInterestTypeValue from '../../../enums/workInterestTypeValue'

jest.mock('./workInterestTypesFormValidator')
jest.mock('../../../data/mappers/createOrUpdateInductionDtoMapper')
jest.mock('../../../services/inductionService')

describe('workInterestTypesUpdateController', () => {
  const mockedFormValidator = validateWorkInterestTypesForm as jest.MockedFunction<typeof validateWorkInterestTypesForm>
  const mockedCreateOrUpdateInductionDtoMapper = toCreateOrUpdateInductionDto as jest.MockedFunction<
    typeof toCreateOrUpdateInductionDto
  >

  const inductionService = new InductionService(null) as jest.Mocked<InductionService>
  const controller = new WorkInterestTypesUpdateController(inductionService)

  const prisonNumber = 'A1234BC'

  const req = {
    session: {} as SessionData,
    body: {},
    user: {} as Express.User,
    params: {} as Record<string, string>,
    flash: jest.fn(),
    path: '',
  }
  const res = {
    redirect: jest.fn(),
    render: jest.fn(),
  }
  const next = jest.fn()

  let errors: Array<Record<string, string>>

  beforeEach(() => {
    jest.resetAllMocks()
    req.session = {} as SessionData
    req.body = {}
    req.user = {} as Express.User
    req.params = {} as Record<string, string>
    req.params.prisonNumber = prisonNumber
    req.path = `/prisoners/${prisonNumber}/induction/work-interest-types`

    errors = []
  })

  describe('getWorkInterestTypesView', () => {
    it('should get the Work Interest Types view given there is no WorkInterestTypesForm on the session', async () => {
      // Given
      const prisonerSummary = aValidPrisonerSummary()
      req.session.prisonerSummary = prisonerSummary
      const inductionDto = aLongQuestionSetInductionDto()
      req.session.inductionDto = inductionDto
      req.session.workInterestTypesForm = undefined

      const expectedWorkInterestTypesForm = {
        workInterestTypes: [
          WorkInterestTypeValue.RETAIL,
          WorkInterestTypeValue.CONSTRUCTION,
          WorkInterestTypeValue.OTHER,
        ],
        workInterestTypesOther: 'Film, TV and media',
      }

      const expectedView = {
        prisonerSummary,
        form: expectedWorkInterestTypesForm,
        backLinkUrl: '/plan/A1234BC/view/work-and-interests',
        backLinkAriaText: `Back to Jimmy Lightfingers's learning and work progress`,
        errors,
      }

      // When
      await controller.getWorkInterestTypesView(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/induction/workInterests/workInterestTypes', expectedView)
      expect(req.session.workInterestTypesForm).toBeUndefined()
      expect(req.session.inductionDto).toEqual(inductionDto)
    })

    it('should get the Work Interest Types view given there is an WorkInterestTypesForm already on the session', async () => {
      // Given
      const prisonerSummary = aValidPrisonerSummary()
      req.session.prisonerSummary = prisonerSummary
      const inductionDto = aLongQuestionSetInductionDto()
      req.session.inductionDto = inductionDto

      const expectedWorkInterestTypesForm = {
        workInterestTypes: [
          WorkInterestTypeValue.RETAIL,
          WorkInterestTypeValue.CONSTRUCTION,
          WorkInterestTypeValue.OTHER,
        ],
        workInterestTypesOther: 'Film, TV and media',
      }
      req.session.workInterestTypesForm = expectedWorkInterestTypesForm

      const expectedView = {
        prisonerSummary,
        form: expectedWorkInterestTypesForm,
        backLinkUrl: '/plan/A1234BC/view/work-and-interests',
        backLinkAriaText: `Back to Jimmy Lightfingers's learning and work progress`,
        errors,
      }

      // When
      await controller.getWorkInterestTypesView(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/induction/workInterests/workInterestTypes', expectedView)
      expect(req.session.workInterestTypesForm).toBeUndefined()
      expect(req.session.inductionDto).toEqual(inductionDto)
    })

    it('should get the Work Interest Types view given there is an updateInductionQuestionSet on the session', async () => {
      // Given
      const prisonerSummary = aValidPrisonerSummary()
      req.session.prisonerSummary = prisonerSummary
      const inductionDto = aLongQuestionSetInductionDto()
      req.session.inductionDto = inductionDto
      req.session.updateInductionQuestionSet = {
        hopingToWorkOnRelease: 'YES',
      }
      req.session.pageFlowHistory = {
        pageUrls: [`/prisoners/${prisonNumber}/induction/previous-work-experience`],
        currentPageIndex: 0,
      }

      const expectedWorkInterestTypesForm = {
        workInterestTypes: [
          WorkInterestTypeValue.RETAIL,
          WorkInterestTypeValue.CONSTRUCTION,
          WorkInterestTypeValue.OTHER,
        ],
        workInterestTypesOther: 'Film, TV and media',
      }
      req.session.workInterestTypesForm = expectedWorkInterestTypesForm

      const expectedView = {
        prisonerSummary,
        form: expectedWorkInterestTypesForm,
        backLinkUrl: '/prisoners/A1234BC/induction/previous-work-experience',
        backLinkAriaText: 'Back to What type of work has Jimmy Lightfingers done before?',
        errors,
      }

      const expectedPageFlowHistory = {
        pageUrls: [
          '/prisoners/A1234BC/induction/previous-work-experience',
          '/prisoners/A1234BC/induction/work-interest-types',
        ],
        currentPageIndex: 1,
      }

      // When
      await controller.getWorkInterestTypesView(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/induction/workInterests/workInterestTypes', expectedView)
      expect(req.session.inductionDto).toEqual(inductionDto)
      expect(req.session.pageFlowHistory).toEqual(expectedPageFlowHistory)
    })
  })

  describe('submitWorkInterestTypesForm', () => {
    it('should not update Induction given form is submitted with validation errors', async () => {
      // Given
      const prisonerSummary = aValidPrisonerSummary()
      req.session.prisonerSummary = prisonerSummary
      const inductionDto = aLongQuestionSetInductionDto()
      req.session.inductionDto = inductionDto

      const invalidWorkInterestTypesForm = {
        workInterestTypes: [WorkInterestTypeValue.OTHER],
        workInterestTypesOther: '',
      }
      req.body = invalidWorkInterestTypesForm
      req.session.workInterestTypesForm = undefined

      errors = [
        {
          href: '#workInterestTypesOther',
          text: `Select the type of work Jimmy Lightfingers is interested in`,
        },
      ]
      mockedFormValidator.mockReturnValue(errors)

      // When
      await controller.submitWorkInterestTypesForm(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.redirect).toHaveBeenCalledWith('/prisoners/A1234BC/induction/work-interest-types')
      expect(req.flash).toHaveBeenCalledWith('errors', errors)
      expect(req.session.workInterestTypesForm).toEqual(invalidWorkInterestTypesForm)
      expect(req.session.inductionDto).toEqual(inductionDto)
    })

    it('should update Induction and call API and redirect to work and interests page', async () => {
      // Given
      req.user.token = 'some-token'

      const prisonerSummary = aValidPrisonerSummary()
      req.session.prisonerSummary = prisonerSummary
      const inductionDto = aLongQuestionSetInductionDto()
      req.session.inductionDto = inductionDto

      const workInterestTypesForm = {
        workInterestTypes: [WorkInterestTypeValue.CONSTRUCTION, WorkInterestTypeValue.OTHER],
        workInterestTypesOther: 'Social Media Influencer',
      }
      req.body = workInterestTypesForm
      req.session.workInterestTypesForm = undefined
      const updateInductionDto = aLongQuestionSetUpdateInductionRequest()

      mockedCreateOrUpdateInductionDtoMapper.mockReturnValueOnce(updateInductionDto)
      mockedFormValidator.mockReturnValue(errors)
      const expectedUpdatedWorkInterests: Array<FutureWorkInterestDto> = [
        {
          workType: 'CONSTRUCTION',
          workTypeOther: undefined,
          role: 'General labourer',
        },
        {
          workType: 'OTHER',
          workTypeOther: 'Social Media Influencer',
          // note that role will not have been updated, despite workTypeOther being changed
          role: 'Being a stunt double for Tom Cruise, even though he does all his own stunts',
        },
      ]

      // When
      await controller.submitWorkInterestTypesForm(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      // Extract the first call to the mock and the second argument (i.e. the updated Induction)
      const updatedInduction = mockedCreateOrUpdateInductionDtoMapper.mock.calls[0][1]
      expect(mockedCreateOrUpdateInductionDtoMapper).toHaveBeenCalledWith(prisonerSummary.prisonId, updatedInduction)
      expect(updatedInduction.futureWorkInterests.interests).toEqual(expectedUpdatedWorkInterests)

      expect(inductionService.updateInduction).toHaveBeenCalledWith(prisonNumber, updateInductionDto, 'some-token')
      expect(res.redirect).toHaveBeenCalledWith(`/plan/${prisonNumber}/view/work-and-interests`)
      expect(req.session.workInterestTypesForm).toBeUndefined()
      expect(req.session.inductionDto).toBeUndefined()
    })

    it('should update InductionDto and redirect to Work Interests Details given long question set journey', async () => {
      // Given
      req.user.token = 'some-token'

      const prisonerSummary = aValidPrisonerSummary()
      req.session.prisonerSummary = prisonerSummary
      const inductionDto = aLongQuestionSetInductionDto()
      req.session.inductionDto = inductionDto

      const workInterestTypesForm = {
        workInterestTypes: [WorkInterestTypeValue.DRIVING],
        workInterestTypesOther: '',
      }
      req.body = workInterestTypesForm
      req.session.workInterestTypesForm = undefined

      mockedFormValidator.mockReturnValue(errors)

      req.session.updateInductionQuestionSet = { hopingToWorkOnRelease: 'YES' }
      const expectedNextPage = '/prisoners/A1234BC/induction/work-interest-roles'

      const expectedFutureWorkInterests: Array<FutureWorkInterestDto> = [
        { workType: WorkInterestTypeValue.DRIVING, workTypeOther: undefined, role: undefined },
      ]

      const expectedPageFlowHistory: PageFlow = {
        pageUrls: ['/prisoners/A1234BC/induction/work-interest-types'],
        currentPageIndex: 0,
      }

      // When
      await controller.submitWorkInterestTypesForm(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      const futureWorkInterestsOnInduction: Array<FutureWorkInterestDto> =
        req.session.inductionDto.futureWorkInterests.interests
      expect(futureWorkInterestsOnInduction).toEqual(expectedFutureWorkInterests)
      expect(res.redirect).toHaveBeenCalledWith(expectedNextPage)
      expect(req.session.workInterestTypesForm).toBeUndefined()
      expect(inductionService.updateInduction).not.toHaveBeenCalled()
      expect(req.session.pageFlowHistory).toEqual(expectedPageFlowHistory)
    })

    it('should not update Induction given error calling service', async () => {
      // Given
      req.user.token = 'some-token'

      const prisonerSummary = aValidPrisonerSummary()
      req.session.prisonerSummary = prisonerSummary
      const inductionDto = aLongQuestionSetInductionDto()
      req.session.inductionDto = inductionDto

      const workInterestTypesForm = {
        workInterestTypes: [WorkInterestTypeValue.CONSTRUCTION, WorkInterestTypeValue.OTHER],
        workInterestTypesOther: 'Social Media Influencer',
      }
      req.body = workInterestTypesForm
      req.session.workInterestTypesForm = undefined
      const updateInductionDto = aLongQuestionSetUpdateInductionRequest()

      mockedCreateOrUpdateInductionDtoMapper.mockReturnValueOnce(updateInductionDto)
      mockedFormValidator.mockReturnValue(errors)
      const expectedUpdatedWorkInterests: Array<FutureWorkInterestDto> = [
        {
          workType: 'CONSTRUCTION',
          workTypeOther: undefined,
          role: 'General labourer',
        },
        {
          workType: 'OTHER',
          workTypeOther: 'Social Media Influencer',
          // note that role will not have been updated, despite workTypeOther being changed
          role: 'Being a stunt double for Tom Cruise, even though he does all his own stunts',
        },
      ]

      inductionService.updateInduction.mockRejectedValue(createError(500, 'Service unavailable'))
      const expectedError = createError(
        500,
        `Error updating Induction for prisoner ${prisonNumber}. Error: InternalServerError: Service unavailable`,
      )

      // When
      await controller.submitWorkInterestTypesForm(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      // Extract the first call to the mock and the second argument (i.e. the updated Induction)
      const updatedInduction = mockedCreateOrUpdateInductionDtoMapper.mock.calls[0][1]
      expect(mockedCreateOrUpdateInductionDtoMapper).toHaveBeenCalledWith(prisonerSummary.prisonId, updatedInduction)
      expect(updatedInduction.futureWorkInterests.interests).toEqual(expectedUpdatedWorkInterests)

      expect(inductionService.updateInduction).toHaveBeenCalledWith(prisonNumber, updateInductionDto, 'some-token')
      expect(next).toHaveBeenCalledWith(expectedError)
      expect(req.session.workInterestTypesForm).toEqual(workInterestTypesForm)
      expect(req.session.inductionDto).toEqual(inductionDto)
    })
  })
})
