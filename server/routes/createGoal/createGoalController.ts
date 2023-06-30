import type { RequestHandler } from 'express'
import type { Prisoner } from 'prisonRegisterApiClient'
import createError from 'http-errors'
import logger from '../../../logger'
import PrisonerSearchService from '../../services/prisonerSearchService'

export default class CreateGoalController {
  constructor(private readonly prisonerSearchService: PrisonerSearchService) {}

  getCreateGoalView: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonNumber } = req.params
    let prisoner: Prisoner
    try {
      prisoner = await this.prisonerSearchService.getPrisonerByPrisonNumber(prisonNumber)
    } catch (error) {
      next(createError(404, 'Prisoner not found'))
      return
    }
    logger.info(prisoner)

    res.render('pages/goal/create/index')
  }

  getAddStepView: RequestHandler = async (req, res, next): Promise<void> => {
    res.render('pages/goal/add-step/index')
  }

  getAddNoteView: RequestHandler = async (req, res, next): Promise<void> => {
    res.render('pages/goal/add-note/index')
  }
}
