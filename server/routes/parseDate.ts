import { Request } from 'express'
import moment from 'moment'

export default function parseDate(req: Request, prefix: string): Date | undefined {
  const day: string = req.body[`${prefix}-day`] ? (req.body[`${prefix}-day`] as string).padStart(2, '0') : ''
  const month: string = req.body[`${prefix}-month`] ? (req.body[`${prefix}-month`] as string).padStart(2, '0') : ''
  const year: string = req.body[`${prefix}-year`] ? (req.body[`${prefix}-year`] as string) : ''
  if (day === '' && month === '' && year === '') {
    return undefined
  }
  return moment(`${day}-${month}-${year}`, 'DD-MM-YYYY', true).toDate()
}
