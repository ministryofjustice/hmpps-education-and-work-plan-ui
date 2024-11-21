import { parseISO } from 'date-fns'
import type { Note } from 'viewModels'
import toNote from './noteMapper'
import aValidNoteResponse from '../../testsupport/noteResponseTestDataBuilder'

describe('noteMapper', () => {
  const examplePrisonNamesById = new Map([
    ['BXI', 'Brixton (HMP)'],
    ['MDI', 'Moorland (HMP & YOI)'],
  ])

  it('should map a NoteResponse to a Note view model object', () => {
    // Given
    const noteResponse = aValidNoteResponse()

    const expected: Note = {
      reference: '8092b80e-4d60-418f-983a-da457ff8df40',
      content: 'Prisoner is not good at listening',
      type: 'GOAL',
      createdBy: 'asmith_gen',
      createdByDisplayName: 'Alex Smith',
      createdAt: parseISO('2023-01-16T09:34:12.453Z'),
      createdAtPrisonName: 'Brixton (HMP)',
      updatedBy: 'asmith_gen',
      updatedByDisplayName: 'Alex Smith',
      updatedAt: parseISO('2023-09-23T13:42:01.401Z'),
      updatedAtPrisonName: 'Brixton (HMP)',
    }

    // When
    const actual = toNote(noteResponse, examplePrisonNamesById)

    // Then
    expect(actual).toEqual(expected)
  })
})
