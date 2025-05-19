import createError from 'http-errors'
import { Request, Response } from 'express'
import { v4 as uuidV4 } from 'uuid'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import { aValidInductionDto } from '../../../testsupport/inductionDtoTestDataBuilder'
import toCreateOrUpdateInductionDto from '../../../data/mappers/createOrUpdateInductionDtoMapper'
import InductionService from '../../../services/inductionService'
import aValidUpdateInductionRequest from '../../../testsupport/updateInductionRequestTestDataBuilder'
import PersonalInterestsUpdateController from './personalInterestsUpdateController'

jest.mock('../../../data/mappers/createOrUpdateInductionDtoMapper')
jest.mock('../../../services/inductionService')

describe('personalInterestsUpdateController', () => {
  const mockedCreateOrUpdateInductionDtoMapper = toCreateOrUpdateInductionDto as jest.MockedFunction<
    typeof toCreateOrUpdateInductionDto
  >

  const inductionService = new InductionService(null, null) as jest.Mocked<InductionService>
  const controller = new PersonalInterestsUpdateController(inductionService)

  const journeyId = uuidV4()
  const prisonNumber = 'A1234BC'
  const username = 'a-dps-user'
  const prisonerSummary = aValidPrisonerSummary()

  const req = {
    session: {},
    journeyData: {},
    body: {},
    user: { username },
    params: { prisonNumber, journeyId },
    path: `/prisoners/${prisonNumber}/induction/${journeyId}/personal-interests`,
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
    req.body = {}
    req.journeyData = {}
  })

  describe('getPersonalInterestsView', () => {
    it('should get the Personal interests view given there is no PersonalInterestsForm on the session', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      req.journeyData.inductionDto = inductionDto
      req.session.personalInterestsForm = undefined

      const expectedPersonalInterestsForm = {
        personalInterests: ['CREATIVE', 'DIGITAL', 'OTHER'],
        personalInterestsOther: 'Renewable energy',
      }

      const expectedView = {
        prisonerSummary,
        form: expectedPersonalInterestsForm,
      }

      // When
      await controller.getPersonalInterestsView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/induction/personalInterests/index', expectedView)
      expect(req.session.personalInterestsForm).toBeUndefined()
      expect(req.journeyData.inductionDto).toEqual(inductionDto)
    })

    it('should get the Personal interests view given there is an PersonalInterestsForm already on the session', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      req.journeyData.inductionDto = inductionDto

      const expectedPersonalInterestsForm = {
        personalInterests: ['COMMUNITY', 'CREATIVE', 'MUSICAL'],
        personalInterestsOther: '',
      }
      req.session.personalInterestsForm = expectedPersonalInterestsForm

      const expectedView = {
        prisonerSummary,
        form: expectedPersonalInterestsForm,
      }

      // When
      await controller.getPersonalInterestsView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/induction/personalInterests/index', expectedView)
      expect(req.session.personalInterestsForm).toBeUndefined()
      expect(req.journeyData.inductionDto).toEqual(inductionDto)
    })
  })

  describe('submitPersonalInterestsForm', () => {
    it('should not update Induction given form is submitted with validation errors', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      req.journeyData.inductionDto = inductionDto

      const invalidPersonalInterestsForm = {
        personalInterests: ['OTHER'],
        personalInterestsOther: '',
      }
      req.body = invalidPersonalInterestsForm
      req.session.personalInterestsForm = undefined

      const expectedErrors = [{ href: '#personalInterestsOther', text: `Enter Ifereeca Peigh's interests` }]

      // When
      await controller.submitPersonalInterestsForm(req, res, next)

      // Then
      expect(res.redirectWithErrors).toHaveBeenCalledWith(
        `/prisoners/A1234BC/induction/${journeyId}/personal-interests`,
        expectedErrors,
      )
      expect(req.session.personalInterestsForm).toEqual(invalidPersonalInterestsForm)
      expect(req.journeyData.inductionDto).toEqual(inductionDto)
    })

    it('should update Induction and call API and redirect to work and interests page', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      req.journeyData.inductionDto = inductionDto

      const personalInterestsForm = {
        personalInterests: ['CREATIVE', 'OTHER'],
        personalInterestsOther: 'Renewable energy',
      }
      req.body = personalInterestsForm
      req.session.personalInterestsForm = undefined
      const updateInductionDto = aValidUpdateInductionRequest()

      mockedCreateOrUpdateInductionDtoMapper.mockReturnValueOnce(updateInductionDto)

      const expectedUpdatedPersonalInterests = [
        {
          interestType: 'CREATIVE',
          interestTypeOther: undefined,
        },
        {
          interestType: 'OTHER',
          interestTypeOther: 'Renewable energy',
        },
      ]

      // When
      await controller.submitPersonalInterestsForm(req, res, next)

      // Then
      // Extract the first call to the mock and the second argument (i.e. the updated Induction)
      const updatedInduction = mockedCreateOrUpdateInductionDtoMapper.mock.calls[0][1]
      expect(mockedCreateOrUpdateInductionDtoMapper).toHaveBeenCalledWith(prisonerSummary.prisonId, updatedInduction)
      expect(updatedInduction.personalSkillsAndInterests.interests).toEqual(expectedUpdatedPersonalInterests)

      expect(inductionService.updateInduction).toHaveBeenCalledWith(prisonNumber, updateInductionDto, username)
      expect(res.redirect).toHaveBeenCalledWith(`/plan/${prisonNumber}/view/work-and-interests`)
      expect(req.session.personalInterestsForm).toBeUndefined()
      expect(req.journeyData.inductionDto).toBeUndefined()
    })

    it('should not update Induction given error calling service', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      req.journeyData.inductionDto = inductionDto

      const personalInterestsForm = {
        personalInterests: ['KNOWLEDGE_BASED', 'OTHER'],
        personalInterestsOther: 'Writing poetry and short stories',
      }
      req.body = personalInterestsForm
      req.session.personalInterestsForm = undefined
      const updateInductionDto = aValidUpdateInductionRequest()

      mockedCreateOrUpdateInductionDtoMapper.mockReturnValueOnce(updateInductionDto)

      const expectedUpdatedPersonalInterests = [
        {
          interestType: 'KNOWLEDGE_BASED',
          interestTypeOther: undefined,
        },
        {
          interestType: 'OTHER',
          interestTypeOther: 'Writing poetry and short stories',
        },
      ]

      inductionService.updateInduction.mockRejectedValue(createError(500, 'Service unavailable'))
      const expectedError = createError(
        500,
        `Error updating Induction for prisoner ${prisonNumber}. Error: InternalServerError: Service unavailable`,
      )

      // When
      await controller.submitPersonalInterestsForm(req, res, next)

      // Then
      // Extract the first call to the mock and the second argument (i.e. the updated Induction)
      const updatedInduction = mockedCreateOrUpdateInductionDtoMapper.mock.calls[0][1]
      expect(mockedCreateOrUpdateInductionDtoMapper).toHaveBeenCalledWith(prisonerSummary.prisonId, updatedInduction)
      expect(updatedInduction.personalSkillsAndInterests.interests).toEqual(expectedUpdatedPersonalInterests)

      expect(inductionService.updateInduction).toHaveBeenCalledWith(prisonNumber, updateInductionDto, username)
      expect(next).toHaveBeenCalledWith(expectedError)
      expect(req.session.personalInterestsForm).toEqual(personalInterestsForm)
      expect(req.journeyData.inductionDto).toEqual(inductionDto)
    })
  })
})
