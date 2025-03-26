import createError from 'http-errors'
import type { WorkedBeforeForm } from 'inductionForms'
import { Request, Response } from 'express'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import { aValidInductionDto } from '../../../testsupport/inductionDtoTestDataBuilder'
import toCreateOrUpdateInductionDto from '../../../data/mappers/createOrUpdateInductionDtoMapper'
import InductionService from '../../../services/inductionService'
import aValidUpdateInductionRequest from '../../../testsupport/updateInductionRequestTestDataBuilder'
import WorkedBeforeUpdateController from './workedBeforeUpdateController'
import HasWorkedBeforeValue from '../../../enums/hasWorkedBeforeValue'
import { getPrisonerContext } from '../../../data/session/prisonerContexts'

jest.mock('../../../data/mappers/createOrUpdateInductionDtoMapper')
jest.mock('../../../services/inductionService')

describe('workedBeforeUpdateController', () => {
  const mockedCreateOrUpdateInductionDtoMapper = toCreateOrUpdateInductionDto as jest.MockedFunction<
    typeof toCreateOrUpdateInductionDto
  >

  const inductionService = new InductionService(null, null) as jest.Mocked<InductionService>
  const controller = new WorkedBeforeUpdateController(inductionService)

  const prisonNumber = 'A1234BC'
  const username = 'a-dps-user'
  const prisonerSummary = aValidPrisonerSummary()

  const req = {
    session: {},
    body: {},
    user: { username },
    params: { prisonNumber },
    path: `/prisoners/${prisonNumber}/induction/has-worked-before`,
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
      getPrisonerContext(req.session, prisonNumber).inductionDto = inductionDto
      getPrisonerContext(req.session, prisonNumber).workedBeforeForm = undefined

      const expectedWorkedBeforeForm = {
        hasWorkedBefore: HasWorkedBeforeValue.YES,
      }

      const expectedView = {
        prisonerSummary,
        form: expectedWorkedBeforeForm,
      }

      // When
      await controller.getWorkedBeforeView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/induction/workedBefore/index', expectedView)
      expect(getPrisonerContext(req.session, prisonNumber).workedBeforeForm).toBeUndefined()
      expect(getPrisonerContext(req.session, prisonNumber).inductionDto).toEqual(inductionDto)
    })

    it('should get the WorkedBefore view given there is an WorkedBeforeForm already on the session', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      getPrisonerContext(req.session, prisonNumber).inductionDto = inductionDto

      const expectedWorkedBeforeForm = {
        hasWorkedBefore: HasWorkedBeforeValue.NO,
      }
      getPrisonerContext(req.session, prisonNumber).workedBeforeForm = expectedWorkedBeforeForm

      const expectedView = {
        prisonerSummary,
        form: expectedWorkedBeforeForm,
      }

      // When
      await controller.getWorkedBeforeView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/induction/workedBefore/index', expectedView)
      expect(getPrisonerContext(req.session, prisonNumber).workedBeforeForm).toBeUndefined()
      expect(getPrisonerContext(req.session, prisonNumber).inductionDto).toEqual(inductionDto)
    })
  })

  describe('submitWorkedBeforeForm', () => {
    it('should not update Induction given form is submitted with validation errors', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      getPrisonerContext(req.session, prisonNumber).inductionDto = inductionDto

      const invalidWorkedBeforeForm: WorkedBeforeForm = {
        hasWorkedBefore: undefined,
      }
      req.body = invalidWorkedBeforeForm
      getPrisonerContext(req.session, prisonNumber).workedBeforeForm = undefined

      const expectedErrors = [
        { href: '#hasWorkedBefore', text: 'Select whether Jimmy Lightfingers has worked before or not' },
      ]

      // When
      await controller.submitWorkedBeforeForm(req, res, next)

      // Then
      expect(res.redirectWithErrors).toHaveBeenCalledWith(
        '/prisoners/A1234BC/induction/has-worked-before',
        expectedErrors,
      )
      expect(getPrisonerContext(req.session, prisonNumber).workedBeforeForm).toEqual(invalidWorkedBeforeForm)
      expect(getPrisonerContext(req.session, prisonNumber).inductionDto).toEqual(inductionDto)
    })

    it('should update Induction in session and redirect to previous work experience page if answering YES', async () => {
      // Given
      const inductionDto = aValidInductionDto({ hasWorkedBefore: HasWorkedBeforeValue.NO })
      getPrisonerContext(req.session, prisonNumber).inductionDto = inductionDto

      const workedBeforeForm = {
        hasWorkedBefore: HasWorkedBeforeValue.YES,
      }
      req.body = workedBeforeForm
      getPrisonerContext(req.session, prisonNumber).workedBeforeForm = undefined
      const updateInductionDto = aValidUpdateInductionRequest()

      mockedCreateOrUpdateInductionDtoMapper.mockReturnValueOnce(updateInductionDto)

      // When
      await controller.submitWorkedBeforeForm(req, res, next)

      // Then
      expect(res.redirect).toHaveBeenCalledWith(`/prisoners/${prisonNumber}/induction/previous-work-experience`)
      expect(getPrisonerContext(req.session, prisonNumber).workedBeforeForm).toBeUndefined()
      expect(getPrisonerContext(req.session, prisonNumber).inductionDto).toStrictEqual({
        ...inductionDto,
        previousWorkExperiences: {
          ...inductionDto.previousWorkExperiences,
          hasWorkedBefore: HasWorkedBeforeValue.YES,
          hasWorkedBeforeNotRelevantReason: undefined,
        },
      })
    })
    it('should update Induction and call API and redirect to work and interests page if answering NO', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      getPrisonerContext(req.session, prisonNumber).inductionDto = inductionDto

      const workedBeforeForm = {
        hasWorkedBefore: HasWorkedBeforeValue.NO,
      }
      req.body = workedBeforeForm
      getPrisonerContext(req.session, prisonNumber).workedBeforeForm = undefined
      const updateInductionDto = aValidUpdateInductionRequest()

      mockedCreateOrUpdateInductionDtoMapper.mockReturnValueOnce(updateInductionDto)

      // When
      await controller.submitWorkedBeforeForm(req, res, next)

      // Then
      // Extract the first call to the mock and the second argument (i.e. the updated Induction)
      const updatedInduction = mockedCreateOrUpdateInductionDtoMapper.mock.calls[0][1]
      expect(mockedCreateOrUpdateInductionDtoMapper).toHaveBeenCalledWith(prisonerSummary.prisonId, updatedInduction)
      expect(updatedInduction.previousWorkExperiences.hasWorkedBefore).toEqual('NO')

      expect(inductionService.updateInduction).toHaveBeenCalledWith(prisonNumber, updateInductionDto, username)
      expect(res.redirect).toHaveBeenCalledWith(`/plan/${prisonNumber}/view/work-and-interests`)
      expect(getPrisonerContext(req.session, prisonNumber).workedBeforeForm).toBeUndefined()
      expect(getPrisonerContext(req.session, prisonNumber).inductionDto).toBeUndefined()
    })

    it('should update Induction and call API and redirect to work and interests page if answering NOT_RELEVANT', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      getPrisonerContext(req.session, prisonNumber).inductionDto = inductionDto

      const workedBeforeForm = {
        hasWorkedBefore: HasWorkedBeforeValue.NOT_RELEVANT,
        hasWorkedBeforeNotRelevantReason: 'Some reason',
      }
      req.body = workedBeforeForm
      getPrisonerContext(req.session, prisonNumber).workedBeforeForm = undefined
      const updateInductionDto = aValidUpdateInductionRequest()

      mockedCreateOrUpdateInductionDtoMapper.mockReturnValueOnce(updateInductionDto)

      // When
      await controller.submitWorkedBeforeForm(req, res, next)

      // Then
      // Extract the first call to the mock and the second argument (i.e. the updated Induction)
      const updatedInduction = mockedCreateOrUpdateInductionDtoMapper.mock.calls[0][1]
      expect(mockedCreateOrUpdateInductionDtoMapper).toHaveBeenCalledWith(prisonerSummary.prisonId, updatedInduction)
      expect(updatedInduction.previousWorkExperiences.hasWorkedBefore).toEqual('NOT_RELEVANT')
      expect(updatedInduction.previousWorkExperiences.hasWorkedBeforeNotRelevantReason).toEqual('Some reason')

      expect(inductionService.updateInduction).toHaveBeenCalledWith(prisonNumber, updateInductionDto, username)
      expect(res.redirect).toHaveBeenCalledWith(`/plan/${prisonNumber}/view/work-and-interests`)
      expect(getPrisonerContext(req.session, prisonNumber).workedBeforeForm).toBeUndefined()
      expect(getPrisonerContext(req.session, prisonNumber).inductionDto).toBeUndefined()
    })

    it('should not update Induction given error calling service', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      getPrisonerContext(req.session, prisonNumber).inductionDto = inductionDto

      const workedBeforeForm = {
        hasWorkedBefore: HasWorkedBeforeValue.NO,
      }
      req.body = workedBeforeForm
      getPrisonerContext(req.session, prisonNumber).workedBeforeForm = undefined
      const updateInductionDto = aValidUpdateInductionRequest()

      mockedCreateOrUpdateInductionDtoMapper.mockReturnValueOnce(updateInductionDto)

      inductionService.updateInduction.mockRejectedValue(createError(500, 'Service unavailable'))
      const expectedError = createError(
        500,
        `Error updating Induction for prisoner ${prisonNumber}. Error: InternalServerError: Service unavailable`,
      )

      // When
      await controller.submitWorkedBeforeForm(req, res, next)

      // Then
      // Extract the first call to the mock and the second argument (i.e. the updated Induction)
      const updatedInduction = mockedCreateOrUpdateInductionDtoMapper.mock.calls[0][1]
      expect(mockedCreateOrUpdateInductionDtoMapper).toHaveBeenCalledWith(prisonerSummary.prisonId, updatedInduction)
      expect(updatedInduction.previousWorkExperiences.hasWorkedBefore).toEqual('NO')

      expect(inductionService.updateInduction).toHaveBeenCalledWith(prisonNumber, updateInductionDto, username)
      expect(next).toHaveBeenCalledWith(expectedError)
      expect(getPrisonerContext(req.session, prisonNumber).workedBeforeForm).toEqual(workedBeforeForm)
      expect(getPrisonerContext(req.session, prisonNumber).inductionDto).toEqual(inductionDto)
    })
  })
})
