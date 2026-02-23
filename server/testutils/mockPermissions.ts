import {
  isGranted,
  PermissionsService,
  PrisonerPermission,
  prisonerPermissionsGuard,
} from '@ministryofjustice/hmpps-prison-permissions-lib'
import { Request, Response, NextFunction } from 'express'
import createError from 'http-errors'

export function mockIsGranted(permissions: Partial<Record<PrisonerPermission, boolean>>) {
  const isGrantedMock = isGranted as jest.MockedFunction<typeof isGranted>

  isGrantedMock.mockImplementation((perm, _perms) => permissions[perm] || false)
}

export function mockPrisonerPermissionsGuard(permissionsUserHas: PrisonerPermission[]) {
  const prisonerPermissionsGuardMock = prisonerPermissionsGuard as jest.MockedFunction<typeof prisonerPermissionsGuard>

  prisonerPermissionsGuardMock.mockImplementation(
    (
      permissionsService: PermissionsService,
      options: {
        requestDependentOn: PrisonerPermission[]
        getPrisonerNumberFunction?: (req: Request) => string
      },
    ) =>
      async (req: Request, res: Response, next: NextFunction) => {
        if (new Set(options.requestDependentOn).isSubsetOf(new Set(permissionsUserHas))) {
          return next()
        }

        return next(createError(403, 'Denied permissions'))
      },
  )
}
