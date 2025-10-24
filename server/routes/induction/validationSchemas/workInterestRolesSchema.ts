import { z } from 'zod'
import { createSchema } from '../../routerRequestHandlers/validationMiddleware'
import WorkInterestTypeValue from '../../../enums/workInterestTypeValue'
import { isEmpty, textValueExceedsLength } from '../../../validators/textValueValidator'
import formatJobTypeFilter from '../../../filters/formatJobTypeFilter'

const workInterestRolesSchema = async () => {
  const MAX_JOB_ROLE_LENGTH = 512

  return createSchema({
    workInterestRoles: z //
      .record(z.enum(WorkInterestTypeValue), z.string().optional())
      .optional()
      .nullable(),
    workInterestTypesOther: z //
      .string()
      .optional()
      .nullable(),
  }).check(ctx => {
    const { workInterestRoles, workInterestTypesOther } = ctx.value

    Object.entries(workInterestRoles).forEach(([workInterestType, role]) => {
      if (!isEmpty(role) && textValueExceedsLength(role, MAX_JOB_ROLE_LENGTH)) {
        ctx.issues.push({
          code: 'custom',
          input: ctx.value,
          path: [workInterestType],
          message:
            workInterestType !== WorkInterestTypeValue.OTHER
              ? `The ${formatJobTypeFilter(workInterestType)} job role must be ${MAX_JOB_ROLE_LENGTH} characters or less`
              : `The ${workInterestTypesOther} job role must be ${MAX_JOB_ROLE_LENGTH} characters or less`,
        })
      }
    })
  })
}

export default workInterestRolesSchema
