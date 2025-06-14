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
    req.session.pageFlowHistory = undefined
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
    it('should update Induction in session and redirect to Work Interest Types page given form is submitted with Hoping To Work as Yes', async () => {
      // Given
      const inductionDto = { prisonNumber } as InductionDto
      req.journeyData.inductionDto = inductionDto

      const hopingToWorkOnReleaseForm = {
        hopingToGetWork: HopingToGetWorkValue.YES,
      }
      req.body = hopingToWorkOnReleaseForm

      const expectedInduction = {
        prisonNumber,
        workOnRelease: {
          hopingToWork: HopingToGetWorkValue.YES,
        },
        futureWorkInterests: {
          interests: [],
        },
      } as InductionDto

      // When
      await controller.submitHopingToWorkOnReleaseForm(req, res, next)

      // Then
      expect(res.redirect).toHaveBeenCalledWith(`/prisoners/A1234BC/create-induction/${journeyId}/work-interest-types`)
      expect(req.journeyData.inductionDto).toEqual(expectedInduction)
    })

    Array.of<HopingToGetWorkValue>(HopingToGetWorkValue.NO, HopingToGetWorkValue.NOT_SURE).forEach(
      hopingToGetWorkValue => {
        it(`should update Induction in session and redirect to factors affecting ability to work page given form is submitted with Hoping To Work as ${hopingToGetWorkValue}`, async () => {
          // Given
          const inductionDto = { prisonNumber } as InductionDto
          req.journeyData.inductionDto = inductionDto

          const hopingToWorkOnReleaseForm = {
            hopingToGetWork: hopingToGetWorkValue,
          }
          req.body = hopingToWorkOnReleaseForm

          const expectedInduction = {
            prisonNumber,
            workOnRelease: {
              hopingToWork: hopingToGetWorkValue,
            },
            futureWorkInterests: {
              interests: [],
            },
          } as InductionDto

          // When
          await controller.submitHopingToWorkOnReleaseForm(req, res, next)

          // Then
          expect(res.redirect).toHaveBeenCalledWith(
            `/prisoners/A1234BC/create-induction/${journeyId}/affect-ability-to-work`,
          )
          expect(req.journeyData.inductionDto).toEqual(expectedInduction)
        })
      },
    )

    it.each([HopingToGetWorkValue.YES, HopingToGetWorkValue.NO, HopingToGetWorkValue.NOT_SURE])(
      'should redirect to Check Your Answers given previous page was Check Your Answers and Hoping To Work has not been changed from %s',
      async (hopingToGetWorkValue: HopingToGetWorkValue) => {
        // Given
        const inductionDto = aValidInductionDto({ hopingToGetWork: hopingToGetWorkValue })
        req.journeyData.inductionDto = inductionDto

        const hopingToWorkOnReleaseForm = {
          hopingToGetWork: hopingToGetWorkValue,
        }
        req.body = hopingToWorkOnReleaseForm

        req.session.pageFlowHistory = {
          pageUrls: [
            `/prisoners/A1234BC/create-induction/${journeyId}/check-your-answers`,
            `/prisoners/A1234BC/create-induction/${journeyId}/hoping-to-work-on-release`,
          ],
          currentPageIndex: 1,
        }

        // When
        await controller.submitHopingToWorkOnReleaseForm(req, res, next)

        // Then
        expect(res.redirect).toHaveBeenCalledWith(`/prisoners/A1234BC/create-induction/${journeyId}/check-your-answers`)
      },
    )

    it.each([HopingToGetWorkValue.NO, HopingToGetWorkValue.NOT_SURE])(
      'should update inductionDto and redirect to Check Your Answers given previous page was Check Your Answers and Hoping To Work is being changed from YES to %s',
      async (hopingToGetWorkValue: HopingToGetWorkValue) => {
        // Given
        const inductionDto = aValidInductionDto({ hopingToGetWork: HopingToGetWorkValue.YES })
        req.journeyData.inductionDto = inductionDto

        const hopingToWorkOnReleaseForm = {
          hopingToGetWork: hopingToGetWorkValue,
        }
        req.body = hopingToWorkOnReleaseForm

        req.session.pageFlowHistory = {
          pageUrls: [
            `/prisoners/A1234BC/create-induction/${journeyId}/check-your-answers`,
            `/prisoners/A1234BC/create-induction/${journeyId}/hoping-to-work-on-release`,
          ],
          currentPageIndex: 1,
        }

        // When
        await controller.submitHopingToWorkOnReleaseForm(req, res, next)

        // Then
        const updatedInduction = req.journeyData.inductionDto
        expect(updatedInduction.workOnRelease.hopingToWork).toEqual(hopingToGetWorkValue)
        expect(updatedInduction.futureWorkInterests.interests).toEqual([])
        expect(res.redirect).toHaveBeenCalledWith(`/prisoners/A1234BC/create-induction/${journeyId}/check-your-answers`)
      },
    )

    it.each([HopingToGetWorkValue.NO, HopingToGetWorkValue.NOT_SURE])(
      'should update inductionDto and redirect to Work Interest Types given previous page was Check Your Answers and Hoping To Work is being changed from %s to YES',
      async (previousHopingToGetWorkValue: HopingToGetWorkValue) => {
        // Given
        const inductionDto = aValidInductionDto({ hopingToGetWork: previousHopingToGetWorkValue })
        req.journeyData.inductionDto = inductionDto

        const hopingToWorkOnReleaseForm = {
          hopingToGetWork: HopingToGetWorkValue.YES,
        }
        req.body = hopingToWorkOnReleaseForm

        req.session.pageFlowHistory = {
          pageUrls: [
            `/prisoners/A1234BC/create-induction/${journeyId}/check-your-answers`,
            `/prisoners/A1234BC/create-induction/${journeyId}/hoping-to-work-on-release`,
          ],
          currentPageIndex: 1,
        }

        // When
        await controller.submitHopingToWorkOnReleaseForm(req, res, next)

        // Then
        const updatedInduction = req.journeyData.inductionDto
        expect(updatedInduction.workOnRelease.hopingToWork).toEqual(HopingToGetWorkValue.YES)
        expect(updatedInduction.futureWorkInterests.interests).toEqual([])
        expect(res.redirect).toHaveBeenCalledWith(
          `/prisoners/A1234BC/create-induction/${journeyId}/work-interest-types`,
        )
      },
    )
  })
})
