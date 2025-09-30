import { parseISO } from 'date-fns'

export type AuditFields = {
  reference?: string
  createdBy?: string
  createdByDisplayName?: string
  createdAt?: string
  createdAtPrison?: string
  updatedBy?: string
  updatedByDisplayName?: string
  updatedAt?: string
  updatedAtPrison?: string
}

const validAuditFields = (
  options?: AuditFields,
): {
  reference: string
  createdBy: string
  createdByDisplayName: string
  createdAt: string
  createdAtPrison: string
  updatedBy: string
  updatedByDisplayName: string
  updatedAt: string
  updatedAtPrison: string
} => ({
  reference: options?.reference || 'c88a6c48-97e2-4c04-93b5-98619966447b',
  createdBy: options?.createdBy || 'asmith_gen',
  createdByDisplayName: options?.createdByDisplayName || 'Alex Smith',
  createdAt: options?.createdAt || '2023-06-19T09:39:44Z',
  createdAtPrison: options?.createdAtPrison || 'MDI',
  updatedBy: options?.updatedBy || 'asmith_gen',
  updatedByDisplayName: options?.updatedByDisplayName || 'Alex Smith',
  updatedAt: options?.updatedAt || '2023-06-19T09:39:44Z',
  updatedAtPrison: options?.updatedAtPrison || 'MDI',
})

export type DtoAuditFields = {
  reference?: string
  createdBy?: string
  createdByDisplayName?: string
  createdAt?: Date
  createdAtPrison?: string
  updatedBy?: string
  updatedByDisplayName?: string
  updatedAt?: Date
  updatedAtPrison?: string
}

const validDtoAuditFields = (
  options?: DtoAuditFields,
): {
  reference: string
  createdBy: string
  createdByDisplayName: string
  createdAt: Date
  createdAtPrison: string
  updatedBy: string
  updatedByDisplayName: string
  updatedAt: Date
  updatedAtPrison: string
} => ({
  reference: options?.reference || 'c88a6c48-97e2-4c04-93b5-98619966447b',
  createdBy: options?.createdBy || 'asmith_gen',
  createdByDisplayName: options?.createdByDisplayName || 'Alex Smith',
  createdAt: options?.createdAt || parseISO('2023-06-19T09:39:44Z'),
  createdAtPrison: options?.createdAtPrison || 'MDI',
  updatedBy: options?.updatedBy || 'asmith_gen',
  updatedByDisplayName: options?.updatedByDisplayName || 'Alex Smith',
  updatedAt: options?.updatedAt || parseISO('2023-06-19T09:39:44Z'),
  updatedAtPrison: options?.updatedAtPrison || 'MDI',
})

export { validAuditFields, validDtoAuditFields }
