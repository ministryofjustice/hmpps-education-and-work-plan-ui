import createError from 'http-errors'
import { Request, Response } from 'express'
import { v4 as uuidV4 } from 'uuid'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import { aValidInductionDto } from '../../../testsupport/inductionDtoTestDataBuilder'
import toCreateOrUpdateInductionDto from '../../../data/mappers/createOrUpdateInductionDtoMapper'
import InductionService from '../../../services/inductionService'
import aValidUpdateInductionRequest from '../../../testsupport/updateInductionRequestTestDataBuilder'
import SkillsUpdateController from './skillsUpdateController'

jest.mock('../../../data/mappers/createOrUpdateInductionDtoMapper')
jest.mock('../../../services/inductionService')

describe('skillsUpdateController', () => {
  const mockedCreateOrUpdateInductionDtoMapper = toCreateOrUpdateInductionDto as jest.MockedFunction<
    typeof toCreateOrUpdateInductionDto
  >

  const inductionService = new InductionService(null, null) as jest.Mocked<InductionService>
  const controller = new SkillsUpdateController(inductionService)

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
    path: `/prisoners/${prisonNumber}/induction/${journeyId}/skills`,
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

  describe('getSkillsView', () => {
    it('should get the Skills view given there is no SkillsForm on the session', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      req.journeyData.inductionDto = inductionDto
      req.session.skillsForm = undefined

      const expectedSkillsForm = {
        skills: ['TEAMWORK', 'WILLINGNESS_TO_LEARN', 'OTHER'],
        skillsOther: 'Tenacity',
      }

      const expectedView = {
        prisonerSummary,
        form: expectedSkillsForm,
      }

      // When
      await controller.getSkillsView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/induction/skills/index', expectedView)
      expect(req.session.skillsForm).toBeUndefined()
      expect(req.journeyData.inductionDto).toEqual(inductionDto)
    })

    it('should get the Skills view given there is an SkillsForm already on the session', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      req.journeyData.inductionDto = inductionDto

      const expectedSkillsForm = {
        skills: ['SELF_MANAGEMENT', 'TEAMWORK', 'THINKING_AND_PROBLEM_SOLVING'],
        skillsOther: '',
      }
      req.session.skillsForm = expectedSkillsForm

      const expectedView = {
        prisonerSummary,
        form: expectedSkillsForm,
      }

      // When
      await controller.getSkillsView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/induction/skills/index', expectedView)
      expect(req.session.skillsForm).toBeUndefined()
      expect(req.journeyData.inductionDto).toEqual(inductionDto)
    })
  })

  describe('submitSkillsForm', () => {
    it('should not update Induction given form is submitted with validation errors', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      req.journeyData.inductionDto = inductionDto

      const invalidSkillsForm = {
        skills: ['OTHER'],
        skillsOther: '',
      }
      req.body = invalidSkillsForm
      req.session.skillsForm = undefined

      const expectedErrors = [{ href: '#skillsOther', text: 'Enter the skill that Jimmy Lightfingers feels they have' }]

      // When
      await controller.submitSkillsForm(req, res, next)

      // Then
      expect(res.redirectWithErrors).toHaveBeenCalledWith(
        `/prisoners/A1234BC/induction/${journeyId}/skills`,
        expectedErrors,
      )
      expect(req.session.skillsForm).toEqual(invalidSkillsForm)
      expect(req.journeyData.inductionDto).toEqual(inductionDto)
    })

    it('should update Induction and call API and redirect to work and interests page', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      req.journeyData.inductionDto = inductionDto

      const skillsForm = {
        skills: ['TEAMWORK', 'OTHER'],
        skillsOther: 'Circus skills',
      }
      req.body = skillsForm
      req.session.skillsForm = undefined
      const updateInductionDto = aValidUpdateInductionRequest()

      mockedCreateOrUpdateInductionDtoMapper.mockReturnValueOnce(updateInductionDto)

      const expectedUpdatedSkills = [
        {
          skillType: 'TEAMWORK',
          skillTypeOther: undefined,
        },
        {
          skillType: 'OTHER',
          skillTypeOther: 'Circus skills',
        },
      ]

      // When
      await controller.submitSkillsForm(req, res, next)

      // Then
      // Extract the first call to the mock and the second argument (i.e. the updated Induction)
      const updatedInduction = mockedCreateOrUpdateInductionDtoMapper.mock.calls[0][1]
      expect(mockedCreateOrUpdateInductionDtoMapper).toHaveBeenCalledWith(prisonerSummary.prisonId, updatedInduction)
      expect(updatedInduction.personalSkillsAndInterests.skills).toEqual(expectedUpdatedSkills)

      expect(inductionService.updateInduction).toHaveBeenCalledWith(prisonNumber, updateInductionDto, username)
      expect(res.redirect).toHaveBeenCalledWith(`/plan/${prisonNumber}/view/work-and-interests`)
      expect(req.session.skillsForm).toBeUndefined()
      expect(req.journeyData.inductionDto).toBeUndefined()
    })

    it('should not update Induction given error calling service', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      req.journeyData.inductionDto = inductionDto

      const skillsForm = {
        skills: ['TEAMWORK', 'OTHER'],
        skillsOther: 'Circus skills',
      }
      req.body = skillsForm
      req.session.skillsForm = undefined
      const updateInductionDto = aValidUpdateInductionRequest()

      mockedCreateOrUpdateInductionDtoMapper.mockReturnValueOnce(updateInductionDto)

      const expectedUpdatedSkills = [
        {
          skillType: 'TEAMWORK',
          skillTypeOther: undefined,
        },
        {
          skillType: 'OTHER',
          skillTypeOther: 'Circus skills',
        },
      ]

      inductionService.updateInduction.mockRejectedValue(createError(500, 'Service unavailable'))
      const expectedError = createError(
        500,
        `Error updating Induction for prisoner ${prisonNumber}. Error: InternalServerError: Service unavailable`,
      )

      // When
      await controller.submitSkillsForm(req, res, next)

      // Then
      // Extract the first call to the mock and the second argument (i.e. the updated Induction)
      const updatedInduction = mockedCreateOrUpdateInductionDtoMapper.mock.calls[0][1]
      expect(mockedCreateOrUpdateInductionDtoMapper).toHaveBeenCalledWith(prisonerSummary.prisonId, updatedInduction)
      expect(updatedInduction.personalSkillsAndInterests.skills).toEqual(expectedUpdatedSkills)

      expect(inductionService.updateInduction).toHaveBeenCalledWith(prisonNumber, updateInductionDto, username)
      expect(next).toHaveBeenCalledWith(expectedError)
      expect(req.session.skillsForm).toEqual(skillsForm)
      expect(req.journeyData.inductionDto).toEqual(inductionDto)
    })
  })
})
