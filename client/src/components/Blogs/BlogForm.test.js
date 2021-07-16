import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { fireEvent, render } from '@testing-library/react'
import BlogForm from './BlogForm'

test('orm calls the event handler it received as props with the right details when a new blog is created', () => {
  const mockSubmit = jest.fn()
  const component = render(<BlogForm addNewBlog={mockSubmit} />)

  const blogForm = component.container.querySelector('#blogForm')
  const authorInput = component.container.querySelector('#author')
  fireEvent.change(authorInput, {
    target: { value: 'Test Author' },
  })
  fireEvent.submit(blogForm)
  console.log(mockSubmit.mock.calls)
  expect(mockSubmit.mock.calls).toHaveLength(1)
  expect(mockSubmit.mock.calls[0][0].author).toBe('Test Author')
})
