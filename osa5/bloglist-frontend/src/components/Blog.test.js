import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'
import Blog from './Blog'

describe('<Blog />', () => {
  const likeMockHandler = jest.fn()
  const removeMockHandler = jest.fn()

  const blog = {
    id: 'testId',
    title: 'test title',
    author: 'test author',
    url: 'test url'
  }

  beforeEach(() => {
    render(<Blog
      key={blog.id}
      blog={blog}
      handleLike={likeMockHandler}
      removeBlog={removeMockHandler}/>)
  })

  test('renders the title correctly', () => {
    let element = screen.queryByText('test title')
    expect(element).toBeDefined()

    element = screen.queryByText('test url')
    expect(element).toBeNull()
  })
})


describe('<BlogForm />', () => {
  const mockHandler = jest.fn()

  beforeEach(() => {
    render(<BlogForm createBlog={mockHandler}/>)
  })

  test('blog creation works as expected' , async () => {
    const user = userEvent.setup()

    let input = screen.getByPlaceholderText('title')
    await user.type(input, 'test title' )

    input = screen.getByPlaceholderText('author')
    await user.type(input, 'test author' )

    input = screen.getByPlaceholderText('url')
    await user.type(input, 'test url' )

    const sendButton = screen.getByText('create')
    await user.click(sendButton)

    expect(mockHandler.mock.calls).toHaveLength(1)
    const submittedBlog = mockHandler.mock.calls[0][0]

    expect(submittedBlog.title).toBe('test title')
    expect(submittedBlog.author).toBe('test author')
    expect(submittedBlog.url).toBe('test url')
  })
})