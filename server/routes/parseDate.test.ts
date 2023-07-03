import { Request } from 'express'
import parseDate from './parseDate'

const request = {
  body: {},
}
describe('parseDate', () => {
  it('should parse date given request with valid date fields', () => {
    // Given
    request.body = { 'reviewDate-day': '31', 'reviewDate-month': '01', 'reviewDate-year': '1990' }

    // When
    const date = parseDate(request as unknown as Request, 'reviewDate')

    // Then
    expect(date).toStrictEqual(new Date(1990, 0, 31))
  })

  it('should parse date given missing fields', () => {
    // Given
    request.body = { 'reviewDate-day': undefined, 'reviewDate-month': undefined, 'reviewDate-year': undefined }

    // When
    const date = parseDate(request as unknown as Request, 'reviewDate')

    // Then
    expect(date).toBeUndefined()
  })

  it('should parse date given request with blank values', () => {
    // Given
    request.body = { 'reviewDate-day': '', 'reviewDate-month': '', 'reviewDate-year': '' }

    // When
    const date = parseDate(request as unknown as Request, 'reviewDate')

    // Then
    expect(date).toBeUndefined()
  })

  it('should parse date given request with missing day', () => {
    // Given
    request.body = { 'reviewDate-day': '', 'reviewDate-month': '10', 'reviewDate-year': '1990' }

    // When
    const date = parseDate(request as unknown as Request, 'reviewDate')

    // Then
    expect(date.getTime()).toStrictEqual(NaN)
  })

  it('should parse date given request with missing month', () => {
    // Given
    request.body = { 'reviewDate-day': '10', 'reviewDate-month': '', 'reviewDate-year': '1990' }

    // When
    const date = parseDate(request as unknown as Request, 'reviewDate')

    // Then
    expect(date.getTime()).toStrictEqual(NaN)
  })

  it('should parse date given request with missing year', () => {
    // Given
    request.body = { 'reviewDate-day': '10', 'reviewDate-month': '10', 'reviewDate-year': '' }

    // When
    const date = parseDate(request as unknown as Request, 'reviewDate')

    // Then
    expect(date.getTime()).toStrictEqual(NaN)
  })

  it('should parse date given request with invalid date', () => {
    // Given
    request.body = { 'reviewDate-day': '31', 'reviewDate-month': '02', 'reviewDate-year': '1990' }

    // When
    const date = parseDate(request as unknown as Request, 'reviewDate')

    // Then
    expect(date.getTime()).toStrictEqual(NaN)
  })
})
