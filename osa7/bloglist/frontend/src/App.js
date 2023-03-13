import { useState, useEffect, useRef } from 'react'
import blogService from './services/blogs'
import loginService from './services/login'
import storageService from './services/storage'
import userService from './services/users'

import LoginForm from './components/Login'
import NewBlog from './components/NewBlog'
import Notification from './components/Notification'
import Togglable from './components/Togglable'

import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link,
    useParams,
  } from 'react-router-dom'

import { Alert } from 'react-bootstrap'
import { MDBBtn } from 'mdb-react-ui-kit';

const App = () => {
    const [blogs, setBlogs] = useState([])
    const [user, setUser] = useState('')
    const [info, setInfo] = useState({ message: null })
    const [users, setUsers] = useState([])
    const [message, setMessage] = useState(null)

    const blogFormRef = useRef()

    useEffect(() => {
        const user = storageService.loadUser()
        setUser(user)
    }, [])

    useEffect(() => {
        blogService.getAll().then((blogs) => setBlogs(blogs))
    }, [])

    useEffect(() => {
        userService.getAll().then((users) => setUsers(users))
    }, [])

    const notifyWith = (message, type = 'info') => {
        setInfo({
            message,
            type,
        })

        setTimeout(() => {
            setInfo({ message: null })
        }, 3000)
    }

    const login = async (username, password) => {
        try {
            const user = await loginService.login({ username, password })
            setUser(user)
            storageService.saveUser(user)
            setMessage(`welcome ${user.name}`)
            setTimeout(() => {
              setMessage(null)
            }, 10000)
        } catch (e) {
            notifyWith('wrong username or password', 'error')
        }
    }

    const logout = async () => {
        setUser(null)
        storageService.removeUser()
        notifyWith('logged out')
    }

    const createBlog = async (newBlog) => {
        const createdBlog = await blogService.create(newBlog)
        notifyWith(`A new blog '${newBlog.title}' by '${newBlog.author}' added`)
        setBlogs(blogs.concat(createdBlog))
        blogFormRef.current.toggleVisibility()
    }

    const like = async (blog) => {
        const blogToUpdate = {
            ...blog,
            likes: blog.likes + 1,
            user: blog.user.id,
        }
        const updatedBlog = await blogService.update(blogToUpdate)
        notifyWith(`A like for the blog '${blog.title}' by '${blog.author}'`)
        setBlogs(blogs.map((b) => (b.id === blog.id ? updatedBlog : b)))
    }

    const remove = async (blog) => {
        const ok = window.confirm(
            `Sure you want to remove '${blog.title}' by ${blog.author}`
        )
        if (ok) {
            await blogService.remove(blog.id)
            notifyWith(`The blog' ${blog.title}' by '${blog.author} removed`)
            setBlogs(blogs.filter((b) => b.id !== blog.id))
        }
    }

    if (!user) {
        return (
            <div>
                <h2>Log in to the application</h2>
                <Notification info={info} />
                <LoginForm login={login} />
            </div>
        )
    }

    const byLikes = (b1, b2) => b2.likes - b1.likes

    const Blog = ({ blog }) => {
        const style = {
          marginBottom: 2,
          padding: 5,
          borderStyle: 'solid',
        }
    
        return (
          <div style={style} className="blog">
            <Link to={`/blogs/${blog.id}`}> {blog.title} {blog.author}</Link>
          </div>
        )
    }
    
    const BlogView = () => {
        const id = useParams().id
        const blog = blogs.find((n) => n.id === id)
    
        return (
          <>
            <h2>
              {blog.title} {blog.author}
            </h2>
            <div>
              {' '}
              <a href={blog.url}> {blog.url}</a>{' '}
            </div>
            <div>
              likes {blog.likes}
              <button onClick={() => like(blog)}>like</button>
            </div>
            <div>added by {blog.user.name}</div>
            {user && blog.user.username === user.username && (
              <button onClick={() => remove(blog)}>delete</button>
            )}
          </>
        )
    }
    
    const HomePage = () => {
        return (
          <div>
            <Togglable buttonLabel="create new" ref={blogFormRef} >
              <NewBlog createBlog={createBlog} />
            </Togglable>
            &nbsp;
            <div>
              {blogs.sort(byLikes).map((blog) => (
                <Blog key={blog.id} blog={blog} />
              ))}
            </div>
          </div>
        )
    }
    
    const User = ({ users }) => {
        const id = useParams().id
        const user = users.find((n) => n.id === id)
    
        if (!user) {
          return null
        }
        return (
          <div>
            <h2>{user.name}</h2>
            <h4>added blogs</h4>
            <ul>
              {user.blogs.map((blog) => {
                return <li key={blog.id}>{blog.title}</li>
              })}
            </ul>
          </div>
        )
    }

    const Users = () => {
        return (
          <>
            <h2>Users</h2>
            <div>
              <table>
                <thead>
                  <tr>
                    <th>  </th>
                    <th> blogs created </th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => {
                    return (
                      <tr key={user.username}>
                        <td>
                          <Link to={`/users/${user.id}`}>{user.name}</Link>
                        </td>
                        <td>{user.blogs.length}</td>
                      </tr> )})}
                </tbody>
              </table>
            </div>
          </>
        )
    }
    
    const Header = () => {
      const style = {
        marginBottom: 2,
        padding: 5,
        backgroundColor: 'lightgray'
      }

        return (
          <>
            <div style={style}>
              <Link to="/">blogs</Link> &nbsp;
              <Link to="/users">users</Link> &nbsp;
              {user.name} logged in &nbsp;
              <MDBBtn onClick={logout}>logout</MDBBtn>
            </div>

            <h2 style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>Blog app</h2> 
            <Notification info={info} />
          </>
        )
    }
    
    return (
      <div className="container">
      {(message &&
        <Alert variant="success">
          {message}
        </Alert>
      )}

        <div className="container">
          <Router>
            <Header />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/users" element={<Users />} />
              <Route path="/users/:id" element={<User users={users} />} />
              <Route path="/blogs/:id" element={<BlogView />} />
            </Routes>
          </Router>
        </div>
      </div>
      )
    }

export default App