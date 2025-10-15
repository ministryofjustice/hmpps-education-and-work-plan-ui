import type { ReferencedAndAuditable } from 'dto'
import { parseISO } from 'date-fns'

const toReferenceAndAuditable = (apiResponse: {
  reference: string
  createdBy: string
  createdByDisplayName: string
  createdAt: string
  createdAtPrison: string
  updatedBy: string
  updatedByDisplayName: string
  updatedAt: string
  updatedAtPrison: string
}): ReferencedAndAuditable => ({
  reference: apiResponse.reference,
  createdBy: apiResponse.createdBy,
  createdByDisplayName: apiResponse.createdByDisplayName,
  createdAt: apiResponse.createdAt ? parseISO(apiResponse.createdAt) : null,
  createdAtPrison: apiResponse.createdAtPrison,
  updatedBy: apiResponse.updatedBy,
  updatedByDisplayName: apiResponse.updatedByDisplayName,
  updatedAt: apiResponse.updatedAt ? parseISO(apiResponse.updatedAt) : null,
  updatedAtPrison: apiResponse.updatedAtPrison,
})

export default toReferenceAndAuditable
