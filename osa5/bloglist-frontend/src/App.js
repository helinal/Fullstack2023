import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import Error from './components/Error'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [message, setMessage] = useState(null)
  const [error, setError] = useState(null)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogout = async (event) => {
    event.preventDefault()
    setUser(null)
    window.localStorage.removeItem('loggedBlogappUser')
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    console.log('logging in with', username, password)

    try {
      const user = await loginService.login({
        username, password
      })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')

    } catch (exception) {
      setError('wrong username or password')
      setTimeout(() => {setError(null)}, 5000)
    }
  }

  const handleNewBlog = async (blogObject) => {
    try {
      const newBlog = await blogService.create(
        blogObject
      )

      setBlogs (blogs.concat(newBlog))
      blogFormRef.current.toggleVisibility()

      setMessage(`a new blog ${newBlog.title} by ${newBlog.author} added successfully`)
      setTimeout(() => {setMessage(null)}, 5000)

    } catch (exception) {
      setError('a blog must contain a title, an author and a url')
      setTimeout(() => {setError(null)}, 5000)
    }
  }

  const handleNewLike = async (blogObject) => {
    const id = blogObject.id
    const userId = blogObject.user.id

    blogObject.user = userId
    blogObject.likes += 1

    const response = await blogService.update(blogObject.id, blogObject)
    setBlogs(blogs.map(blog => blog.id !== id ? blog : response))
  }

  const removeBlog = async (blogObject) => {
    if (window.confirm(`Remove blog ${blogObject.title} by ${blogObject.author}?`)) {
      try {
        const id = blogObject.id
        await blogService.remove(id)

        setBlogs(blogs.filter(blog => blog.id !== id))

        setMessage(`blog ${blogObject.title} was removed successfully`)
        setTimeout(() => {setMessage(null)}, 5000)

      } catch (exception) {
        setError('some error occurred')
        setTimeout(() => {setError(null)}, 5000)
      }
    }
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <h2>Log in to the application</h2>
      <Error error={error} />
      <div>
        username
        <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  )

  const blogForm = () => (
    <>
      <h1>Blogs</h1>

      <p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>

      <Togglable buttonLabel='new blog' ref={blogFormRef}>
        <BlogForm createBlog={handleNewBlog} />
      </Togglable>

      <Notification message = {message}/>
      <Error error = {error}/>

      <h3>All blogs</h3>
      {blogs
        .sort((i, y) => y.likes - i.likes)
        .map(blog =>
          <Blog key={blog.id} blog={blog}
            handleNewLike={handleNewLike}
            removeBlog={removeBlog}/>
        )}
    </>
  )

  return (
    <>
      {!user && loginForm()}
      {user && blogForm()
      }
    </>
  )
}

export default App