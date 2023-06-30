import type { RequestHandler } from 'express'

export default class CreateGoalController {
  getCreateGoalView: RequestHandler = async (req, res, next): Promise<void> => {
    res.render('pages/goal/create/index')
  }

  getAddStepView: RequestHandler = async (req, res, next): Promise<void> => {
    res.render('pages/goal/add-step/index')
  }

  getAddNoteView: RequestHandler = async (req, res, next): Promise<void> => {
    res.render('pages/goal/add-note/index')
  }
}
