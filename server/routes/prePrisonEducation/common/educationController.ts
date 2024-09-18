import { Request } from 'express'

/**
 * Abstract controller class defining functionality common to all pre-prison Education/Qualification screens and journeys.
 */
export default abstract class EducationController {
  /**
   * Concrete classes must provide an implementation of this method to provide the backlink URL relevant to their use case / journey.
   */
  abstract getBackLinkUrl(req: Request): string

  /**
   * Concrete classes must provide an implementation of this method to provide the backlink aria text relevant to their use case / journey.
   */
  abstract getBackLinkAriaText(req: Request): string
}
