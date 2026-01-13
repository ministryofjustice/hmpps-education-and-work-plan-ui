import createError from 'http-errors'
import { Request, Response } from 'express'
import { v4 as uuidV4 } from 'uuid'
import HopingToWorkOnReleaseUpdateController from './hopingToWorkOnReleaseUpdateController'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import { aValidInductionDto } from '../../../testsupport/inductionDtoTestDataBuilder'
import HopingToGetWorkValue from '../../../enums/hopingToGetWorkValue'
import toCreateOrUpdateInductionDto from '../../../data/mappers/createOrUpdateInductionDtoMapper'
import InductionService from '../../../services/inductionService'
import aValidUpdateInductionRequest from '../../../testsupport/updateInductionRequestTestDataBuilder'

jest.mock('../../../data/mappers/createOrUpdateInductionDtoMapper')
jest.mock('../../../services/inductionService')

describe('hopingToWorkOnReleaseUpdateController', () => {
  const mockedCreateOrUpdateInductionDtoMapper = toCreateOrUpdateInductionDto as jest.MockedFunction<
    typeof toCreateOrUpdateInductionDto
  >

  const inductionService = new InductionService(null) as jest.Mocked<InductionService>
  const controller = new HopingToWorkOnReleaseUpdateController(inductionService)

  const journeyId = uuidV4()
  const prisonNumber = 'A1234BC'
  const username = 'a-dps-user'
  const prisonerSummary = aValidPrisonerSummary({ prisonNumber })

  const flash = jest.fn()
  const req = {
    session: {},
    journeyData: {},
    body: {},
    user: { username },
    params: { prisonNumber, journeyId },
    path: `/prisoners/${prisonNumber}/induction/${journeyId}/hoping-to-work-on-release`,
    flash,
  } as unknown as Request
  const res = {
    redirect: jest.fn(),
    render: jest.fn(),
    locals: { prisonerSummary },
  } as unknown as Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
    req.body = {}
    req.journeyData = {}
    res.locals.invalidForm = undefined
  })

  describe('getHopingToWorkOnReleaseView', () => {
    it('should get the Hoping To Work On Release view given there is no HopingToWorkOnReleaseForm on res.locals.invalidForm', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      req.journeyData.inductionDto = inductionDto
      res.locals.invalidForm = undefined

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
      expect(req.journeyData.inductionDto).toEqual(inductionDto)
    })

    it('should get the Hoping To Work On Release view given there is a HopingToWorkOnReleaseForm already on res.locals.invalidForm', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      req.journeyData.inductionDto = inductionDto

      const expectedHopingToWorkOnReleaseForm = {
        hopingToGetWork: HopingToGetWorkValue.YES,
      }
      res.locals.invalidForm = expectedHopingToWorkOnReleaseForm

      const expectedView = {
        prisonerSummary,
        form: expectedHopingToWorkOnReleaseForm,
      }

      // When
      await controller.getHopingToWorkOnReleaseView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/induction/hopingToWorkOnRelease/index', expectedView)
      expect(req.journeyData.inductionDto).toEqual(inductionDto)
    })
  })

  describe('submitHopingToWorkOnReleaseForm', () => {
    it.each([HopingToGetWorkValue.NO, HopingToGetWorkValue.NOT_SURE])(
      `should update Induction given form is submitted with value from YES to %s`,
      async (hopingToGetWorkValue: HopingToGetWorkValue) => {
        // Given
        const inductionDto = aValidInductionDto({ hopingToGetWork: HopingToGetWorkValue.YES })
        req.journeyData.inductionDto = inductionDto

        const hopingToWorkOnReleaseForm = { hopingToGetWork: hopingToGetWorkValue }
        req.body = hopingToWorkOnReleaseForm

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
        expect(req.journeyData.inductionDto).toBeUndefined()
        expect(flash).toHaveBeenCalledWith('pendingRedirectAtEndOfJourney', 'true')
      },
    )

    it.each([HopingToGetWorkValue.NO, HopingToGetWorkValue.NOT_SURE])(
      `should redirect to Work Interest Types and not call the API to update Induction given form is submitted with value from %s to YES`,
      async (previousHopingToGetWorkValue: HopingToGetWorkValue) => {
        // Given
        const inductionDto = aValidInductionDto({ hopingToGetWork: previousHopingToGetWorkValue })
        req.journeyData.inductionDto = inductionDto

        const hopingToWorkOnReleaseForm = { hopingToGetWork: HopingToGetWorkValue.YES }
        req.body = hopingToWorkOnReleaseForm

        // When
        await controller.submitHopingToWorkOnReleaseForm(req, res, next)

        // Then
        expect(res.redirect).toHaveBeenCalledWith(`/prisoners/A1234BC/induction/${journeyId}/work-interest-types`)
        const updatedInduction = req.journeyData.inductionDto
        expect(updatedInduction.workOnRelease.hopingToWork).toEqual(HopingToGetWorkValue.YES)
        expect(updatedInduction.futureWorkInterests.interests).toEqual([])
        expect(inductionService.updateInduction).not.toHaveBeenCalled()
      },
    )

    it('should not update Induction given error calling service', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      req.journeyData.inductionDto = inductionDto

      const hopingToWorkOnReleaseForm = {
        hopingToGetWork: HopingToGetWorkValue.NOT_SURE,
      }
      req.body = hopingToWorkOnReleaseForm
      const updateInductionDto = aValidUpdateInductionRequest()

      mockedCreateOrUpdateInductionDtoMapper.mockReturnValueOnce(updateInductionDto)

      inductionService.updateInduction.mockRejectedValue(createError(500, 'Service unavailable'))

      // When
      await controller.submitHopingToWorkOnReleaseForm(req, res, next)

      // Then
      // Extract the first call to the mock and the second argument (i.e. the updated Induction)
      const updatedInduction = mockedCreateOrUpdateInductionDtoMapper.mock.calls[0][1]
      expect(mockedCreateOrUpdateInductionDtoMapper).toHaveBeenCalledWith(prisonerSummary.prisonId, updatedInduction)
      expect(updatedInduction.workOnRelease.hopingToWork).toEqual(HopingToGetWorkValue.NOT_SURE)

      expect(inductionService.updateInduction).toHaveBeenCalledWith(prisonNumber, updateInductionDto, username)
      const updatedInductionDto = req.journeyData.inductionDto
      expect(updatedInductionDto.workOnRelease.hopingToWork).toEqual(HopingToGetWorkValue.NOT_SURE)
      expect(flash).toHaveBeenCalledWith('pageHasApiErrors', 'true')
      expect(res.redirect).toHaveBeenCalledWith('hoping-to-work-on-release')
    })

    it.each([HopingToGetWorkValue.YES, HopingToGetWorkValue.NO, HopingToGetWorkValue.NOT_SURE])(
      'should redirect to Work & Interests given Hoping To Work has not been changed from %s',
      async (hopingToGetWorkValue: HopingToGetWorkValue) => {
        // Given
        const inductionDto = aValidInductionDto({ hopingToGetWork: hopingToGetWorkValue })
        req.journeyData.inductionDto = inductionDto

        const hopingToWorkOnReleaseForm = {
          hopingToGetWork: hopingToGetWorkValue,
        }
        req.body = hopingToWorkOnReleaseForm

        // When
        await controller.submitHopingToWorkOnReleaseForm(req, res, next)

        // Then
        expect(res.redirect).toHaveBeenCalledWith('/plan/A1234BC/view/work-and-interests')
        expect(req.journeyData.inductionDto).toBeUndefined()
        expect(inductionService.updateInduction).not.toHaveBeenCalled()
      },
    )
  })
})
