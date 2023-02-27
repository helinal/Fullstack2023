import { useState } from 'react'
import PropTypes from 'prop-types'

const BlogForm = ({ createBlog }) => {
  BlogForm.propTypes = {
    createBlog: PropTypes.func.isRequired
  }

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()

    createBlog({
      title: title,
      author: author,
      url: url
    })

    setTitle('')
    setAuthor('')
    setUrl('')
  }


  return (
    <>
      <h3>Create new</h3>
      <form onSubmit={addBlog}>
        <div>
          title: <input
            type="title"
            value={title}
            name="Title"
            onChange={({ target }) => setTitle(target.value)}
            placeholder='title'
          />
        </div>
        <div>
          author: <input
            type="author"
            value={author}
            name="Author"
            onChange={({ target }) => setAuthor(target.value)}
            placeholder='author'
          />
        </div>
        <div>
          url: <input
            type="url "
            value={url}
            name="Url"
            onChange={({ target }) => setUrl(target.value)}
            placeholder='url'
          />
        </div>
        <button type="submit">create</button>
      </form>
    </>
  )
}

export default BlogForm