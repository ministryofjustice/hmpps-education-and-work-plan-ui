import { NextFunction, Request, Response } from 'express'
import type { SessionData } from 'express-session'
import HopingToWorkOnReleaseUpdateController from './hopingToWorkOnReleaseUpdateController'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import {
  aLongQuestionSetInductionDto,
  aShortQuestionSetInductionDto,
} from '../../../testsupport/inductionDtoTestDataBuilder'
import HopingToGetWorkValue from '../../../enums/hopingToGetWorkValue'
import validateHopingToWorkOnReleaseForm from './hopingToWorkOnReleaseFormValidator'
import toCreateOrUpdateInductionDto from '../../../data/mappers/createOrUpdateInductionDtoMapper'
import InductionService from '../../../services/inductionService'
import { aShortQuestionSetUpdateInductionDto } from '../../../testsupport/updateInductionDtoTestDataBuilder'
import { aLongQuestionSetUpdateInductionRequest } from '../../../testsupport/updateInductionRequestTestDataBuilder'

jest.mock('./hopingToWorkOnReleaseFormValidator')
jest.mock('../../../data/mappers/createOrUpdateInductionDtoMapper')
jest.mock('../../../services/inductionService')

describe('hopingToWorkOnReleaseUpdateController', () => {
  const mockedFormValidator = validateHopingToWorkOnReleaseForm as jest.MockedFunction<
    typeof validateHopingToWorkOnReleaseForm
  >
  const mockedCreateOrUpdateInductionDtoMapper = toCreateOrUpdateInductionDto as jest.MockedFunction<
    typeof toCreateOrUpdateInductionDto
  >

  const inductionService = new InductionService(null) as jest.Mocked<InductionService>
  const controller = new HopingToWorkOnReleaseUpdateController(inductionService)

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
    req.path = `/prisoners/${prisonNumber}/induction/hoping-to-work-on-release`

    errors = []
  })

  describe('getHopingToWorkOnReleaseView', () => {
    it('should get the Hoping To Work On Release view given there is no HopingToWorkOnReleaseForm on the session', async () => {
      // Given
      const prisonerSummary = aValidPrisonerSummary()
      req.session.prisonerSummary = prisonerSummary
      const inductionDto = aLongQuestionSetInductionDto()
      req.session.inductionDto = inductionDto
      req.session.hopingToWorkOnReleaseForm = undefined

      const expectedHopingToWorkOnReleaseForm = {
        hopingToGetWork: HopingToGetWorkValue.YES,
      }

      const expectedView = {
        prisonerSummary,
        form: expectedHopingToWorkOnReleaseForm,
        backLinkUrl: '/plan/A1234BC/view/work-and-interests',
        backLinkAriaText: `Back to Jimmy Lightfingers's learning and work progress`,
        errors,
      }

      // When
      await controller.getHopingToWorkOnReleaseView(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/induction/hopingToWorkOnRelease/index', expectedView)
      expect(req.session.hopingToWorkOnReleaseForm).toBeUndefined()
      expect(req.session.inductionDto).toEqual(inductionDto)
    })

    it('should get the Hoping To Work On Release view given there is a HopingToWorkOnReleaseForm already on the session', async () => {
      // Given
      const prisonerSummary = aValidPrisonerSummary()
      req.session.prisonerSummary = prisonerSummary
      const inductionDto = aLongQuestionSetInductionDto()
      req.session.inductionDto = inductionDto

      const expectedHopingToWorkOnReleaseForm = {
        hopingToGetWork: HopingToGetWorkValue.YES,
      }
      req.session.hopingToWorkOnReleaseForm = expectedHopingToWorkOnReleaseForm

      const expectedView = {
        prisonerSummary,
        form: expectedHopingToWorkOnReleaseForm,
        backLinkUrl: '/plan/A1234BC/view/work-and-interests',
        backLinkAriaText: `Back to Jimmy Lightfingers's learning and work progress`,
        errors,
      }

      // When
      await controller.getHopingToWorkOnReleaseView(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/induction/hopingToWorkOnRelease/index', expectedView)
      expect(req.session.hopingToWorkOnReleaseForm).toBeUndefined()
      expect(req.session.inductionDto).toEqual(inductionDto)
    })
  })

  describe('submitHopingToWorkOnReleaseForm', () => {
    it('should not update Induction given form is submitted with validation errors', async () => {
      // Given
      const prisonerSummary = aValidPrisonerSummary()
      req.session.prisonerSummary = prisonerSummary
      const inductionDto = aLongQuestionSetInductionDto()
      req.session.inductionDto = inductionDto

      const invalidHopingToWorkOnReleaseForm = {
        hopingToGetWork: '',
      }
      req.body = invalidHopingToWorkOnReleaseForm
      req.session.hopingToWorkOnReleaseForm = undefined

      errors = [
        {
          href: '#hopingToGetWork',
          text: `Select whether Jimmy Lightfingers is hoping to get work`,
        },
      ]
      mockedFormValidator.mockReturnValue(errors)

      // When
      await controller.submitHopingToWorkOnReleaseForm(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.redirect).toHaveBeenCalledWith('/prisoners/A1234BC/induction/hoping-to-work-on-release')
      expect(req.flash).toHaveBeenCalledWith('errors', errors)
      expect(req.session.hopingToWorkOnReleaseForm).toEqual(invalidHopingToWorkOnReleaseForm)
      expect(req.session.inductionDto).toEqual(inductionDto)
    })

    Array.of(
      { inductionValue: HopingToGetWorkValue.YES, formValue: HopingToGetWorkValue.YES },
      { inductionValue: HopingToGetWorkValue.NO, formValue: HopingToGetWorkValue.NO },
      { inductionValue: HopingToGetWorkValue.NOT_SURE, formValue: HopingToGetWorkValue.NOT_SURE },
      { inductionValue: HopingToGetWorkValue.NO, formValue: HopingToGetWorkValue.NOT_SURE },
      { inductionValue: HopingToGetWorkValue.NOT_SURE, formValue: HopingToGetWorkValue.NO },
    ).forEach(spec => {
      it(`should update Induction whose current value is ${spec.inductionValue} given form is submitted with value ${spec.formValue} `, async () => {
        // Given
        req.user.token = 'some-token'

        const prisonerSummary = aValidPrisonerSummary()
        req.session.prisonerSummary = prisonerSummary

        const inductionDto =
          spec.inductionValue === HopingToGetWorkValue.YES
            ? aLongQuestionSetInductionDto()
            : aShortQuestionSetInductionDto()
        inductionDto.workOnRelease.hopingToWork = spec.inductionValue
        req.session.inductionDto = inductionDto

        const hopingToWorkOnReleaseForm = { hopingToGetWork: spec.formValue }
        req.body = hopingToWorkOnReleaseForm
        req.session.hopingToWorkOnReleaseForm = undefined

        mockedFormValidator.mockReturnValue(errors)

        const updateInductionDto =
          spec.inductionValue === HopingToGetWorkValue.YES
            ? aLongQuestionSetUpdateInductionRequest()
            : aShortQuestionSetUpdateInductionDto()
        updateInductionDto.workOnRelease.hopingToWork = spec.formValue
        mockedCreateOrUpdateInductionDtoMapper.mockReturnValueOnce(updateInductionDto)

        const expectedHopingToWorkOnReleaseValue = spec.formValue

        // When
        await controller.submitHopingToWorkOnReleaseForm(
          req as undefined as Request,
          res as undefined as Response,
          next as undefined as NextFunction,
        )

        // Then
        // Extract the first call to the mock and the second argument (i.e. the updated Induction)
        const updatedInduction = mockedCreateOrUpdateInductionDtoMapper.mock.calls[0][1]
        expect(mockedCreateOrUpdateInductionDtoMapper).toHaveBeenCalledWith(prisonerSummary.prisonId, updatedInduction)
        expect(updatedInduction.workOnRelease.hopingToWork).toEqual(expectedHopingToWorkOnReleaseValue)

        expect(inductionService.updateInduction).toHaveBeenCalledWith(prisonNumber, updateInductionDto, 'some-token')
        expect(res.redirect).toHaveBeenCalledWith(`/plan/${prisonNumber}/view/work-and-interests`)
        expect(req.session.hopingToWorkOnReleaseForm).toBeUndefined()
        expect(req.session.inductionDto).toBeUndefined()
      })
    })
  })
})
