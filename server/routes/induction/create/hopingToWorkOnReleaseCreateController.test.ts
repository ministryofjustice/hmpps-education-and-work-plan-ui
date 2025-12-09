import { Request, Response } from 'express'
import { v4 as uuidV4 } from 'uuid'
import type { InductionDto } from 'inductionDto'
import type { HopingToWorkOnReleaseForm } from 'inductionForms'
import HopingToWorkOnReleaseCreateController from './hopingToWorkOnReleaseCreateController'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import HopingToGetWorkValue from '../../../enums/hopingToGetWorkValue'
import { aValidInductionDto } from '../../../testsupport/inductionDtoTestDataBuilder'

describe('hopingToWorkOnReleaseCreateController', () => {
  const controller = new HopingToWorkOnReleaseCreateController()

  const journeyId = uuidV4()
  const prisonNumber = 'A1234BC'
  const prisonerSummary = aValidPrisonerSummary()

  const req = {
    session: {},
    journeyData: {},
    body: {},
    params: { prisonNumber, journeyId },
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
    it('should get the Hoping To Work On Release view given there is not a HopingToWorkOnReleaseForm on res.locals.invalidForm', async () => {
      // Given
      const inductionDto: InductionDto = undefined
      req.journeyData.inductionDto = inductionDto

      res.locals.invalidForm = undefined

      const expectedHopingToWorkOnReleaseForm: HopingToWorkOnReleaseForm = {
        hopingToGetWork: undefined,
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
      const inductionDto: InductionDto = undefined
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
    it('should update Induction in session and redirect to Work Interest Types page given form is submitted with Hoping To Work as Yes and previous page was not Check Your Answers', async () => {
      // Given
      req.query = {}

      const inductionDto = { prisonNumber } as InductionDto
      req.journeyData.inductionDto = inductionDto

      const hopingToWorkOnReleaseForm = {
        hopingToGetWork: HopingToGetWorkValue.YES,
      }
      req.body = hopingToWorkOnReleaseForm

      const expectedNextPage = 'work-interest-types'
      const expectedInduction = {
        prisonNumber,
        workOnRelease: {
          hopingToWork: HopingToGetWorkValue.YES,
        },
        futureWorkInterests: {
          interests: [],
          needToCompleteJourneyFromCheckYourAnswers: false,
        },
      } as InductionDto

      // When
      await controller.submitHopingToWorkOnReleaseForm(req, res, next)

      // Then
      expect(res.redirect).toHaveBeenCalledWith(expectedNextPage)
      expect(req.journeyData.inductionDto).toEqual(expectedInduction)
    })

    Array.of<HopingToGetWorkValue>(HopingToGetWorkValue.NO, HopingToGetWorkValue.NOT_SURE).forEach(
      hopingToGetWorkValue => {
        it(`should update Induction in session and redirect to factors affecting ability to work page given form is submitted with Hoping To Work as ${hopingToGetWorkValue} and previous page was not Check Your Answers`, async () => {
          // Given
          req.query = {}

          const inductionDto = { prisonNumber } as InductionDto
          req.journeyData.inductionDto = inductionDto

          const hopingToWorkOnReleaseForm = {
            hopingToGetWork: hopingToGetWorkValue,
          }
          req.body = hopingToWorkOnReleaseForm

          const expectedNextPage = 'affect-ability-to-work'
          const expectedInduction = {
            prisonNumber,
            workOnRelease: {
              hopingToWork: hopingToGetWorkValue,
            },
            futureWorkInterests: {
              interests: [],
              needToCompleteJourneyFromCheckYourAnswers: false,
            },
          } as InductionDto

          // When
          await controller.submitHopingToWorkOnReleaseForm(req, res, next)

          // Then
          expect(res.redirect).toHaveBeenCalledWith(expectedNextPage)
          expect(req.journeyData.inductionDto).toEqual(expectedInduction)
        })
      },
    )

    it.each([HopingToGetWorkValue.YES, HopingToGetWorkValue.NO, HopingToGetWorkValue.NOT_SURE])(
      'should redirect to Check Your Answers given previous page was Check Your Answers and Hoping To Work has not been changed from %s',
      async (hopingToGetWorkValue: HopingToGetWorkValue) => {
        // Given
        req.query = { submitToCheckAnswers: 'true' }

        const inductionDto = aValidInductionDto({ hopingToGetWork: hopingToGetWorkValue })
        inductionDto.futureWorkInterests.needToCompleteJourneyFromCheckYourAnswers = false
        req.journeyData.inductionDto = inductionDto

        const hopingToWorkOnReleaseForm = {
          hopingToGetWork: hopingToGetWorkValue,
        }
        req.body = hopingToWorkOnReleaseForm

        const expectedNextPage = 'check-your-answers'

        // When
        await controller.submitHopingToWorkOnReleaseForm(req, res, next)

        // Then
        expect(req.journeyData.inductionDto.workOnRelease.hopingToWork).toEqual(hopingToGetWorkValue)
        expect(req.journeyData.inductionDto.futureWorkInterests.needToCompleteJourneyFromCheckYourAnswers).toEqual(
          false,
        )
        expect(res.redirect).toHaveBeenCalledWith(expectedNextPage)
      },
    )

    it.each([HopingToGetWorkValue.NO, HopingToGetWorkValue.NOT_SURE])(
      'should update inductionDto and redirect to Check Your Answers given previous page was Check Your Answers and Hoping To Work is being changed from YES to %s',
      async (hopingToGetWorkValue: HopingToGetWorkValue) => {
        // Given
        req.query = { submitToCheckAnswers: 'true' }

        const inductionDto = aValidInductionDto({ hopingToGetWork: HopingToGetWorkValue.YES })
        inductionDto.futureWorkInterests.needToCompleteJourneyFromCheckYourAnswers = false
        req.journeyData.inductionDto = inductionDto

        const hopingToWorkOnReleaseForm = {
          hopingToGetWork: hopingToGetWorkValue,
        }
        req.body = hopingToWorkOnReleaseForm

        const expectedNextPage = 'check-your-answers'

        // When
        await controller.submitHopingToWorkOnReleaseForm(req, res, next)

        // Then
        const updatedInduction = req.journeyData.inductionDto
        expect(updatedInduction.workOnRelease.hopingToWork).toEqual(hopingToGetWorkValue)
        expect(updatedInduction.futureWorkInterests.interests).toEqual([])
        expect(updatedInduction.futureWorkInterests.needToCompleteJourneyFromCheckYourAnswers).toEqual(false)
        expect(res.redirect).toHaveBeenCalledWith(expectedNextPage)
      },
    )

    it.each([HopingToGetWorkValue.NO, HopingToGetWorkValue.NOT_SURE])(
      'should update inductionDto and redirect to Work Interest Types given previous page was Check Your Answers and Hoping To Work is being changed from %s to YES',
      async (previousHopingToGetWorkValue: HopingToGetWorkValue) => {
        // Given
        req.query = { submitToCheckAnswers: 'true' }

        const inductionDto = aValidInductionDto({ hopingToGetWork: previousHopingToGetWorkValue })
        inductionDto.futureWorkInterests.needToCompleteJourneyFromCheckYourAnswers = false
        req.journeyData.inductionDto = inductionDto

        const hopingToWorkOnReleaseForm = {
          hopingToGetWork: HopingToGetWorkValue.YES,
        }
        req.body = hopingToWorkOnReleaseForm

        const expectedNextPage = 'work-interest-types'

        // When
        await controller.submitHopingToWorkOnReleaseForm(req, res, next)

        // Then
        const updatedInduction = req.journeyData.inductionDto
        expect(updatedInduction.workOnRelease.hopingToWork).toEqual(HopingToGetWorkValue.YES)
        expect(updatedInduction.futureWorkInterests.interests).toEqual([])
        expect(updatedInduction.futureWorkInterests.needToCompleteJourneyFromCheckYourAnswers).toEqual(true)
        expect(res.redirect).toHaveBeenCalledWith(expectedNextPage)
      },
    )
  })
})
