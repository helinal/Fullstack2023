import { useState, useEffect } from 'react'
import Blog from './components/Blog'
//import Notification from './components/Notification'
import Error from './components/Error'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [message, setMessage] = useState(null)
  const [error, setError] = useState(null)

  const [title, setTitle] = useState('') 
  const [author, setAuthor] = useState('') 
  const [url, setUrl] = useState('')  

  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('') 
  const [user, setUser] = useState(null)

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
        username, password,
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

      setMessage(`a new blog ${title} by ${author} added successfully`)
      setTimeout(() => {setMessage(null)}, 5000)

    } catch (exception) {
      setError(`a blog must contain a title, an author and a url`)
      setTimeout(() => {setError(null)}, 5000)
    }   
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <h2>Log in to application</h2>
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

      <Togglable buttonLabel='new blog'>
        <BlogForm createBlog={handleNewBlog} />
      </Togglable>

      <h3>All blogs</h3>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </> 
  )

//uuden blogin luomislomake toggable

  return (
    <>
      {!user && loginForm()}
      {user && blogForm()
    } 
    </>
  )
}

export default App