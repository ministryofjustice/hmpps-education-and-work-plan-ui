import { RequestHandler } from 'express'

export default class AccessibilityStatementView {
  constructor() {}

  getAccessibilityStatementView: RequestHandler = async (req, res, next): Promise<void> => {
    res.render('pages/accessibilityStatement/index')
  }
}
