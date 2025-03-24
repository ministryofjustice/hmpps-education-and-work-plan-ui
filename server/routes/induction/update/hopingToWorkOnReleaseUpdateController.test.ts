import createError from 'http-errors'
import { Request, Response } from 'express'
import type { SessionData } from 'express-session'
import HopingToWorkOnReleaseUpdateController from './hopingToWorkOnReleaseUpdateController'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import { aValidInductionDto } from '../../../testsupport/inductionDtoTestDataBuilder'
import HopingToGetWorkValue from '../../../enums/hopingToGetWorkValue'
import validateHopingToWorkOnReleaseForm from '../../validators/induction/hopingToWorkOnReleaseFormValidator'
import toCreateOrUpdateInductionDto from '../../../data/mappers/createOrUpdateInductionDtoMapper'
import InductionService from '../../../services/inductionService'
import aValidUpdateInductionRequest from '../../../testsupport/updateInductionRequestTestDataBuilder'
import { getPrisonerContext } from '../../../data/session/prisonerContexts'

jest.mock('../../validators/induction/hopingToWorkOnReleaseFormValidator')
jest.mock('../../../data/mappers/createOrUpdateInductionDtoMapper')
jest.mock('../../../services/inductionService')

describe('hopingToWorkOnReleaseUpdateController', () => {
  const mockedFormValidator = validateHopingToWorkOnReleaseForm as jest.MockedFunction<
    typeof validateHopingToWorkOnReleaseForm
  >
  const mockedCreateOrUpdateInductionDtoMapper = toCreateOrUpdateInductionDto as jest.MockedFunction<
    typeof toCreateOrUpdateInductionDto
  >

  const inductionService = new InductionService(null, null) as jest.Mocked<InductionService>
  const controller = new HopingToWorkOnReleaseUpdateController(inductionService)

  const prisonNumber = 'A1234BC'
  const username = 'a-dps-user'
  const prisonerSummary = aValidPrisonerSummary({ prisonNumber })

  const req = {
    session: {} as SessionData,
    body: {},
    user: { username },
    params: { prisonNumber },
    path: `/prisoners/${prisonNumber}/induction/hoping-to-work-on-release`,
  } as unknown as Request
  const res = {
    redirect: jest.fn(),
    redirectWithErrors: jest.fn(),
    render: jest.fn(),
    locals: { prisonerSummary },
  } as unknown as Response
  const next = jest.fn()

  let errors: Array<Record<string, string>>

  beforeEach(() => {
    jest.resetAllMocks()
    req.body = {}
    errors = []
  })

  describe('getHopingToWorkOnReleaseView', () => {
    it('should get the Hoping To Work On Release view given there is no HopingToWorkOnReleaseForm on the session', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      getPrisonerContext(req.session, prisonNumber).inductionDto = inductionDto
      getPrisonerContext(req.session, prisonNumber).hopingToWorkOnReleaseForm = undefined

      const expectedHopingToWorkOnReleaseForm = {
        hopingToGetWork: HopingToGetWorkValue.YES,
      }

      const expectedView = {
        prisonerSummary,
        form: expectedHopingToWorkOnReleaseForm,
      }

      // When
      await controller.getHopingToWorkOnReleaseView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/induction/hopingToWorkOnRelease/index', expectedView)
      expect(getPrisonerContext(req.session, prisonNumber).hopingToWorkOnReleaseForm).toBeUndefined()
      expect(getPrisonerContext(req.session, prisonNumber).inductionDto).toEqual(inductionDto)
    })

    it('should get the Hoping To Work On Release view given there is a HopingToWorkOnReleaseForm already on the session', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      getPrisonerContext(req.session, prisonNumber).inductionDto = inductionDto

      const expectedHopingToWorkOnReleaseForm = {
        hopingToGetWork: HopingToGetWorkValue.YES,
      }
      getPrisonerContext(req.session, prisonNumber).hopingToWorkOnReleaseForm = expectedHopingToWorkOnReleaseForm

      const expectedView = {
        prisonerSummary,
        form: expectedHopingToWorkOnReleaseForm,
      }

      // When
      await controller.getHopingToWorkOnReleaseView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/induction/hopingToWorkOnRelease/index', expectedView)
      expect(getPrisonerContext(req.session, prisonNumber).hopingToWorkOnReleaseForm).toBeUndefined()
      expect(getPrisonerContext(req.session, prisonNumber).inductionDto).toEqual(inductionDto)
    })
  })

  describe('submitHopingToWorkOnReleaseForm', () => {
    it('should not update Induction given form is submitted with validation errors', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      getPrisonerContext(req.session, prisonNumber).inductionDto = inductionDto

      const invalidHopingToWorkOnReleaseForm = {
        hopingToGetWork: '',
      }
      req.body = invalidHopingToWorkOnReleaseForm
      getPrisonerContext(req.session, prisonNumber).hopingToWorkOnReleaseForm = undefined

      errors = [
        {
          href: '#hopingToGetWork',
          text: `Select whether Jimmy Lightfingers is hoping to get work`,
        },
      ]
      mockedFormValidator.mockReturnValue(errors)

      // When
      await controller.submitHopingToWorkOnReleaseForm(req, res, next)

      // Then
      expect(res.redirectWithErrors).toHaveBeenCalledWith(
        '/prisoners/A1234BC/induction/hoping-to-work-on-release',
        errors,
      )
      expect(getPrisonerContext(req.session, prisonNumber).hopingToWorkOnReleaseForm).toEqual(
        invalidHopingToWorkOnReleaseForm,
      )
      expect(getPrisonerContext(req.session, prisonNumber).inductionDto).toEqual(inductionDto)
    })

    it.each([HopingToGetWorkValue.NO, HopingToGetWorkValue.NOT_SURE])(
      `should update Induction given form is submitted with value from YES to %s`,
      async (hopingToGetWorkValue: HopingToGetWorkValue) => {
        // Given
        const inductionDto = aValidInductionDto({ hopingToGetWork: HopingToGetWorkValue.YES })
        getPrisonerContext(req.session, prisonNumber).inductionDto = inductionDto

        const hopingToWorkOnReleaseForm = { hopingToGetWork: hopingToGetWorkValue }
        req.body = hopingToWorkOnReleaseForm
        getPrisonerContext(req.session, prisonNumber).hopingToWorkOnReleaseForm = undefined

        mockedFormValidator.mockReturnValue(errors)

        const updateInductionDto = aValidUpdateInductionRequest()
        updateInductionDto.workOnRelease.hopingToWork = hopingToGetWorkValue
        mockedCreateOrUpdateInductionDtoMapper.mockReturnValueOnce(updateInductionDto)

        // When
        await controller.submitHopingToWorkOnReleaseForm(req, res, next)

        // Then
        // Extract the first call to the mock and the second argument (i.e. the updated Induction)
        const updatedInduction = mockedCreateOrUpdateInductionDtoMapper.mock.calls[0][1]
        expect(mockedCreateOrUpdateInductionDtoMapper).toHaveBeenCalledWith(prisonerSummary.prisonId, updatedInduction)
        expect(updatedInduction.workOnRelease.hopingToWork).toEqual(hopingToGetWorkValue)
        expect(updatedInduction.futureWorkInterests.interests).toEqual([])

        expect(inductionService.updateInduction).toHaveBeenCalledWith(prisonNumber, updateInductionDto, username)
        expect(res.redirect).toHaveBeenCalledWith(`/plan/${prisonNumber}/view/work-and-interests`)
        expect(getPrisonerContext(req.session, prisonNumber).hopingToWorkOnReleaseForm).toBeUndefined()
        expect(getPrisonerContext(req.session, prisonNumber).inductionDto).toBeUndefined()
      },
    )

    it.each([HopingToGetWorkValue.NO, HopingToGetWorkValue.NOT_SURE])(
      `should redirect to Work Interest Types and not call the API to update Induction given form is submitted with value from %s to YES`,
      async (previousHopingToGetWorkValue: HopingToGetWorkValue) => {
        // Given
        const inductionDto = aValidInductionDto({ hopingToGetWork: previousHopingToGetWorkValue })
        getPrisonerContext(req.session, prisonNumber).inductionDto = inductionDto

        const hopingToWorkOnReleaseForm = { hopingToGetWork: HopingToGetWorkValue.YES }
        req.body = hopingToWorkOnReleaseForm
        getPrisonerContext(req.session, prisonNumber).hopingToWorkOnReleaseForm = undefined

        mockedFormValidator.mockReturnValue(errors)

        // When
        await controller.submitHopingToWorkOnReleaseForm(req, res, next)

        // Then
        expect(res.redirect).toHaveBeenCalledWith('/prisoners/A1234BC/induction/work-interest-types')
        expect(getPrisonerContext(req.session, prisonNumber).hopingToWorkOnReleaseForm).toEqual(
          hopingToWorkOnReleaseForm,
        )
        const updatedInduction = getPrisonerContext(req.session, prisonNumber).inductionDto
        expect(updatedInduction.workOnRelease.hopingToWork).toEqual(HopingToGetWorkValue.YES)
        expect(updatedInduction.futureWorkInterests.interests).toEqual([])
        expect(inductionService.updateInduction).not.toHaveBeenCalled()
      },
    )

    it('should not update Induction given error calling service', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      getPrisonerContext(req.session, prisonNumber).inductionDto = inductionDto

      const hopingToWorkOnReleaseForm = {
        hopingToGetWork: HopingToGetWorkValue.NOT_SURE,
      }
      req.body = hopingToWorkOnReleaseForm
      getPrisonerContext(req.session, prisonNumber).hopingToWorkOnReleaseForm = undefined
      const updateInductionDto = aValidUpdateInductionRequest()

      mockedCreateOrUpdateInductionDtoMapper.mockReturnValueOnce(updateInductionDto)
      mockedFormValidator.mockReturnValue(errors)

      inductionService.updateInduction.mockRejectedValue(createError(500, 'Service unavailable'))
      const expectedError = createError(
        500,
        `Error updating Induction for prisoner ${prisonNumber}. Error: InternalServerError: Service unavailable`,
      )

      // When
      await controller.submitHopingToWorkOnReleaseForm(req, res, next)

      // Then
      // Extract the first call to the mock and the second argument (i.e. the updated Induction)
      const updatedInduction = mockedCreateOrUpdateInductionDtoMapper.mock.calls[0][1]
      expect(mockedCreateOrUpdateInductionDtoMapper).toHaveBeenCalledWith(prisonerSummary.prisonId, updatedInduction)
      expect(updatedInduction.workOnRelease.hopingToWork).toEqual(HopingToGetWorkValue.NOT_SURE)

      expect(inductionService.updateInduction).toHaveBeenCalledWith(prisonNumber, updateInductionDto, username)
      expect(next).toHaveBeenCalledWith(expectedError)
      expect(getPrisonerContext(req.session, prisonNumber).hopingToWorkOnReleaseForm).toEqual(hopingToWorkOnReleaseForm)
      const updatedInductionDto = getPrisonerContext(req.session, prisonNumber).inductionDto
      expect(updatedInductionDto.workOnRelease.hopingToWork).toEqual(HopingToGetWorkValue.NOT_SURE)
    })

    it.each([HopingToGetWorkValue.YES, HopingToGetWorkValue.NO, HopingToGetWorkValue.NOT_SURE])(
      'should redirect to Work & Interests given Hoping To Work has not been changed from %s',
      async (hopingToGetWorkValue: HopingToGetWorkValue) => {
        // Given
        const inductionDto = aValidInductionDto({ hopingToGetWork: hopingToGetWorkValue })
        getPrisonerContext(req.session, prisonNumber).inductionDto = inductionDto

        const hopingToWorkOnReleaseForm = {
          hopingToGetWork: hopingToGetWorkValue,
        }
        req.body = hopingToWorkOnReleaseForm
        getPrisonerContext(req.session, prisonNumber).hopingToWorkOnReleaseForm = undefined

        mockedFormValidator.mockReturnValue(errors)

        // When
        await controller.submitHopingToWorkOnReleaseForm(req, res, next)

        // Then
        expect(res.redirect).toHaveBeenCalledWith('/plan/A1234BC/view/work-and-interests')
        expect(getPrisonerContext(req.session, prisonNumber).hopingToWorkOnReleaseForm).toBeUndefined()
        expect(getPrisonerContext(req.session, prisonNumber).inductionDto).toBeUndefined()
        expect(inductionService.updateInduction).not.toHaveBeenCalled()
      },
    )
  })
})
