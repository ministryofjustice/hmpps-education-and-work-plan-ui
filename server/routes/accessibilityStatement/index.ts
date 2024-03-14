import type { Router } from 'express'
import { checkUserHasViewAuthority } from '../../middleware/roleBasedAccessControl'
import AccessibilityStatementController from './accessibilityStatementController'

/**
 * Route definition for the accessibility statement page
 */
export default (router: Router) => {
  const accessibilityStatementController = new AccessibilityStatementController()
  router.get('/accessibility-statement', [
    checkUserHasViewAuthority(),
    accessibilityStatementController.getAccessibilityStatementView,
  ])
}
