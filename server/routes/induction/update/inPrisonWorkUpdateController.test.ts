import createError from 'http-errors'
import type { SessionData } from 'express-session'
import { NextFunction, Request, Response } from 'express'
import InPrisonWorkUpdateController from './inPrisonWorkUpdateController'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import { aShortQuestionSetInductionDto } from '../../../testsupport/inductionDtoTestDataBuilder'
import validateInPrisonWorkForm from './inPrisonWorkFormValidator'
import toCreateOrUpdateInductionDto from '../../../data/mappers/createOrUpdateInductionDtoMapper'
import InductionService from '../../../services/inductionService'
import { aShortQuestionSetUpdateInductionRequest } from '../../../testsupport/updateInductionRequestTestDataBuilder'

jest.mock('./inPrisonWorkFormValidator')
jest.mock('../../../data/mappers/createOrUpdateInductionDtoMapper')
jest.mock('../../../services/inductionService')

describe('inPrisonWorkUpdateController', () => {
  const mockedFormValidator = validateInPrisonWorkForm as jest.MockedFunction<typeof validateInPrisonWorkForm>
  const mockedCreateOrUpdateInductionDtoMapper = toCreateOrUpdateInductionDto as jest.MockedFunction<
    typeof toCreateOrUpdateInductionDto
  >

  const inductionService = new InductionService(null) as jest.Mocked<InductionService>
  const controller = new InPrisonWorkUpdateController(inductionService)

  const req = {
    session: {} as SessionData,
    body: {},
    user: {} as Express.User,
    params: {} as Record<string, string>,
    flash: jest.fn(),
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

    errors = []
  })

  describe('getInPrisonWorkView', () => {
    it('should get the In Prison Work view given there is no InPrisonWorkForm on the session', async () => {
      // Given
      const prisonNumber = 'A1234BC'
      req.params.prisonNumber = prisonNumber

      const prisonerSummary = aValidPrisonerSummary()
      req.session.prisonerSummary = prisonerSummary
      const inductionDto = aShortQuestionSetInductionDto()
      req.session.inductionDto = inductionDto
      req.session.inPrisonWorkForm = undefined

      const expectedInPrisonWorkForm = {
        inPrisonWork: ['CLEANING_AND_HYGIENE', 'OTHER'],
        inPrisonWorkOther: 'Gardening and grounds keeping',
      }

      const expectedView = {
        prisonerSummary,
        form: expectedInPrisonWorkForm,
        backLinkUrl: '/plan/A1234BC/view/work-and-interests',
        backLinkAriaText: `Back to Jimmy Lightfingers's learning and work progress`,
        errors,
      }

      // When
      await controller.getInPrisonWorkView(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/induction/inPrisonWork/index', expectedView)
      expect(req.session.inPrisonWorkForm).toBeUndefined()
      expect(req.session.inductionDto).toEqual(inductionDto)
    })

    it('should get the In Prison Work view given there is an InPrisonWorkForm already on the session', async () => {
      // Given
      const prisonNumber = 'A1234BC'
      req.params.prisonNumber = prisonNumber

      const prisonerSummary = aValidPrisonerSummary()
      req.session.prisonerSummary = prisonerSummary
      const inductionDto = aShortQuestionSetInductionDto()
      req.session.inductionDto = inductionDto

      const expectedInPrisonWorkForm = {
        inPrisonWork: ['TEXTILES_AND_SEWING', 'WELDING_AND_METALWORK', 'WOODWORK_AND_JOINERY'],
        inPrisonWorkOther: '',
      }
      req.session.inPrisonWorkForm = expectedInPrisonWorkForm

      const expectedView = {
        prisonerSummary,
        form: expectedInPrisonWorkForm,
        backLinkUrl: '/plan/A1234BC/view/work-and-interests',
        backLinkAriaText: `Back to Jimmy Lightfingers's learning and work progress`,
        errors,
      }

      // When
      await controller.getInPrisonWorkView(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/induction/inPrisonWork/index', expectedView)
      expect(req.session.inPrisonWorkForm).toBeUndefined()
      expect(req.session.inductionDto).toEqual(inductionDto)
    })

    it('should get the In Prison Work view given there is an updateInductionQuestionSet on the session', async () => {
      // Given
      const prisonNumber = 'A1234BC'
      req.params.prisonNumber = prisonNumber

      const prisonerSummary = aValidPrisonerSummary()
      req.session.prisonerSummary = prisonerSummary
      const inductionDto = aShortQuestionSetInductionDto()
      req.session.inductionDto = inductionDto
      req.session.updateInductionQuestionSet = {
        hopingToWorkOnRelease: 'NO',
      }
      req.session.pageFlowHistory = {
        pageUrls: [`/prisoners/${prisonNumber}/induction/additional-training`],
        currentPageIndex: 0,
      }

      const expectedInPrisonWorkForm = {
        inPrisonWork: ['TEXTILES_AND_SEWING', 'WELDING_AND_METALWORK', 'WOODWORK_AND_JOINERY'],
        inPrisonWorkOther: '',
      }
      req.session.inPrisonWorkForm = expectedInPrisonWorkForm

      const expectedView = {
        prisonerSummary,
        form: expectedInPrisonWorkForm,
        backLinkUrl: '/prisoners/A1234BC/induction/additional-training',
        backLinkAriaText: 'Back to Does Jimmy Lightfingers have any other training or vocational qualifications?',
        errors,
      }
      const expectedPageFlowHistory = {
        pageUrls: ['/prisoners/A1234BC/induction/additional-training', '/prisoners/A1234BC/induction/in-prison-work'],
        currentPageIndex: 1,
      }

      // When
      await controller.getInPrisonWorkView(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/induction/inPrisonWork/index', expectedView)
      expect(req.session.inductionDto).toEqual(inductionDto)
      expect(req.session.pageFlowHistory).toEqual(expectedPageFlowHistory)
    })
  })

  describe('submitInPrisonWorkForm', () => {
    it('should not update Induction given form is submitted with validation errors', async () => {
      // Given
      const prisonNumber = 'A1234BC'
      req.params.prisonNumber = prisonNumber

      const prisonerSummary = aValidPrisonerSummary()
      req.session.prisonerSummary = prisonerSummary
      const inductionDto = aShortQuestionSetInductionDto()
      req.session.inductionDto = inductionDto

      const invalidInPrisonWorkForm = {
        inPrisonWork: ['OTHER'],
        inPrisonWorkOther: '',
      }
      req.body = invalidInPrisonWorkForm
      req.session.inPrisonWorkForm = undefined

      errors = [
        { href: '#inPrisonWorkOther', text: 'Enter the type of work Jimmy Lightfingers would like to do in prison' },
      ]
      mockedFormValidator.mockReturnValue(errors)

      // When
      await controller.submitInPrisonWorkForm(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.redirect).toHaveBeenCalledWith('/prisoners/A1234BC/induction/in-prison-work')
      expect(req.flash).toHaveBeenCalledWith('errors', errors)
      expect(req.session.inPrisonWorkForm).toEqual(invalidInPrisonWorkForm)
      expect(req.session.inductionDto).toEqual(inductionDto)
    })

    it('should update Induction and call API and redirect to work and interests page', async () => {
      // Given
      req.user.token = 'some-token'
      const prisonNumber = 'A1234BC'
      req.params.prisonNumber = prisonNumber

      const prisonerSummary = aValidPrisonerSummary()
      req.session.prisonerSummary = prisonerSummary
      const inductionDto = aShortQuestionSetInductionDto()
      req.session.inductionDto = inductionDto

      const inPrisonWorkForm = {
        inPrisonWork: ['COMPUTERS_OR_DESK_BASED', 'OTHER'],
        inPrisonWorkOther: 'Gambling',
      }
      req.body = inPrisonWorkForm
      req.session.inPrisonWorkForm = undefined
      const updateInductionDto = aShortQuestionSetUpdateInductionRequest()

      mockedCreateOrUpdateInductionDtoMapper.mockReturnValueOnce(updateInductionDto)
      mockedFormValidator.mockReturnValue(errors)
      const expectedUpdatedWorkInterests = [
        {
          workType: 'COMPUTERS_OR_DESK_BASED',
          workTypeOther: undefined,
        },
        {
          workType: 'OTHER',
          workTypeOther: 'Gambling',
        },
      ]

      // When
      await controller.submitInPrisonWorkForm(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      // Extract the first call to the mock and the second argument (i.e. the updated Induction)
      const updatedInduction = mockedCreateOrUpdateInductionDtoMapper.mock.calls[0][1]
      expect(mockedCreateOrUpdateInductionDtoMapper).toHaveBeenCalledWith(prisonerSummary.prisonId, updatedInduction)
      expect(updatedInduction.inPrisonInterests.inPrisonWorkInterests).toEqual(expectedUpdatedWorkInterests)

      expect(inductionService.updateInduction).toHaveBeenCalledWith(prisonNumber, updateInductionDto, 'some-token')
      expect(res.redirect).toHaveBeenCalledWith(`/plan/${prisonNumber}/view/work-and-interests`)
      expect(req.session.inPrisonWorkForm).toBeUndefined()
      expect(req.session.inductionDto).toBeUndefined()
    })

    it('should update InductionDto and redirect to In Prison Training view there is an updateInductionQuestionSet on the session', async () => {
      // Given
      req.user.token = 'some-token'
      const prisonNumber = 'A1234BC'
      req.params.prisonNumber = prisonNumber

      const prisonerSummary = aValidPrisonerSummary()
      req.session.prisonerSummary = prisonerSummary
      const inductionDto = aShortQuestionSetInductionDto()
      req.session.inductionDto = inductionDto

      const inPrisonWorkForm = {
        inPrisonWork: ['COMPUTERS_OR_DESK_BASED', 'OTHER'],
        inPrisonWorkOther: 'Gambling',
      }
      req.body = inPrisonWorkForm
      req.session.inPrisonWorkForm = undefined

      mockedFormValidator.mockReturnValue(errors)
      const expectedUpdatedWorkInterests = [
        {
          workType: 'COMPUTERS_OR_DESK_BASED',
          workTypeOther: undefined,
        },
        {
          workType: 'OTHER',
          workTypeOther: 'Gambling',
        },
      ]

      req.session.updateInductionQuestionSet = { hopingToWorkOnRelease: 'NO' }
      const expectedNextPage = '/prisoners/A1234BC/induction/in-prison-training'

      // When
      await controller.submitInPrisonWorkForm(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(req.session.inductionDto.inPrisonInterests.inPrisonWorkInterests).toEqual(expectedUpdatedWorkInterests)
      expect(res.redirect).toHaveBeenCalledWith(expectedNextPage)
      expect(req.session.inPrisonWorkForm).toEqual(inPrisonWorkForm)
    })

    it('should not update Induction given error calling service', async () => {
      // Given
      req.user.token = 'some-token'
      const prisonNumber = 'A1234BC'
      req.params.prisonNumber = prisonNumber

      const prisonerSummary = aValidPrisonerSummary()
      req.session.prisonerSummary = prisonerSummary
      const inductionDto = aShortQuestionSetInductionDto()
      req.session.inductionDto = inductionDto

      const inPrisonWorkForm = {
        inPrisonWork: ['COMPUTERS_OR_DESK_BASED', 'OTHER'],
        inPrisonWorkOther: 'Gambling',
      }
      req.body = inPrisonWorkForm
      req.session.inPrisonWorkForm = undefined
      const updateInductionDto = aShortQuestionSetUpdateInductionRequest()

      mockedCreateOrUpdateInductionDtoMapper.mockReturnValueOnce(updateInductionDto)
      mockedFormValidator.mockReturnValue(errors)
      const expectedUpdatedWorkInterests = [
        {
          workType: 'COMPUTERS_OR_DESK_BASED',
          workTypeOther: undefined,
        },
        {
          workType: 'OTHER',
          workTypeOther: 'Gambling',
        },
      ]

      inductionService.updateInduction.mockRejectedValue(createError(500, 'Service unavailable'))
      const expectedError = createError(
        500,
        `Error updating Induction for prisoner ${prisonNumber}. Error: InternalServerError: Service unavailable`,
      )

      // When
      await controller.submitInPrisonWorkForm(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      // Extract the first call to the mock and the second argument (i.e. the updated Induction)
      const updatedInduction = mockedCreateOrUpdateInductionDtoMapper.mock.calls[0][1]
      expect(mockedCreateOrUpdateInductionDtoMapper).toHaveBeenCalledWith(prisonerSummary.prisonId, updatedInduction)
      expect(updatedInduction.inPrisonInterests.inPrisonWorkInterests).toEqual(expectedUpdatedWorkInterests)

      expect(inductionService.updateInduction).toHaveBeenCalledWith(prisonNumber, updateInductionDto, 'some-token')
      expect(next).toHaveBeenCalledWith(expectedError)
      expect(req.session.inPrisonWorkForm).toEqual(inPrisonWorkForm)
      expect(req.session.inductionDto).toEqual(inductionDto)
    })
  })
})
